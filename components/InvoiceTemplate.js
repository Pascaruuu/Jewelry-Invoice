// ======================================================================
// INVOICE TEMPLATE SYSTEM
// ======================================================================

async function loadInvoiceTemplate() {
  try {
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const templatePath = path.join(__dirname, 'invoice-template.html');
      return fs.readFileSync(templatePath, 'utf-8');
    }
  } catch (error) {
    console.error('Error loading template:', error);
  }
  return getDefaultInvoiceTemplate();
}

function getDefaultInvoiceTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - {{CLIENT_NAME}}</title>
  <style>
    :root {
      --invoice-border: #d8d8d8;
      --invoice-muted: #f3f3f3;
      --invoice-text: #1a1a18;
      --invoice-secondary-text: #545450;
    }
    body { font-family: Arial, sans-serif; padding: 24px; margin: 0; color: var(--invoice-text); background: #ffffff; }
    .header { text-align: center; margin-bottom: 24px; }
    .header h1 { font-size: 26px; margin: 6px 0; }
    .header p { color: var(--invoice-secondary-text); font-size: 16px; line-height: 1.45; margin: 8px 0; }
    .header h2 { font-size: 22px; letter-spacing: 0.04em; margin: 18px 0 8px 0; }
    .contact-info { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 18px; }
    .contact-info p { font-size: 15px; line-height: 1.5; margin: 5px 0; }
    .info { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px; margin: 18px 0; padding: 14px; border: 1px solid var(--invoice-border); }
    .info p { margin: 0; font-size: 14px; }
    .info strong { font-weight: 600; }
    .client-name { font-size: 17px; }
    table { width: 100%; border-collapse: collapse; margin: 18px 0; }
    th, td { border: 1px solid var(--invoice-border); padding: 9px 10px; text-align: left; font-size: 14px; }
    th { background-color: var(--invoice-muted); font-weight: bold; }
    .totals { font-weight: bold; background-color: var(--invoice-muted); }
    .grand-total { text-align: right; font-size: 22px; font-weight: bold; margin: 18px 0; }
    .disclaimer { font-size: 15px; margin-top: 20px; color: var(--invoice-secondary-text); }
    .qr-code { text-align: center; margin-top: 30px; }
    .qr-code img { width: auto; height: 220px; }
    .align-center { text-align: center; }
    .align-right { text-align: right; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>អូឡាំព្យា ចាក់ពុម្ពគ្រឿងអលង្ការ</h1>
    <p>មានទទួលចាក់ពុម្ពគ្រឿងអលង្ការគ្រប់ប្រភេទ ដោយម៉ាស្សីនស្វ័យប្រវត្តិយ៉ាងទំនើបទាន់ចិត្ត</p>
    <h2>វិក័យប័ត្រ / INVOICE</h2>
  </div>
  
  <div class="contact-info">
    <div>
      <p><strong>TEL:</strong> 012205358<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;061848616</p>
    </div>
    <div class="align-right">
      <p>ផ្ទះលេខ10C1E0 ផ្លូវលេខ211<br/>សង្កាត់វាលវង់ ខណ្ឌ៧មករា</p>
    </div>
  </div>
  
  <div class="info">
    <p><strong>ឈ្មោះអតិថិជន / Client Name: <span class="client-name">{{CLIENT_NAME}}</span></strong></p>
    <p><strong>ថ្ងៃទី / Date:</strong> {{DATE}}</p>
    <p><strong>ផ្លាទីនទឹក / Gold Mix:</strong> {{GOLD_MIX}}</p>
    <p><strong>ហាងឆេង / Gold Market Price:</strong> \${{GOLD_PRICE}}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>ប្រភេទគ្រឿង<br/>Type of Goods</th>
        <th class="align-center">ចំនួន<br/>Qty</th>
        <th class="align-center">ទំងន់<br/>Weight (l)</th>
        <th class="align-right">ឈ្នួល<br/>Labor</th>
        <th class="align-right">សរុប<br/>Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITEMS_ROWS}}
      <tr class="totals">
        <td>សរុប / TOTAL</td>
        <td class="align-center">{{TOTAL_QTY}}</td>
        <td class="align-center">{{TOTAL_WEIGHT}}</td>
        <td class="align-right">\${{TOTAL_LABOR}}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
  
  <div class="grand-total">
    សរុបរួម / GRAND TOTAL: \${{GRAND_TOTAL}}
  </div>
  
  <div class="disclaimer">
    <p>អ្នកទិញបានមើល ថ្លឹង នឹងយល់ព្រមតាមទំងន់ខាងលើត្រឹមត្រូវ។</p>
  </div>
  
  {{QR_CODE_SECTION}}
</body>
</html>`;
}

async function generateInvoiceHTML(formData, goldMixOptions, qrCodeImage, calculateItemTotal, formatDate, roundTotal, globalGoldPrice) {
  const template = await loadInvoiceTemplate();
  const totalQty = formData.items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  
  const totals = {
    totalQty: Math.round(totalQty * 100) / 100,
    totalWeight: formData.items.reduce((sum, item) => {
      return sum + item.subItems.reduce((s, sub) => s + (parseFloat(sub.weight) || 0), 0);
    }, 0),
    totalLabor: formData.items.reduce((sum, item) => {
      return sum + item.subItems.reduce((s, sub) => s + (parseFloat(sub.laborCost) || 0), 0);
    }, 0)
  };

  const rawGrandTotal = formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const grandTotal = roundTotal(rawGrandTotal);

  const itemsRows = formData.items.map(item => {
    const totalWeight = item.subItems.reduce((sum, sub) => sum + (parseFloat(sub.weight) || 0), 0);
    const totalLabor = item.subItems.reduce((sum, sub) => sum + (parseFloat(sub.laborCost) || 0), 0);
    return `
    <tr>
      <td>${item.itemName}${item.productCode ? ` N${item.productCode}` : ''}</td>
      <td class="align-center">${item.quantity}${item.qtyUnit || ''}</td>
      <td class="align-center">${totalWeight.toFixed(1)}</td>
      <td class="align-right">$${totalLabor}</td>
      <td class="align-right">$${(() => {
        const v = calculateItemTotal(item);
        const d = v - Math.floor(v);
        return (d >= 0.7 ? Math.ceil(v) : Math.floor(v)).toLocaleString();})()}</td>
    </tr>`;
  }).join('');

  const qrCodeSection = qrCodeImage 
    ? `<div class="qr-code"><img src="${qrCodeImage}" alt="Payment QR Code" /></div>` 
    : '';

  // Use formData.goldPrice if set (and not empty), otherwise use globalGoldPrice
  const displayGoldPrice = (formData.goldPrice && formData.goldPrice.trim() !== '') 
    ? formData.goldPrice 
    : (globalGoldPrice || '');

  let html = template
    .replace(/{{CLIENT_NAME}}/g, formData.clientName)
    .replace(/{{DATE}}/g, formatDate(formData.date))
    .replace(/{{GOLD_MIX}}/g, goldMixOptions.find(o => o.value === formData.goldMix)?.label || '')
    .replace(/{{GOLD_PRICE}}/g, displayGoldPrice)
    .replace(/{{ITEMS_ROWS}}/g, itemsRows)
    .replace(/{{TOTAL_QTY}}/g, String(totals.totalQty))
    .replace(/{{TOTAL_WEIGHT}}/g, totals.totalWeight.toFixed(1))
    .replace(/{{TOTAL_LABOR}}/g, String(totals.totalLabor))
    .replace(/{{GRAND_TOTAL}}/g, grandTotal.toLocaleString())
    .replace(/{{QR_CODE_SECTION}}/g, qrCodeSection);

  return html;
}

// Make functions available globally
window.loadInvoiceTemplate = loadInvoiceTemplate;
window.getDefaultInvoiceTemplate = getDefaultInvoiceTemplate;
window.generateInvoiceHTML = generateInvoiceHTML;
