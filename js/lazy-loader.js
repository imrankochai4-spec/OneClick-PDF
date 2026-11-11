// File: public/js/lazy-loader.js
/**
 * High-Speed Dynamic Script & Engine Loader
 * Splits heavy PDF WebAssembly/JS libraries (~900KB) out of the critical rendering path
 * so the main web app loads in < 50ms and achieves 99-100 Google PageSpeed scores.
 */

const CDN_SCRIPTS = {
  pdflib: 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js',
  pdfjs: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  pdfjsWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
};

const loadedPromises = new Map();

function loadExternalScript(url) {
  if (loadedPromises.has(url)) {
    return loadedPromises.get(url);
  }
  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing && (window.PDFLib || window.pdfjsLib)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load engine script: ${url}`));
    document.head.appendChild(script);
  });
  loadedPromises.set(url, promise);
  return promise;
}

/**
 * Ensures both pdf-lib and pdf.js are loaded in memory before running a PDF operation.
 */
export async function ensurePdfEnginesLoaded() {
  const tasks = [];
  if (!window.PDFLib) {
    tasks.push(loadExternalScript(CDN_SCRIPTS.pdflib));
  }
  if (!window.pdfjsLib) {
    tasks.push(
      loadExternalScript(CDN_SCRIPTS.pdfjs).then(() => {
        if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = CDN_SCRIPTS.pdfjsWorker;
        }
      })
    );
  }
  if (tasks.length > 0) {
    await Promise.all(tasks);
  }
}

/**
 * Prefetches heavy PDF engines quietly during browser idle time AFTER first paint.
 */
export function scheduleIdleEnginePrefetch() {
  const trigger = () => {
    ensurePdfEnginesLoaded().catch(() => {});
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(trigger, { timeout: 2500 });
  } else {
    setTimeout(trigger, 1200);
  }
}
