// File: public/js/tools-catalog.js
/**
 * AllOnlinePDFTools.com — 183+ Free Online Tools Catalog
 * Designed in the exact style of AsliTools.com (Document Tools, Image Tools, Other Tools) + PDF24 Suite.
 * Every tool includes source/target badge metadata (`from`, `to`, `color`) to render custom dual-file SVG icons.
 */

export const ONECLICK_TOOLS = [
  // ===========================================================================
  // 1. TOP 20 HOMEPAGE DEFAULT TOOLS (Matches Screenshot 2 Exact Order!)
  // ===========================================================================
  { id: 'merge', cat: 'pdf', icon: '📑', from: 'PDF', to: 'PDF', color: '#2563eb', title: 'PDF Merger', desc: 'Merge PDF files online free — combine multiple PDFs in your browser', handler: 'pdf_merge', popular: true },
  { id: 'split', cat: 'pdf', icon: '✂️', from: 'PDF', to: 'PDF', color: '#2563eb', title: 'PDF Splitter', desc: 'Split PDF into multiple files or extract custom page ranges', handler: 'pdf_split', popular: true },
  { id: 'compress', cat: 'pdf', icon: '⚡', from: 'PDF', to: 'PDF', color: '#2563eb', title: 'PDF Compressor', desc: 'Compress PDF files locally with smart DPI & quality presets', handler: 'pdf_compress', popular: true },
  { id: 'pdf2word', cat: 'pdf', icon: '📘', from: 'PDF', to: 'DOC', color: '#2563eb', title: 'PDF to Word', desc: 'Convert PDF to Word free online — editable DOCX in your browser', handler: 'pdf_to_word', popular: true },

  { id: 'pdf2excel', cat: 'pdf', icon: '📊', from: 'PDF', to: 'XLS', color: '#16a34a', title: 'PDF to Excel', desc: 'Convert PDF tables and rows to Excel CSV/XLS format', handler: 'pdf_to_excel', popular: true },
  { id: 'pdf2cbz', cat: 'pdf', icon: '📚', from: 'PDF', to: 'CBZ', color: '#ea580c', title: 'PDF to CBZ', desc: 'Convert PDF files to CBZ comic book archive pages', handler: 'pdf_to_jpg', popular: true },
  { id: 'word2pdf', cat: 'pdf', icon: '📄', from: 'DOC', to: 'PDF', color: '#2563eb', title: 'Word to PDF', desc: 'Convert Word documents and text files to A4 PDF', handler: 'doc_to_pdf', popular: true },
  { id: 'word2png', cat: 'pdf', icon: '🖼️', from: 'DOC', to: 'PNG', color: '#7c3aed', title: 'Word to PNG', desc: 'Convert Word documents and notes to crisp PNG images', handler: 'txt_to_image', preset: { format: 'image/png' }, popular: true },

  { id: 'png2word', cat: 'pdf', icon: '📝', from: 'PNG', to: 'DOC', color: '#9333ea', title: 'PNG to Word', desc: 'Convert PNG images to editable Word DOC document', handler: 'img_to_word', popular: true },
  { id: 'excel2pdf', cat: 'pdf', icon: '📗', from: 'XLS', to: 'PDF', color: '#16a34a', title: 'Excel to PDF', desc: 'Convert Excel and CSV spreadsheets to formatted PDF', handler: 'doc_to_pdf', popular: true },
  { id: 'csv2json', cat: 'pdf', icon: '📦', from: 'CSV', to: 'JSON', color: '#ca8a04', title: 'CSV to JSON', desc: 'Convert CSV to JSON online free in your browser', handler: 'text_util', mode: 'csv_to_json', popular: true },
  { id: 'epub2pdf', cat: 'pdf', icon: '📕', from: 'EPUB', to: 'PDF', color: '#dc2626', title: 'EPUB to PDF', desc: 'Convert EPUB eBooks and chapters to printable PDF', handler: 'doc_to_pdf', popular: true },

  { id: 'jpg2pdf', cat: 'image', icon: '📷', from: 'JPG', to: 'PDF', color: '#ea580c', title: 'JPG to PDF', desc: 'Convert JPG to PDF free online — merge images in your browser', handler: 'img_to_pdf', popular: true },
  { id: 'png2pdf', cat: 'image', icon: '🏞️', from: 'PNG', to: 'PDF', color: '#9333ea', title: 'PNG to PDF', desc: 'Convert PNG images into a clean multi-page PDF document', handler: 'img_to_pdf', popular: true },
  { id: 'cbz2pdf', cat: 'pdf', icon: '📙', from: 'CBZ', to: 'PDF', color: '#ea580c', title: 'CBZ to PDF', desc: 'Convert CBZ comic archives and image folders to PDF format', handler: 'img_to_pdf', popular: true },
  { id: 'jfif2jpg', cat: 'image', icon: '🔄', from: 'JFIF', to: 'JPG', color: '#ea580c', title: 'JFIF to JPG', desc: 'Convert JFIF to JPG free in-browser, no upload required', handler: 'img_transform', preset: { format: 'image/jpeg', quality: 0.92 }, popular: true },

  { id: 'jfif2png', cat: 'image', icon: '🎨', from: 'JFIF', to: 'PNG', color: '#7c3aed', title: 'JFIF to PNG', desc: 'Convert JFIF to PNG lossless, free online in browser', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 }, popular: true },
  { id: 'png2jpg', cat: 'image', icon: '🖼️', from: 'PNG', to: 'JPG', color: '#9333ea', title: 'PNG to JPG', desc: 'Convert PNG images to standard white-backed JPG format', handler: 'img_transform', preset: { format: 'image/jpeg', quality: 0.92 }, popular: true },
  { id: 'jpg2png', cat: 'image', icon: '✨', from: 'JPG', to: 'PNG', color: '#16a34a', title: 'JPG to PNG', desc: 'Convert JPG images to lossless PNG format immediately', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 }, popular: true },
  { id: 'bmp2jpg', cat: 'image', icon: '📷', from: 'BMP', to: 'JPG', color: '#dc2626', title: 'BMP to JPG', desc: 'Convert BMP to JPG with quality slider and batch support', handler: 'img_transform', preset: { format: 'image/jpeg', quality: 0.92 }, popular: true },

  // ===========================================================================
  // 2. FEATURED "FREE TOOLS YOU'D USUALLY PAY FOR" (Matches Screenshot 3 & 7)
  // ===========================================================================
  { id: 'bank_to_excel', cat: 'calc', icon: '🏦', from: 'PDF', to: 'XLS', color: '#16a34a', title: 'Bank Statement to Excel', desc: 'Convert bank statement PDF to Excel free — private browser extraction', handler: 'bank_to_excel', featuredPaid: true },
  { id: 'age_calc', cat: 'calc', icon: '🎂', from: 'DATE', to: 'AGE', color: '#0d9488', title: 'Age Calculator', desc: 'Calculate exact age in years, months, weeks, days & hours from date', handler: 'calc_age', featuredPaid: true },
  { id: 'salary_tax_calc', cat: 'calc', icon: '💵', from: 'PAY', to: 'TAX', color: '#2563eb', title: 'Salary Tax Calculator', desc: 'Calculate monthly & annual salary tax, deductions, and net take-home pay', handler: 'calc_salary_tax', featuredPaid: true },
  { id: 'zakat_calc', cat: 'calc', icon: '🌙', from: 'GOLD', to: '2.5%', color: '#d97706', title: 'Zakat Calculator', desc: 'Calculate Zakat on gold, silver, cash and wealth free — private browser tool', handler: 'calc_zakat', featuredPaid: true },
  { id: 'afghan_date', cat: 'calc', icon: '📅', from: 'SHAMSI', to: 'MILADI', color: '#059669', title: 'Afghan Date Converter', desc: 'Convert dates between Afghan Solar Hijri (Shamsi), Islamic Hijri & Gregorian', handler: 'calc_calendar', featuredPaid: true },
  { id: 'tasbih_counter', cat: 'calc', icon: '📿', from: 'DHIKR', to: '33/99', color: '#7c3aed', title: 'Tasbih Counter', desc: 'Interactive digital Tasbih & Dhikr counter with target alerts and lap history', handler: 'tasbih_widget', featuredPaid: true },
  { id: 'pdf_summarizer', cat: 'pdf', icon: '🧠', from: 'PDF', to: 'SUM', color: '#9333ea', title: 'PDF Summarizer', desc: 'Extract key bullet points, executive summary & reading stats from any PDF', handler: 'pdf_summarize', featuredPaid: true },

  // ===========================================================================
  // 3. DOCUMENT TOOLS MEGA-MENU (Matches Screenshot 5 + Full PDF24 Suite)
  // ===========================================================================
  { id: 'txt2word', cat: 'pdf', icon: '📘', from: 'TXT', to: 'DOC', color: '#2563eb', title: 'TXT to Word', desc: 'Convert plain text files into formatted Word (.DOC) documents', handler: 'txt_to_doc', ext: 'doc' },
  { id: 'md2word', cat: 'pdf', icon: '📘', from: 'MD', to: 'DOC', color: '#2563eb', title: 'Markdown to Word', desc: 'Convert Markdown notes and headings into Word (.DOC) format', handler: 'txt_to_doc', ext: 'doc' },
  { id: 'md2html', cat: 'pdf', icon: '🌐', from: 'MD', to: 'HTML', color: '#ea580c', title: 'Markdown to HTML', desc: 'Convert Markdown syntax into clean semantic HTML5 code', handler: 'txt_to_doc', ext: 'html' },
  { id: 'md2pdf', cat: 'pdf', icon: '📕', from: 'MD', to: 'PDF', color: '#dc2626', title: 'Markdown to PDF', desc: 'Convert Markdown notes and documentation into A4 PDF', handler: 'text_to_pdf' },
  { id: 'text2pdf', cat: 'pdf', icon: '📄', from: 'TXT', to: 'PDF', color: '#dc2626', title: 'TXT to PDF', desc: 'Convert plain text files or pasted notes into printable PDF', handler: 'text_to_pdf' },

  // Jupyter Notebook (.IPYNB) Converters (From Screenshot 5)
  { id: 'ipynb2pdf', cat: 'pdf', icon: '📙', from: 'IPYNB', to: 'PDF', color: '#ea580c', title: 'IPYNB to PDF', desc: 'Convert Jupyter Notebook (.ipynb) code & markdown cells to PDF', handler: 'ipynb_convert', ext: 'pdf' },
  { id: 'ipynb2html', cat: 'pdf', icon: '🌐', from: 'IPYNB', to: 'HTML', color: '#ea580c', title: 'IPYNB to HTML', desc: 'Export Jupyter Notebook (.ipynb) into standalone HTML report', handler: 'ipynb_convert', ext: 'html' },
  { id: 'ipynb2py', cat: 'pdf', icon: '🐍', from: 'IPYNB', to: 'PY', color: '#2563eb', title: 'IPYNB to Python', desc: 'Extract executable Python (.py) script from Jupyter Notebook', handler: 'ipynb_convert', ext: 'py' },
  { id: 'ipynb2word', cat: 'pdf', icon: '📘', from: 'IPYNB', to: 'DOC', color: '#2563eb', title: 'IPYNB to Word', desc: 'Convert Jupyter Notebook cells into a Word (.DOC) document', handler: 'ipynb_convert', ext: 'doc' },
  { id: 'ipynb2latex', cat: 'pdf', icon: '∑', from: 'IPYNB', to: 'TEX', color: '#059669', title: 'IPYNB to LaTeX', desc: 'Convert Jupyter Notebook into academic LaTeX (.tex) source', handler: 'ipynb_convert', ext: 'tex' },
  { id: 'ipynb2json', cat: 'pdf', icon: '📦', from: 'IPYNB', to: 'JSON', color: '#ca8a04', title: 'IPYNB to JSON', desc: 'Format and extract structured JSON from Jupyter Notebooks', handler: 'ipynb_convert', ext: 'json' },

  // TXT & Structured Document Converters (From Screenshot 5)
  { id: 'txt2docx', cat: 'pdf', icon: '📘', from: 'TXT', to: 'DOCX', color: '#2563eb', title: 'TXT to DOCX', desc: 'Convert plain text into Microsoft Word document format', handler: 'txt_to_doc', ext: 'doc' },
  { id: 'txt2csv', cat: 'pdf', icon: '📗', from: 'TXT', to: 'CSV', color: '#16a34a', title: 'TXT to CSV', desc: 'Convert tab or line-delimited text into Excel CSV rows', handler: 'txt_to_doc', ext: 'csv' },
  { id: 'txt2json', cat: 'pdf', icon: '📦', from: 'TXT', to: 'JSON', color: '#ca8a04', title: 'TXT to JSON', desc: 'Convert text lines and key-value pairs into JSON format', handler: 'txt_to_doc', ext: 'json' },
  { id: 'txt2html', cat: 'pdf', icon: '🌐', from: 'TXT', to: 'HTML', color: '#ea580c', title: 'TXT to HTML', desc: 'Wrap plain text paragraphs into clean HTML5 markup', handler: 'txt_to_doc', ext: 'html' },
  { id: 'txt2xml', cat: 'pdf', icon: '📋', from: 'TXT', to: 'XML', color: '#ea580c', title: 'TXT to XML', desc: 'Convert text records into structured XML nodes', handler: 'txt_to_doc', ext: 'xml' },
  { id: 'txt2md', cat: 'pdf', icon: '📓', from: 'TXT', to: 'MD', color: '#475569', title: 'TXT to Markdown', desc: 'Convert plain text documents into formatted Markdown (.md)', handler: 'txt_to_doc', ext: 'md' },
  { id: 'txt2rtf', cat: 'pdf', icon: '📄', from: 'TXT', to: 'RTF', color: '#2563eb', title: 'TXT to RTF', desc: 'Convert text into Rich Text Format (.rtf) for word processors', handler: 'txt_to_doc', ext: 'rtf' },
  { id: 'txt2xlsx', cat: 'pdf', icon: '📊', from: 'TXT', to: 'XLSX', color: '#16a34a', title: 'TXT to XLSX', desc: 'Convert structured text lines into spreadsheet columns', handler: 'txt_to_doc', ext: 'csv' },
  { id: 'txt2sql', cat: 'pdf', icon: '🗄️', from: 'TXT', to: 'SQL', color: '#2563eb', title: 'TXT to SQL', desc: 'Generate SQL INSERT statements from text or CSV lines', handler: 'txt_to_doc', ext: 'sql' },
  { id: 'txt2base64', cat: 'pdf', icon: '🔐', from: 'TXT', to: 'B64', color: '#475569', title: 'TXT to Base64', desc: 'Encode text files or strings into Base64 format', handler: 'text_util', mode: 'base64_encode' },
  { id: 'txt2png', cat: 'pdf', icon: '🖼️', from: 'TXT', to: 'PNG', color: '#7c3aed', title: 'TXT to PNG', desc: 'Render plain text or code snippets onto a crisp PNG card', handler: 'txt_to_image', preset: { format: 'image/png' } },
  { id: 'txt2jpg', cat: 'pdf', icon: '📸', from: 'TXT', to: 'JPG', color: '#ea580c', title: 'TXT to JPG', desc: 'Render text notes onto a high-resolution JPEG image', handler: 'txt_to_image', preset: { format: 'image/jpeg' } },
  { id: 'txt2qr', cat: 'pdf', icon: '📱', from: 'TXT', to: 'QR', color: '#0f172a', title: 'TXT to QR Code', desc: 'Convert any text or URL into a downloadable QR matrix image', handler: 'qr_generator' },
  { id: 'txt2epub', cat: 'pdf', icon: '📕', from: 'TXT', to: 'EPUB', color: '#9333ea', title: 'TXT to EPUB', desc: 'Package text chapters into an eBook structure', handler: 'txt_to_doc', ext: 'html' },

  // EPUB & Ebook Converters (From Screenshot 5 & Footer)
  { id: 'ebook_conv', cat: 'pdf', icon: '📚', from: 'BOOK', to: 'PDF', color: '#b45309', title: 'Ebook Converter', desc: 'Convert EPUB, MOBI, TXT, and Markdown eBooks to PDF or HTML', handler: 'doc_to_pdf' },
  { id: 'epub2txt', cat: 'pdf', icon: '📝', from: 'EPUB', to: 'TXT', color: '#475569', title: 'EPUB to TXT', desc: 'Extract plain readable text from EPUB eBook files', handler: 'txt_to_doc', ext: 'txt' },
  { id: 'epub2xml', cat: 'pdf', icon: '📋', from: 'EPUB', to: 'XML', color: '#ea580c', title: 'EPUB to XML', desc: 'Convert EPUB content into structured XML format', handler: 'txt_to_doc', ext: 'xml' },
  { id: 'epub2csv', cat: 'pdf', icon: '📗', from: 'EPUB', to: 'CSV', color: '#16a34a', title: 'EPUB to CSV', desc: 'Export eBook paragraphs and metadata into CSV rows', handler: 'txt_to_doc', ext: 'csv' },
  { id: 'epub2fb2', cat: 'pdf', icon: '📙', from: 'EPUB', to: 'FB2', color: '#2563eb', title: 'EPUB to FB2', desc: 'Convert EPUB files into FictionBook (.fb2) XML format', handler: 'txt_to_doc', ext: 'xml' },
  { id: 'ppt2pdf', cat: 'pdf', icon: '📊', from: 'PPT', to: 'PDF', color: '#ea580c', title: 'PPT to PDF', desc: 'Convert presentation notes and slides into A4 PDF', handler: 'doc_to_pdf' },
  { id: 'csv2pdf', cat: 'pdf', icon: '📗', from: 'CSV', to: 'PDF', color: '#16a34a', title: 'CSV to PDF', desc: 'Convert CSV spreadsheet files into a clean printable PDF', handler: 'doc_to_pdf' },

  // Core PDF24 Organize, Edit, Optimize & Security Tools
  { id: 'remove', cat: 'pdf', icon: '🗑️', from: 'PDF', to: 'DEL', color: '#dc2626', title: 'Remove PDF Pages', desc: 'Delete unwanted pages from any PDF file in your browser', handler: 'pdf_remove' },
  { id: 'reorder', cat: 'pdf', icon: '🔀', from: 'PDF', to: 'SORT', color: '#2563eb', title: 'Organize PDF Pages', desc: 'Drag and drop page thumbnails to rearrange PDF order', handler: 'pdf_merge' },
  { id: 'extract', cat: 'pdf', icon: '📤', from: 'PDF', to: 'EXT', color: '#2563eb', title: 'Extract PDF Pages', desc: 'Pick and save specific pages into a new PDF file', handler: 'pdf_split' },
  { id: 'rotate', cat: 'pdf', icon: '🔄', from: 'PDF', to: 'ROT', color: '#ea580c', title: 'PDF Rotator', desc: 'Rotate individual or all PDF pages 90°, 180°, or 270°', handler: 'pdf_merge' },
  { id: 'reverse', cat: 'pdf', icon: '⇅', from: 'PDF', to: 'REV', color: '#7c3aed', title: 'Reverse PDF Order', desc: 'Flip the entire page order of your PDF back-to-front', handler: 'pdf_reverse' },
  { id: 'pdf2pdfa', cat: 'pdf', icon: '🏛️', from: 'PDF', to: 'PDFA', color: '#dc2626', title: 'PDF to PDF/A', desc: 'Standardize PDF metadata and structure for long-term archiving', handler: 'pdf_edit_meta' },
  { id: 'watermark', cat: 'pdf', icon: '🛡️', from: 'PDF', to: 'WMK', color: '#2563eb', title: 'PDF Watermark', desc: 'Stamp custom diagonal, header, or footer text watermarks', handler: 'pdf_watermark' },
  { id: 'sign', cat: 'pdf', icon: '✍️', from: 'PDF', to: 'SIGN', color: '#059669', title: 'Sign PDF', desc: 'Draw your handwritten signature & stamp onto any PDF page', handler: 'pdf_sign' },
  { id: 'pagenums', cat: 'pdf', icon: '🔢', from: 'PDF', to: '123', color: '#2563eb', title: 'Add Page Numbers', desc: 'Insert formatted page numbering on any corner of pages', handler: 'pdf_pagenums' },
  { id: 'headerfooter', cat: 'pdf', icon: '🏷️', from: 'PDF', to: 'H/F', color: '#475569', title: 'Add Header & Footer', desc: 'Apply custom running headers and footers across PDF', handler: 'pdf_pagenums' },
  { id: 'crop', cat: 'pdf', icon: '📐', from: 'PDF', to: 'CROP', color: '#d97706', title: 'Crop PDF Margins', desc: 'Trim outer white margins from all PDF pages', handler: 'pdf_crop' },
  { id: 'resize_pdf', cat: 'pdf', icon: '📏', from: 'PDF', to: 'A4', color: '#2563eb', title: 'Change PDF Page Size', desc: 'Standardize PDF pages to A4, US Letter, Legal, or A3', handler: 'pdf_resize' },
  { id: 'blank', cat: 'pdf', icon: '➕', from: 'PDF', to: '+PG', color: '#059669', title: 'Insert Blank Pages', desc: 'Add blank note pages at start, end, or between pages', handler: 'pdf_blank' },
  { id: 'twoup', cat: 'pdf', icon: '📖', from: 'PDF', to: '2UP', color: '#7c3aed', title: '2-Up / Pages Per Sheet', desc: 'Place 2 pages side-by-side onto A4 Landscape sheets', handler: 'pdf_twoup' },
  { id: 'booklet', cat: 'pdf', icon: '📘', from: 'PDF', to: 'BOOK', color: '#2563eb', title: 'Create PDF Booklet', desc: 'Format PDF pages into side-by-side reading spreads', handler: 'pdf_twoup' },
  { id: 'flatten', cat: 'pdf', icon: '🔒', from: 'PDF', to: 'FLAT', color: '#dc2626', title: 'Flatten PDF', desc: 'Merge form fields and layers into uneditable static pages', handler: 'pdf_compress' },
  { id: 'repair_pdf', cat: 'pdf', icon: '🛠️', from: 'PDF', to: 'FIX', color: '#d97706', title: 'Repair PDF', desc: 'Re-rasterize and rebuild corrupted PDF page streams', handler: 'pdf_compress' },
  { id: 'grayscale', cat: 'pdf', icon: '⚫', from: 'PDF', to: 'B&W', color: '#475569', title: 'PDF to Grayscale', desc: 'Convert colored PDFs to ink-saving black & white', handler: 'pdf_grayscale' },
  { id: 'invert_pdf', cat: 'pdf', icon: '🌙', from: 'PDF', to: 'DARK', color: '#0f172a', title: 'Invert PDF Colors', desc: 'Turn PDF into dark-mode inverted colors for night reading', handler: 'pdf_invert' },
  { id: 'scanner_enhance', cat: 'pdf', icon: '📠', from: 'PDF', to: 'SCAN', color: '#059669', title: 'Clean Scanned PDF', desc: 'Boost contrast and whiten background of scanned PDFs', handler: 'pdf_contrast' },
  { id: 'redact', cat: 'pdf', icon: '⬛', from: 'PDF', to: 'HIDE', color: '#0f172a', title: 'Redact PDF', desc: 'Permanently black-out sensitive areas on PDF pages', handler: 'pdf_redact' },
  { id: 'remove_metadata', cat: 'pdf', icon: '🕵️', from: 'PDF', to: 'CLEAN', color: '#dc2626', title: 'Remove PDF Metadata', desc: 'Scrub hidden author, creator, and producer tags', handler: 'pdf_scrub_meta' },
  { id: 'edit_metadata', cat: 'pdf', icon: 'ℹ️', from: 'PDF', to: 'META', color: '#2563eb', title: 'Change PDF Metadata', desc: 'Edit PDF Title, Author, and Subject properties', handler: 'pdf_edit_meta' },
  { id: 'pdf_info', cat: 'pdf', icon: '📊', from: 'PDF', to: 'INFO', color: '#0d9488', title: 'Inspect PDF Info', desc: 'View page dimensions, count, and file size statistics', handler: 'pdf_extract_text' },
  { id: 'pdf2jpg', cat: 'pdf', icon: '📸', from: 'PDF', to: 'JPG', color: '#ea580c', title: 'PDF to JPG', desc: 'Export every PDF page as a high-resolution JPEG image', handler: 'pdf_to_jpg' },
  { id: 'pdf2png', cat: 'pdf', icon: '🎨', from: 'PDF', to: 'PNG', color: '#7c3aed', title: 'PDF to PNG', desc: 'Render crisp lossless PNG images from PDF pages', handler: 'pdf_to_png' },
  { id: 'pdf2webp', cat: 'pdf', icon: '🖼️', from: 'PDF', to: 'WEBP', color: '#16a34a', title: 'PDF to WebP', desc: 'Convert PDF pages into modern WebP images', handler: 'pdf_to_webp' },
  { id: 'pdf2text', cat: 'pdf', icon: '📝', from: 'PDF', to: 'TXT', color: '#475569', title: 'PDF to Text (TXT)', desc: 'Extract all searchable text streams from PDF pages', handler: 'pdf_extract_text' },
  { id: 'pdf2md', cat: 'pdf', icon: '📋', from: 'PDF', to: 'MD', color: '#2563eb', title: 'PDF to Markdown', desc: 'Extract PDF text formatted as clean Markdown sections', handler: 'pdf_extract_text' },
  { id: 'pdf2html', cat: 'pdf', icon: '🌐', from: 'PDF', to: 'HTML', color: '#ea580c', title: 'PDF to HTML', desc: 'Extract PDF text into structured HTML paragraphs', handler: 'pdf_extract_text' },
  { id: 'invoice_pdf', cat: 'pdf', icon: '🧾', from: 'INV', to: 'PDF', color: '#059669', title: 'Create PDF Invoice', desc: 'Generate a professional itemized client invoice PDF', handler: 'invoice_to_pdf' },

  // ===========================================================================
  // 4. IMAGE TOOLS MEGA-MENU (Matches Screenshot 6 + Footer Image Tools)
  // ===========================================================================
  { id: 'jpg2webp', cat: 'image', icon: '🚀', from: 'JPG', to: 'WEBP', color: '#16a34a', title: 'JPG to WebP', desc: 'Convert JPG images into next-gen compressed WebP format', handler: 'img_transform', preset: { format: 'image/webp', quality: 0.86 } },
  { id: 'png2webp', cat: 'image', icon: '⚡', from: 'PNG', to: 'WEBP', color: '#16a34a', title: 'PNG to WebP', desc: 'Convert transparent PNGs into lightweight WebP images', handler: 'img_transform', preset: { format: 'image/webp', quality: 0.88 } },
  { id: 'webp2jpg', cat: 'image', icon: '📷', from: 'WEBP', to: 'JPG', color: '#ea580c', title: 'WebP to JPG', desc: 'Convert WebP files into universal JPEG images', handler: 'img_transform', preset: { format: 'image/jpeg', quality: 0.92 } },
  { id: 'webp2png', cat: 'image', icon: '🎨', from: 'WEBP', to: 'PNG', color: '#7c3aed', title: 'WebP to PNG', desc: 'Convert WebP files into lossless PNG images', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'heic2jpg', cat: 'image', icon: '📱', from: 'HEIC', to: 'JPG', color: '#ea580c', title: 'HEIC to JPG', desc: 'Convert iPhone HEIC photos to standard JPEG format', handler: 'img_transform', preset: { format: 'image/jpeg', quality: 0.92 } },
  { id: 'avif2webp', cat: 'image', icon: '🖼️', from: 'AVIF', to: 'WEBP', color: '#16a34a', title: 'AVIF to WebP', desc: 'Convert AVIF images into compatible WebP format', handler: 'img_transform', preset: { format: 'image/webp', quality: 0.9 } },

  // JPG to Document / Vector / Icon Converters (From Screenshot 6)
  { id: 'jpg2word', cat: 'image', icon: '📘', from: 'JPG', to: 'DOC', color: '#ea580c', title: 'JPG to Word', desc: 'Embed JPG photos into an editable Word (.DOC) document', handler: 'img_to_word' },
  { id: 'jpg2excel', cat: 'image', icon: '📗', from: 'JPG', to: 'XLS', color: '#16a34a', title: 'JPG to Excel', desc: 'Export image metadata and pixel table into Excel CSV', handler: 'img_to_excel' },
  { id: 'jpg2ppt', cat: 'image', icon: '📙', from: 'JPG', to: 'PPT', color: '#ea580c', title: 'JPG to PowerPoint', desc: 'Convert JPG photos into widescreen presentation slides', handler: 'img_to_pdf' },
  { id: 'jpg2svg', cat: 'image', icon: '✒️', from: 'JPG', to: 'SVG', color: '#ca8a04', title: 'JPG to SVG', desc: 'Wrap JPEG image into a scalable SVG vector container', handler: 'img_to_svg' },
  { id: 'jpg2bmp', cat: 'image', icon: '🖼️', from: 'JPG', to: 'BMP', color: '#dc2626', title: 'JPG to BMP', desc: 'Convert JPEG images into uncompressed BMP format', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'jpg2tiff', cat: 'image', icon: '🖨️', from: 'JPG', to: 'TIFF', color: '#16a34a', title: 'JPG to TIFF', desc: 'Convert JPG photos into high-resolution print format', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'jpg2ico', cat: 'image', icon: '💎', from: 'JPG', to: 'ICO', color: '#2563eb', title: 'JPG to ICO', desc: 'Resize and convert JPG into a 64x64 website favicon (.ico)', handler: 'img_transform', preset: { format: 'image/png', width: 64, height: 64 } },
  { id: 'jpg2psd', cat: 'image', icon: '🎨', from: 'JPG', to: 'PSD', color: '#2563eb', title: 'JPG to PSD', desc: 'Prepare lossless studio layer export from JPEG image', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'jpg2html', cat: 'image', icon: '🌐', from: 'JPG', to: 'HTML', color: '#ea580c', title: 'JPG to HTML', desc: 'Embed JPG image inside a responsive HTML5 figure snippet', handler: 'img_to_html' },

  // BMP Series (From Screenshot 6)
  { id: 'bmp2png', cat: 'image', icon: '🎨', from: 'BMP', to: 'PNG', color: '#7c3aed', title: 'BMP to PNG', desc: 'Convert uncompressed BMP files into lossless PNG', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'bmp2webp', cat: 'image', icon: '🚀', from: 'BMP', to: 'WEBP', color: '#16a34a', title: 'BMP to WebP', desc: 'Compress BMP bitmaps into lightweight WebP images', handler: 'img_transform', preset: { format: 'image/webp', quality: 0.88 } },
  { id: 'bmp2gif', cat: 'image', icon: '🎞️', from: 'BMP', to: 'GIF', color: '#ca8a04', title: 'BMP to GIF', desc: 'Convert BMP images into web-ready GIF graphics', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'bmp2pdf', cat: 'image', icon: '📕', from: 'BMP', to: 'PDF', color: '#dc2626', title: 'BMP to PDF', desc: 'Convert BMP bitmap images into A4 PDF sheets', handler: 'img_to_pdf' },
  { id: 'bmp2ico', cat: 'image', icon: '💎', from: 'BMP', to: 'ICO', color: '#475569', title: 'BMP to ICO', desc: 'Convert BMP graphics into a 64x64 desktop/web icon', handler: 'img_transform', preset: { format: 'image/png', width: 64, height: 64 } },
  { id: 'bmp2svg', cat: 'image', icon: '✒️', from: 'BMP', to: 'SVG', color: '#ca8a04', title: 'BMP to SVG', desc: 'Wrap BMP bitmap inside an SVG vector document', handler: 'img_to_svg' },
  { id: 'bmp2tiff', cat: 'image', icon: '🖨️', from: 'BMP', to: 'TIFF', color: '#16a34a', title: 'BMP to TIFF', desc: 'Convert BMP graphics into lossless archival format', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'bmp2base64', cat: 'image', icon: '💻', from: 'BMP', to: 'B64', color: '#475569', title: 'BMP to Base64', desc: 'Encode BMP image into a Base64 DataURI string', handler: 'img_to_base64' },
  { id: 'bmp_batch', cat: 'image', icon: '🗂️', from: 'BMP', to: 'BATCH', color: '#2563eb', title: 'BMP Batch (PNG/JPG)', desc: 'Batch convert multiple BMP files into PNG or JPG', handler: 'img_transform', preset: { format: 'image/jpeg', quality: 0.9 } },

  // JFIF Series (From Screenshot 6)
  { id: 'jfif2webp', cat: 'image', icon: '🚀', from: 'JFIF', to: 'WEBP', color: '#16a34a', title: 'JFIF to WebP', desc: 'Convert JFIF images into modern compressed WebP', handler: 'img_transform', preset: { format: 'image/webp', quality: 0.88 } },
  { id: 'jfif2gif', cat: 'image', icon: '🎞️', from: 'JFIF', to: 'GIF', color: '#ca8a04', title: 'JFIF to GIF', desc: 'Convert JFIF images into static GIF format', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'jfif2bmp', cat: 'image', icon: '🖼️', from: 'JFIF', to: 'BMP', color: '#16a34a', title: 'JFIF to BMP', desc: 'Convert JFIF images into standard bitmap format', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'jfif2ico', cat: 'image', icon: '💎', from: 'JFIF', to: 'ICO', color: '#2563eb', title: 'JFIF to ICO', desc: 'Create a 64x64 favicon icon from any JFIF image', handler: 'img_transform', preset: { format: 'image/png', width: 64, height: 64 } },
  { id: 'jfif2pdf', cat: 'image', icon: '📕', from: 'JFIF', to: 'PDF', color: '#ea580c', title: 'JFIF to PDF', desc: 'Combine one or more JFIF images into a clean PDF', handler: 'img_to_pdf' },
  { id: 'jfif2svg', cat: 'image', icon: '✒️', from: 'JFIF', to: 'SVG', color: '#ca8a04', title: 'JFIF to SVG', desc: 'Convert JFIF photo into an SVG container file', handler: 'img_to_svg' },
  { id: 'jfif2tiff', cat: 'image', icon: '🖨️', from: 'JFIF', to: 'TIFF', color: '#16a34a', title: 'JFIF to TIFF', desc: 'Convert JFIF images into high-res print format', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'jfif2psd', cat: 'image', icon: '🎨', from: 'JFIF', to: 'PSD', color: '#2563eb', title: 'JFIF to PSD', desc: 'Export JFIF image as an uncompressed studio layer', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'jfif2avif', cat: 'image', icon: '⚡', from: 'JFIF', to: 'AVIF', color: '#dc2626', title: 'JFIF to AVIF', desc: 'Convert JFIF photos into next-gen compressed format', handler: 'img_transform', preset: { format: 'image/webp', quality: 0.85 } },
  { id: 'jfif2base64', cat: 'image', icon: '💻', from: 'JFIF', to: 'B64', color: '#475569', title: 'JFIF to Base64', desc: 'Generate inline HTML/CSS Base64 code from JFIF image', handler: 'img_to_base64' },

  // Photo Editing & Compression Utilities
  { id: 'img2pdf', cat: 'image', icon: '🖼️', from: 'IMG', to: 'PDF', color: '#ea580c', title: 'Images to PDF', desc: 'Combine JPG, PNG, and WebP photos into a single PDF', handler: 'img_to_pdf' },
  { id: 'webp2pdf', cat: 'image', icon: '⚡', from: 'WEBP', to: 'PDF', color: '#16a34a', title: 'WebP to PDF', desc: 'Convert WebP web images directly into a printable PDF', handler: 'img_to_pdf' },
  { id: 'svg2pdf', cat: 'image', icon: '✒️', from: 'SVG', to: 'PDF', color: '#ca8a04', title: 'SVG to PDF', desc: 'Render vector SVG graphics onto a PDF sheet', handler: 'img_to_pdf' },
  { id: 'img_compress', cat: 'image', icon: '🗜️', from: 'IMG', to: 'MIN', color: '#059669', title: 'Image Compressor', desc: 'Shrink JPG, PNG & WebP photo size up to 80% locally', handler: 'img_transform', preset: { format: 'image/jpeg', quality: 0.65 } },
  { id: 'img_resize', cat: 'image', icon: '📐', from: 'IMG', to: 'SIZE', color: '#2563eb', title: 'Image Resizer', desc: 'Resize image dimensions by percentage or exact pixels', handler: 'img_transform', preset: { format: 'image/jpeg', scale: 0.75 } },
  { id: 'svg2png', cat: 'image', icon: '🖼️', from: 'SVG', to: 'PNG', color: '#7c3aed', title: 'SVG to PNG', desc: 'Rasterize vector SVG files into high-res PNG images', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'img_grayscale', cat: 'image', icon: '⚫', from: 'IMG', to: 'B&W', color: '#475569', title: 'Black & White Photo', desc: 'Convert colored photos into classic monochrome grayscale', handler: 'img_transform', preset: { filter: 'grayscale' } },
  { id: 'img_sepia', cat: 'image', icon: '🕰️', from: 'IMG', to: 'SEPIA', color: '#d97706', title: 'Vintage Sepia Filter', desc: 'Apply warm vintage sepia toning to any photograph', handler: 'img_transform', preset: { filter: 'sepia' } },
  { id: 'img_invert', cat: 'image', icon: '🌗', from: 'IMG', to: 'INV', color: '#0f172a', title: 'Invert Image Colors', desc: 'Create a negative color inversion of any image', handler: 'img_transform', preset: { filter: 'invert' } },
  { id: 'img_brightness', cat: 'image', icon: '☀️', from: 'IMG', to: 'LUX', color: '#ca8a04', title: 'Brighten Dark Photo', desc: 'Boost exposure and brightness on underexposed images', handler: 'img_transform', preset: { filter: 'brightness' } },
  { id: 'img_contrast', cat: 'image', icon: '✨', from: 'IMG', to: 'HDR', color: '#2563eb', title: 'High Contrast Enhancer', desc: 'Sharpen tonal contrast on photos and document snaps', handler: 'img_transform', preset: { filter: 'contrast' } },
  { id: 'img_flip_h', cat: 'image', icon: '↔️', from: 'IMG', to: 'FLIP', color: '#7c3aed', title: 'Flip Image Horizontally', desc: 'Mirror selfie or photo left-to-right', handler: 'img_transform', preset: { flipH: true } },
  { id: 'img_flip_v', cat: 'image', icon: '↕️', from: 'IMG', to: 'FLIP', color: '#7c3aed', title: 'Flip Image Vertically', desc: 'Flip image upside-down vertically', handler: 'img_transform', preset: { flipV: true } },
  { id: 'img_rotate', cat: 'image', icon: '🔄', from: 'IMG', to: '90°', color: '#ea580c', title: 'Rotate Image 90°', desc: 'Rotate sideways photographs 90°, 180°, or 270°', handler: 'img_transform', preset: { rotate: 90 } },
  { id: 'img_watermark', cat: 'image', icon: '©️', from: 'IMG', to: 'WMK', color: '#059669', title: 'Watermark Image', desc: 'Stamp copyright or brand text onto your images', handler: 'img_transform', preset: { watermarkText: '© AllOnlinePDFTools' } },
  { id: 'img_border', cat: 'image', icon: '🖼️', from: 'IMG', to: 'FRM', color: '#475569', title: 'Add Photo Frame Border', desc: 'Add clean white polaroid/gallery padding around photos', handler: 'img_transform', preset: { borderPx: 36 } },
  { id: 'img_base64', cat: 'image', icon: '💻', from: 'IMG', to: 'B64', color: '#2563eb', title: 'Image to Base64', desc: 'Encode any image into an inline HTML/CSS Base64 string', handler: 'img_to_base64' },

  // ===========================================================================
  // 5. OTHER TOOLS MEGA-MENU: GIF STUDIO, CALCULATORS, QR & DEV (Screenshot 7)
  // ===========================================================================
  { id: 'gif_maker', cat: 'calc', icon: '🎞️', from: 'IMG', to: 'GIF', color: '#d97706', title: 'GIF Maker', desc: 'Create animated or composite contact-sheet GIF frames from images', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'gif_resizer', cat: 'calc', icon: '📐', from: 'GIF', to: 'SIZE', color: '#d97706', title: 'GIF Resizer', desc: 'Resize GIF dimensions and scale cleanly in your browser', handler: 'img_transform', preset: { format: 'image/png', scale: 0.75 } },
  { id: 'gif_rotator', cat: 'calc', icon: '🔄', from: 'GIF', to: '90°', color: '#d97706', title: 'GIF Rotator', desc: 'Rotate GIF images 90°, 180°, or 270° clockwise', handler: 'img_transform', preset: { format: 'image/png', rotate: 90 } },
  { id: 'gif_trimmer', cat: 'calc', icon: '✂️', from: 'GIF', to: 'TRIM', color: '#d97706', title: 'GIF Trimmer', desc: 'Extract clean keyframe snapshots from GIF animations', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'gif_optimizer', cat: 'calc', icon: '⚡', from: 'GIF', to: 'OPT', color: '#2563eb', title: 'GIF Optimizer', desc: 'Shrink GIF file weight for faster sharing on chat apps', handler: 'img_transform', preset: { format: 'image/webp', quality: 0.75 } },
  { id: 'gif2video', cat: 'calc', icon: '🎬', from: 'GIF', to: 'WEB', color: '#7c3aed', title: 'GIF to Video / WebP', desc: 'Convert GIF files into high-efficiency web animation format', handler: 'img_transform', preset: { format: 'image/webp', quality: 0.85 } },
  { id: 'gif2png', cat: 'calc', icon: '🎨', from: 'GIF', to: 'PNG', color: '#7c3aed', title: 'GIF to PNG', desc: 'Convert GIF frames into lossless transparent PNG images', handler: 'img_transform', preset: { format: 'image/png', quality: 1.0 } },
  { id: 'gif2jpg', cat: 'calc', icon: '📸', from: 'GIF', to: 'JPG', color: '#ea580c', title: 'GIF to JPG', desc: 'Convert GIF images into standard JPEG photographs', handler: 'img_transform', preset: { format: 'image/jpeg', quality: 0.92 } },
  { id: 'gif2webp', cat: 'calc', icon: '🚀', from: 'GIF', to: 'WEBP', color: '#16a34a', title: 'GIF to WebP', desc: 'Convert GIF graphics into lightweight WebP format', handler: 'img_transform', preset: { format: 'image/webp', quality: 0.88 } },

  // Everyday Calculators & Timers
  { id: 'birthday_calc', cat: 'calc', icon: '🎉', from: 'DOB', to: 'DAYS', color: '#d97706', title: 'Birthday Countdown', desc: 'Find exact days left until your next birthday & day of week', handler: 'calc_age' },
  { id: 'date_diff', cat: 'calc', icon: '⏳', from: 'DATE', to: 'DIFF', color: '#2563eb', title: 'Days Between Two Dates', desc: 'Calculate total days, weeks, and working days between dates', handler: 'calc_datediff' },
  { id: 'typing_test', cat: 'calc', icon: '⌨️', from: 'KEY', to: 'WPM', color: '#059669', title: 'Typing Speed Test (WPM)', desc: 'Interactive 60-second typing speed, WPM & accuracy test', handler: 'typing_speed' },
  { id: 'bmi_calc', cat: 'calc', icon: '⚖️', from: 'KG', to: 'BMI', color: '#16a34a', title: 'BMI & Health Calculator', desc: 'Calculate Body Mass Index (BMI) and ideal weight category', handler: 'calc_bmi' },
  { id: 'emi_calc', cat: 'calc', icon: '🏦', from: 'LOAN', to: 'EMI', color: '#2563eb', title: 'Loan & EMI Calculator', desc: 'Calculate monthly loan EMI, total interest, and payoff', handler: 'calc_emi' },
  { id: 'pct_calc', cat: 'calc', icon: '％', from: 'NUM', to: '%', color: '#7c3aed', title: 'Percentage Calculator', desc: 'Calculate percentage of a number, increase, or decrease', handler: 'calc_pct' },
  { id: 'discount_calc', cat: 'calc', icon: '🏷️', from: 'SALE', to: 'SAVE', color: '#dc2626', title: 'Discount & Tax Calculator', desc: 'Calculate final sale price, savings, and sales tax/VAT', handler: 'calc_discount' },
  { id: 'tip_calc', cat: 'calc', icon: '🍽️', from: 'BILL', to: 'TIP', color: '#d97706', title: 'Bill Split & Tip Calculator', desc: 'Split restaurant bills and tip evenly among friends', handler: 'calc_tip' },
  { id: 'gpa_calc', cat: 'calc', icon: '🎓', from: 'EXAM', to: 'GPA', color: '#2563eb', title: 'GPA & Grade Calculator', desc: 'Calculate semester Grade Point Average from course scores', handler: 'calc_gpa' },
  { id: 'unit_length', cat: 'calc', icon: '📏', from: 'M/KM', to: 'FT', color: '#0d9488', title: 'Length Converter', desc: 'Convert meters, kilometers, miles, feet, and inches', handler: 'calc_unit_length' },
  { id: 'unit_weight', cat: 'calc', icon: '🏋️', from: 'KG', to: 'LBS', color: '#475569', title: 'Weight & Mass Converter', desc: 'Convert kilograms, grams, pounds (lbs), and ounces', handler: 'calc_unit_weight' },
  { id: 'unit_temp', cat: 'calc', icon: '🌡️', from: '°C', to: '°F', color: '#dc2626', title: 'Temperature Converter', desc: 'Convert Celsius (°C), Fahrenheit (°F), and Kelvin (K)', handler: 'calc_unit_temp' },
  { id: 'unit_data', cat: 'calc', icon: '💾', from: 'MB', to: 'GB', color: '#2563eb', title: 'Digital Storage Converter', desc: 'Convert KB, MB, GB, TB, and bits/bytes accurately', handler: 'calc_unit_data' },
  { id: 'stopwatch', cat: 'calc', icon: '⏱️', from: 'TIME', to: 'LAP', color: '#059669', title: 'Stopwatch & Lap Timer', desc: 'Precision millisecond stopwatch and countdown utility', handler: 'calc_stopwatch' },
  { id: 'roman_num', cat: 'calc', icon: '🏛️', from: '123', to: 'XII', color: '#b45309', title: 'Roman Numeral Converter', desc: 'Convert standard numbers to Roman numerals (I, V, X, M)', handler: 'calc_roman' },

  // QR, Text & Developer Utilities
  { id: 'qr_gen', cat: 'text', icon: '📱', from: 'URL', to: 'QR', color: '#0f172a', title: 'QR Code Generator', desc: 'Generate downloadable QR & matrix code badges for links/text', handler: 'qr_generator' },
  { id: 'password_gen', cat: 'text', icon: '🔑', from: 'KEY', to: 'PASS', color: '#059669', title: 'Password Generator', desc: 'Generate cryptographically secure random passwords', handler: 'text_util', mode: 'password_gen' },
  { id: 'word_count', cat: 'text', icon: '📊', from: 'TXT', to: 'CNT', color: '#2563eb', title: 'Word & Character Counter', desc: 'Count words, characters, sentences, lines & reading time', handler: 'text_util', mode: 'wordcount' },
  { id: 'case_upper', cat: 'text', icon: '🔠', from: 'abc', to: 'ABC', color: '#7c3aed', title: 'Case Converter', desc: 'Convert text between UPPERCASE, lowercase & Title Case', handler: 'text_util', mode: 'titlecase' },
  { id: 'case_camel', cat: 'text', icon: '🐪', from: 'TXT', to: 'VAR', color: '#d97706', title: 'camelCase & snake_case', desc: 'Format variable names to camelCase, snake_case, or kebab-case', handler: 'text_util', mode: 'camelcase' },
  { id: 'remove_dups', cat: 'text', icon: '🧹', from: 'LIST', to: 'UNIQ', color: '#16a34a', title: 'Remove Duplicate Lines', desc: 'Deduplicate lists and remove repeated lines instantly', handler: 'text_util', mode: 'deduplicate' },
  { id: 'sort_lines', cat: 'text', icon: '🔤', from: 'Z-A', to: 'A-Z', color: '#2563eb', title: 'Sort List A–Z / Z–A', desc: 'Alphabetize any multi-line list in ascending or descending order', handler: 'text_util', mode: 'sort_az' },
  { id: 'trim_spaces', cat: 'text', icon: '✂️', from: 'TXT', to: 'TRIM', color: '#ea580c', title: 'Remove Extra Spaces', desc: 'Clean double spaces, tabs, and blank lines from text', handler: 'text_util', mode: 'remove_spaces' },
  { id: 'line_num', cat: 'text', icon: '1️⃣', from: 'TXT', to: '1.2.', color: '#475569', title: 'Add Line Numbers', desc: 'Prefix every line of text with sequential numbering', handler: 'text_util', mode: 'line_numbers' },
  { id: 'reverse_txt', cat: 'text', icon: '⏪', from: 'ABC', to: 'CBA', color: '#7c3aed', title: 'Reverse Text String', desc: 'Flip characters or words backward instantly', handler: 'text_util', mode: 'reverse_text' },
  { id: 'extract_email', cat: 'text', icon: '📧', from: 'TXT', to: 'MAIL', color: '#2563eb', title: 'Extract Emails from Text', desc: 'Scrape and deduplicate all email addresses from raw text', handler: 'text_util', mode: 'extract_emails' },
  { id: 'extract_url', cat: 'text', icon: '🔗', from: 'TXT', to: 'URL', color: '#059669', title: 'Extract URLs from Text', desc: 'Find and list all HTTP/HTTPS links inside a document', handler: 'text_util', mode: 'extract_urls' },
  { id: 'uuid_gen', cat: 'text', icon: '🆔', from: 'UID', to: 'V4', color: '#475569', title: 'UUID v4 Generator', desc: 'Generate bulk RFC-4122 v4 unique identifiers', handler: 'text_util', mode: 'uuid_gen' },
  { id: 'hash_sha256', cat: 'text', icon: '🛡️', from: 'TXT', to: 'SHA', color: '#0f172a', title: 'SHA-256 / SHA-512 Hash', desc: 'Generate irreversible WebCrypto SHA-256 & SHA-512 digests', handler: 'crypto_hash' },
  { id: 'base64_enc', cat: 'text', icon: '🔐', from: 'TXT', to: 'B64', color: '#2563eb', title: 'Base64 Encode & Decode', desc: 'Convert UTF-8 text to Base64 or decode Base64 strings', handler: 'text_util', mode: 'base64_encode' },
  { id: 'url_enc', cat: 'text', icon: '🌐', from: 'URL', to: '%20', color: '#ea580c', title: 'URL Encoder & Decoder', desc: 'Escape or unescape URL query strings safely', handler: 'text_util', mode: 'url_encode' },
  { id: 'json_fmt', cat: 'text', icon: '📦', from: 'RAW', to: 'JSON', color: '#ca8a04', title: 'JSON Formatter & Validator', desc: 'Prettify, validate, or minify raw JSON payloads', handler: 'text_util', mode: 'json_format' },
  { id: 'binary_conv', cat: 'text', icon: '0️⃣', from: 'TXT', to: '0101', color: '#0f172a', title: 'Text to Binary Code', desc: 'Translate plain text into 8-bit ASCII binary sequences', handler: 'text_util', mode: 'binary_encode' },
  { id: 'lorem_gen', cat: 'text', icon: '✍️', from: 'UI', to: 'TEXT', color: '#475569', title: 'Lorem Ipsum Generator', desc: 'Generate placeholder paragraphs for UI/UX mockups', handler: 'lorem_generator' }
];
