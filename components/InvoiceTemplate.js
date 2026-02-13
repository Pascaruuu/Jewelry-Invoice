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
    body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 30px; margin: 10px 0; }
    .header p { font-size: 22px; margin: 10px 0; }
    .header h2 { font-size: 24px; margin: 20px 0 10px 0; }
    .contact-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .contact-info p { font-size: 19px; margin: 5px 0; }
    .info { margin: 20px 0; }
    .info p { margin: 8px 0; font-size: 16px; }
    .info strong { font-weight: 600; }
    .client-name { font-size: 22px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; font-weight: bold; }
    .totals { font-weight: bold; background-color: #f9f9f9; }
    .grand-total { text-align: right; font-size: 24px; font-weight: bold; margin: 20px 0; }
    .disclaimer { font-size: 18px; margin-top: 20px; color: #333; }
    .qr-code { text-align: center; margin-top: 30px; }
    .qr-code img { width: auto; height: 220px; }
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
    <div style="text-align: right;">
      <p>ផ្ទះលេខ10C1E0 ផ្លូវលេខ211<br/>សង្កាត់វាលវង់ ខណ្ឌ៧មករា</p>
    </div>
  </div>
  
  <div class="info">
    <p><strong>ឈ្មោះអតិថិជន / Client Name: <span class="client-name">{{CLIENT_NAME}}</span></strong></p>
    <p><strong>ថ្ងៃទី / Date:</strong> {{DATE}}</p>
    <p><strong>ផ្លាទីនទឹក / Gold Mix:</strong> {{GOLD_MIX}}</p>
    <p><strong>ហាងឆេង / Gold Market Price:</strong> ${{GOLD_PRICE}}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>ប្រភេទគ្រឿង<br/>Type of Goods</th>
        <th style="text-align: center;">ចំនួន<br/>Qty</th>
        <th style="text-align: center;">ទំងន់<br/>Weight (l)</th>
        <th style="text-align: right;">ឈ្នួល<br/>Labor</th>
        <th style="text-align: right;">សរុប<br/>Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITEMS_ROWS}}
      <tr class="totals">
        <td>សរុប / TOTAL</td>
        <td style="text-align: center;">{{TOTAL_QTY}}</td>
        <td style="text-align: center;">{{TOTAL_WEIGHT}}</td>
        <td style="text-align: right;">\${{TOTAL_LABOR}}</td>
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
  
  const totals = {
    totalQty: formData.items.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0),
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
      <td style="text-align: center;">${item.quantity}${item.qtyUnit || ''}</td>
      <td style="text-align: center;">${totalWeight.toFixed(1)}</td>
      <td style="text-align: right;">$${totalLabor}</td>
      <td style="text-align: right;">$${(() => {
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
    .replace(/{{TOTAL_QTY}}/g, totals.totalQty)
    .replace(/{{TOTAL_WEIGHT}}/g, totals.totalWeight.toFixed(1))
    .replace(/{{TOTAL_LABOR}}/g, totals.totalLabor)
    .replace(/{{GRAND_TOTAL}}/g, grandTotal.toLocaleString())
    .replace(/{{QR_CODE_SECTION}}/g, qrCodeSection);

  return html;
}

// Make functions available globally
window.loadInvoiceTemplate = loadInvoiceTemplate;
window.getDefaultInvoiceTemplate = getDefaultInvoiceTemplate;
window.generateInvoiceHTML = generateInvoiceHTML;