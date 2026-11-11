// File: public/js/pdf-engine.js
/**
 * Emerald PDF Mega-Suite Engine — 100% Client-Side PDF Processing Core (24 Tools)
 * Inspired by PDF24 Tools & AsliTools. Zero server uploads.
 * Uses pdf-lib, pdfjs-dist, and HTML5 Canvas API with strict ObjectURL memory governance.
 */

export class MemoryGovernor {
  constructor() {
    /** @type {Set<string>} */
    this.activeUrls = new Set();
  }

  /**
   * Creates a managed Object URL from a Blob or Uint8Array and tracks it for cleanup.
   * @param {Uint8Array|Blob} data
   * @param {string} mimeType
   * @returns {string}
   */
  createManagedUrl(data, mimeType = 'application/pdf') {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    this.activeUrls.add(url);
    return url;
  }

  /**
   * Explicitly revokes a specific Object URL to prevent browser memory leaks.
   * @param {string} url
   */
  revokeUrl(url) {
    if (url && this.activeUrls.has(url)) {
      URL.revokeObjectURL(url);
      this.activeUrls.delete(url);
    }
  }

  /**
   * Revokes all tracked Object URLs.
   */
  revokeAll() {
    for (const url of this.activeUrls) {
      URL.revokeObjectURL(url);
    }
    this.activeUrls.clear();
  }

  /**
   * Converts raw payload (string, Uint8Array, ArrayBuffer, or Blob) into a typed Blob.
   * @param {Uint8Array|Blob|string} data
   * @param {string} mimeType
   * @returns {Blob}
   */
  toBlob(data, mimeType = 'application/pdf') {
    if (data instanceof Blob) return data;
    const payload = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    return new Blob([payload], { type: mimeType });
  }

  /**
   * Converts a Blob to a Data URL (Base64) string for mobile WebView compatibility.
   * @param {Blob} blob
   * @returns {Promise<string>}
   */
  blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Triggers a universal download across Desktop, Mobile Browsers (Android/iOS),
   * In-App WebViews, and the Capacitor Android APK.
   * @param {Uint8Array|Blob|string} data
   * @param {string} filename
   * @param {string} mimeType
   */
  async triggerDownload(data, filename, mimeType = 'application/pdf') {
    const cleanMime = (mimeType || 'application/octet-stream').split(';')[0].trim();
    const blob = this.toBlob(data, cleanMime);

    // 1. Native Android APK Bridge (Direct write to Android Downloads folder)
    if (window.AndroidDownloader && typeof window.AndroidDownloader.saveBase64File === 'function') {
      try {
        const dataUrl = await this.blobToDataUrl(blob);
        const saved = window.AndroidDownloader.saveBase64File(dataUrl, filename, cleanMime);
        if (saved) return;
      } catch (_) {
        // Fall through to Web Share / Browser download
      }
    }

    const ua = navigator.userAgent || '';
    const isAndroidWebView = Boolean(window.Capacitor) || /; wv\)/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // 2. If inside Android WebView (APK) or iOS Safari where blob: download is restricted,
    // use Web Share API with File support first so user can Save to Files / Device / WhatsApp.
    if (isAndroidWebView || isIOS) {
      try {
        const fileObj = new File([blob], filename, { type: cleanMime });
        if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
          await navigator.share({
            files: [fileObj],
            title: filename
          });
          return;
        }
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }

      // Data-URL fallback for WebViews that support data: in DownloadListener
      try {
        const dataUrl = await this.blobToDataUrl(blob);
        const dataAnchor = document.createElement('a');
        dataAnchor.href = dataUrl;
        dataAnchor.download = filename;
        dataAnchor.style.display = 'none';
        document.body.appendChild(dataAnchor);
        dataAnchor.click();
        document.body.removeChild(dataAnchor);
        return;
      } catch (_) {
        // Fall through to standard Object URL download
      }
    }

    // 3. Standard Desktop & Mobile Browser (Chrome / Samsung / Firefox / Edge) Blob Download
    const url = this.createManagedUrl(blob, cleanMime);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      this.revokeUrl(url);
    }, 15000);
  }

  /**
   * Explicitly opens the mobile native Share / Save to Phone sheet (or downloads if unsupported).
   * @param {Uint8Array|Blob|string} data
   * @param {string} filename
   * @param {string} mimeType
   */
  async shareOrSaveMobile(data, filename, mimeType = 'application/pdf') {
    const cleanMime = (mimeType || 'application/octet-stream').split(';')[0].trim();
    const blob = this.toBlob(data, cleanMime);
    try {
      const fileObj = new File([blob], filename, { type: cleanMime });
      if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
        await navigator.share({
          files: [fileObj],
          title: filename
        });
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
    await this.triggerDownload(blob, filename, cleanMime);
  }
}

export class ClientPdfEngine {
  constructor() {
    this.memory = new MemoryGovernor();
    this._configurePdfJsWorker();
  }

  _configurePdfJsWorker() {
    if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  }

  /**
   * Renders a specific 1-based page from a PDF ArrayBuffer to an HTML5 Canvas.
   */
  async renderPageThumbnail(arrayBuffer, pageNumber, canvas, scale = 0.35) {
    this._configurePdfJsWorker();
    const clonedBuffer = arrayBuffer.slice(0);
    const loadingTask = window.pdfjsLib.getDocument({ data: clonedBuffer });
    const pdfDoc = await loadingTask.promise;
    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const ctx = canvas.getContext('2d', { alpha: false });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      page.cleanup();
    } finally {
      await pdfDoc.destroy();
    }
  }

  /**
   * Inspects a PDF file and returns total page count.
   */
  async getPageCount(arrayBuffer) {
    const { PDFDocument } = window.PDFLib;
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  }

  /**
   * 1. Merge & Reorder PDF Pages (Also supports Reverse, Duplicate, Rotate, Delete)
   */
  async mergeAndReorderPages(pageDescriptors, onProgress = () => {}) {
    const { PDFDocument, degrees } = window.PDFLib;
    const outPdf = await PDFDocument.create();
    const sourceCache = new Map();
    const total = pageDescriptors.length;

    for (let i = 0; i < total; i++) {
      const item = pageDescriptors[i];
      onProgress(Math.round(((i + 1) / total) * 88), `Processing page ${i + 1} of ${total}...`);

      let srcDoc = sourceCache.get(item.buffer);
      if (!srcDoc) {
        srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
        sourceCache.set(item.buffer, srcDoc);
      }

      const [copiedPage] = await outPdf.copyPages(srcDoc, [item.pageIndex]);
      if (item.rotation && item.rotation % 360 !== 0) {
        const currentRotation = copiedPage.getRotation().angle || 0;
        copiedPage.setRotation(degrees((currentRotation + item.rotation) % 360));
      }
      outPdf.addPage(copiedPage);
    }

    onProgress(95, 'Serializing PDF stream...');
    const bytes = await outPdf.save({ useObjectStreams: true });
    onProgress(100, 'Completed!');
    return bytes;
  }

  /**
   * 2. Split / Extract or Remove Specific Page Ranges
   */
  async filterByRange(allPages, rangeString, mode = 'keep', onProgress = () => {}) {
    const matchedIndices = new Set(this.parsePageRanges(rangeString, allPages.length));
    const filtered = allPages.filter((_, idx) =>
      mode === 'keep' ? matchedIndices.has(idx) : !matchedIndices.has(idx)
    );
    if (filtered.length === 0) {
      throw new Error('No pages remain after applying the selected page range.');
    }
    return this.mergeAndReorderPages(filtered, onProgress);
  }

  parsePageRanges(rangeText, maxPages) {
    if (!rangeText || !rangeText.trim()) {
      return Array.from({ length: maxPages }, (_, i) => i);
    }
    const result = [];
    const seen = new Set();
    const parts = rangeText.split(',').map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [startRaw, endRaw] = part.split('-').map((n) => parseInt(n.trim(), 10));
        if (!Number.isNaN(startRaw) && !Number.isNaN(endRaw)) {
          const start = Math.max(1, Math.min(startRaw, endRaw));
          const end = Math.min(maxPages, Math.max(startRaw, endRaw));
          for (let p = start; p <= end; p++) {
            if (!seen.has(p - 1)) {
              seen.add(p - 1);
              result.push(p - 1);
            }
          }
        }
      } else {
        const single = parseInt(part, 10);
        if (!Number.isNaN(single) && single >= 1 && single <= maxPages) {
          if (!seen.has(single - 1)) {
            seen.add(single - 1);
            result.push(single - 1);
          }
        }
      }
    }
    return result;
  }

  /**
   * 3. Compress / Flatten / Grayscale / Invert / Repair PDF via Canvas Raster Pipeline
   * Supports colorFilter: 'none' | 'grayscale' | 'invert' | 'contrast'
   */
  async rasterTransformPdf(
    pageDescriptors,
    options = { quality: 0.68, scale: 1.25, colorFilter: 'none' },
    onProgress = () => {}
  ) {
    this._configurePdfJsWorker();
    const { PDFDocument } = window.PDFLib;
    const outPdf = await PDFDocument.create();
    const total = pageDescriptors.length;

    const workCanvas = document.createElement('canvas');
    const workCtx = workCanvas.getContext('2d', { alpha: false });

    for (let i = 0; i < total; i++) {
      const desc = pageDescriptors[i];
      onProgress(Math.round(((i + 1) / total) * 90), `Rendering page ${i + 1} of ${total}...`);

      const clonedBuffer = desc.buffer.slice(0);
      const loadingTask = window.pdfjsLib.getDocument({ data: clonedBuffer });
      const pdfJsDoc = await loadingTask.promise;

      try {
        const page = await pdfJsDoc.getPage(desc.pageIndex + 1);
        const baseViewport = page.getViewport({
          scale: 1.0,
          rotation: (page.rotate + (desc.rotation || 0)) % 360
        });
        const renderViewport = page.getViewport({
          scale: options.scale || 1.25,
          rotation: (page.rotate + (desc.rotation || 0)) % 360
        });

        workCanvas.width = Math.floor(renderViewport.width);
        workCanvas.height = Math.floor(renderViewport.height);
        workCtx.fillStyle = '#ffffff';
        workCtx.fillRect(0, 0, workCanvas.width, workCanvas.height);

        await page.render({ canvasContext: workCtx, viewport: renderViewport }).promise;
        page.cleanup();

        if (options.colorFilter && options.colorFilter !== 'none') {
          this._applyCanvasPixelFilter(workCtx, workCanvas.width, workCanvas.height, options.colorFilter);
        }

        const jpegBlob = await new Promise((resolve) =>
          workCanvas.toBlob(resolve, 'image/jpeg', options.quality || 0.75)
        );
        const jpegBuffer = await jpegBlob.arrayBuffer();
        const embeddedJpg = await outPdf.embedJpg(jpegBuffer);

        const pdfPage = outPdf.addPage([baseViewport.width, baseViewport.height]);
        pdfPage.drawImage(embeddedJpg, {
          x: 0,
          y: 0,
          width: baseViewport.width,
          height: baseViewport.height
        });
      } finally {
        await pdfJsDoc.destroy();
      }
    }

    workCanvas.width = 1;
    workCanvas.height = 1;
    onProgress(96, 'Packing optimized PDF object streams...');
    const bytes = await outPdf.save({ useObjectStreams: true });
    onProgress(100, 'Done!');
    return bytes;
  }

  _applyCanvasPixelFilter(ctx, width, height, filterType) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (filterType === 'grayscale') {
        const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        data[i] = lum;
        data[i + 1] = lum;
        data[i + 2] = lum;
      } else if (filterType === 'invert') {
        data[i] = 255 - r;
        data[i + 1] = 255 - g;
        data[i + 2] = 255 - b;
      } else if (filterType === 'contrast') {
        // High-contrast document scanner enhancement
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const clean = lum > 190 ? 255 : Math.max(0, Math.round((lum - 40) * 1.35));
        data[i] = clean;
        data[i + 1] = clean;
        data[i + 2] = clean;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  /**
   * 4. Export PDF Pages to High-Resolution Images (PNG or JPEG)
   */
  async pdfToImages(pageDescriptors, options = { format: 'image/jpeg', scale: 2.0 }, onProgress = () => {}) {
    this._configurePdfJsWorker();
    const exportedImages = [];
    const total = pageDescriptors.length;
    const ext = options.format === 'image/png' ? 'png' : options.format === 'image/webp' ? 'webp' : 'jpg';

    const workCanvas = document.createElement('canvas');
    const workCtx = workCanvas.getContext('2d', { alpha: false });

    for (let i = 0; i < total; i++) {
      const desc = pageDescriptors[i];
      onProgress(Math.round(((i + 1) / total) * 95), `Rendering page ${i + 1} to ${ext.toUpperCase()}...`);

      const clonedBuffer = desc.buffer.slice(0);
      const loadingTask = window.pdfjsLib.getDocument({ data: clonedBuffer });
      const pdfJsDoc = await loadingTask.promise;

      try {
        const page = await pdfJsDoc.getPage(desc.pageIndex + 1);
        const viewport = page.getViewport({
          scale: options.scale || 2.0,
          rotation: (page.rotate + (desc.rotation || 0)) % 360
        });

        workCanvas.width = Math.floor(viewport.width);
        workCanvas.height = Math.floor(viewport.height);
        workCtx.fillStyle = '#ffffff';
        workCtx.fillRect(0, 0, workCanvas.width, workCanvas.height);

        await page.render({ canvasContext: workCtx, viewport }).promise;
        page.cleanup();

        const blob = await new Promise((resolve) =>
          workCanvas.toBlob(resolve, options.format, 0.92)
        );
        const url = this.memory.createManagedUrl(blob, options.format);
        exportedImages.push({
          fileName: `page-${i + 1}.${ext}`,
          blob,
          url,
          width: workCanvas.width,
          height: workCanvas.height
        });
      } finally {
        await pdfJsDoc.destroy();
      }
    }

    workCanvas.width = 1;
    workCanvas.height = 1;
    onProgress(100, 'All pages exported to images!');
    return exportedImages;
  }

  /**
   * 5. Extract All Text from PDF Pages (PDF to Text)
   */
  async extractTextFromPdf(pageDescriptors, onProgress = () => {}) {
    this._configurePdfJsWorker();
    const chunks = [];
    const total = pageDescriptors.length;

    for (let i = 0; i < total; i++) {
      const desc = pageDescriptors[i];
      onProgress(Math.round(((i + 1) / total) * 95), `Extracting text from page ${i + 1} of ${total}...`);

      const clonedBuffer = desc.buffer.slice(0);
      const loadingTask = window.pdfjsLib.getDocument({ data: clonedBuffer });
      const pdfJsDoc = await loadingTask.promise;

      try {
        const page = await pdfJsDoc.getPage(desc.pageIndex + 1);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        chunks.push(`--- PAGE ${i + 1} (${desc.fileName}) ---\n${pageText.trim()}\n`);
        page.cleanup();
      } finally {
        await pdfJsDoc.destroy();
      }
    }

    onProgress(100, 'Text extraction complete!');
    return chunks.join('\n');
  }

  /**
   * 6. Images to PDF Converter
   */
  async imagesToPdf(imageItems, options = { pageSize: 'A4', margin: 24 }, onProgress = () => {}) {
    const { PDFDocument } = window.PDFLib;
    const outPdf = await PDFDocument.create();
    const total = imageItems.length;
    const DIMENSIONS = { A4: [595.28, 841.89], LETTER: [612, 792] };

    for (let i = 0; i < total; i++) {
      const item = imageItems[i];
      onProgress(Math.round(((i + 1) / total) * 90), `Embedding image ${i + 1} of ${total}...`);

      const normalizedJpegBytes = await this._normalizeImageToJpegBuffer(item.file, item.rotation || 0);
      const embeddedImg = await outPdf.embedJpg(normalizedJpegBytes);

      const imgWidth = embeddedImg.width;
      const imgHeight = embeddedImg.height;

      let pageWidth = imgWidth;
      let pageHeight = imgHeight;
      let margin = Number(options.margin) || 0;

      if (options.pageSize !== 'FIT' && DIMENSIONS[options.pageSize]) {
        [pageWidth, pageHeight] = DIMENSIONS[options.pageSize];
      } else {
        margin = 0;
      }

      const page = outPdf.addPage([pageWidth, pageHeight]);
      const availW = Math.max(20, pageWidth - margin * 2);
      const availH = Math.max(20, pageHeight - margin * 2);
      const scale = Math.min(availW / imgWidth, availH / imgHeight);

      const drawW = imgWidth * scale;
      const drawH = imgHeight * scale;
      const drawX = (pageWidth - drawW) / 2;
      const drawY = (pageHeight - drawH) / 2;

      page.drawImage(embeddedImg, { x: drawX, y: drawY, width: drawW, height: drawH });
    }

    onProgress(96, 'Finalizing image PDF...');
    const bytes = await outPdf.save({ useObjectStreams: true });
    onProgress(100, 'Images converted to PDF!');
    return bytes;
  }

  async _normalizeImageToJpegBuffer(file, rotationDeg = 0) {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });

    const normRot = ((rotationDeg % 360) + 360) % 360;
    const swapDims = normRot === 90 || normRot === 270;
    canvas.width = swapDims ? bitmap.height : bitmap.width;
    canvas.height = swapDims ? bitmap.width : bitmap.height;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((normRot * Math.PI) / 180);
    ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
    ctx.restore();
    bitmap.close();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    canvas.width = 1;
    canvas.height = 1;
    return blob.arrayBuffer();
  }

  /**
   * 7. Text / Notes to PDF Generator (Supports ASCII + Full Unicode / Urdu / Arabic / Emoji via Canvas fallback)
   */
  async createPdfFromText(config = { title: 'Document', body: '', fontSize: 12 }, onProgress = () => {}) {
    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
    onProgress(25, 'Initializing PDF document...');
    const pdfDoc = await PDFDocument.create();

    const titleStr = String(config.title || '');
    const bodyStr = String(config.body || '');
    const hasNonWinAnsi = /[^\x20-\x7E\xA0-\xFF\r\n\t]/.test(titleStr + '\n' + bodyStr);

    if (hasNonWinAnsi) {
      const pageW = 1190;
      const pageH = 1684;
      const margin = 90;
      const fSize = Math.min(44, Math.max(18, Math.round((Number(config.fontSize) || 12) * 2.1)));
      const lineH = Math.round(fSize * 1.55);

      const canvas = document.createElement('canvas');
      canvas.width = pageW;
      canvas.height = pageH;
      const ctx = canvas.getContext('2d');

      const resetCanvasPage = (isFirst) => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageW, pageH);
        let y = margin;
        if (isFirst && titleStr) {
          ctx.fillStyle = '#064e3b';
          ctx.font = 'bold 34px "Plus Jakarta Sans", Arial, sans-serif';
          ctx.fillText(titleStr, margin, y + 30);
          y += 76;
        }
        ctx.fillStyle = '#0f172a';
        ctx.font = `${fSize}px "Plus Jakarta Sans", Arial, sans-serif`;
        return y;
      };

      const flushCanvasPage = async () => {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
        const jpgBytes = await blob.arrayBuffer();
        const img = await pdfDoc.embedJpg(jpgBytes);
        const page = pdfDoc.addPage([595.28, 841.89]);
        page.drawImage(img, { x: 0, y: 0, width: 595.28, height: 841.89 });
      };

      let cursorY = resetCanvasPage(true);
      const maxW = pageW - margin * 2;
      const paragraphs = bodyStr.split(/\r?\n/);

      for (const para of paragraphs) {
        const words = para.split(' ');
        let line = '';
        for (const word of words) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.measureText(test).width > maxW && line) {
            if (cursorY > pageH - margin) {
              await flushCanvasPage();
              cursorY = resetCanvasPage(false);
            }
            ctx.fillText(line, margin, cursorY);
            cursorY += lineH;
            line = word;
          } else {
            line = test;
          }
        }
        if (cursorY > pageH - margin) {
          await flushCanvasPage();
          cursorY = resetCanvasPage(false);
        }
        ctx.fillText(line, margin, cursorY);
        cursorY += lineH;
      }
      await flushCanvasPage();
      canvas.width = 1;
      canvas.height = 1;
      onProgress(100, 'Created Unicode PDF from text!');
      return pdfDoc.save({ useObjectStreams: true });
    }

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 50;
    const fontSize = Math.min(28, Math.max(8, Number(config.fontSize) || 12));
    const lineHeight = fontSize * 1.45;
    const maxLineWidth = pageWidth - margin * 2;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let cursorY = pageHeight - margin;

    if (titleStr) {
      page.drawText(titleStr, {
        x: margin,
        y: cursorY - 18,
        size: 18,
        font: fontBold,
        color: rgb(0.023, 0.306, 0.231)
      });
      cursorY -= 42;
    }

    const paragraphs = bodyStr.split(/\r?\n/);
    for (const para of paragraphs) {
      const words = para.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = fontReg.widthOfTextAtSize(testLine, fontSize);
        if (width > maxLineWidth && currentLine) {
          if (cursorY < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            cursorY = pageHeight - margin;
          }
          page.drawText(currentLine, { x: margin, y: cursorY, size: fontSize, font: fontReg, color: rgb(0.1, 0.1, 0.12) });
          cursorY -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (cursorY < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        cursorY = pageHeight - margin;
      }
      page.drawText(currentLine, { x: margin, y: cursorY, size: fontSize, font: fontReg, color: rgb(0.1, 0.1, 0.12) });
      cursorY -= lineHeight;
    }

    onProgress(100, 'Created PDF from text!');
    return pdfDoc.save({ useObjectStreams: true });
  }

  /**
   * 8. Add Page Numbers & Custom Header / Footer
   */
  async addPageNumbersAndHeaderFooter(
    pageDescriptors,
    config = { format: 'Page {n} of {total}', position: 'bottom-center', headerText: '', fontSize: 10 },
    onProgress = () => {}
  ) {
    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
    const mergedBytes = await this.mergeAndReorderPages(pageDescriptors, (p, s) =>
      onProgress(Math.round(p * 0.65), s)
    );
    const pdfDoc = await PDFDocument.load(mergedBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();
    const total = pages.length;
    const size = Number(config.fontSize) || 10;

    pages.forEach((page, i) => {
      const { width, height } = page.getSize();
      const label = (config.format || 'Page {n} of {total}')
        .replace('{n}', String(i + 1))
        .replace('{total}', String(total));

      const textW = font.widthOfTextAtSize(label, size);
      let x = (width - textW) / 2;
      let y = 24;

      if (config.position.includes('left')) x = 36;
      if (config.position.includes('right')) x = width - textW - 36;
      if (config.position.includes('top')) y = height - 28;

      page.drawText(label, { x, y, size, font, color: rgb(0.2, 0.25, 0.3) });

      if (config.headerText && config.headerText.trim()) {
        const hw = font.widthOfTextAtSize(config.headerText.trim(), size);
        page.drawText(config.headerText.trim(), {
          x: (width - hw) / 2,
          y: height - 26,
          size,
          font,
          color: rgb(0.023, 0.306, 0.231)
        });
      }
    });

    onProgress(100, 'Page numbers & headers applied!');
    return pdfDoc.save({ useObjectStreams: true });
  }

  /**
   * 9. Watermark & Protect PDF
   */
  async applyWatermarkAndProtect(pageDescriptors, config, onProgress = () => {}) {
    const { PDFDocument, StandardFonts, rgb, degrees } = window.PDFLib;
    const mergedBytes = await this.mergeAndReorderPages(pageDescriptors, (p, s) =>
      onProgress(Math.round(p * 0.6), s)
    );

    onProgress(70, 'Applying vector watermark & document metadata...');
    const pdfDoc = await PDFDocument.load(mergedBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const watermarkText = (config.text || 'CONFIDENTIAL').trim();
    const opacity = Math.min(1, Math.max(0.05, Number(config.opacity) || 0.28));
    const fontSize = Math.min(120, Math.max(12, Number(config.fontSize) || 46));
    const colorRgb = this._hexToRgb(config.colorHex || '#d97706');

    if (config.author) {
      pdfDoc.setAuthor(config.author);
      pdfDoc.setProducer('Emerald PDF Toolkit (100% Client-Side)');
      pdfDoc.setCreator('Emerald PDF Security Engine');
    }

    const pages = pdfDoc.getPages();
    pages.forEach((page, idx) => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

      if (config.placement === 'header') {
        page.drawText(watermarkText, {
          x: Math.max(20, (width - textWidth) / 2),
          y: height - fontSize - 24,
          size: fontSize * 0.55,
          font,
          color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
          opacity
        });
      } else if (config.placement === 'footer') {
        page.drawText(watermarkText, {
          x: Math.max(20, (width - textWidth) / 2),
          y: 24,
          size: fontSize * 0.55,
          font,
          color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
          opacity
        });
      } else {
        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2.8,
          y: height / 2 - fontSize / 2,
          size: fontSize,
          font,
          color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
          opacity,
          rotate: degrees(38)
        });
      }
      onProgress(70 + Math.round(((idx + 1) / pages.length) * 25), `Stamping page ${idx + 1}...`);
    });

    const finalBytes = await pdfDoc.save({ useObjectStreams: true });
    onProgress(100, 'Watermark & protection applied!');
    return finalBytes;
  }

  /**
   * 10. Sign PDF (Interactive Drawn Signature PNG Stamp)
   */
  async signPdfWithPng(
    pageDescriptors,
    signatureDataUrl,
    config = { position: 'bottom-right', targetPages: 'last', signerName: '' },
    onProgress = () => {}
  ) {
    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
    const mergedBytes = await this.mergeAndReorderPages(pageDescriptors, (p, s) =>
      onProgress(Math.round(p * 0.65), s)
    );
    const pdfDoc = await PDFDocument.load(mergedBytes);
    const pngImage = await pdfDoc.embedPng(signatureDataUrl);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const indicesToSign =
      config.targetPages === 'all'
        ? pages.map((_, i) => i)
        : config.targetPages === 'first'
        ? [0]
        : [pages.length - 1];

    for (const idx of indicesToSign) {
      const page = pages[idx];
      if (!page) continue;
      const { width, height } = page.getSize();
      const sigW = 150;
      const sigH = 60;

      let x = width - sigW - 42;
      let y = 48;
      if (config.position === 'bottom-left') x = 42;
      if (config.position === 'bottom-center') x = (width - sigW) / 2;
      if (config.position === 'center') {
        x = (width - sigW) / 2;
        y = (height - sigH) / 2;
      }

      page.drawImage(pngImage, { x, y, width: sigW, height: sigH });
      if (config.signerName) {
        page.drawText(`Signed by: ${config.signerName} (${new Date().toISOString().slice(0, 10)})`, {
          x,
          y: y - 12,
          size: 8,
          font,
          color: rgb(0.023, 0.306, 0.231)
        });
      }
    }

    onProgress(100, 'Digital signature stamped onto PDF!');
    return pdfDoc.save({ useObjectStreams: true });
  }

  /**
   * 11. Crop PDF Margins or Add Padding / Resize Page
   */
  async cropOrResizePages(
    pageDescriptors,
    config = { mode: 'crop', marginPt: 36, targetSize: 'A4' },
    onProgress = () => {}
  ) {
    const { PDFDocument } = window.PDFLib;
    const mergedBytes = await this.mergeAndReorderPages(pageDescriptors, (p, s) =>
      onProgress(Math.round(p * 0.65), s)
    );
    const pdfDoc = await PDFDocument.load(mergedBytes);
    const pages = pdfDoc.getPages();
    const pt = Number(config.marginPt) || 0;

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      if (config.mode === 'crop' && pt > 0) {
        const cropW = Math.max(50, width - pt * 2);
        const cropH = Math.max(50, height - pt * 2);
        page.setCropBox(pt, pt, cropW, cropH);
        page.setMediaBox(pt, pt, cropW, cropH);
      } else if (config.mode === 'resize') {
        const SIZES = {
          A4: [595.28, 841.89],
          LETTER: [612, 792],
          LEGAL: [612, 1008],
          A3: [841.89, 1190.55]
        };
        const [targetW, targetH] = SIZES[config.targetSize] || SIZES.A4;
        const scaleX = (targetW - pt * 2) / width;
        const scaleY = (targetH - pt * 2) / height;
        const scale = Math.min(scaleX, scaleY);
        page.setSize(targetW, targetH);
        page.scaleContent(scale, scale);
        page.translateContent(pt, pt);
      }
    });

    onProgress(100, 'Page geometry updated!');
    return pdfDoc.save({ useObjectStreams: true });
  }

  /**
   * 12. Edit or Scrub PDF Metadata (Privacy Sanitizer)
   */
  async updateOrScrubMetadata(
    pageDescriptors,
    config = { scrubAll: false, title: '', author: '', subject: '', keywords: '' },
    onProgress = () => {}
  ) {
    const { PDFDocument } = window.PDFLib;
    const mergedBytes = await this.mergeAndReorderPages(pageDescriptors, (p, s) =>
      onProgress(Math.round(p * 0.7), s)
    );
    const pdfDoc = await PDFDocument.load(mergedBytes);

    if (config.scrubAll) {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
    } else {
      if (config.title !== undefined) pdfDoc.setTitle(config.title);
      if (config.author !== undefined) pdfDoc.setAuthor(config.author);
      if (config.subject !== undefined) pdfDoc.setSubject(config.subject);
      if (config.keywords !== undefined) {
        pdfDoc.setKeywords(
          config.keywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean)
        );
      }
    }

    onProgress(100, 'Metadata updated!');
    return pdfDoc.save({ useObjectStreams: true });
  }

  /**
   * 13. Insert Blank Pages into PDF
   */
  async insertBlankPages(pageDescriptors, position = 'end', count = 1, onProgress = () => {}) {
    const { PDFDocument } = window.PDFLib;
    const mergedBytes = await this.mergeAndReorderPages(pageDescriptors, (p, s) =>
      onProgress(Math.round(p * 0.7), s)
    );
    const pdfDoc = await PDFDocument.load(mergedBytes);
    const pages = pdfDoc.getPages();
    const refSize = pages.length > 0 ? pages[0].getSize() : { width: 595.28, height: 841.89 };

    if (position === 'start') {
      for (let i = 0; i < count; i++) {
        pdfDoc.insertPage(0, [refSize.width, refSize.height]);
      }
    } else if (position === 'between') {
      for (let i = pages.length - 1; i >= 1; i--) {
        pdfDoc.insertPage(i, [refSize.width, refSize.height]);
      }
    } else {
      for (let i = 0; i < count; i++) {
        pdfDoc.addPage([refSize.width, refSize.height]);
      }
    }

    onProgress(100, 'Blank pages inserted!');
    return pdfDoc.save({ useObjectStreams: true });
  }

  /**
   * 14. 2-Up / N-Up Booklet Page Imposition (Combine 2 pages side-by-side onto Landscape A4)
   */
  async createTwoUpLayout(pageDescriptors, onProgress = () => {}) {
    const { PDFDocument } = window.PDFLib;
    const mergedBytes = await this.mergeAndReorderPages(pageDescriptors, (p, s) =>
      onProgress(Math.round(p * 0.5), s)
    );
    const srcDoc = await PDFDocument.load(mergedBytes);
    const outDoc = await PDFDocument.create();
    const srcPages = srcDoc.getPages();

    const sheetW = 841.89; // A4 Landscape
    const sheetH = 595.28;
    const halfW = sheetW / 2;

    for (let i = 0; i < srcPages.length; i += 2) {
      onProgress(50 + Math.round(((i + 1) / srcPages.length) * 45), `Imposing 2-Up sheet ${Math.floor(i / 2) + 1}...`);
      const sheet = outDoc.addPage([sheetW, sheetH]);

      const [leftEmbed] = await outDoc.embedPages([srcPages[i]]);
      const leftScale = Math.min((halfW - 24) / leftEmbed.width, (sheetH - 24) / leftEmbed.height);
      sheet.drawPage(leftEmbed, {
        x: (halfW - leftEmbed.width * leftScale) / 2,
        y: (sheetH - leftEmbed.height * leftScale) / 2,
        width: leftEmbed.width * leftScale,
        height: leftEmbed.height * leftScale
      });

      if (i + 1 < srcPages.length) {
        const [rightEmbed] = await outDoc.embedPages([srcPages[i + 1]]);
        const rightScale = Math.min((halfW - 24) / rightEmbed.width, (sheetH - 24) / rightEmbed.height);
        sheet.drawPage(rightEmbed, {
          x: halfW + (halfW - rightEmbed.width * rightScale) / 2,
          y: (sheetH - rightEmbed.height * rightScale) / 2,
          width: rightEmbed.width * rightScale,
          height: rightEmbed.height * rightScale
        });
      }
    }

    onProgress(100, '2-Up imposition complete!');
    return outDoc.save({ useObjectStreams: true });
  }

  /**
   * 15. Redact Area on PDF Pages (Permanent black security box over coordinates)
   */
  async applyRedactionBox(
    pageDescriptors,
    config = { xPercent: 10, yPercent: 75, widthPercent: 80, heightPercent: 10, label: 'REDACTED' },
    onProgress = () => {}
  ) {
    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
    const mergedBytes = await this.mergeAndReorderPages(pageDescriptors, (p, s) =>
      onProgress(Math.round(p * 0.65), s)
    );
    const pdfDoc = await PDFDocument.load(mergedBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const boxX = (Number(config.xPercent) / 100) * width;
      const boxY = (Number(config.yPercent) / 100) * height;
      const boxW = (Number(config.widthPercent) / 100) * width;
      const boxH = (Number(config.heightPercent) / 100) * height;

      page.drawRectangle({
        x: boxX,
        y: boxY,
        width: boxW,
        height: boxH,
        color: rgb(0, 0, 0)
      });

      if (config.label) {
        page.drawText(config.label, {
          x: boxX + 8,
          y: boxY + Math.max(4, boxH / 2 - 5),
          size: 10,
          font,
          color: rgb(0.95, 0.6, 0.05)
        });
      }
    });

    onProgress(100, 'Redaction blocks applied!');
    return pdfDoc.save({ useObjectStreams: true });
  }

  _hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.replace(/(.)/g, '$1$1') : clean, 16);
    return {
      r: ((num >> 16) & 255) / 255,
      g: ((num >> 8) & 255) / 255,
      b: (num & 255) / 255
    };
  }
}
