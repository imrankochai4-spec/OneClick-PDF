// File: public/js/tool-guides.js
/**
 * Dynamic Rich Guide & Usage Documentation Generator for all 184+ Tools
 * Renders Asli-Tools-style detailed documentation, 3-step cards, FAQs, features,
 * real-world use cases, comparison notes, tips, and clickable related tools
 * inside every tool workspace (`#studioWorkspace`).
 */

const FORMAT_DETAILS = {
  PDF: 'Portable Document Format (.pdf) with preserved layout, typography, and print readiness',
  DOC: 'editable Microsoft Word (.doc / .docx) format for easy text editing and formatting',
  DOCX: 'editable Microsoft Word (.docx) format compatible with Word, Google Docs, and LibreOffice',
  XLS: 'structured spreadsheet (.csv / .xls) tables with cleanly separated columns and rows',
  XLSX: 'spreadsheet format ready to open in Microsoft Excel, Google Sheets, and Apple Numbers',
  CSV: 'comma-separated values (.csv) tabular data for spreadsheets and databases',
  PPT: 'widescreen presentation slides ready for sharing, reading, and handouts',
  TXT: 'lightweight UTF-8 plain text readable on every operating system and editor',
  MD: 'clean Markdown (.md) syntax with structured headings, lists, and code blocks',
  HTML: 'semantic HTML5 markup ready for web pages, documentation, or email templates',
  XML: 'structured XML node markup for data exchange and software feeds',
  JSON: 'clean UTF-8 JSON objects and arrays formatted for APIs and apps',
  SQL: 'ready-to-run SQL INSERT statements for importing records into relational databases',
  RTF: 'Rich Text Format (.rtf) universally supported by WordPad, Word, and Pages',
  EPUB: 'reflowable EPUB digital eBook packages and readable chapter files',
  FB2: 'FictionBook (.fb2) XML eBook format popular on dedicated e-readers',
  CBZ: 'Comic Book ZIP (.cbz) archive storing sequenced high-resolution comic pages',
  IPYNB: 'Jupyter Notebook (.ipynb) combining Python code cells, outputs, and Markdown notes',
  PY: 'clean executable Python (.py) script stripped of notebook JSON boilerplate',
  TEX: 'academic LaTeX (.tex) document source ready for Overleaf or TeX Live',
  JPG: 'universal JPEG photograph format with balanced compression and crisp color',
  PNG: 'lossless PNG graphics supporting sharp edges and transparent backgrounds',
  WEBP: 'next-gen WebP format delivering high visual quality at a much smaller file size',
  JFIF: 'JPEG File Interchange Format (.jfif) images saved by Windows browsers and cameras',
  BMP: 'uncompressed Windows Bitmap (.bmp) raster image format',
  HEIC: 'Apple iPhone High Efficiency Image (.heic) format',
  AVIF: 'ultra-efficient AVIF modern web image format',
  GIF: 'Graphics Interchange Format (.gif) frames and lightweight web graphics',
  TIFF: 'archival high-resolution TIFF raster format used in printing and publishing',
  PSD: 'uncompressed lossless studio image export ready for Photoshop layers',
  SVG: 'Scalable Vector Graphics (.svg) XML container that scales cleanly at any size',
  ICO: 'compact 64×64 website favicon and desktop shortcut icon (.ico)',
  B64: 'inline Base64 DataURI text string for embedding directly into HTML, CSS, or JSON',
  QR: 'high-contrast matrix QR barcode image scannable by any phone camera'
};

const SPECIAL_OVERRIDES = {
  merge: {
    seoTitle: 'Free PDF Merger Online - Merge PDF Files Free | Combine Multiple PDFs Instantly',
    whatIs:
      'PDF merging is the process of combining multiple separate PDF files (or images turned into PDF pages) into a single, well-organized document. Instead of emailing or storing scattered reports, invoices, and chapters separately, you can combine everything in exact page order in seconds right inside your browser.',
    step1: 'Click "Add files to PDF Merger" or drag and drop multiple PDF documents into the canvas. You can reorder or remove individual pages using the drag handles and card buttons.',
    step2: 'Use the toolbar ("Rotate All", "Reverse", Grid/List view) and "Conversion settings" on the right to name your merged PDF and keep high-DPI quality.',
    step3: 'Click "Convert / Run PDF Merger" to combine every selected page locally in browser RAM, then tap "Download Result" or "Share / Save to Phone" immediately.',
    extraFaqQ: 'Can I rearrange pages or rotate files before merging?',
    extraFaqA: 'Yes! Drag any page card to reorder it, click ↻ on individual pages to rotate 90°, click ✕ to remove unwanted pages, or use the top toolbar to reverse or rotate everything at once.'
  },
  split: {
    seoTitle: 'Free PDF Splitter Online - Split & Extract PDF Pages Instantly',
    whatIs:
      'PDF splitting lets you break a large multi-page PDF document into smaller standalone PDFs or extract only the exact pages you need (such as page ranges like 1-3, 5). It is ideal for sending just the signed pages of a contract or separating textbook chapters.',
    step1: 'Upload your PDF document into the studio canvas. Every page renders as a visual thumbnail card so you can inspect page numbers before splitting.',
    step2: 'Open "Conversion settings" on the right to enter exact page numbers or ranges (for example: 1-3, 5, 8-10) and set your output filename.',
    step3: 'Press "Convert / Run PDF Splitter" to extract or burst the pages locally with zero server uploads, then save your new PDF right away.',
    extraFaqQ: 'Will splitting reduce the quality of text or images inside my PDF?',
    extraFaqA: 'No. Our client-side PDF engine copies original vector pages and embedded objects directly whenever possible, preserving full crisp quality.'
  },
  compress: {
    seoTitle: 'Free PDF Compressor Online - Reduce PDF File Size Without Losing Readability',
    whatIs:
      'PDF compression reduces heavy file sizes caused by high-resolution scans and embedded photos so your PDFs fit email attachment limits, government portal uploads (under 1MB–5MB), and fast mobile sharing while keeping text readable.',
    step1: 'Drop one or multiple oversized PDF files into the studio area. Check each page preview card to verify your document is loaded.',
    step2: 'In "Conversion settings" on the right, pick a compression preset (Balanced, Small Email Size, or Print Quality) and DPI target.',
    step3: 'Click "Convert / Run PDF Compressor" to rebuild and optimize your PDF locally in memory, then download the compact file instantly.'
  },
  bank_to_excel: {
    seoTitle: 'Free Bank Statement to Excel Converter - Extract PDF Transactions Locally (100% Private)',
    whatIs:
      'Bank Statement to Excel converts digital PDF bank statements into clean spreadsheet rows (Date, Description, Debit/Credit Amount, Balance) that open directly in Microsoft Excel or Google Sheets—without ever uploading sensitive financial records to any external server.',
    step1: 'Upload your monthly PDF bank statement(s). Because extraction runs 100% in your own device RAM, zero banking data leaves your computer or phone.',
    step2: 'Choose your output format (Excel .csv or Structured JSON), statement date format (MM/DD/YYYY or DD/MM/YYYY), and bank layout detection mode in "Conversion settings".',
    step3: 'Click "Convert to Excel / CSV" and download your clean, categorized transaction table ready for bookkeeping, tax filing, or budgeting.',
    extraFaqQ: 'Are my bank account numbers or transactions uploaded anywhere?',
    extraFaqA: 'Never. Processing executes offline-capable inside your browser JavaScript & WebAssembly engine. Even if you disconnect your Wi-Fi, conversion continues working privately.'
  },
  pdf2word: {
    seoTitle: 'Free PDF to Word Converter - Convert PDF to Editable DOC Online',
    whatIs:
      'PDF to Word extracts readable paragraphs and structured text out of PDF documents into an editable Word (.DOC) file so you can edit resumes, letters, essays, and contracts easily inside Microsoft Word, Google Docs, or LibreOffice.',
    step1: 'Select or drag your PDF document into the studio dropzone. Wait a moment for page thumbnails to render.',
    step2: 'Review page order in the grid and set your desired Word document filename in the "Conversion settings" drawer.',
    step3: 'Click "Convert / Run PDF to Word" to extract the text into an editable Word document and download it cleanly in one tap.'
  },
  pdf2excel: {
    seoTitle: 'Free PDF to Excel Converter - Extract PDF Tables & Data to XLS/CSV',
    whatIs:
      'PDF to Excel identifies tabular rows, numbers, invoices, and price lists embedded in PDFs and exports them into clean spreadsheet rows compatible with Excel, Google Sheets, and accounting software.',
    step1: 'Add your PDF report, price sheet, or statement to the workspace canvas.',
    step2: 'Pick Excel CSV or JSON structure plus date format in "Conversion settings" on the right.',
    step3: 'Run the converter and download a spreadsheet you can immediately filter, sum, and graph.'
  },
  afghan_date: {
    seoTitle: 'Free Afghan Date Converter - Shamsi (Solar Hijri), Islamic Hijri & Gregorian Calendar',
    whatIs:
      'The Afghan Date Converter accurately translates dates between the Afghan Solar Hijri calendar (Shamsi: Hamal, Sawr, Jawza, Saratan, Asad, Sunbula, Mizan, Aqrab, Qaws, Jadi, Dalw, Hut), the Lunar Islamic Hijri calendar (Qamari), and the international Gregorian (Miladi) calendar—plus lets you view your Afghan official Tazkira / birth date alignment instantly.',
    step1: 'No file upload needed—go straight to "Conversion settings" on the right panel to pick your source calendar system and date (Year, Month, Day).',
    step2: 'Select today’s date or type any historical or upcoming Shamsi, Hijri, or Gregorian date.',
    step3: 'Click "Convert / Run Afghan Date Converter" to immediately see the exact converted dates across all three calendars along with weekday and copy/download options.',
    extraFaqQ: 'Does this support Afghan month names like Hamal, Asad, Mizan, and Hut?',
    extraFaqA: 'Yes! All 12 Afghan Solar Hijri (Shamsi) months as well as Lunar Islamic Hijri months and leap-year rules are calculated offline right inside your browser.'
  },
  zakat_calc: {
    seoTitle: 'Free Zakat Calculator Online - Calculate 2.5% Zakat on Gold, Silver & Savings',
    whatIs:
      'Our private Zakat Calculator helps you calculate exact annual Zakat (2.5% / 1/40th) on your cash savings, bank balances, gold, silver, business inventory, and investments after deducting eligible short-term liabilities against the current Silver or Gold Nisab threshold.',
    step1: 'Open the calculator fields inside "Conversion settings" on the right panel—no documents or login required.',
    step2: 'Enter your cash/bank balances, value of gold and silver, business stock/investments, and any immediate debts payable.',
    step3: 'Click "Convert / Run Zakat Calculator" to see whether your net wealth meets Nisab and view your exact 2.5% Zakat due breakdown privately on your device.'
  },
  age_calc: {
    seoTitle: 'Free Exact Age Calculator - Years, Months, Weeks, Days & Next Birthday Countdown',
    whatIs:
      'The Exact Age Calculator computes your precise chronological age down to years, months, weeks, days, and total hours from your Date of Birth to today or any target reference date, including day of the week born and days remaining until your next birthday.',
    step1: 'Look at the "Conversion settings" panel on the right and enter your Date of Birth.',
    step2: 'Optionally set a custom "Calculate Age As Of" date for passport forms, school admissions, or retirement checks.',
    step3: 'Press "Convert / Run Age Calculator" to see your complete age breakdown and save or copy the result card.'
  },
  salary_tax_calc: {
    seoTitle: 'Free Salary Tax & Take-Home Pay Calculator - Monthly & Annual Breakdown',
    whatIs:
      'The Salary Tax Calculator quickly computes gross-to-net take-home income by subtracting income tax percentages and monthly deductions/pension contributions, giving you clear monthly and annual net pay figures without sharing salary details online.',
    step1: 'Enter your Monthly Gross Salary in the "Conversion settings" sidebar on the right.',
    step2: 'Set your applicable Income Tax Rate (%) and any monthly pension, insurance, or social deductions.',
    step3: 'Click "Convert / Run Salary Tax Calculator" to review monthly and annual tax withheld plus net take-home pay.'
  },
  tasbih_counter: {
    seoTitle: 'Free Digital Tasbih & Dhikr Counter - 33 / 99 Target Alert & Saved Progress',
    whatIs:
      'The Digital Tasbih Counter is an interactive, ad-free Dhikr counter designed for both desktop and Android mobile screens. It remembers your count locally even if you refresh the page, supports 33, 99, or 100-count cycles, and tracks total laps.',
    step1: 'Look inside the right "Conversion settings" panel (or run button) to access your live Tasbih tap button and target cycle selector (33 / 99 / 100 / Unlimited).',
    step2: 'Tap the count button or click "Convert / Run Tasbih Counter" to increment your Dhikr with visual lap tracking.',
    step3: 'Your count saves automatically in local browser storage so you never lose track of your daily Dhikr.'
  },
  pdf_summarizer: {
    seoTitle: 'Free PDF Summarizer Online - Extract Key Takeaways & Executive Summary Locally',
    whatIs:
      'Our privacy-first PDF Summarizer scans searchable text inside multi-page PDF reports, research papers, or contracts directly in your browser to extract key bullet points, word/page reading metrics, and an executive overview—without sending private files to external AI servers.',
    step1: 'Upload your PDF document into the left studio canvas (supports single or multi-page searchable PDFs).',
    step2: 'Check "Conversion settings" to pick summary length (Concise Bullets, Detailed Overview) and output format.',
    step3: 'Click "Convert / Run PDF Summarizer" to inspect key extracted takeaways on screen and download your summary text.'
  },
  qr_gen: {
    seoTitle: 'Free QR Code Generator Online - Create Custom High-Res QR Codes Instantly',
    whatIs:
      'Generate crisp, high-contrast QR codes for website links, Wi-Fi passwords, vCards, WhatsApp numbers, or plain text messages locally in your browser with instant PNG download and zero expiration limits.',
    step1: 'Open "Conversion settings" on the right panel and enter any URL, text, email, or phone number (or upload a .txt file).',
    step2: 'Customize QR matrix sizing and output filename directly inside the settings drawer.',
    step3: 'Click "Convert / Run QR Code Generator" to render your scannable QR image and download or save it to your device.'
  }
};

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function classifyToolFamily(tool) {
  const h = tool.handler || '';
  if (h.startsWith('calc_') || h === 'tasbih_widget' || h === 'typing_speed') return 'calculator';
  if (h === 'qr_generator' || h === 'text_util' || h === 'crypto_hash' || h === 'lorem_generator') return 'textdev';
  if (tool.id.startsWith('gif')) return 'gif';
  if (tool.cat === 'image' || h.startsWith('img_')) return 'image';
  if (['pdf_merge', 'pdf_split', 'pdf_compress', 'pdf_remove', 'pdf_reverse', 'pdf_watermark', 'pdf_sign', 'pdf_pagenums', 'pdf_crop', 'pdf_resize', 'pdf_blank', 'pdf_twoup', 'pdf_grayscale', 'pdf_invert', 'pdf_contrast', 'pdf_redact', 'pdf_scrub_meta', 'pdf_edit_meta', 'pdf_summarize', 'pdf_extract_text'].includes(h)) {
    return 'pdf_edit';
  }
  return 'converter';
}

function buildGenericWhatIs(tool, family) {
  const fromFmt = (tool.from || 'FILE').toUpperCase();
  const toFmt = (tool.to || 'OUT').toUpperCase();
  const fromDesc = FORMAT_DETAILS[fromFmt] || `${fromFmt} source file`;
  const toDesc = FORMAT_DETAILS[toFmt] || `${toFmt} output`;

  if (family === 'calculator') {
    return `${tool.title} is a fast, accurate browser utility designed to compute exact results without spreadsheets or paid mobile apps. Whether you need quick personal checks, academic planning, financial budgeting, or everyday unit conversions, ${tool.title} gives you instant calculations privately on your own device with zero account sign-up.`;
  }
  if (family === 'textdev') {
    return `${tool.title} transforms, validates, formats, or encodes your text and developer payloads (${tool.desc.toLowerCase()}) completely offline-capable inside browser memory. Sensitive API snippets, emails, hashes, and passwords never touch remote servers, giving developers, students, and content writers safe one-click formatting.`;
  }
  if (family === 'gif') {
    return `${tool.title} helps you edit, resize, rotate, optimize, or convert GIF graphics without installing heavy desktop video suites. Because every pixel operation uses local HTML5 Canvas processing, your memes, product demos, and animated banners convert cleanly in seconds.`;
  }
  if (family === 'pdf_edit') {
    return `${tool.title} performs direct structural or visual edits on PDF files (${tool.desc.toLowerCase()}) inside your web browser or mobile app. Instead of uploading sensitive reports, contracts, or certificates to third-party servers, all page rendering and PDF assembly runs locally in device RAM.`;
  }
  if (fromFmt !== toFmt && FORMAT_DETAILS[fromFmt] && FORMAT_DETAILS[toFmt]) {
    return `${tool.title} converts ${fromDesc} into ${toDesc}. Instead of dealing with incompatible viewers or installing bulky desktop converters, you can drag and drop one or multiple ${fromFmt} files into the workspace, fine-tune output settings, and export clean ${toFmt} results within seconds.`;
  }
  return `${tool.title} makes it simple to ${tool.desc.toLowerCase()} directly inside your browser. With local HTML5 and WebAssembly processing, you get reliable, watermark-free output on desktop and Android without waiting in server upload queues.`;
}

function buildSteps(tool, family, ov) {
  if (ov?.step1 && ov?.step2 && ov?.step3) {
    return [ov.step1, ov.step2, ov.step3];
  }
  const fromFmt = (tool.from || 'FILE').toUpperCase();
  const toFmt = (tool.to || 'OUT').toUpperCase();

  if (family === 'calculator') {
    return [
      `Enter Your Values: Go straight to the "Conversion settings" panel on the right side of the workspace—no file upload or registration is required to use ${tool.title}.`,
      `Adjust Calculation Options: Fill in the numeric inputs, dates, units, or rate sliders provided specifically for ${tool.title}.`,
      `Calculate & Save: Click "Convert / Run ${tool.title}" at the bottom of settings to generate your instant breakdown, then copy or download your summary card.`
    ];
  }
  if (family === 'textdev') {
    return [
      `Paste Text or Upload File: Type or paste your source content directly inside the input box in "Conversion settings" (or drag and drop a .txt / .csv / .json file into the left dropzone).`,
      `Choose Formatting & Options: Adjust mode toggles, password length, case style, or output filename to match what you need.`,
      `Run & Copy or Download: Click "Convert / Run ${tool.title}" to transform everything locally in browser RAM, then copy or download the finished output.`
    ];
  }
  if (family === 'pdf_edit') {
    return [
      `Add Your PDF File(s): Click "Add files to ${tool.title}" or drag and drop your PDF documents onto the workspace canvas. Page thumbnails render automatically so you can inspect every page.`,
      `Customize Studio Controls: Use the top toolbar ("Rotate All", "Reverse", Grid/List view) and "Conversion settings" on the right to adjust page ranges, watermarks, quality presets, or output filenames.`,
      `Apply & Download Instantly: Click "Convert / Run ${tool.title}" to process all pages in browser RAM with zero server uploads, then save or share your finished PDF immediately.`
    ];
  }
  return [
    `Upload Your ${fromFmt} Files: Click "Add files to ${tool.title}" or drag and drop your ${fromFmt} files directly into the converter canvas. You can queue single files or batches cleanly.`,
    `Customize Output Settings: Review file cards in the preview grid (rotate or reorder if needed) and configure output filename, quality/DPI, or merge toggles inside "Conversion settings" on the right.`,
    `Convert to ${toFmt} & Download: Click "Convert / Run ${tool.title}" to process everything locally inside your browser in seconds—zero server queues, zero watermarks—and hit "Download Result".`
  ];
}

function buildFeatures(tool, family) {
  const fromFmt = (tool.from || 'FILE').toUpperCase();
  const toFmt = (tool.to || 'OUT').toUpperCase();
  const common = [
    { label: '100% Privacy and Security', text: 'Every operation runs locally inside your device’s browser memory (RAM). Files and inputs are never uploaded, stored, or logged on any external server.' },
    { label: 'Completely Free & No Watermarks', text: 'Use unlimited runs on All Online PDF Tools with zero hidden paywalls, zero credit limits, zero registration walls, and zero branding watermarks.' }
  ];

  if (family === 'calculator') {
    return [
      { label: 'Instant Local Calculations', text: `Compute ${tool.title} figures immediately with zero page reloads or server round-trips.` },
      { label: 'Clear Breakdown & Export', text: 'Review detailed step-by-step numbers and export clean reports when needed.' },
      { label: 'Desktop, Tablet & Android Ready', text: 'Clean touch-friendly inputs work smoothly in browsers and the All Online PDF Tools Android app.' },
      ...common
    ];
  }
  if (family === 'textdev') {
    return [
      { label: 'Fast Client-Side Engine', text: `Run ${tool.title} instantaneously using built-in browser WebCrypto and UTF-8 text processors.` },
      { label: 'Paste or File Input', text: 'Either type text directly into settings or drop .txt/.csv/.json files into the workspace.' },
      { label: 'Developer & Creator Friendly', text: 'Produces clean, copy-ready and downloadable output with preserved encoding.' },
      ...common
    ];
  }
  if (family === 'pdf_edit') {
    return [
      { label: 'Visual Page Thumbnails', text: 'Preview every page visually before running edits—rotate 90°, duplicate, reorder, or remove unwanted pages individually.' },
      { label: 'Multi-File Batch Studio', text: 'Drop multiple documents at once, switch between Grid and List views, and combine or transform cleanly.' },
      { label: 'High-DPI Export Control', text: 'Preserve crisp readable fonts and graphics with high-DPI export toggles and custom filenames.' },
      ...common
    ];
  }
  return [
    { label: `Clean ${fromFmt} to ${toFmt} Output`, text: `Convert ${fromFmt} sources into reliable ${toFmt} deliverables formatted for modern apps and viewers.` },
    { label: 'Batch Queue & Reordering', text: 'Add multiple files at once, drag cards to adjust order, or toggle single vs merged output in settings.' },
    { label: 'High-DPI & Quality Controls', text: 'Customize output quality, filenames, and resolution presets inside the Conversion settings drawer.' },
    ...common
  ];
}

function buildUseCases(tool, family) {
  if (family === 'calculator') {
    return [
      { label: 'Daily Personal Planning', text: `Check accurate ${tool.title} results in seconds without downloading mobile bloatware.` },
      { label: 'Work, Study & Finance', text: 'Verify bills, taxes, grades, dates, loans, or Zakat obligations quickly before official submissions.' },
      { label: 'Offline Travel & Mobile Use', text: 'Run calculations smoothly even with limited mobile data or inside our offline-capable PWA/Android app.' },
      { label: 'Privacy-Sensitive Numbers', text: 'Keep salary, wealth, health, and age details strictly on your own screen.' }
    ];
  }
  if (family === 'textdev') {
    return [
      { label: 'Coding & API Debugging', text: 'Format JSON, generate UUIDs/SHA-256 hashes, or encode Base64/URL strings cleanly during development.' },
      { label: 'Content Writing & SEO', text: 'Count words, clean duplicate lines, normalize capitalization, or trim extra spaces before publishing.' },
      { label: 'QR Sharing for Business', text: 'Create scannable codes for menus, Wi-Fi access, business cards, and posters in seconds.' },
      { label: 'Data Cleanup & Extraction', text: 'Pull clean lists of emails or URLs out of messy logs, spreadsheets, or plain text dumps.' }
    ];
  }
  if (family === 'image' || family === 'gif') {
    return [
      { label: 'Website & E-Commerce Speed', text: 'Convert heavy camera photos, BMPs, or JFIFs into compressed WebP, JPG, or PNG for faster loading.' },
      { label: 'Print & Document Submissions', text: 'Turn photos, receipts, and ID scans into clean single PDF sheets ready for forms and portals.' },
      { label: 'Social Media & App Icons', text: 'Resize, rotate, mirror, filter, or package crisp favicons (.ico) and thumbnails effortlessly.' },
      { label: 'Confidential Photo Handling', text: 'Keep family pictures, IDs, and private scans completely off remote third-party servers.' }
    ];
  }
  return [
    { label: 'Submitting Job & Visa Packets', text: `Prepare clean, compatible files with ${tool.title} before uploading to portals with strict format rules.` },
    { label: 'Office Reports & Invoices', text: 'Package receipts, contracts, notebooks, and client deliverables cleanly into universal formats.' },
    { label: 'Academic & Study Notes', text: 'Convert Jupyter notebooks, Markdown, EPUBs, or scattered class handouts into organized PDF/Word files.' },
    { label: 'Archiving & Email Sharing', text: 'Standardize files for long-term storage and smooth viewing across Windows, Mac, iPhone, and Android.' }
  ];
}

function buildTips(tool, family) {
  if (family === 'calculator') {
    return [
      'Double-check units and input formats (for example dates, currency rates, or percentages) inside Conversion settings before running.',
      'Re-run with adjusted assumptions to compare best-case and conservative scenarios instantly.',
      'Use "Download Result" or copy the output summary when saving records for bookkeeping or personal logs.'
    ];
  }
  if (family === 'textdev') {
    return [
      'Paste UTF-8 text or drop clean `.txt`/`.csv` files directly so special characters remain intact.',
      'Review line breaks and whitespace options before copying output into code editors or spreadsheets.',
      'Test generated QR codes or hashes on sample data first before printing bulk posters or packaging production configs.'
    ];
  }
  if (family === 'image' || family === 'gif') {
    return [
      'Use PNG or TIFF output when you need lossless graphics, sharp screenshots, or transparent backgrounds; use JPG or WebP for smaller photo file sizes.',
      'Enable "Preserve high-DPI quality" in Conversion settings when preparing images for print or PDF documents.',
      'Check orientation with the ↻ Rotate button on each thumbnail card before exporting your batch.'
    ];
  }
  return [
    'Use the Grid / List view buttons above the canvas to inspect page numbers and exact file sequence before running.',
    'Check "Output Filename" in Conversion settings so your exported document downloads with a clear, descriptive name.',
    'Enable "Preserve high-DPI quality" for sharp text and charts, or switch compression presets when targeting smaller email sizes.',
    'Keep "100% Privacy" effortless—run everything locally in your browser even on confidential legal, academic, or banking files.'
  ];
}

function getRelatedTools(tool, allTools) {
  const fromFmt = (tool.from || '').toUpperCase();
  const toFmt = (tool.to || '').toUpperCase();
  const scored = [];
  for (const cand of allTools) {
    if (cand.id === tool.id) continue;
    let score = 0;
    if (cand.handler === tool.handler) score += 5;
    if (cand.cat === tool.cat) score += 3;
    if (fromFmt && ((cand.from || '').toUpperCase() === fromFmt || (cand.to || '').toUpperCase() === fromFmt)) score += 3;
    if (toFmt && ((cand.to || '').toUpperCase() === toFmt || (cand.from || '').toUpperCase() === toFmt)) score += 2;
    if (cand.popular || cand.featuredPaid) score += 1;
    if (score > 0) scored.push({ tool: cand, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 6).map((s) => s.tool);
}

/**
 * Generates the complete, structured HTML documentation card for any tool in ONECLICK_TOOLS.
 */
export function buildToolRichGuideHtml(tool, allTools) {
  const ov = SPECIAL_OVERRIDES[tool.id] || null;
  const family = classifyToolFamily(tool);
  const fromFmt = (tool.from || 'FILE').toUpperCase();
  const toFmt = (tool.to || 'OUT').toUpperCase();

  const seoHeadline =
    ov?.seoTitle ||
    (family === 'calculator'
      ? `Free ${tool.title} Online - Accurate Instant Calculation | All Online PDF Tools`
      : `Free ${tool.title} Online - Fast & Private Browser Tool | All Online PDF Tools`);

  const intro1 = `Looking for a fast, reliable way to use ${tool.title} online for free? Our ${tool.title} helps you ${tool.desc.toLowerCase()} instantly without installing software or creating an account.`;
  const intro2 = `Every step runs directly inside your browser memory (RAM) with zero hidden costs, zero watermarks, and zero file uploads—so your documents, photos, and calculations never leave your computer or phone.`;

  const whatIsText = ov?.whatIs || buildGenericWhatIs(tool, family);
  const [step1, step2, step3] = buildSteps(tool, family, ov);
  const features = buildFeatures(tool, family);
  const useCases = buildUseCases(tool, family);
  const tips = buildTips(tool, family);
  const related = getRelatedTools(tool, allTools);

  const actionPhrase =
    family === 'calculator'
      ? `use ${tool.title}`
      : family === 'textdev'
      ? `run ${tool.title}`
      : `convert ${fromFmt} to ${toFmt}`.replace(new RegExp(`convert ${fromFmt} to ${fromFmt}`, 'i'), `use ${tool.title}`);

  const relatedLinksHtml = related
    .map(
      (r) =>
        `<a href="#studioWorkspace" class="guide-related-inline" data-tool-jump="${esc(r.id)}">${esc(r.title)}</a>`
    )
    .join(', ');

  const relatedChipsHtml = related
    .map(
      (r) => `
      <button type="button" class="guide-related-chip" data-tool-jump="${esc(r.id)}">
        <span>${r.icon || '⚡'}</span>
        <span>${esc(r.title)}</span>
        <span style="opacity:0.65;">→</span>
      </button>`
    )
    .join('');

  const extraFaqHtml = ov?.extraFaqQ
    ? `
      <div class="guide-faq-item">
        <h4>${esc(ov.extraFaqQ)}</h4>
        <p>${esc(ov.extraFaqA)}</p>
      </div>`
    : `
      <div class="guide-faq-item">
        <h4>Does ${esc(tool.title)} upload my files or inputs to a server?</h4>
        <p>No. ${esc(tool.title)} processes everything 100% client-side inside your browser RAM. Even after the page loads, core workflows continue functioning privately offline.</p>
      </div>`;

  return `
    <article class="tool-guide-card" aria-label="Complete Guide for ${esc(tool.title)}">
      <h2 class="guide-main-h2">${esc(seoHeadline)}</h2>
      <p class="guide-lead-p">${esc(intro1)}</p>
      <p class="guide-body-p">${esc(intro2)}</p>

      <h3 class="guide-sub-h3">What is ${esc(tool.title)}?</h3>
      <p class="guide-body-p">${esc(whatIsText)}</p>

      <h3 class="guide-sub-h3">Why use ${esc(tool.title)} on All Online PDF Tools?</h3>
      <p class="guide-body-p">
        All Online PDF Tools combines desktop-grade speed with total browser privacy. You never hit daily file paywalls, slow upload queues, or confusing popups—just drop your file or enter your inputs, adjust Conversion settings, and save your result in seconds.
      </p>

      <h3 class="guide-sub-h3">How it works — ${esc(actionPhrase)}</h3>
      <p class="guide-body-p" style="margin-bottom:0.85rem;">
        Using ${esc(tool.title)} takes just seconds. Follow these three simple steps:
      </p>

      <div class="guide-steps-list">
        <div class="guide-step-box">
          <div class="guide-step-head">
            <span class="guide-step-num">1</span>
            <span>Step 1</span>
          </div>
          <p>${esc(step1)}</p>
        </div>

        <div class="guide-step-box">
          <div class="guide-step-head">
            <span class="guide-step-num">2</span>
            <span>Step 2</span>
          </div>
          <p>${esc(step2)}</p>
        </div>

        <div class="guide-step-box">
          <div class="guide-step-head">
            <span class="guide-step-num">3</span>
            <span>Step 3</span>
          </div>
          <p>${esc(step3)}</p>
        </div>
      </div>

      <h3 class="guide-sub-h3">Frequently Asked Questions</h3>
      <div class="guide-faq-list">
        <div class="guide-faq-item">
          <h4>Is this ${esc(tool.title)} tool free?</h4>
          <p>Yes — All Online PDF Tools provides unlimited free access without forcing sign-up, subscriptions, or watermarks.</p>
        </div>
        <div class="guide-faq-item">
          <h4>Do I need to install any software?</h4>
          <p>No installation is required. Use any modern desktop or mobile browser—or install our lightweight Android/Desktop PWA right from the top bar.</p>
        </div>
        <div class="guide-faq-item">
          <h4>How to ${esc(actionPhrase)} for free?</h4>
          <p>Open ${esc(tool.title)} above, add your files or enter your settings on the right, customize output options if needed, and click "Convert / Run ${esc(tool.title)}" to download your output immediately.</p>
        </div>
        <div class="guide-faq-item">
          <h4>What browsers and devices are supported?</h4>
          <p>Current versions of Google Chrome, Microsoft Edge, Firefox, Safari, Windows Desktop, and Android phones/tablets are fully supported.</p>
        </div>
        ${extraFaqHtml}
      </div>

      <h3 class="guide-sub-h3">Powerful Features of Our Free ${esc(tool.title)}</h3>
      <p class="guide-body-p">Built for speed, clarity, and strict confidentiality:</p>
      <ul class="guide-bullet-list">
        ${features.map((f) => `<li><strong>${esc(f.label)}:</strong> ${esc(f.text)}</li>`).join('')}
      </ul>

      <h3 class="guide-sub-h3">When ${esc(tool.title)} is useful</h3>
      <p class="guide-body-p">Common everyday situations where ${esc(tool.title)} saves time:</p>
      <ul class="guide-bullet-list">
        ${useCases.map((u) => `<li><strong>${esc(u.label)}:</strong> ${esc(u.text)}</li>`).join('')}
      </ul>

      <h3 class="guide-sub-h3">${esc(tool.title)} online vs desktop apps</h3>
      <p class="guide-body-p">
        Traditional desktop software often requires heavy installers, paid licenses, and manual updates—while many online sites compromise privacy by uploading your personal documents to remote servers with file-size caps. ${esc(tool.title)} on All Online PDF Tools gives you the best of both worlds: instant zero-install access in any browser combined with 100% local on-device execution.
      </p>

      <h3 class="guide-sub-h3">Tips for Best Results When Using ${esc(tool.title)}</h3>
      <ul class="guide-bullet-list">
        ${tips.map((t) => `<li>${esc(t)}</li>`).join('')}
      </ul>

      <h3 class="guide-sub-h3">Try ${esc(tool.title)} on All Online PDF Tools</h3>
      <p class="guide-body-p">
        Ready to finish your task in seconds? Scroll back up to the ${esc(tool.title)} studio to run unlimited free conversions right inside your browser—with total privacy and zero watermarks.
      </p>
      <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin:0.75rem 0 1.4rem;">
        <button type="button" class="btn-orange-header js-scroll-studio-top">↑ Start Using ${esc(tool.title)}</button>
        <button type="button" class="btn-secondary js-browse-all-tools">← Browse All ${allTools.length}+ Tools</button>
      </div>

      <h3 class="guide-sub-h3">Related Tools You Might Need</h3>
      <p class="guide-body-p">
        After using ${esc(tool.title)}, you may also find these free tools helpful: ${relatedLinksHtml}.
      </p>
      <div class="guide-related-grid">
        ${relatedChipsHtml}
      </div>
    </article>
  `;
}
