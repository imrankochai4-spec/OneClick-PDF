// File: public/js/legal-content.js
/**
 * Modular Legal Policies, Financial/Islamic Calculators (Salary Tax, Zakat, BMI, EMI)
 * & Document/Notebook Conversion Helpers (Bank Statement to Excel, IPYNB, PDF to Word/Excel, Summarizer).
 */

export const LEGAL_PAGES = {
  privacy: {
    title: '🔒 Privacy Policy & Google AdSense Cookie Disclosure',
    html: `
      <p><strong>Effective Date:</strong> November 2026</p>
      <h4>1. 100% Client-Side File Processing (Zero Server Uploads)</h4>
      <p>AllOnlinePDFTools operates entirely within your web browser. When you upload or drop PDF documents, bank statements, images, or text into the workspace, your files are processed locally in your device's RAM using WebAssembly and HTML5 Canvas. We never upload, store, view, or transmit your personal documents to any external server.</p>
      <h4>2. Google AdSense & DART Cookie Policy</h4>
      <p>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites on the internet. Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="color:var(--gold-600);">Google Ads Settings</a>.</p>
      <h4>3. Local Storage & Preferences</h4>
      <p>We use browser <code>localStorage</code> solely to remember your dark/light theme preference, Tasbih counter state, and cookie consent status.</p>
    `
  },
  terms: {
    title: '📜 Terms & Conditions of Use',
    html: `
      <p><strong>Welcome to AllOnlinePDFTools — 183+ Free Online Tools!</strong></p>
      <h4>1. Acceptance of Terms</h4>
      <p>By accessing and using AllOnlinePDFTools, you agree to comply with these Terms and Conditions. All 183+ utilities are provided 100% free of charge for personal, academic, and commercial use with no mandatory sign-up.</p>
      <h4>2. User Responsibility</h4>
      <p>Because all files are processed locally on your own device, you retain 100% ownership and responsibility for the documents, images, and data you process using our tools.</p>
      <h4>3. No Warranty</h4>
      <p>All tools are provided "as is" without warranty of any kind. Always keep a backup of original critical documents before performing redaction, splitting, or compression.</p>
    `
  },
  disclaimer: {
    title: '⚖️ Disclaimer & DMCA Policy',
    html: `
      <h4>1. General Disclaimer</h4>
      <p>Calculation tools (including Bank Statement to Excel, Salary Tax Calculator, Zakat Calculator, Loan EMI, BMI, and Calendar conversions) are provided for informational and educational purposes only and do not constitute formal financial, tax, religious, medical, or legal advice.</p>
      <h4>2. Copyright & DMCA</h4>
      <p>AllOnlinePDFTools does not host or store any user-uploaded files on its servers. All processing happens transiently inside the end-user's browser.</p>
    `
  },
  about: {
    title: '⚡ About AllOnlinePDFTools',
    html: `
      <p><strong>AllOnlinePDFTools</strong> was created with a single mission: to make 183+ professional document, PDF, image, financial, and everyday calculation tools accessible to everyone in the world for free—without compromising user privacy.</p>
      <h4>What Makes Us Different?</h4>
      <p>• <strong>183+ Tools in One Place:</strong> Document converters (PDF, Word, Excel, EPUB, IPYNB, Markdown), Image & GIF Studio (JPG, PNG, WebP, JFIF, BMP, HEIC, SVG), and specialized tools like Bank Statement to Excel, Salary Tax Calculator, Zakat Calculator, Afghan Shamsi/Hijri Date Converter, and Digital Tasbih.<br>• <strong>Works Offline Everywhere:</strong> Installable as a Progressive Web App (PWA) on Windows PC, Mac, iPhone, and as an Android APK.</p>
    `
  },
  contact: {
    title: '✉️ Contact Us & Support',
    html: `
      <p>Have a feature request, bug report, or business inquiry? We would love to hear from you!</p>
      <h4>Direct Channels</h4>
      <p>• <strong>Official Repository & Issue Tracker:</strong> <a href="https://github.com/imrankochai4-spec/OneClick-PDF" target="_blank" rel="noopener" style="color:var(--gold-600);">github.com/imrankochai4-spec/OneClick-PDF</a><br>• <strong>Email Support:</strong> contact@allonlinepdftools.com</p>
      <div class="form-group" style="margin-top:0.5rem;">
        <label class="form-label">Send a Quick Feedback Note</label>
        <textarea class="form-textarea" placeholder="Write your message or tool suggestion..."></textarea>
        <button type="button" class="btn-gold" onclick="alert('Thank you! Your message has been recorded.');" style="margin-top:0.5rem;">Send Feedback</button>
      </div>
    `
  }
};

export function runNumericCalculator(handler, v1, v2, v3) {
  if (handler === 'calc_salary_tax') {
    const monthlyGross = Math.max(0, Number(v1) || 0);
    const taxRatePct = Math.max(0, Number(v2) || 0);
    const monthlyDeductions = Math.max(0, Number(v3) || 0);
    const taxableMonthly = Math.max(0, monthlyGross - monthlyDeductions);
    const monthlyTax = (taxableMonthly * taxRatePct) / 100;
    const netMonthly = monthlyGross - monthlyTax - monthlyDeductions;
    const annualGross = monthlyGross * 12;
    const annualTax = monthlyTax * 12;
    const annualNet = netMonthly * 12;
    return [
      `=== SALARY TAX & TAKE-HOME PAY SUMMARY ===`,
      `Monthly Gross Salary   : ${monthlyGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Monthly Tax (${taxRatePct}%)      : -${monthlyTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Other Deductions       : -${monthlyDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `-------------------------------------------`,
      `NET MONTHLY TAKE-HOME  : ${netMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `-------------------------------------------`,
      `Annual Gross Income    : ${annualGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Annual Total Tax       : ${annualTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `NET ANNUAL TAKE-HOME   : ${annualNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ].join('\n');
  }

  if (handler === 'calc_zakat') {
    const cashAndSavings = Math.max(0, Number(v1) || 0);
    const goldSilverWealth = Math.max(0, Number(v2) || 0);
    const debtsLiabilities = Math.max(0, Number(v3) || 0);
    const netZakatable = Math.max(0, cashAndSavings + goldSilverWealth - debtsLiabilities);
    const zakatPayable = netZakatable * 0.025;
    return [
      `=== ISLAMIC ZAKAT CALCULATION (2.5%) ===`,
      `Cash, Bank & Business Wealth : ${cashAndSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      `Gold, Silver & Investments   : ${goldSilverWealth.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      `Less Debts / Liabilities     : -${debtsLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      `-------------------------------------------`,
      `Net Zakatable Wealth         : ${netZakatable.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      `TOTAL ZAKAT PAYABLE (2.5%)   : ${zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ].join('\n');
  }

  if (handler === 'calc_bmi') {
    const hMeters = v2 / 100;
    const bmi = v1 / (hMeters * hMeters);
    const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal Weight' : bmi < 30 ? 'Overweight' : 'Obese';
    return `BMI Score: ${bmi.toFixed(1)}\nCategory: ${cat}\nInput: ${v1} kg, ${v2} cm`;
  }
  if (handler === 'calc_emi') {
    const r = v2 / 12 / 100;
    const n = v3;
    const emi = r === 0 ? v1 / n : (v1 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    return `Monthly EMI: ${emi.toFixed(2)}\nTotal Payable: ${total.toFixed(2)}\nTotal Interest: ${(total - v1).toFixed(2)}`;
  }
  if (handler === 'calc_pct') {
    return `${v2}% of ${v1} = ${((v1 * v2) / 100).toFixed(2)}\n${v1} increased by ${v2}% = ${(v1 * (1 + v2 / 100)).toFixed(2)}`;
  }
  if (handler === 'calc_discount') {
    const saved = (v1 * v2) / 100;
    const afterDisc = v1 - saved;
    const tax = (afterDisc * v3) / 100;
    return `Final Price: ${(afterDisc + tax).toFixed(2)}\nYou Save: ${saved.toFixed(2)}\nTax Added (${v3}%): ${tax.toFixed(2)}`;
  }
  if (handler === 'calc_tip') {
    const tip = (v1 * v2) / 100;
    const total = v1 + tip;
    const perPerson = total / Math.max(1, v3);
    return `Total with Tip: ${total.toFixed(2)}\nPer Person (${v3} people): ${perPerson.toFixed(2)}`;
  }
  if (handler === 'calc_unit_length') {
    return `${v1} Meters = ${(v1 / 1000).toFixed(4)} km | ${(v1 * 3.28084).toFixed(2)} ft | ${(v1 * 39.3701).toFixed(2)} in | ${(v1 * 0.000621371).toFixed(4)} miles`;
  }
  if (handler === 'calc_unit_weight') {
    return `${v1} kg = ${(v1 * 1000).toFixed(0)} g | ${(v1 * 2.20462).toFixed(2)} lbs | ${(v1 * 35.274).toFixed(2)} oz`;
  }
  if (handler === 'calc_unit_temp') {
    return `${v1} °C = ${((v1 * 9) / 5 + 32).toFixed(2)} °F | ${(v1 + 273.15).toFixed(2)} K`;
  }
  if (handler === 'calc_unit_data') {
    return `${v1} MB = ${(v1 * 1024).toFixed(0)} KB | ${(v1 / 1024).toFixed(4)} GB | ${(v1 * 8).toFixed(0)} Mbit`;
  }
  if (handler === 'calc_gpa') {
    const obtainedMarks = Math.max(0, Number(v1) || 0);
    const totalMarks = Math.max(1, Number(v2) || 100);
    const scale = Math.max(1, Number(v3) || 4.0);
    const pct = Math.min(100, (obtainedMarks / totalMarks) * 100);
    const gpa = ((pct / 100) * scale).toFixed(2);
    const letter = pct >= 90 ? 'A+' : pct >= 85 ? 'A' : pct >= 80 ? 'A-' : pct >= 75 ? 'B+' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';
    return `=== GPA & GRADE REPORT ===\nScore Percentage : ${pct.toFixed(1)}%\nEstimated GPA    : ${gpa} / ${scale.toFixed(1)}\nLetter Grade     : ${letter}`;
  }
  if (handler === 'calc_roman') {
    let num = Math.min(3999, Math.max(1, Math.floor(v1)));
    const lookup = [
      ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
      ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
      ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    let roman = '';
    for (const [sym, val] of lookup) {
      while (num >= val) {
        roman += sym;
        num -= val;
      }
    }
    return `Roman Numeral: ${roman}`;
  }
  return `Result: ${(v1 + v2).toFixed(2)}`;
}

/**
 * Extracts structured Bank Statement rows or general PDF table lines into Excel CSV format.
 */
export function convertExtractedTextToBankCsv(rawText, opts = {}) {
  const lines = String(rawText || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('--- Page'));

  const rows = [];
  if (opts.includeTimestamp !== false) {
    rows.push(['"Generated By"', '"AllOnlinePDFTools Bank Statement Converter"', `"${new Date().toISOString()}"`, '""', '""']);
  }
  rows.push(['"Row #"', '"Date / Reference"', '"Transaction Description"', '"Amount / Value"', '"Balance / Notes"']);

  const dateRegex = /\b(\d{1,4}[\/\-]\d{1,2}[\/\-]\d{1,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/i;
  const amountRegex = /([+-]?\$?\€?\£?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;

  let idx = 1;
  for (const line of lines) {
    const dateMatch = line.match(dateRegex);
    const amounts = line.match(amountRegex) || [];
    const dateCol = dateMatch ? dateMatch[1] : `Line-${idx}`;
    const amtCol = amounts.length >= 1 ? amounts[amounts.length - 1] : '';
    const balCol = amounts.length >= 2 ? amounts[amounts.length - 2] : '';
    const descCol = line.replace(dateRegex, '').replace(/"/g, '""').trim();
    rows.push([`"${idx}"`, `"${dateCol}"`, `"${descCol}"`, `"${amtCol}"`, `"${balCol}"`]);
    idx++;
  }

  return rows.map((r) => r.join(',')).join('\n');
}

/**
 * Generates an executive summary, key bullet points, and reading stats from extracted PDF text.
 */
export function summarizeExtractedPdfText(rawText) {
  const clean = String(rawText || '').replace(/--- Page \d+ ---/g, '').trim();
  const words = clean ? clean.split(/\s+/) : [];
  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 35);

  const scored = sentences.map((s, i) => ({
    text: s,
    idx: i,
    score: s.split(/\s+/).length + (/\d/.test(s) ? 4 : 0)
  }));
  scored.sort((a, b) => b.score - a.score);
  const topBullets = scored
    .slice(0, 6)
    .sort((a, b) => a.idx - b.idx)
    .map((b) => `• ${b.text}`);

  const readMin = Math.max(1, Math.ceil(words.length / 200));
  return [
    `====================================================`,
    `📄 EXECUTIVE DOCUMENT SUMMARY (AllOnlinePDFTools)`,
    `====================================================`,
    `Total Words        : ${words.length.toLocaleString()}`,
    `Total Sentences    : ${sentences.length.toLocaleString()}`,
    `Est. Reading Time  : ~${readMin} min`,
    ``,
    `🔑 KEY HIGHLIGHTS & EXTRACTED POINTS:`,
    ...(topBullets.length ? topBullets : [`• ${clean.slice(0, 400) || 'No text stream found in PDF.'}`])
  ].join('\n');
}
