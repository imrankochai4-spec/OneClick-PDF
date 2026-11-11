// File: public/js/app.js
import { ClientPdfEngine } from './pdf-engine.js';
import { ClientUtilityEngine } from './utility-engine.js';
import { ONECLICK_TOOLS } from './tools-catalog.js';
import { ensurePdfEnginesLoaded, scheduleIdleEnginePrefetch } from './lazy-loader.js';
import {
  LEGAL_PAGES,
  runNumericCalculator,
  convertExtractedTextToBankCsv,
  summarizeExtractedPdfText
} from './legal-content.js';

const MEGA_MENU_CONFIG = {
  pdf: {
    title: 'DOCUMENT TOOLS',
    desc: 'Convert, merge, split, and manage your documents',
    countText: '85 tools available',
    featured: ['txt2word', 'md2word', 'md2html', 'md2pdf'],
    popular: [
      'cbz2pdf', 'text2pdf', 'ipynb2pdf', 'ipynb2html', 'ipynb2py', 'ipynb2word',
      'ipynb2latex', 'ipynb2json', 'txt2docx', 'txt2csv', 'txt2json', 'txt2html',
      'txt2xml', 'txt2md', 'txt2rtf', 'txt2xlsx', 'txt2sql', 'txt2base64',
      'txt2png', 'txt2jpg', 'txt2qr', 'txt2epub', 'ebook_conv', 'epub2pdf',
      'epub2txt', 'epub2xml', 'epub2csv', 'epub2fb2', 'word2pdf', 'word2png'
    ]
  },
  image: {
    title: 'IMAGE TOOLS',
    desc: 'Edit, resize, compress, and transform your images',
    countText: '73 tools available',
    featured: ['png2jpg', 'jpg2png', 'jpg2webp', 'jpg2word'],
    popular: [
      'jpg2excel', 'jpg2ppt', 'jpg2svg', 'jpg2bmp', 'bmp2jpg', 'bmp2png',
      'bmp2webp', 'bmp2gif', 'bmp2pdf', 'bmp2ico', 'bmp2svg', 'bmp2tiff',
      'bmp2base64', 'bmp_batch', 'jpg2tiff', 'jpg2ico', 'jfif2jpg', 'jfif2png',
      'jfif2webp', 'jfif2gif', 'jfif2bmp', 'jfif2ico', 'jfif2pdf', 'jfif2svg',
      'jfif2tiff', 'jfif2psd', 'jfif2avif', 'jfif2base64', 'jpg2psd', 'jpg2html'
    ]
  },
  calc: {
    title: 'OTHER TOOLS',
    desc: 'Calculators, converters, QR codes, and more',
    countText: '25 tools available',
    featured: ['bank_to_excel', 'age_calc', 'salary_tax_calc', 'zakat_calc'],
    popular: [
      'afghan_date', 'merge', 'split', 'compress', 'pdf2pdfa', 'rotate',
      'remove', 'reorder', 'pdf_summarizer', 'watermark', 'qr_gen', 'tasbih_counter',
      'gif_maker', 'gif_resizer', 'gif_rotator', 'gif_trimmer', 'gif_optimizer', 'gif2video',
      'gif2png', 'gif2jpg', 'gif2webp'
    ]
  }
};

class OneClickApp {
  constructor() {
    this.pdfEngine = new ClientPdfEngine();
    this.utilEngine = new ClientUtilityEngine();
    const urlTool = new URLSearchParams(window.location.search).get('tool');
    this.activeTool = ONECLICK_TOOLS.some((t) => t.id === urlTool) ? urlTool : 'merge';
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.showAllTools = false;
    this.viewMode = 'grid';

    /** @type {Array<{id: string, type: 'pdf'|'image'|'text', fileName: string, fileSize: number, buffer?: ArrayBuffer, file?: File, textContent?: string, pageIndex?: number, rotation: number, selected: boolean, objectUrl?: string}>} */
    this.items = [];
    this.dragSrcIndex = null;

    this.lastOutputData = null;
    this.lastOutputName = 'allonlinepdftools-output.pdf';
    this.lastOutputMime = 'application/pdf';
    this.deferredInstallPrompt = null;

    // Tasbih, Stopwatch & Typing state
    this.tasbihCount = Number(localStorage.getItem('allonline_tasbih_count') || 0);
    this.tasbihTarget = 33;
    this.stopwatchTimer = null;
    this.stopwatchRunning = false;
    this.stopwatchElapsedMs = 0;
    this.stopwatchLaps = [];
    this.typingStartTime = null;
    this.paidCarouselOffset = 0;

    this._initDomRefs();
    this._initTheme();
    this._populateHeroDropdown();
    this._renderToolsDirectory();
    this._bindEvents();
    this._registerServiceWorker();
    this._setupMobileBackNavigation();
    this._syncNativeAppBanner();
    this._renderToolConfigSidebar();
    this._updateActiveToolSeo(this.activeTool);
    scheduleIdleEnginePrefetch();
  }

  _syncNativeAppBanner() {
    const isNative = Boolean(
      (window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform()) ||
      typeof window.AndroidDownloader !== 'undefined' ||
      /; wv\)/i.test(navigator.userAgent || '')
    );
    if (isNative) {
      document.getElementById('mobileAppAlertBanner')?.classList.add('hidden');
    }
  }

  _initDomRefs() {
    this.toolsGrid = document.getElementById('toolsGrid');
    this.toolSearchInput = document.getElementById('toolSearchInput');
    this.headerSearchInput = document.getElementById('headerSearchInput');
    this.categoryTabs = document.querySelectorAll('.cat-tab');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.directorySectionHeading = document.getElementById('directorySectionHeading');
    this.toolCountBadge = document.getElementById('toolCountBadge');
    this.toggleShowAllToolsBtn = document.getElementById('toggleShowAllToolsBtn');
    this.toggleShowAllToolsText = document.getElementById('toggleShowAllToolsText');

    // Hero 3-Step Converter Refs
    this.heroDropzoneBox = document.getElementById('heroDropzoneBox');
    this.heroDropStatusText = document.getElementById('heroDropStatusText');
    this.heroToolSelect = document.getElementById('heroToolSelect');
    this.heroConvertBtn = document.getElementById('heroConvertBtn');

    // Mega-Menu Refs
    this.megaMenuPanel = document.getElementById('megaMenuPanel');
    this.megaCatTitle = document.getElementById('megaCatTitle');
    this.megaCatDesc = document.getElementById('megaCatDesc');
    this.megaFeaturedList = document.getElementById('megaFeaturedList');
    this.megaPopularCols = document.getElementById('megaPopularCols');
    this.megaFooterCount = document.getElementById('megaFooterCount');
    this.megaViewAllBtn = document.getElementById('megaViewAllBtn');

    // Studio Workspace Refs
    this.dropzone = document.getElementById('dropzone');
    this.dropzoneToolName = document.getElementById('dropzoneToolName');
    this.fileInput = document.getElementById('fileInput');
    this.pagesGrid = document.getElementById('pagesGrid');
    this.statsPill = document.getElementById('statsPill');
    this.rotateAllBtn = document.getElementById('rotateAllBtn');
    this.reverseAllBtn = document.getElementById('reverseAllBtn');
    this.clearAllBtn = document.getElementById('clearAllBtn');
    this.demoSampleBtn = document.getElementById('demoSampleBtn');
    this.gridViewBtn = document.getElementById('gridViewBtn');
    this.listViewBtn = document.getElementById('listViewBtn');
    this.addMoreFilesCircleBtn = document.getElementById('addMoreFilesCircleBtn');

    this.configContainer = document.getElementById('toolConfigContainer');
    this.sidebarIcon = document.getElementById('sidebarIcon');
    this.sidebarTitleText = document.getElementById('sidebarTitleText');
    this.sidebarSubtitleText = document.getElementById('sidebarSubtitleText');
    this.processBtn = document.getElementById('processBtn');
    this.processBtnLabel = document.getElementById('processBtnLabel');

    this.progressBox = document.getElementById('progressBox');
    this.progressFill = document.getElementById('progressFill');
    this.progressStatus = document.getElementById('progressStatus');
    this.progressPercent = document.getElementById('progressPercent');

    this.resultCard = document.getElementById('resultCard');
    this.resultMetaText = document.getElementById('resultMetaText');
    this.resultExtraContainer = document.getElementById('resultExtraContainer');
    this.downloadResultBtn = document.getElementById('downloadResultBtn');
    this.shareResultBtn = document.getElementById('shareResultBtn');
    this.openResultBtn = document.getElementById('openResultBtn');
    this.downloadFeedbackMsg = document.getElementById('downloadFeedbackMsg');

    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.installPwaBtn = document.getElementById('installPwaBtn');
  }

  _uid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'oc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  _initTheme() {
    const saved = localStorage.getItem('oneclick_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    if (this.themeToggleBtn) {
      this.themeToggleBtn.textContent = saved === 'dark' ? '☀️' : '🌙';
    }
  }

  _populateHeroDropdown() {
    if (!this.heroToolSelect) return;
    this.heroToolSelect.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (const tool of ONECLICK_TOOLS) {
      const opt = document.createElement('option');
      opt.value = tool.id;
      opt.textContent = `${tool.title} (${tool.from || 'FILE'} → ${tool.to || 'OUT'}) — ${tool.desc.slice(0, 48)}`;
      if (tool.id === this.activeTool) opt.selected = true;
      fragment.appendChild(opt);
    }
    this.heroToolSelect.appendChild(fragment);
  }

  _buildDualIconHtml(tool) {
    const fromTxt = (tool.from || 'PDF').slice(0, 4);
    const toTxt = (tool.to || 'OUT').slice(0, 4);
    const color = tool.color || '#2563eb';
    return `
      <div class="dual-file-icon" style="--badge-color:${color};">
        <div class="dual-sheet-back">${fromTxt}</div>
        <div class="dual-sheet-front">${toTxt}</div>
      </div>
    `;
  }

  _openMegaMenu(catKey) {
    const cfg = MEGA_MENU_CONFIG[catKey];
    if (!cfg || !this.megaMenuPanel) return;

    if (this._lastMegaKey !== catKey) {
      this._lastMegaKey = catKey;
      this.megaCatTitle.textContent = cfg.title;
      this.megaCatDesc.textContent = cfg.desc;
      this.megaFooterCount.textContent = cfg.countText;

      const renderMiniBtn = (toolId) => {
        const t = ONECLICK_TOOLS.find((x) => x.id === toolId);
        if (!t) return '';
        return `
          <button type="button" class="mega-tool-btn" data-mega-pick="${t.id}">
            ${this._buildDualIconHtml(t)}
            <span>${t.title}</span>
          </button>
        `;
      };

      this.megaFeaturedList.innerHTML = cfg.featured.map(renderMiniBtn).join('');
      this.megaPopularCols.innerHTML = cfg.popular.map(renderMiniBtn).join('');
    }

    this.megaMenuPanel.classList.add('open');

    if (this.megaViewAllBtn) {
      this.megaViewAllBtn.onclick = () => {
        this.megaMenuPanel.classList.remove('open');
        this.showAllTools = true;
        this._setCategory(catKey);
        document.getElementById('directorySectionHeading')?.scrollIntoView({ behavior: 'smooth' });
      };
    }
  }

  _setCategory(cat) {
    this.activeCategory = cat || 'all';
    if (cat !== 'all') this.showAllTools = true;
    this.categoryTabs.forEach((t) => t.classList.toggle('active', t.dataset.cat === cat));
    this.navLinks.forEach((n) => n.classList.toggle('active', n.dataset.nav === cat));

    const HEADINGS = {
      all: 'All Free Tools',
      pdf: 'Document Tools',
      image: 'Image Tools',
      calc: 'Other Tools & Calculators',
      text: 'Text, QR & Developer Tools'
    };
    if (this.directorySectionHeading) {
      this.directorySectionHeading.textContent = HEADINGS[cat] || HEADINGS.all;
    }
    this._renderToolsDirectory();
  }

  _renderToolsDirectory() {
    if (!this.toolsGrid) return;
    this.toolsGrid.innerHTML = '';
    const q = this.searchQuery.toLowerCase().trim();

    let filtered = ONECLICK_TOOLS.filter((t) => {
      const matchCat = this.activeCategory === 'all' || t.cat === this.activeCategory;
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.cat.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    const totalMatched = filtered.length;
    if (!q && this.activeCategory === 'all' && !this.showAllTools) {
      filtered = filtered.slice(0, 20);
    }

    if (this.toolCountBadge) {
      this.toolCountBadge.textContent = `Showing ${filtered.length} of ${totalMatched} Tools`;
    }

    if (this.toggleShowAllToolsText) {
      this.toggleShowAllToolsText.textContent =
        this.showAllTools && this.activeCategory === 'all'
          ? 'Show Top 20 Popular Tools ↑'
          : `View All ${ONECLICK_TOOLS.length}+ Tools →`;
    }

    if (filtered.length === 0) {
      this.toolsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
          No tools matched "<strong>${this.searchQuery}</strong>". Try clearing the search filter.
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const tool of filtered) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `tool-card ${this.activeTool === tool.id ? 'active' : ''}`;
      btn.dataset.tool = tool.id;
      btn.innerHTML = `
        ${this._buildDualIconHtml(tool)}
        <div class="tool-card-body">
          <div class="tool-card-title">${tool.title}</div>
          <div class="tool-card-desc">${tool.desc}</div>
        </div>
      `;
      fragment.appendChild(btn);
    }
    this.toolsGrid.appendChild(fragment);
  }

  _bindEvents() {
    this.toolsGrid?.addEventListener('click', (e) => {
      const card = e.target.closest('.tool-card[data-tool]');
      if (!card) return;
      this.switchTool(card.dataset.tool);
      document.getElementById('studioWorkspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    this.megaMenuPanel?.addEventListener('click', (e) => {
      const pick = e.target.closest('[data-mega-pick]');
      if (!pick) return;
      const id = pick.getAttribute('data-mega-pick');
      this.megaMenuPanel.classList.remove('open');
      this.switchTool(id);
      document.getElementById('studioWorkspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    this.themeToggleBtn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('oneclick_theme', next);
      this.themeToggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    });

    // Sync both header search and main directory search
    let searchRaf = null;
    const handleSearch = (val) => {
      this.searchQuery = val;
      if (this.toolSearchInput && this.toolSearchInput.value !== val) this.toolSearchInput.value = val;
      if (this.headerSearchInput && this.headerSearchInput.value !== val) this.headerSearchInput.value = val;
      if (searchRaf) cancelAnimationFrame(searchRaf);
      searchRaf = requestAnimationFrame(() => this._renderToolsDirectory());
    };

    this.toolSearchInput?.addEventListener('input', (e) => handleSearch(e.target.value));
    this.headerSearchInput?.addEventListener('input', (e) => {
      handleSearch(e.target.value);
      if (e.target.value.trim().length === 1) {
        document.getElementById('directorySectionHeading')?.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Mega-Menu Hover & Click
    document.querySelectorAll('.js-mega-trigger').forEach((btn) => {
      const key = btn.getAttribute('data-mega');
      btn.addEventListener('mouseenter', () => this._openMegaMenu(key));
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = this.megaMenuPanel?.classList.contains('open');
        if (isOpen && this.megaCatTitle?.textContent === MEGA_MENU_CONFIG[key]?.title) {
          this.megaMenuPanel.classList.remove('open');
        } else {
          this._openMegaMenu(key);
        }
      });
    });

    this.megaMenuPanel?.addEventListener('mouseleave', () => {
      this.megaMenuPanel.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (this.megaMenuPanel && !this.megaMenuPanel.contains(e.target) && !e.target.closest('.js-mega-trigger')) {
        this.megaMenuPanel.classList.remove('open');
      }
    });

    this.categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => this._setCategory(tab.dataset.cat));
    });

    document.querySelectorAll('[data-nav="all"]').forEach((el) => {
      el.addEventListener('click', () => {
        this.megaMenuPanel?.classList.remove('open');
        this.showAllTools = true;
        this._setCategory('all');
        document.getElementById('directorySectionHeading')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    document.getElementById('appGridLauncherBtn')?.addEventListener('click', () => {
      this.showAllTools = true;
      this._setCategory('all');
      document.getElementById('directorySectionHeading')?.scrollIntoView({ behavior: 'smooth' });
    });

    this.toggleShowAllToolsBtn?.addEventListener('click', () => {
      this.showAllTools = !this.showAllTools;
      if (this.showAllTools) this.activeCategory = 'all';
      this._renderToolsDirectory();
    });

    // Hero 3-Step Converter Box Events
    this.heroDropzoneBox?.addEventListener('click', (e) => {
      if (e.target.closest('#demoSampleBtn')) return;
      this.fileInput.click();
    });
    this.heroDropzoneBox?.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.heroDropzoneBox.classList.add('dragover');
    });
    this.heroDropzoneBox?.addEventListener('dragleave', () => {
      this.heroDropzoneBox.classList.remove('dragover');
    });
    this.heroDropzoneBox?.addEventListener('drop', async (e) => {
      e.preventDefault();
      this.heroDropzoneBox.classList.remove('dragover');
      if (e.dataTransfer?.files?.length) {
        await this.handleFiles(Array.from(e.dataTransfer.files));
        document.getElementById('studioWorkspace')?.scrollIntoView({ behavior: 'smooth' });
      }
    });

    this.heroToolSelect?.addEventListener('change', (e) => {
      this.switchTool(e.target.value);
    });

    this.heroConvertBtn?.addEventListener('click', () => {
      if (this.heroToolSelect) {
        this.switchTool(this.heroToolSelect.value);
      }
      document.getElementById('studioWorkspace')?.scrollIntoView({ behavior: 'smooth' });
      if (this.items.length > 0) {
        this.executeCurrentTool();
      }
    });

    // Studio Canvas Events (Grid/List Toggle, '+' Button, Dropzone)
    this.gridViewBtn?.addEventListener('click', () => {
      this.viewMode = 'grid';
      this.gridViewBtn.classList.add('active');
      this.listViewBtn?.classList.remove('active');
      this.pagesGrid?.classList.remove('list-mode');
    });

    this.listViewBtn?.addEventListener('click', () => {
      this.viewMode = 'list';
      this.listViewBtn.classList.add('active');
      this.gridViewBtn?.classList.remove('active');
      this.pagesGrid?.classList.add('list-mode');
    });

    this.addMoreFilesCircleBtn?.addEventListener('click', () => this.fileInput.click());
    this.dropzone?.addEventListener('click', () => this.fileInput.click());
    this.dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropzone.classList.add('dragover');
    });
    this.dropzone?.addEventListener('dragleave', () => {
      this.dropzone.classList.remove('dragover');
    });
    this.dropzone?.addEventListener('drop', async (e) => {
      e.preventDefault();
      this.dropzone.classList.remove('dragover');
      if (e.dataTransfer?.files?.length) {
        await this.handleFiles(Array.from(e.dataTransfer.files));
      }
    });

    this.fileInput?.addEventListener('change', async (e) => {
      if (e.target.files?.length) {
        await this.handleFiles(Array.from(e.target.files));
        this.fileInput.value = '';
      }
    });

    this.rotateAllBtn?.addEventListener('click', () => {
      if (!this.items.length) return;
      this.items.forEach((item) => {
        item.rotation = (item.rotation + 90) % 360;
      });
      this.renderThumbnails();
    });

    this.reverseAllBtn?.addEventListener('click', () => {
      if (!this.items.length) return;
      this.items.reverse();
      this.renderThumbnails();
    });

    this.clearAllBtn?.addEventListener('click', () => this.clearWorkspace());
    this.demoSampleBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.loadSampleDocument();
      document.getElementById('studioWorkspace')?.scrollIntoView({ behavior: 'smooth' });
    });
    this.processBtn?.addEventListener('click', () => this.executeCurrentTool());

    // Copy Link Button in Share Strip
    document.getElementById('copySiteLinkBtn')?.addEventListener('click', () => {
      navigator.clipboard?.writeText('https://allonlinepdftools.com/');
      alert('Link copied: https://allonlinepdftools.com/');
    });

    // Featured Paid Tools Carousel Navigation
    const paidToolsList = [
      { id: 'bank_to_excel', banner: 'Bank Statement to Excel Converter', g: '📊 XLS', title: 'Bank Statement to Excel', desc: 'Convert bank statement PDF to Excel free — private browser extraction' },
      { id: 'age_calc', banner: 'AGE CALCULATOR', g: '📅', title: 'Age Calculator', desc: 'Calculate exact age in years, months, weeks, and days from birth date' },
      { id: 'salary_tax_calc', banner: 'SALARY TAX CALCULATOR', g: '$%', title: 'Salary Tax Calculator', desc: 'Calculate monthly & annual salary tax and net take-home pay' },
      { id: 'zakat_calc', banner: 'ZAKAT CALCULATOR', g: '★', title: 'Zakat Calculator', desc: 'Calculate Zakat on gold, silver and wealth free — private browser tool' },
      { id: 'afghan_date', banner: 'AFGHAN DATE CONVERTER', g: '🌙☀️', title: 'Afghan Date Converter', desc: 'Convert between Afghan Shamsi, Islamic Hijri, and Gregorian dates' },
      { id: 'tasbih_counter', banner: 'DIGITAL TASBIH COUNTER', g: '📿 33', title: 'Tasbih Counter', desc: 'Interactive digital Tasbih & Dhikr counter with target alerts' },
      { id: 'pdf_summarizer', banner: 'AI-FREE PDF SUMMARIZER', g: '🧠', title: 'PDF Summarizer', desc: 'Extract key bullet points and reading summary from any PDF' },
      { id: 'gif_maker', banner: 'ONLINE GIF STUDIO', g: '🎞️ GIF', title: 'GIF Maker & Converter', desc: 'Convert, resize, rotate, and optimize GIF animations in browser' }
    ];

    const renderPaidCarousel = () => {
      const track = document.getElementById('paidCardsTrack');
      if (!track) return;
      const slice = [];
      for (let i = 0; i < 4; i++) {
        slice.push(paidToolsList[(this.paidCarouselOffset + i) % paidToolsList.length]);
      }
      track.innerHTML = slice
        .map(
          (item) => `
        <article class="paid-gold-card" data-tool-jump="${item.id}">
          <div class="paid-gold-banner">
            <div class="paid-gold-banner-title">${item.banner}</div>
            <div class="paid-gold-graphic">${item.g}</div>
            <div class="paid-gold-domain">AllOnlinePDFTools</div>
          </div>
          <div class="paid-gold-body">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <span class="paid-open-link">Open tool →</span>
          </div>
        </article>
      `
        )
        .join('');
      this._bindToolJumpLinks(track);
    };

    document.getElementById('paidPrevBtn')?.addEventListener('click', () => {
      this.paidCarouselOffset = (this.paidCarouselOffset - 1 + paidToolsList.length) % paidToolsList.length;
      renderPaidCarousel();
    });
    document.getElementById('paidNextBtn')?.addEventListener('click', () => {
      this.paidCarouselOffset = (this.paidCarouselOffset + 1) % paidToolsList.length;
      renderPaidCarousel();
    });

    // Download, Share & Open Result Buttons
    this.downloadResultBtn?.addEventListener('click', async () => {
      if (this.lastOutputData) {
        await this.pdfEngine.memory.triggerDownload(this.lastOutputData, this.lastOutputName, this.lastOutputMime);
        this._showDownloadFeedback(`✅ Saved "${this.lastOutputName}"!`);
      }
    });

    this.shareResultBtn?.addEventListener('click', async () => {
      if (this.lastOutputData) {
        await this.pdfEngine.memory.shareOrSaveMobile(this.lastOutputData, this.lastOutputName, this.lastOutputMime);
      }
    });

    this.openResultBtn?.addEventListener('click', async () => {
      if (!this.lastOutputData) return;
      if (typeof this.lastOutputData === 'string') {
        const modalBackdrop = document.getElementById('legalModalBackdrop');
        const modalTitle = document.getElementById('legalModalTitle');
        const modalBody = document.getElementById('legalModalBody');
        if (modalBackdrop && modalTitle && modalBody) {
          modalTitle.textContent = `👁️ Preview: ${this.lastOutputName}`;
          modalBody.innerHTML = `<pre style="white-space:pre-wrap;word-break:break-word;font-size:0.8rem;line-height:1.5;margin:0;">${this.lastOutputData.replace(/</g, '&lt;')}</pre>`;
          modalBackdrop.classList.add('open');
          modalBackdrop.setAttribute('aria-hidden', 'false');
          return;
        }
      }
      const cleanMime = (this.lastOutputMime || 'application/pdf').split(';')[0].trim();
      const blob = this.pdfEngine.memory.toBlob(this.lastOutputData, cleanMime);
      const ua = navigator.userAgent || '';
      const isWebView = Boolean(window.Capacitor) || /; wv\)/i.test(ua);
      if (isWebView) {
        await this.pdfEngine.memory.shareOrSaveMobile(blob, this.lastOutputName, cleanMime);
        return;
      }
      const url = this.pdfEngine.memory.createManagedUrl(blob, cleanMime);
      const win = window.open(url, '_blank', 'noopener');
      if (!win) {
        await this.pdfEngine.memory.shareOrSaveMobile(blob, this.lastOutputName, cleanMime);
      }
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (this.installPwaBtn) this.installPwaBtn.style.display = 'inline-flex';
    });

    document.querySelectorAll('.js-trigger-install').forEach((btn) => {
      btn.addEventListener('click', () => this.triggerAppInstallFlow());
    });

    document.getElementById('dismissMobileAlertBtn')?.addEventListener('click', () => {
      document.getElementById('mobileAppAlertBanner')?.classList.add('hidden');
    });

    document.querySelectorAll('.js-ios-guide').forEach((btn) => {
      btn.addEventListener('click', () => {
        alert(
          'To install AllOnlinePDFTools on iPhone or iPad:\n\n1. Open this page in Safari.\n2. Tap the Share button (⬆️) at the bottom.\n3. Tap "Add to Home Screen".'
        );
      });
    });

    window.addEventListener('beforeunload', () => {
      this.pdfEngine.memory.revokeAll();
    });

    this._initLegalAndCookies();
    this._bindToolJumpLinks(document);
  }

  _bindToolJumpLinks(root = document) {
    root.querySelectorAll('[data-tool-jump]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTool = link.getAttribute('data-tool-jump');
        this.switchTool(targetTool);
        document.getElementById('studioWorkspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  _initLegalAndCookies() {
    const modalBackdrop = document.getElementById('legalModalBackdrop');
    const modalTitle = document.getElementById('legalModalTitle');
    const modalBody = document.getElementById('legalModalBody');
    const closeBtn = document.getElementById('closeLegalModalBtn');

    document.querySelectorAll('[data-legal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-legal');
        const page = LEGAL_PAGES[key] || LEGAL_PAGES.privacy;
        if (modalTitle) modalTitle.textContent = page.title;
        if (modalBody) modalBody.innerHTML = page.html;
        modalBackdrop?.classList.add('open');
        modalBackdrop?.setAttribute('aria-hidden', 'false');
      });
    });

    closeBtn?.addEventListener('click', () => {
      modalBackdrop?.classList.remove('open');
      modalBackdrop?.setAttribute('aria-hidden', 'true');
    });

    modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
      }
    });

    const cookieBar = document.getElementById('cookieConsentBar');
    const acceptBtn = document.getElementById('acceptCookiesBtn');
    const rejectBtn = document.getElementById('rejectCookiesBtn');
    if (cookieBar && !localStorage.getItem('oneclick_cookie_consent')) {
      cookieBar.classList.add('visible');
    }
    acceptBtn?.addEventListener('click', () => {
      localStorage.setItem('oneclick_cookie_consent', 'accepted');
      cookieBar?.classList.remove('visible');
    });
    rejectBtn?.addEventListener('click', () => {
      localStorage.setItem('oneclick_cookie_consent', 'rejected');
      cookieBar?.classList.remove('visible');
    });
  }

  _showDownloadFeedback(msg) {
    if (!this.downloadFeedbackMsg) return;
    this.downloadFeedbackMsg.textContent = msg;
    this.downloadFeedbackMsg.style.display = 'block';
  }

  async triggerAppInstallFlow() {
    const isNative = Boolean(
      window.Capacitor &&
      typeof window.Capacitor.isNativePlatform === 'function' &&
      window.Capacitor.isNativePlatform()
    );
    if (isNative) {
      alert('✅ You are already running the official OneClick Android App!');
      return;
    }

    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      await this.deferredInstallPrompt.userChoice;
      this.deferredInstallPrompt = null;
      return;
    }

    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    if (isIOS) {
      alert('To install on iPhone/iPad:\n1. Tap Share (⬆️) in Safari.\n2. Tap "Add to Home Screen".');
      return;
    }
    if (isAndroid) {
      alert('To install on Android:\nTap the 3-dots menu (⋮) in Chrome and select "Add to Home screen" / "Install app".');
      return;
    }

    const link = document.createElement('a');
    link.href = './OneClick-Windows-Desktop.hta';
    link.download = 'AllOnlinePDFTools-Desktop.hta';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  _registerServiceWorker() {
    if (
      'serviceWorker' in navigator &&
      (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  _setupMobileBackNavigation() {
    window.addEventListener('ionBackButton', (ev) => {
      if (this.items.length > 0) {
        ev.detail.register(10, () => {
          this.clearWorkspace();
        });
      }
    });
  }

  switchTool(toolId) {
    this.activeTool = toolId;
    if (this.heroToolSelect) this.heroToolSelect.value = toolId;
    this._renderToolsDirectory();
    this.resultCard?.classList.remove('visible');
    if (this.resultExtraContainer) this.resultExtraContainer.innerHTML = '';
    this._renderToolConfigSidebar();
    this._updateActiveToolSeo(toolId);
  }

  _updateActiveToolSeo(toolId) {
    const tool = ONECLICK_TOOLS.find((t) => t.id === toolId) || ONECLICK_TOOLS[0];
    if (!tool) return;
    document.title = `${tool.title} Online Free — AllOnlinePDFTools | 183+ Free Tools`;
    const seoTitle = document.getElementById('activeToolSeoTitle');
    const seoDesc = document.getElementById('activeToolSeoDesc');
    if (seoTitle) {
      seoTitle.textContent = `${tool.icon} How to Use ${tool.title} Online for Free — AllOnlinePDFTools`;
    }
    if (seoDesc) {
      seoDesc.textContent = `${tool.desc}. Process your files 100% locally in your browser with zero server uploads, no watermarks, and instant download on AllOnlinePDFTools.`;
    }
  }

  async handleFiles(fileList) {
    this.resultCard?.classList.remove('visible');
    this._setProgress(15, 'Loading local files into browser RAM...');

    for (const file of fileList) {
      const nameLower = file.name.toLowerCase();
      const isImage = file.type.startsWith('image/') || nameLower.endsWith('.jfif') || nameLower.endsWith('.bmp');
      const isPdf = file.type === 'application/pdf' || nameLower.endsWith('.pdf');

      if (isImage) {
        const objUrl = this.pdfEngine.memory.createManagedUrl(file, file.type || 'image/jpeg');
        this.items.push({
          id: this._uid(),
          type: 'image',
          fileName: file.name,
          fileSize: file.size,
          file,
          rotation: 0,
          selected: true,
          objectUrl: objUrl
        });
      } else if (isPdf) {
        await ensurePdfEnginesLoaded();
        const buffer = await file.arrayBuffer();
        const pageCount = await this.pdfEngine.getPageCount(buffer);
        for (let p = 0; p < pageCount; p++) {
          this.items.push({
            id: this._uid(),
            type: 'pdf',
            fileName: file.name,
            fileSize: file.size,
            buffer,
            pageIndex: p,
            rotation: 0,
            selected: true
          });
        }
      } else {
        // Text, Markdown, CSV, JSON, IPYNB, HTML, DOC
        const textContent = await file.text();
        this.items.push({
          id: this._uid(),
          type: 'text',
          fileName: file.name,
          fileSize: file.size,
          file,
          textContent,
          rotation: 0,
          selected: true
        });
      }
    }

    if (this.heroDropStatusText) {
      this.heroDropStatusText.textContent = `✅ ${this.items.length} file(s) ready — Click Convert Now`;
    }
    this._hideProgress();
    await this.renderThumbnails();
  }

  async loadSampleDocument() {
    this._setProgress(25, 'Generating sample PDF statement in memory...');
    await ensurePdfEnginesLoaded();
    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
    const sampleDoc = await PDFDocument.create();
    const fontBold = await sampleDoc.embedFont(StandardFonts.HelveticaBold);
    const fontReg = await sampleDoc.embedFont(StandardFonts.Helvetica);

    const samplePages = [
      {
        title: 'KOCHAI FINANCE CLOUD — STATEMENT',
        badge: 'Page 1 • AllOnlinePDFTools',
        rows: [
          '11/01/2026   Opening Balance Deposit             +$4,500.00   $4,500.00',
          '11/04/2026   Cloud Hosting & Domain Renewal       -$12.98     $4,487.02',
          '11/07/2026   Client Software Engineering Payout  +$1,850.00   $6,337.02',
          '11/10/2026   Office Equipment & Accessories      -$245.50     $6,091.52'
        ]
      },
      {
        title: 'EXECUTIVE SUMMARY & ANALYTICS',
        badge: 'Page 2 • 100% Client-Side Privacy',
        rows: [
          '11/11/2026   Enterprise Consulting Milestone     +$2,200.00   $8,291.52',
          '11/11/2026   Closing Statement Balance            $0.00       $8,291.52'
        ]
      }
    ];

    samplePages.forEach((info) => {
      const page = sampleDoc.addPage([595.28, 841.89]);
      page.drawRectangle({ x: 36, y: 745, width: 523, height: 62, color: rgb(0.98, 0.96, 0.92) });
      page.drawText(info.title, { x: 50, y: 780, size: 15, font: fontBold, color: rgb(0.09, 0.09, 0.11) });
      page.drawText(info.badge, { x: 50, y: 760, size: 10, font: fontReg, color: rgb(0.85, 0.46, 0.02) });

      let y = 695;
      for (const r of info.rows) {
        page.drawText(r, { x: 50, y, size: 11, font: fontReg, color: rgb(0.18, 0.2, 0.24) });
        y -= 28;
      }
    });

    const pdfBytes = await sampleDoc.save();
    const sampleFile = new File([pdfBytes], 'Kochai_Finance_Statement_Sample.pdf', { type: 'application/pdf' });
    await this.handleFiles([sampleFile]);
  }

  clearWorkspace() {
    this.pdfEngine.memory.revokeAll();
    this.items = [];
    this.lastOutputData = null;
    this.resultCard?.classList.remove('visible');
    if (this.resultExtraContainer) this.resultExtraContainer.innerHTML = '';
    if (this.heroDropStatusText) {
      this.heroDropStatusText.textContent = 'Drag and drop files or click to browse';
    }
    this.renderThumbnails();
  }

  /**
   * Renders the AsliTools Split-Screen Studio File Cards (Screenshot 9!)
   */
  async renderThumbnails() {
    if (!this.pagesGrid) return;
    this.pagesGrid.innerHTML = '';

    const isStatement = this.activeTool === 'bank_to_excel';
    const labelWord = isStatement ? 'Selected statements' : 'Selected files';
    if (this.statsPill) {
      this.statsPill.textContent = `${labelWord} (${this.items.length})`;
    }

    if (this.dropzone) {
      this.dropzone.style.display = this.items.length === 0 ? 'block' : 'none';
    }

    if (this.items.length === 0) return;

    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];
      const card = document.createElement('div');
      card.className = 'page-card';
      card.draggable = true;
      card.dataset.index = String(index);

      const handle = document.createElement('div');
      handle.className = 'page-drag-handle';
      handle.title = 'Drag to reorder';
      handle.textContent = '⋮⋮';
      card.appendChild(handle);

      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'page-thumb-wrap';

      if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.objectUrl;
        img.alt = item.fileName;
        img.style.transform = `rotate(${item.rotation}deg)`;
        thumbWrap.appendChild(img);
      } else if (item.type === 'pdf') {
        const canvas = document.createElement('canvas');
        canvas.style.transform = `rotate(${item.rotation}deg)`;
        thumbWrap.appendChild(canvas);
        this.pdfEngine.renderPageThumbnail(item.buffer, item.pageIndex + 1, canvas, 0.34).catch(() => {});
      } else {
        const docBox = document.createElement('div');
        docBox.style.cssText = 'padding:0.75rem;font-size:0.7rem;color:#334155;background:#fff;border-radius:6px;width:85%;height:85%;overflow:hidden;border:1px solid #e2e8f0;';
        docBox.textContent = (item.textContent || item.fileName).slice(0, 180);
        thumbWrap.appendChild(docBox);
      }

      const sizeKb = ((item.fileSize || 1024) / 1024).toFixed(1);
      const displayTitle = item.type === 'pdf' ? `${item.fileName} (P.${item.pageIndex + 1})` : item.fileName;

      const footer = document.createElement('div');
      footer.className = 'page-card-footer';
      footer.innerHTML = `
        <div class="page-card-filename" title="${displayTitle}">${displayTitle}</div>
        <div class="page-card-filesize">${sizeKb} KB</div>
        <div class="page-card-actions">
          <button type="button" class="page-mini-btn" data-action="dup" title="Duplicate">⧉</button>
          <button type="button" class="page-mini-btn" data-action="rotate" title="Rotate 90°">↻</button>
          <button type="button" class="page-mini-btn" data-action="delete" title="Remove">✕</button>
        </div>
      `;

      footer.querySelector('[data-action="dup"]').addEventListener('click', (e) => {
        e.stopPropagation();
        this.items.splice(index + 1, 0, { ...item, id: this._uid() });
        this.renderThumbnails();
      });

      footer.querySelector('[data-action="rotate"]').addEventListener('click', (e) => {
        e.stopPropagation();
        item.rotation = (item.rotation + 90) % 360;
        this.renderThumbnails();
      });

      footer.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.objectUrl) this.pdfEngine.memory.revokeUrl(item.objectUrl);
        this.items.splice(index, 1);
        this.renderThumbnails();
      });

      card.addEventListener('dragstart', (e) => {
        this.dragSrcIndex = index;
        e.dataTransfer.effectAllowed = 'move';
      });
      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
      card.addEventListener('drop', (e) => {
        e.preventDefault();
        if (this.dragSrcIndex !== null && this.dragSrcIndex !== index) {
          const [moved] = this.items.splice(this.dragSrcIndex, 1);
          this.items.splice(index, 0, moved);
          this.dragSrcIndex = null;
          this.renderThumbnails();
        }
      });

      card.appendChild(thumbWrap);
      card.appendChild(footer);
      this.pagesGrid.appendChild(card);
    }
  }

  _renderToolConfigSidebar() {
    const tool = ONECLICK_TOOLS.find((t) => t.id === this.activeTool) || ONECLICK_TOOLS[0];
    if (this.sidebarIcon) this.sidebarIcon.textContent = tool.icon;
    if (this.sidebarTitleText) this.sidebarTitleText.textContent = tool.title;
    if (this.sidebarSubtitleText) this.sidebarSubtitleText.textContent = tool.desc;
    if (this.dropzoneToolName) this.dropzoneToolName.textContent = tool.title;
    if (this.processBtnLabel) {
      this.processBtnLabel.textContent =
        tool.id === 'bank_to_excel'
          ? 'Convert to Excel / CSV'
          : `Convert / Run ${tool.title}`;
    }

    const h = tool.handler;

    // 1. Bank Statement to Excel (Matches Screenshot 9 Exact Controls!)
    if (h === 'bank_to_excel' || h === 'pdf_to_excel') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="bankOutFormat"><span style="color:var(--amber-500);">📄</span> Output format</label>
          <select id="bankOutFormat" class="form-select">
            <option value="csv" selected>Excel (.csv / .xlsx compatible)</option>
            <option value="json">Structured JSON (.json)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="bankOcrMode"><span style="color:var(--amber-500);">✨</span> Scanned statement (OCR)</label>
          <select id="bankOcrMode" class="form-select">
            <option value="auto" selected>Auto</option>
            <option value="text">Direct PDF Text Stream</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="bankDateFormat"><span style="color:var(--amber-500);">📅</span> Date format in file</label>
          <select id="bankDateFormat" class="form-select">
            <option value="MM/DD/YYYY" selected>MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="bankLayoutMode"><span style="color:var(--amber-500);">🏦</span> Bank layout</label>
          <select id="bankLayoutMode" class="form-select">
            <option value="auto" selected>Auto detect</option>
            <option value="standard">Standard Date-Desc-Amount</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="outputNameInput">Output Filename</label>
          <input id="outputNameInput" class="form-input" type="text" value="bank-statement-export.csv" />
        </div>
      `;
    }
    // 2. Salary Tax Calculator (From Screenshot 3 & 7)
    else if (h === 'calc_salary_tax') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="calcVal1">💵 Monthly Gross Salary</label>
          <input id="calcVal1" class="form-input" type="number" step="any" value="5000" />
        </div>
        <div class="form-group">
          <label class="form-label" for="calcVal2">📊 Income Tax Rate (%)</label>
          <input id="calcVal2" class="form-input" type="number" step="any" value="15" />
        </div>
        <div class="form-group">
          <label class="form-label" for="calcVal3">🛡️ Monthly Deductions / Pension</label>
          <input id="calcVal3" class="form-input" type="number" step="any" value="200" />
        </div>
      `;
    }
    // 3. Zakat Calculator (From Screenshot 3 & 7)
    else if (h === 'calc_zakat') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="calcVal1">💰 Cash, Bank Balance &amp; Savings</label>
          <input id="calcVal1" class="form-input" type="number" step="any" value="10000" />
        </div>
        <div class="form-group">
          <label class="form-label" for="calcVal2">🪙 Gold, Silver &amp; Business Assets Value</label>
          <input id="calcVal2" class="form-input" type="number" step="any" value="5000" />
        </div>
        <div class="form-group">
          <label class="form-label" for="calcVal3">📉 Short-Term Debts / Liabilities</label>
          <input id="calcVal3" class="form-input" type="number" step="any" value="500" />
        </div>
      `;
    }
    // 4. Interactive Digital Tasbih Counter (From Screenshot 7)
    else if (h === 'tasbih_widget') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="tasbihDhikrSelect">📿 Select Dhikr / Target</label>
          <select id="tasbihDhikrSelect" class="form-select">
            <option value="33" selected>SubhanAllah (سبحان الله) — 33</option>
            <option value="33">Alhamdulillah (الحمد لله) — 33</option>
            <option value="34">Allahu Akbar (الله أكبر) — 34</option>
            <option value="100">Astaghfirullah (أستغفر الله) — 100</option>
          </select>
        </div>
        <div style="text-align:center;padding:1rem;background:var(--bg-primary);border:1.5px solid var(--border-color);border-radius:12px;margin-bottom:0.75rem;">
          <div style="font-size:0.74rem;color:var(--text-muted);font-weight:700;">CURRENT COUNT</div>
          <div id="tasbihDisplayNum" style="font-size:2.6rem;font-weight:900;color:var(--amber-600);margin:0.25rem 0;">${this.tasbihCount}</div>
          <div id="tasbihTargetLabel" style="font-size:0.74rem;color:var(--text-secondary);margin-bottom:0.75rem;">Target: ${this.tasbihTarget}</div>
          <div style="display:flex;gap:0.5rem;">
            <button type="button" id="tasbihTapBtn" class="btn-drawer-convert" style="flex:2;font-size:1rem;padding:0.9rem;">📿 Tap (+1)</button>
            <button type="button" id="tasbihResetBtn" class="btn-secondary" style="flex:1;">Reset</button>
          </div>
        </div>
      `;
      this._bindTasbihEvents();
    }
    // 5. PDF Merge / Reorder / Rotate / Reverse
    else if (h === 'pdf_merge' || h === 'pdf_reverse') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="outputNameInput">Output Filename</label>
          <input id="outputNameInput" class="form-input" type="text" value="allonline-${tool.id}.pdf" />
        </div>
      `;
    }
    // 6. PDF Split / Extract / Remove
    else if (h === 'pdf_split' || h === 'pdf_remove') {
      const isRemove = h === 'pdf_remove';
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="splitRangeInput">
            <span>${isRemove ? 'Pages to Remove' : 'Page Ranges (e.g. 1-2, 4)'}</span>
          </label>
          <input id="splitRangeInput" class="form-input" type="text" value="1" />
        </div>
        <div class="form-group">
          <label class="form-label" for="outputNameInput">Output Filename</label>
          <input id="outputNameInput" class="form-input" type="text" value="allonline-${tool.id}.pdf" />
        </div>
      `;
    }
    // 7. PDF Compress / Flatten / Repair
    else if (h === 'pdf_compress') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="compressPresetSelect">Compression Level</label>
          <select id="compressPresetSelect" class="form-select">
            <option value="extreme">Extreme Compression (Smallest Size)</option>
            <option value="recommended" selected>Recommended (High Clarity, 68% Quality)</option>
            <option value="high">High Fidelity Flatten (85% Quality)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="outputNameInput">Output Filename</label>
          <input id="outputNameInput" class="form-input" type="text" value="allonline-${tool.id}.pdf" />
        </div>
      `;
    }
    // 8. Sign PDF
    else if (h === 'pdf_sign') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label">
            <span>Draw Your Signature</span>
            <button id="clearSigBtn" type="button" style="background:none;border:none;color:var(--amber-600);cursor:pointer;font-weight:700;font-size:0.74rem;margin-left:auto;">Clear</button>
          </label>
          <div class="signature-pad-wrap">
            <canvas id="signatureCanvas" class="signature-canvas" width="300" height="120"></canvas>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="sigSignerInput">Signer Name Stamp</label>
          <input id="sigSignerInput" class="form-input" type="text" value="Verified Signatory" />
        </div>
        <div class="form-group">
          <label class="form-label" for="sigPosSelect">Placement</label>
          <select id="sigPosSelect" class="form-select">
            <option value="bottom-right" selected>Bottom Right Corner</option>
            <option value="bottom-left">Bottom Left Corner</option>
            <option value="bottom-center">Bottom Center</option>
          </select>
        </div>
      `;
      this._initSignaturePad();
    }
    // 8b. Watermark & Protect PDF
    else if (h === 'pdf_watermark') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="wmTextInput">🛡️ Watermark Text</label>
          <input id="wmTextInput" class="form-input" type="text" value="CONFIDENTIAL" />
        </div>
        <div class="form-group">
          <label class="form-label" for="wmPlacementSelect">Placement</label>
          <select id="wmPlacementSelect" class="form-select">
            <option value="diagonal" selected>Diagonal Center Stamp</option>
            <option value="header">Top Header Stamp</option>
            <option value="footer">Bottom Footer Stamp</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="wmColorInput">Color Hex &amp; Size</label>
          <div style="display:flex;gap:0.5rem;">
            <input id="wmColorInput" class="form-input" type="color" value="#059669" style="width:60px;padding:0.2rem;" />
            <input id="wmSizeInput" class="form-input" type="number" min="12" max="120" value="46" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="wmOpacityInput">Opacity (0.1 – 1.0)</label>
          <input id="wmOpacityInput" class="form-input" type="number" step="0.05" min="0.1" max="1.0" value="0.28" />
        </div>
      `;
    }
    // 8c. Page Numbers & Header/Footer
    else if (h === 'pdf_pagenums') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="pnFormatInput">🔢 Page Number Format</label>
          <input id="pnFormatInput" class="form-input" type="text" value="Page {n} of {total}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="pnPosSelect">Position</label>
          <select id="pnPosSelect" class="form-select">
            <option value="bottom-center" selected>Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-center">Top Center</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="pnHeaderInput">Running Header Text (Optional)</label>
          <input id="pnHeaderInput" class="form-input" type="text" value="" placeholder="e.g. AllOnlinePDFTools Report" />
        </div>
      `;
    }
    // 8d. Crop Margins or Resize Page Size
    else if (h === 'pdf_crop' || h === 'pdf_resize') {
      this.configContainer.innerHTML = `
        ${
          h === 'pdf_resize'
            ? `<div class="form-group">
                <label class="form-label" for="resizePageSelect">📏 Target Page Size</label>
                <select id="resizePageSelect" class="form-select">
                  <option value="A4" selected>A4 (595 × 842 pt)</option>
                  <option value="LETTER">US Letter (612 × 792 pt)</option>
                  <option value="LEGAL">US Legal (612 × 1008 pt)</option>
                  <option value="A3">A3 (842 × 1191 pt)</option>
                </select>
              </div>`
            : ''
        }
        <div class="form-group">
          <label class="form-label" for="geomMarginInput">📐 ${h === 'pdf_crop' ? 'Margin Trim (pt)' : 'Outer Padding (pt)'}</label>
          <input id="geomMarginInput" class="form-input" type="number" min="0" max="200" value="${h === 'pdf_crop' ? 36 : 16}" />
        </div>
      `;
    }
    // 8e. Insert Blank Pages
    else if (h === 'pdf_blank') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="blankPosSelect">➕ Insert Position</label>
          <select id="blankPosSelect" class="form-select">
            <option value="end" selected>At End of Document</option>
            <option value="start">At Beginning (Start)</option>
            <option value="between">Between Every Page</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="blankCountInput">Number of Blank Pages</label>
          <input id="blankCountInput" class="form-input" type="number" min="1" max="20" value="1" />
        </div>
      `;
    }
    // 8f. Redact Sensitive PDF Area
    else if (h === 'pdf_redact') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="redactLabelInput">⬛ Redaction Stamp Label</label>
          <input id="redactLabelInput" class="form-input" type="text" value="REDACTED" />
        </div>
        <div class="form-group">
          <label class="form-label">Box Position (% from Left / Bottom)</label>
          <div style="display:flex;gap:0.5rem;">
            <input id="redactXInput" class="form-input" type="number" min="0" max="95" value="10" title="X %" />
            <input id="redactYInput" class="form-input" type="number" min="0" max="95" value="75" title="Y %" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Box Size (% Width / Height)</label>
          <div style="display:flex;gap:0.5rem;">
            <input id="redactWInput" class="form-input" type="number" min="5" max="100" value="80" title="Width %" />
            <input id="redactHInput" class="form-input" type="number" min="2" max="100" value="10" title="Height %" />
          </div>
        </div>
      `;
    }
    // 8g. Edit or Scrub PDF Metadata
    else if (h === 'pdf_edit_meta' || h === 'pdf_scrub_meta') {
      if (h === 'pdf_scrub_meta') {
        this.configContainer.innerHTML = `
          <div class="form-group">
            <label class="form-label" for="outputNameInput">🕵️ Privacy Metadata Cleaner</label>
            <p style="font-size:0.76rem;color:var(--text-secondary);margin-bottom:0.5rem;">Removes Author, Title, Subject, Keywords, Creator, and Producer tags.</p>
            <input id="outputNameInput" class="form-input" type="text" value="allonline-cleaned-metadata.pdf" />
          </div>
        `;
      } else {
        this.configContainer.innerHTML = `
          <div class="form-group">
            <label class="form-label" for="metaTitleInput">ℹ️ Document Title</label>
            <input id="metaTitleInput" class="form-input" type="text" value="Archived Document" />
          </div>
          <div class="form-group">
            <label class="form-label" for="metaAuthorInput">Author Name</label>
            <input id="metaAuthorInput" class="form-input" type="text" value="AllOnlinePDFTools User" />
          </div>
          <div class="form-group">
            <label class="form-label" for="metaSubjectInput">Subject</label>
            <input id="metaSubjectInput" class="form-input" type="text" value="PDF Archive" />
          </div>
        `;
      }
    }
    // 9. Image Transform / JFIF / BMP / HEIC / GIF / SVG / ICO
    else if (
      h === 'img_transform' ||
      h === 'img_to_base64' ||
      h === 'img_to_word' ||
      h === 'img_to_excel' ||
      h === 'img_to_svg' ||
      h === 'img_to_html'
    ) {
      const p = tool.preset || {};
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="imgOutFormatSelect">Target Format</label>
          <select id="imgOutFormatSelect" class="form-select">
            <option value="image/jpeg" ${p.format === 'image/jpeg' ? 'selected' : ''}>JPG / JPEG</option>
            <option value="image/png" ${p.format === 'image/png' ? 'selected' : ''}>PNG (Lossless)</option>
            <option value="image/webp" ${p.format === 'image/webp' ? 'selected' : ''}>WebP (Modern)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="imgQualityInput">Quality (0.10 – 1.00)</label>
          <input id="imgQualityInput" class="form-input" type="number" step="0.05" min="0.1" max="1.0" value="${p.quality || 0.9}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="imgScaleInput">Scale Multiplier (1.0 = 100%)</label>
          <input id="imgScaleInput" class="form-input" type="number" step="0.05" min="0.1" max="3.0" value="${p.scale || 1.0}" />
        </div>
      `;
    }
    // 10. Age & Birthday Calculator
    else if (h === 'calc_age') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="dobInput">🎂 Select Date of Birth</label>
          <input id="dobInput" class="form-input" type="date" value="2000-01-01" />
        </div>
      `;
    }
    // 11. Afghan Shamsi / Hijri / Gregorian Calendar Converter
    else if (h === 'calc_calendar' || h === 'calc_datediff') {
      const todayIso = new Date().toISOString().slice(0, 10);
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="calDate1Input">📅 Select Date</label>
          <input id="calDate1Input" class="form-input" type="date" value="${todayIso}" />
        </div>
        ${
          h === 'calc_datediff'
            ? `<div class="form-group">
                <label class="form-label" for="calDate2Input">📅 End Date</label>
                <input id="calDate2Input" class="form-input" type="date" value="2027-01-01" />
              </div>`
            : ''
        }
      `;
    }
    // 12. Typing Speed Test
    else if (h === 'typing_speed') {
      const samplePassage =
        'AllOnlinePDFTools is a fast, private, all-in-one digital toolbox that runs inside your browser. Practice your typing speed every day to build accuracy and productivity.';
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label">Passage to Type</label>
          <div style="padding:0.65rem;border-radius:8px;background:var(--bg-primary);border:1px solid var(--border-color);font-size:0.78rem;line-height:1.45;">${samplePassage}</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="typingUserInput">Type Below</label>
          <textarea id="typingUserInput" class="form-textarea" placeholder="Start typing here..."></textarea>
        </div>
      `;
      this._bindLiveTypingTest(samplePassage);
    }
    // 12b. GPA & Grade Calculator
    else if (h === 'calc_gpa') {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="calcVal1">🎓 Obtained Marks / Score</label>
          <input id="calcVal1" class="form-input" type="number" step="any" value="88" />
        </div>
        <div class="form-group">
          <label class="form-label" for="calcVal2">📘 Total Maximum Marks</label>
          <input id="calcVal2" class="form-input" type="number" step="any" value="100" />
        </div>
        <div class="form-group">
          <label class="form-label" for="calcVal3">⭐ GPA Scale (4.0 or 5.0)</label>
          <input id="calcVal3" class="form-input" type="number" step="0.1" value="4.0" />
        </div>
      `;
    }
    // 12c. Live Stopwatch & Lap Timer
    else if (h === 'calc_stopwatch') {
      this.configContainer.innerHTML = `
        <div style="text-align:center;padding:1rem;background:var(--bg-primary);border:1.5px solid var(--border-color);border-radius:12px;margin-bottom:0.75rem;">
          <div style="font-size:0.74rem;color:var(--text-muted);font-weight:700;">PRECISION STOPWATCH</div>
          <div id="swDisplayTime" style="font-size:2.1rem;font-weight:900;color:var(--amber-600);margin:0.35rem 0;font-variant-numeric:tabular-nums;">00:00.00</div>
          <div style="display:flex;gap:0.4rem;margin-bottom:0.6rem;">
            <button type="button" id="swStartPauseBtn" class="btn-drawer-convert" style="flex:1.4;font-size:0.86rem;padding:0.65rem;">▶ Start</button>
            <button type="button" id="swLapBtn" class="btn-secondary" style="flex:1;">🏁 Lap</button>
            <button type="button" id="swResetBtn" class="btn-secondary" style="flex:1;">↺ Reset</button>
          </div>
          <div id="swLapsBox" style="max-height:110px;overflow-y:auto;text-align:left;font-size:0.74rem;color:var(--text-secondary);"></div>
        </div>
      `;
      this._bindStopwatchEvents();
    }
    // 13. Other Numeric Calculators (BMI, EMI, Discount, Tip, Units, Roman)
    else if (h.startsWith('calc_')) {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="calcVal1">Primary Value (Amount / Weight kg / Value)</label>
          <input id="calcVal1" class="form-input" type="number" step="any" value="70" />
        </div>
        <div class="form-group">
          <label class="form-label" for="calcVal2">Secondary Value (Height cm / Rate % / Persons)</label>
          <input id="calcVal2" class="form-input" type="number" step="any" value="175" />
        </div>
        <div class="form-group">
          <label class="form-label" for="calcVal3">Tertiary Value (Months / Tax %)</label>
          <input id="calcVal3" class="form-input" type="number" step="any" value="12" />
        </div>
      `;
    }
    // 14. Text, Document, Markdown, IPYNB, QR & Dev Utilities
    else {
      this.configContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="utilTextInput">Input Text / Notes (or upload a file on the left)</label>
          <textarea id="utilTextInput" class="form-textarea">AllOnlinePDFTools — 183+ Free Online PDF, Image & Utility Tools!\n100% Browser Privacy • Zero Server Uploads</textarea>
        </div>
        <div class="form-group">
          <label class="form-label" for="outputNameInput">Output Filename</label>
          <input id="outputNameInput" class="form-input" type="text" value="allonline-${tool.id}.${tool.ext || 'pdf'}" />
        </div>
      `;
    }
  }

  _bindTasbihEvents() {
    const tapBtn = document.getElementById('tasbihTapBtn');
    const resetBtn = document.getElementById('tasbihResetBtn');
    const numEl = document.getElementById('tasbihDisplayNum');
    const selEl = document.getElementById('tasbihDhikrSelect');
    const targetEl = document.getElementById('tasbihTargetLabel');

    selEl?.addEventListener('change', () => {
      this.tasbihTarget = Number(selEl.value) || 33;
      if (targetEl) targetEl.textContent = `Target: ${this.tasbihTarget}`;
    });

    tapBtn?.addEventListener('click', () => {
      this.tasbihCount++;
      localStorage.setItem('allonline_tasbih_count', String(this.tasbihCount));
      if (numEl) numEl.textContent = String(this.tasbihCount);
      if (navigator.vibrate && this.tasbihCount % this.tasbihTarget === 0) {
        navigator.vibrate(120);
      }
    });

    resetBtn?.addEventListener('click', () => {
      this.tasbihCount = 0;
      localStorage.setItem('allonline_tasbih_count', '0');
      if (numEl) numEl.textContent = '0';
    });
  }

  _formatStopwatchMs(ms) {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  }

  _bindStopwatchEvents() {
    const disp = document.getElementById('swDisplayTime');
    const toggleBtn = document.getElementById('swStartPauseBtn');
    const lapBtn = document.getElementById('swLapBtn');
    const resetBtn = document.getElementById('swResetBtn');
    const lapsBox = document.getElementById('swLapsBox');

    const render = () => {
      if (disp) disp.textContent = this._formatStopwatchMs(this.stopwatchElapsedMs);
      if (lapsBox) {
        lapsBox.innerHTML = this.stopwatchLaps
          .map((t, idx) => `<div style="padding:2px 0;border-bottom:1px dashed var(--border-color);">Lap ${idx + 1}: <strong>${t}</strong></div>`)
          .join('');
      }
    };
    render();

    let lastTick = performance.now();
    toggleBtn?.addEventListener('click', () => {
      if (this.stopwatchRunning) {
        clearInterval(this.stopwatchTimer);
        this.stopwatchRunning = false;
        toggleBtn.textContent = '▶ Resume';
      } else {
        lastTick = performance.now();
        this.stopwatchRunning = true;
        toggleBtn.textContent = '⏸ Pause';
        this.stopwatchTimer = setInterval(() => {
          const now = performance.now();
          this.stopwatchElapsedMs += now - lastTick;
          lastTick = now;
          if (disp) disp.textContent = this._formatStopwatchMs(this.stopwatchElapsedMs);
        }, 40);
      }
    });

    lapBtn?.addEventListener('click', () => {
      this.stopwatchLaps.unshift(this._formatStopwatchMs(this.stopwatchElapsedMs));
      render();
    });

    resetBtn?.addEventListener('click', () => {
      clearInterval(this.stopwatchTimer);
      this.stopwatchRunning = false;
      this.stopwatchElapsedMs = 0;
      this.stopwatchLaps = [];
      if (toggleBtn) toggleBtn.textContent = '▶ Start';
      render();
    });
  }

  _bindLiveTypingTest(targetPassage) {
    this.typingStartTime = null;
    const input = document.getElementById('typingUserInput');
    if (!input) return;

    input.addEventListener('input', () => {
      if (!this.typingStartTime) this.typingStartTime = performance.now();
      const typed = input.value;
      const elapsedMinutes = Math.max(0.01, (performance.now() - this.typingStartTime) / 60000);
      const wordCount = typed.trim() ? typed.trim().split(/\s+/).length : 0;
      const wpm = Math.round(wordCount / elapsedMinutes);

      let correctChars = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === targetPassage[i]) correctChars++;
      }
      const accuracy = typed.length ? Math.round((correctChars / typed.length) * 100) : 100;

      this.resultMetaText.innerHTML = `Speed: <strong>${wpm} WPM</strong> • Accuracy: <strong>${accuracy}%</strong>`;
      this.resultCard.classList.add('visible');
    });
  }

  _initSignaturePad() {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.font = 'italic bold 24px Georgia, serif';
    ctx.fillStyle = '#18181b';
    ctx.fillText('Approved Signature', 42, 68);

    let drawing = false;
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * canvas.width,
        y: ((clientY - rect.top) / rect.height) * canvas.height
      };
    };

    const start = (e) => {
      e.preventDefault();
      drawing = true;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    const move = (e) => {
      if (!drawing) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const end = () => {
      drawing = false;
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);

    document.getElementById('clearSigBtn')?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  _setProgress(percent, statusText) {
    this.progressBox?.classList.add('active');
    if (this.progressFill) this.progressFill.style.width = `${percent}%`;
    if (this.progressPercent) this.progressPercent.textContent = `${percent}%`;
    if (this.progressStatus) this.progressStatus.textContent = statusText;
  }

  _hideProgress() {
    setTimeout(() => {
      this.progressBox?.classList.remove('active');
    }, 280);
  }

  async executeCurrentTool() {
    const tool = ONECLICK_TOOLS.find((t) => t.id === this.activeTool) || ONECLICK_TOOLS[0];
    const h = tool.handler;

    try {
      this.processBtn.disabled = true;
      this.resultCard?.classList.remove('visible');
      if (this.resultExtraContainer) this.resultExtraContainer.innerHTML = '';

      const outNameEl = document.getElementById('outputNameInput');
      this.lastOutputName = (outNameEl?.value || `allonline-${tool.id}.pdf`).trim();
      this.lastOutputMime = 'application/pdf';

      // =====================================================================
      // 1. STANDALONE CALCULATORS, TASBIH, DATE, TYPING, TEXT, QR & HASH
      // =====================================================================
      if (h === 'tasbih_widget') {
        this.tasbihCount++;
        localStorage.setItem('allonline_tasbih_count', String(this.tasbihCount));
        const numEl = document.getElementById('tasbihDisplayNum');
        if (numEl) numEl.textContent = String(this.tasbihCount);
        this._presentTextResult(
          `Digital Tasbih Session Report\nTotal Count: ${this.tasbihCount}\nTarget Cycle: ${this.tasbihTarget}`,
          'tasbih-session.txt'
        );
        return;
      }

      if (h === 'calc_age') {
        const dob = document.getElementById('dobInput')?.value || '2000-01-01';
        const res = this.utilEngine.calculateAgeAndBirthday(dob);
        const summary = `Exact Age: ${res.years} Years, ${res.months} Months, ${res.days} Days\nNext Birthday In: ${res.daysUntilNextBirthday} Days (Born on ${res.dayOfWeekBorn})\nTotal Lived: ${res.totalDays.toLocaleString()} Days | ${res.totalWeeks.toLocaleString()} Weeks | ${res.totalHours.toLocaleString()} Hours`;
        this._presentTextResult(summary, 'age-calculation.txt');
        return;
      }

      if (h === 'calc_calendar') {
        const d1 = document.getElementById('calDate1Input')?.value;
        const res = this.utilEngine.convertCalendars(d1);
        const summary = `Gregorian (Miladi): ${res.gregorian}\nIslamic (Hijri): ${res.islamic}\nSolar Hijri (Afghan Shamsi): ${res.persian}\nISO Format: ${res.iso}`;
        this._presentTextResult(summary, 'afghan-date-conversion.txt');
        return;
      }

      if (h === 'calc_datediff') {
        const d1 = new Date(document.getElementById('calDate1Input')?.value || Date.now());
        const d2 = new Date(document.getElementById('calDate2Input')?.value || Date.now());
        const diffDays = Math.round(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        const summary = `Days Between Dates: ${diffDays} Days\nWeeks: ${(diffDays / 7).toFixed(1)} Weeks\nApproximate Working Days: ${Math.round((diffDays * 5) / 7)} Days`;
        this._presentTextResult(summary, 'date-difference.txt');
        return;
      }

      if (h === 'typing_speed') {
        const typed = document.getElementById('typingUserInput')?.value || '';
        const words = typed.trim() ? typed.trim().split(/\s+/).length : 0;
        const mins = this.typingStartTime ? Math.max(0.05, (performance.now() - this.typingStartTime) / 60000) : 0.5;
        const wpm = Math.round(words / mins);
        this._presentTextResult(`Typing Speed Result: ${wpm} Words Per Minute (WPM)\nTotal Words Typed: ${words}`, 'typing-certificate.txt');
        return;
      }

      if (h === 'calc_stopwatch') {
        const current = this._formatStopwatchMs(this.stopwatchElapsedMs);
        const lapsText = this.stopwatchLaps.length
          ? this.stopwatchLaps.map((t, idx) => `Lap ${idx + 1}: ${t}`).join('\n')
          : 'No laps recorded.';
        this._presentTextResult(
          `Stopwatch Timer Report\nCurrent Time: ${current}\n\nRecorded Laps:\n${lapsText}`,
          'stopwatch-report.txt'
        );
        return;
      }

      if (h.startsWith('calc_')) {
        const v1 = Number(document.getElementById('calcVal1')?.value || 0);
        const v2 = Number(document.getElementById('calcVal2')?.value || 0);
        const v3 = Number(document.getElementById('calcVal3')?.value || 0);
        const summary = runNumericCalculator(h, v1, v2, v3);
        this._presentTextResult(summary, `${tool.id}-report.txt`);
        return;
      }

      const textItems = this.items.filter((i) => i.type === 'text');
      const rawTextFromInputOrFile =
        textItems.length > 0
          ? textItems.map((t) => t.textContent).join('\n\n')
          : document.getElementById('utilTextInput')?.value || 'AllOnlinePDFTools Sample Document';

      if (h === 'text_util') {
        const transformed = this.utilEngine.transformText(rawTextFromInputOrFile, tool.mode);
        this._presentTextResult(transformed, `${tool.id}.txt`);
        return;
      }

      if (h === 'crypto_hash') {
        const sha256 = await this.utilEngine.computeCryptoHash(rawTextFromInputOrFile, 'SHA-256');
        const sha512 = await this.utilEngine.computeCryptoHash(rawTextFromInputOrFile, 'SHA-512');
        this._presentTextResult(`SHA-256:\n${sha256}\n\nSHA-512:\n${sha512}`, 'crypto-hashes.txt');
        return;
      }

      if (h === 'qr_generator') {
        const dataUrl = this.utilEngine.generateVisualBadgeCanvas(rawTextFromInputOrFile, 'AllOnlinePDFTools');
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        this.lastOutputData = blob;
        this.lastOutputName = 'qr-code.png';
        this.lastOutputMime = 'image/png';
        this.resultExtraContainer.innerHTML = `<div style="text-align:center;"><img src="${dataUrl}" alt="QR Code" style="max-width:170px;border-radius:8px;" /></div>`;
        this.resultMetaText.textContent = 'qr-code.png • PNG Matrix';
        this.downloadResultBtn.textContent = '⬇ Download QR PNG';
        this.resultCard.classList.add('visible');
        return;
      }

      if (h === 'lorem_generator') {
        const lorem =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        this._presentTextResult(lorem, 'lorem-ipsum.txt');
        return;
      }

      // =====================================================================
      // 2. TXT / MARKDOWN / IPYNB / WORD / EPUB CONVERTERS (Screenshot 5!)
      // =====================================================================
      if (h === 'ipynb_convert') {
        let extractedCells = rawTextFromInputOrFile;
        try {
          const parsed = JSON.parse(rawTextFromInputOrFile);
          if (Array.isArray(parsed.cells)) {
            extractedCells = parsed.cells
              .map((c, idx) => `# --- Cell ${idx + 1} (${c.cell_type}) ---\n` + (Array.isArray(c.source) ? c.source.join('') : c.source || ''))
              .join('\n\n');
          }
        } catch (_) {}

        if (tool.ext === 'pdf') {
          await ensurePdfEnginesLoaded();
          const bytes = await this.pdfEngine.createPdfFromText(
            { title: `${tool.title} — AllOnlinePDFTools`, body: extractedCells, fontSize: 11 },
            (p, s) => this._setProgress(p, s)
          );
          this._presentBinaryResult(bytes, `notebook-export.pdf`);
          return;
        }
        this._presentTextResult(extractedCells, `notebook-export.${tool.ext || 'txt'}`);
        return;
      }

      if (h === 'txt_to_doc') {
        const ext = tool.ext || 'doc';
        let outputPayload = rawTextFromInputOrFile;
        if (ext === 'html' || ext === 'doc') {
          outputPayload = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${tool.title}</title></head><body style="font-family:Calibri,Arial,sans-serif;line-height:1.6;padding:24px;"><h2>${tool.title}</h2><pre style="white-space:pre-wrap;font-family:inherit;">${rawTextFromInputOrFile.replace(/</g, '&lt;')}</pre></body></html>`;
        } else if (ext === 'csv') {
          outputPayload = rawTextFromInputOrFile
            .split(/\r?\n/)
            .map((line, i) => `"${i + 1}","${line.replace(/"/g, '""')}"`)
            .join('\n');
        } else if (ext === 'json') {
          outputPayload = JSON.stringify({ source: 'AllOnlinePDFTools', lines: rawTextFromInputOrFile.split(/\r?\n/) }, null, 2);
        } else if (ext === 'xml') {
          const itemsXml = rawTextFromInputOrFile
            .split(/\r?\n/)
            .map((l, i) => `  <row id="${i + 1}">${l.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</row>`)
            .join('\n');
          outputPayload = `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n${itemsXml}\n</document>`;
        } else if (ext === 'sql') {
          outputPayload =
            `CREATE TABLE exported_records (id INT PRIMARY KEY, content TEXT);\n` +
            rawTextFromInputOrFile
              .split(/\r?\n/)
              .filter(Boolean)
              .map((l, i) => `INSERT INTO exported_records (id, content) VALUES (${i + 1}, '${l.replace(/'/g, "''")}');`)
              .join('\n');
        }
        this._presentTextResult(outputPayload, `converted-document.${ext}`);
        return;
      }

      if (h === 'txt_to_image') {
        const canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e0821c';
        ctx.fillRect(0, 0, canvas.width, 12);
        ctx.fillStyle = '#18181b';
        ctx.font = 'bold 22px Inter, Arial, sans-serif';
        ctx.fillText(tool.title + ' — AllOnlinePDFTools', 40, 58);
        ctx.font = '16px Inter, Arial, sans-serif';
        ctx.fillStyle = '#3f3f46';
        const lines = rawTextFromInputOrFile.split(/\r?\n/).slice(0, 18);
        lines.forEach((line, i) => {
          ctx.fillText(line.slice(0, 85), 40, 105 + i * 26);
        });
        const fmt = tool.preset?.format || 'image/png';
        const ext = fmt === 'image/jpeg' ? 'jpg' : 'png';
        const dataUrl = canvas.toDataURL(fmt, 0.92);
        const blob = await (await fetch(dataUrl)).blob();
        this.lastOutputData = blob;
        this.lastOutputName = `document-page.${ext}`;
        this.lastOutputMime = fmt;
        this.resultExtraContainer.innerHTML = `<img src="${dataUrl}" alt="Rendered Document" style="max-width:100%;max-height:150px;border-radius:8px;border:1px solid var(--border-color);" />`;
        this.resultMetaText.textContent = `${this.lastOutputName} • ${(blob.size / 1024).toFixed(1)} KB`;
        this.downloadResultBtn.textContent = `⬇ Download ${ext.toUpperCase()}`;
        this.resultCard.classList.add('visible');
        return;
      }

      if (h === 'text_to_pdf' || h === 'invoice_to_pdf' || h === 'doc_to_pdf') {
        await ensurePdfEnginesLoaded();
        const title = document.getElementById('txtTitleInput')?.value || tool.title;
        const body = document.getElementById('txtBodyInput')?.value || rawTextFromInputOrFile;
        const bytes = await this.pdfEngine.createPdfFromText({ title, body, fontSize: 12 }, (p, s) =>
          this._setProgress(p, s)
        );
        this._presentBinaryResult(bytes, `${tool.id}-output.pdf`);
        return;
      }

      // =====================================================================
      // 3. IMAGE STUDIO & JFIF / BMP / GIF / SVG / WORD / EXCEL CONVERTERS
      // =====================================================================
      const pdfItems = this.items.filter((i) => i.type === 'pdf');
      const imgItems = this.items.filter((i) => i.type === 'image');

      if (
        h === 'img_transform' ||
        h === 'img_to_base64' ||
        h === 'img_to_word' ||
        h === 'img_to_excel' ||
        h === 'img_to_svg' ||
        h === 'img_to_html'
      ) {
        if (imgItems.length === 0) {
          throw new Error('Please add an image file (JPG, PNG, JFIF, BMP, WebP, GIF) first using the "+ Add files" button.');
        }
        const format = document.getElementById('imgOutFormatSelect')?.value || tool.preset?.format || 'image/jpeg';
        const quality = Number(document.getElementById('imgQualityInput')?.value || tool.preset?.quality || 0.9);
        const scale = Number(document.getElementById('imgScaleInput')?.value || tool.preset?.scale || 1.0);

        const out = await this.utilEngine.processImage(imgItems[0].file, {
          ...tool.preset,
          format,
          quality,
          scale
        });

        if (h === 'img_to_base64') {
          this._presentTextResult(out.dataUrl, `${tool.id}-base64.txt`);
          return;
        }
        if (h === 'img_to_svg') {
          const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${out.width}" height="${out.height}" viewBox="0 0 ${out.width} ${out.height}">\n  <image href="${out.dataUrl}" width="${out.width}" height="${out.height}" />\n</svg>`;
          this._presentTextResult(svgCode, `${tool.id}.svg`);
          return;
        }
        if (h === 'img_to_html' || h === 'img_to_word') {
          const ext = h === 'img_to_word' ? 'doc' : 'html';
          const docHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${imgItems[0].fileName}</title></head><body style="font-family:Arial,sans-serif;padding:20px;"><h3>${imgItems[0].fileName}</h3><img src="${out.dataUrl}" style="max-width:100%;height:auto;" /></body></html>`;
          this._presentTextResult(docHtml, `${tool.id}.${ext}`);
          return;
        }
        if (h === 'img_to_excel') {
          const csvData = `"Property","Value"\n"File Name","${imgItems[0].fileName}"\n"Width (px)","${out.width}"\n"Height (px)","${out.height}"\n"Output Format","${out.ext.toUpperCase()}"\n"File Size (Bytes)","${out.blob.size}"`;
          this._presentTextResult(csvData, `${tool.id}.csv`);
          return;
        }

        this.lastOutputData = out.blob;
        this.lastOutputName = `converted-${tool.id}.${out.ext}`;
        this.lastOutputMime = format;
        const sizeKb = (out.blob.size / 1024).toFixed(1);

        this.resultExtraContainer.innerHTML = `<div style="text-align:center;"><img src="${out.dataUrl}" alt="Converted" style="max-width:100%;max-height:140px;border-radius:8px;border:1px solid var(--border-color);" /></div>`;
        this.resultMetaText.textContent = `${this.lastOutputName} (${out.width}×${out.height}) • ${sizeKb} KB`;
        this.downloadResultBtn.textContent = `⬇ Download ${out.ext.toUpperCase()}`;
        this.resultCard.classList.add('visible');
        return;
      }

      if (h === 'img_to_pdf' || (pdfItems.length === 0 && imgItems.length > 0)) {
        if (imgItems.length === 0) {
          throw new Error('Please upload at least one image (JPG, PNG, JFIF, BMP, WebP) to convert to PDF.');
        }
        await ensurePdfEnginesLoaded();
        const bytes = await this.pdfEngine.imagesToPdf(imgItems, { pageSize: 'A4', margin: 20 }, (p, s) =>
          this._setProgress(p, s)
        );
        this._presentBinaryResult(bytes, `${tool.id}.pdf`);
        return;
      }

      // =====================================================================
      // 4. PDF SUITE & BANK STATEMENT / WORD / EXCEL / SUMMARIZER
      // =====================================================================
      await ensurePdfEnginesLoaded();
      if (pdfItems.length === 0) {
        await this.loadSampleDocument();
      }
      const activePdfItems = this.items.filter((i) => i.type === 'pdf');

      if (h === 'bank_to_excel' || h === 'pdf_to_excel') {
        const extractedText = await this.pdfEngine.extractTextFromPdf(activePdfItems, (p, s) =>
          this._setProgress(p, s)
        );
        const csvContent = convertExtractedTextToBankCsv(extractedText, { includeTimestamp: true });
        this._presentTextResult(csvContent, 'bank-statement-export.csv', 'text/csv;charset=utf-8');
        return;
      }

      if (h === 'pdf_to_word') {
        const extractedText = await this.pdfEngine.extractTextFromPdf(activePdfItems, (p, s) =>
          this._setProgress(p, s)
        );
        const wordDoc = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Exported Word Document</title></head><body style="font-family:Calibri,Arial,sans-serif;line-height:1.6;padding:24px;"><h2>Exported Document — AllOnlinePDFTools</h2><pre style="white-space:pre-wrap;font-family:Calibri,Arial,sans-serif;">${extractedText.replace(/</g, '&lt;')}</pre></body></html>`;
        this._presentTextResult(wordDoc, 'converted-document.doc', 'application/msword');
        return;
      }

      if (h === 'pdf_summarize') {
        const extractedText = await this.pdfEngine.extractTextFromPdf(activePdfItems, (p, s) =>
          this._setProgress(p, s)
        );
        const summaryReport = summarizeExtractedPdfText(extractedText);
        this._presentTextResult(summaryReport, 'pdf-executive-summary.txt');
        return;
      }

      if (h === 'pdf_to_jpg' || h === 'pdf_to_png' || h === 'pdf_to_webp') {
        const format = h === 'pdf_to_png' ? 'image/png' : h === 'pdf_to_webp' ? 'image/webp' : 'image/jpeg';
        const images = await this.pdfEngine.pdfToImages(activePdfItems, { format, scale: 2.0 }, (p, s) =>
          this._setProgress(p, s)
        );
        if (!images || images.length === 0) {
          throw new Error('Could not render PDF pages as images. Please ensure your PDF has valid pages.');
        }
        this.lastOutputData = images[0].blob;
        this.lastOutputName = images[0].fileName;
        this.lastOutputMime = format;

        const gallery = document.createElement('div');
        gallery.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:0.45rem;margin-top:0.35rem;';
        images.forEach((imgObj) => {
          const itemBox = document.createElement('div');
          itemBox.style.cssText = 'border:1px solid var(--border-color);border-radius:8px;padding:0.3rem;text-align:center;background:var(--bg-surface);';
          itemBox.innerHTML = `<img src="${imgObj.url}" alt="${imgObj.fileName}" style="width:100%;height:70px;object-fit:contain;border-radius:4px;" />`;
          const dlOne = document.createElement('button');
          dlOne.type = 'button';
          dlOne.className = 'btn-secondary';
          dlOne.style.cssText = 'width:100%;padding:0.22rem;font-size:0.68rem;margin-top:0.25rem;';
          dlOne.textContent = `⬇ ${imgObj.fileName}`;
          dlOne.addEventListener('click', () => {
            this.pdfEngine.memory.triggerDownload(imgObj.blob, imgObj.fileName, format);
          });
          itemBox.appendChild(dlOne);
          gallery.appendChild(itemBox);
        });
        this.resultExtraContainer.appendChild(gallery);
        this.resultMetaText.textContent = `${images.length} page image(s) rendered`;
        this.downloadResultBtn.textContent = `⬇ Download ${images[0].fileName}`;
        this.resultCard.classList.add('visible');
        return;
      }

      if (h === 'pdf_extract_text') {
        const extractedText = await this.pdfEngine.extractTextFromPdf(activePdfItems, (p, s) =>
          this._setProgress(p, s)
        );
        this._presentTextResult(extractedText, 'extracted-text.txt');
        return;
      }

      let outputBytes;
      if (h === 'pdf_split' || h === 'pdf_remove') {
        const rangeStr = document.getElementById('splitRangeInput')?.value || '1';
        const mode = h === 'pdf_remove' ? 'remove' : 'keep';
        outputBytes = await this.pdfEngine.filterByRange(activePdfItems, rangeStr, mode, (p, s) =>
          this._setProgress(p, s)
        );
      } else if (h === 'pdf_reverse') {
        outputBytes = await this.pdfEngine.mergeAndReorderPages([...activePdfItems].reverse(), (p, s) =>
          this._setProgress(p, s)
        );
      } else if (h === 'pdf_compress') {
        const preset = document.getElementById('compressPresetSelect')?.value || 'recommended';
        const PRESETS = {
          extreme: { quality: 0.5, scale: 1.0, colorFilter: 'none' },
          recommended: { quality: 0.68, scale: 1.25, colorFilter: 'none' },
          high: { quality: 0.85, scale: 1.5, colorFilter: 'none' }
        };
        outputBytes = await this.pdfEngine.rasterTransformPdf(activePdfItems, PRESETS[preset], (p, s) =>
          this._setProgress(p, s)
        );
      } else if (h === 'pdf_grayscale' || h === 'pdf_invert' || h === 'pdf_contrast') {
        const colorFilter = h === 'pdf_invert' ? 'invert' : h === 'pdf_contrast' ? 'contrast' : 'grayscale';
        outputBytes = await this.pdfEngine.rasterTransformPdf(
          activePdfItems,
          { quality: 0.8, scale: 1.35, colorFilter },
          (p, s) => this._setProgress(p, s)
        );
      } else if (h === 'pdf_twoup') {
        outputBytes = await this.pdfEngine.createTwoUpLayout(activePdfItems, (p, s) => this._setProgress(p, s));
      } else if (h === 'pdf_sign') {
        const sigCanvas = document.getElementById('signatureCanvas');
        const sigDataUrl = sigCanvas.toDataURL('image/png');
        const position = document.getElementById('sigPosSelect')?.value || 'bottom-right';
        const signerName = document.getElementById('sigSignerInput')?.value || '';
        outputBytes = await this.pdfEngine.signPdfWithPng(
          activePdfItems,
          sigDataUrl,
          { position, targetPages: 'last', signerName },
          (p, s) => this._setProgress(p, s)
        );
      } else if (h === 'pdf_watermark') {
        const text = document.getElementById('wmTextInput')?.value || 'CONFIDENTIAL';
        const placement = document.getElementById('wmPlacementSelect')?.value || 'diagonal';
        const colorHex = document.getElementById('wmColorInput')?.value || '#059669';
        const fontSize = Number(document.getElementById('wmSizeInput')?.value || 46);
        const opacity = Number(document.getElementById('wmOpacityInput')?.value || 0.28);
        outputBytes = await this.pdfEngine.applyWatermarkAndProtect(
          activePdfItems,
          { text, placement, colorHex, fontSize, opacity },
          (p, s) => this._setProgress(p, s)
        );
      } else if (h === 'pdf_pagenums') {
        const format = document.getElementById('pnFormatInput')?.value || 'Page {n} of {total}';
        const position = document.getElementById('pnPosSelect')?.value || 'bottom-center';
        const headerText = document.getElementById('pnHeaderInput')?.value || '';
        outputBytes = await this.pdfEngine.addPageNumbersAndHeaderFooter(
          activePdfItems,
          { format, position, headerText, fontSize: 10 },
          (p, s) => this._setProgress(p, s)
        );
      } else if (h === 'pdf_crop' || h === 'pdf_resize') {
        const marginPt = Number(document.getElementById('geomMarginInput')?.value || 36);
        const targetSize = document.getElementById('resizePageSelect')?.value || 'A4';
        outputBytes = await this.pdfEngine.cropOrResizePages(
          activePdfItems,
          { mode: h === 'pdf_resize' ? 'resize' : 'crop', marginPt, targetSize },
          (p, s) => this._setProgress(p, s)
        );
      } else if (h === 'pdf_blank') {
        const pos = document.getElementById('blankPosSelect')?.value || 'end';
        const count = Math.max(1, Number(document.getElementById('blankCountInput')?.value || 1));
        outputBytes = await this.pdfEngine.insertBlankPages(activePdfItems, pos, count, (p, s) =>
          this._setProgress(p, s)
        );
      } else if (h === 'pdf_redact') {
        const label = document.getElementById('redactLabelInput')?.value || 'REDACTED';
        const xPercent = Number(document.getElementById('redactXInput')?.value ?? 10);
        const yPercent = Number(document.getElementById('redactYInput')?.value ?? 75);
        const widthPercent = Number(document.getElementById('redactWInput')?.value ?? 80);
        const heightPercent = Number(document.getElementById('redactHInput')?.value ?? 10);
        outputBytes = await this.pdfEngine.applyRedactionBox(
          activePdfItems,
          { xPercent, yPercent, widthPercent, heightPercent, label },
          (p, s) => this._setProgress(p, s)
        );
      } else if (h === 'pdf_scrub_meta' || h === 'pdf_edit_meta') {
        const scrubAll = h === 'pdf_scrub_meta';
        const title = document.getElementById('metaTitleInput')?.value || '';
        const author = document.getElementById('metaAuthorInput')?.value || '';
        const subject = document.getElementById('metaSubjectInput')?.value || '';
        outputBytes = await this.pdfEngine.updateOrScrubMetadata(
          activePdfItems,
          { scrubAll, title, author, subject, keywords: '' },
          (p, s) => this._setProgress(p, s)
        );
      } else {
        outputBytes = await this.pdfEngine.mergeAndReorderPages(activePdfItems, (p, s) =>
          this._setProgress(p, s)
        );
      }

      this._presentBinaryResult(outputBytes, this.lastOutputName);
    } catch (err) {
      alert(`AllOnlinePDFTools Notice: ${err.message}`);
    } finally {
      this.processBtn.disabled = false;
      this._hideProgress();
    }
  }

  _presentTextResult(textContent, filename, mime = 'text/plain;charset=utf-8') {
    this.lastOutputData = textContent;
    this.lastOutputName = filename;
    this.lastOutputMime = mime;

    const previewArea = document.createElement('textarea');
    previewArea.className = 'form-textarea';
    previewArea.readOnly = true;
    previewArea.value = textContent;
    this.resultExtraContainer.appendChild(previewArea);

    const sizeKb = (new Blob([textContent]).size / 1024).toFixed(2);
    this.resultMetaText.textContent = `${filename} • ${sizeKb} KB`;
    this.downloadResultBtn.textContent = `⬇ Download ${filename}`;
    this.resultCard.classList.add('visible');
  }

  _presentBinaryResult(bytes, filename) {
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf';
    }
    this.lastOutputData = bytes;
    this.lastOutputName = filename;
    this.lastOutputMime = 'application/pdf';

    const sizeKb = (bytes.byteLength / 1024).toFixed(1);
    this.resultMetaText.textContent = `${filename} • ${sizeKb} KB`;
    this.downloadResultBtn.textContent = '⬇ Download Processed PDF';
    this.resultCard.classList.add('visible');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.oneClickApp = new OneClickApp();
});
