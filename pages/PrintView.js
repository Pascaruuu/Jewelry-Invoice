// ======================================================================
// PRINT VIEW PAGE
// ======================================================================

function PrintView({
  formData,
  goldMixOptions,
  qrCodeImage,
  formatDate,
  calculateItemTotal,
  calculateGrandTotal,
  calculateTotals,
  roundTotal,
  setShowPrintView,
  getEffectiveGoldPrice
}) {
  const totals = calculateTotals();

  return (
    <div className="page-print">
      <div className="print-container">
        <div className="no-print">
          <button
            onClick={() => setShowPrintView(false)}
            className="btn btn-muted"
          >
            ← ត្រឡប់ក្រោយ / Back
          </button>
          <button
            onClick={() => window.print()}
            className="btn btn-primary"
          >
            បោះពុម្ព / Print
          </button>
        </div>

        <div className="print-sheet">
          <h1 className="text-3xl font-bold text-center">អូឡាំព្យា ចាក់ពុម្ពគ្រឿងអលង្ការ</h1>
          <div className="text-lg text-center text-muted print-subtitle">
            មានទទួលចាក់ពុម្ពគ្រឿងអលង្ការគ្រប់ប្រភេទ<br/>ដោយម៉ាស្សីនស្វ័យប្រវត្តិយ៉ាងទំនើបទាន់ចិត្ត
          </div>
          
          <h2 className="text-3xl font-bold text-center print-heading">វិក័យប័ត្រ / INVOICE</h2>
          
          <div className="row-between print-meta">
            <div className="text-lg">
              <div>TEL: 012205358</div>
              <div className="print-address">061848616</div>
            </div>
            <div className="text-right text-lg">
              ផ្ទះលេខ10C1E0 ផ្លូវលេខ211<br/>សង្កាត់វាលវង់ ខណ្ឌ៧មករា
            </div>
          </div>
          
          <div className="print-info">
            <div className="row-between">
              <span className="font-semibold">ថ្ងៃទី / Date:</span>
              <span>{formatDate(formData.date)}</span>
            </div>
            <div className="row-between">
              <span className="font-semibold">ឈ្មោះអតិថិជន / Client Name:</span>
              <span>{formData.clientName}</span>
            </div>
            <div className="row-between">
              <span className="font-semibold">ផ្លាទីនទឹក / Gold Mix:</span>
              <span>{goldMixOptions.find(o => o.value === formData.goldMix)?.label}</span>
            </div>
            <div className="row-between">
              <span className="font-semibold">ហាងឆេង / Gold Market Price:</span>
              <span>${getEffectiveGoldPrice()}</span>
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th className="text-left">ប្រភេទគ្រឿង<br/>Type of Goods</th>
                <th className="text-center">ចំនួន<br/>Qty</th>
                <th className="text-center">ទំងន់<br/>Weight (l)</th>
                <th className="text-right">ឈ្នួល<br/>Labor</th>
                <th className="text-right">សរុប<br/>Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, idx) => {
                let totalW = 0;
                let totalL = 0;
                
                if (item.subItems && item.subItems.length > 0) {
                  item.subItems.forEach(sub => {
                    totalW += parseFloat(sub.weight) || 0;
                    totalL += parseFloat(sub.laborCost) || 0;
                  });
                }
                
                return (
                  <tr key={`item-${idx}`}>
                    <td>
                      {item.itemName}
                      {item.productCode && ` N${item.productCode}`}
                    </td>
                    <td className="text-center">{item.quantity}{item.qtyUnit}</td>
                    <td className="text-center">{totalW.toFixed(1)}</td>
                    <td className="text-right">${totalL}</td>
                    <td className="text-right font-semibold">${roundTotal(calculateItemTotal(item)).toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr className="print-total-row">
                <td>សរុប / TOTAL</td>
                <td className="text-center">{totals.totalQty}</td>
                <td className="text-center">{totals.totalWeight.toFixed(1)}</td>
                <td className="text-right">${totals.totalLabor}</td>
                <td className="text-right"></td>
              </tr>
            </tbody>
          </table>

          <div className="row-between print-footer">
            <div className="text-lg text-muted print-disclaimer">
              អ្នកទិញបានមើល ថ្លឹង នឹងយល់ព្រម<br/>តាមទំងន់ខាងលើត្រឹមត្រូវ។
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                <span>សរុបរួម / GRAND TOTAL:</span>
                <span className="text-3xl">${calculateGrandTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {qrCodeImage && (
            <div className="text-center">
              <img src={qrCodeImage} alt="QR Code" className="qr-print" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Make component available globally
window.PrintView = PrintView;
