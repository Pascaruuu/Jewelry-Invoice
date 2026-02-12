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
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 no-print">
          <button
            onClick={() => setShowPrintView(false)}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← ត្រឡប់ក្រោយ / Back
          </button>
          <button
            onClick={() => window.print()}
            className="ml-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            បោះពុម្ព / Print
          </button>
        </div>

        <div className="border-2 border-gray-300 p-8">
          <h1 className="text-3xl font-bold text-center mb-2">អូឡាំព្យា ចាក់ពុម្ពគ្រឿងអលង្ការ</h1>
          <div className="text-lg text-center mb-6 text-gray-700 leading-relaxed">
            មានទទួលចាក់ពុម្ពគ្រឿងអលង្ការគ្រប់ប្រភេទ<br/>ដោយម៉ាស្សីនស្វ័យប្រវត្តិយ៉ាងទំនើបទាន់ចិត្ត
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-6">វិក័យប័ត្រ / INVOICE</h2>
          
          <div className="flex justify-between mb-6">
            <div className="text-lg">
              <div>TEL: 012205358</div>
              <div style={{paddingLeft: '28px'}}>061848616</div>
            </div>
            <div className="text-right text-lg leading-relaxed">
              ផ្ទះលេខ10C1E0 ផ្លូវលេខ211<br/>សង្កាត់វាលវង់ ខណ្ឌ៧មករា
            </div>
          </div>
          
          <div className="mb-6 text-base">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">ថ្ងៃទី / Date:</span>
              <span>{formatDate(formData.date)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">ឈ្មោះអតិថិជន / Client Name:</span>
              <span>{formData.clientName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">ផ្លាទីនទឹក / Gold Mix:</span>
              <span>{goldMixOptions.find(o => o.value === formData.goldMix)?.label}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">ហាងឆេង / Gold Market Price:</span>
              <span>${getEffectiveGoldPrice()}</span>
            </div>
          </div>

          <table className="w-full mb-6 border-collapse text-base">
            <thead>
              <tr className="border-b border-tertiary border-gray-300">
                <th className="text-left py-3 px-2">ប្រភេទគ្រឿង<br/>Type of Goods</th>
                <th className="text-center py-3 px-2">ចំនួន<br/>Qty</th>
                <th className="text-center py-3 px-2">ទំងន់<br/>Weight (l)</th>
                <th className="text-right py-3 px-2">ឈ្នួល<br/>Labor</th>
                <th className="text-right py-3 px-2">សរុប<br/>Total</th>
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
                  <tr key={`item-${idx}`} className="border-b border-tertiary border-gray-200">
                    <td className="py-3 px-2">
                      {item.itemName}
                      {item.productCode && ` N${item.productCode}`}
                    </td>
                    <td className="text-center py-3 px-2">{item.quantity}{item.qtyUnit}</td>
                    <td className="text-center py-3 px-2">{totalW.toFixed(1)}</td>
                    <td className="text-right py-3 px-2">${totalL}</td>
                    <td className="text-right py-3 px-2 font-semibold">${roundTotal(calculateItemTotal(item)).toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-300 font-semibold">
                <td className="py-3 px-2">សរុប / TOTAL</td>
                <td className="text-center py-3 px-2">{totals.totalQty}</td>
                <td className="text-center py-3 px-2">{totals.totalWeight.toFixed(1)}</td>
                <td className="text-right py-3 px-2">${totals.totalLabor}</td>
                <td className="text-right py-3 px-2"></td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between items-start mb-6">
            <div className="text-lg text-gray-600 max-w-md leading-relaxed">
              អ្នកទិញបានមើល ថ្លឹង នឹងយល់ព្រម<br/>តាមទំងន់ខាងលើត្រឹមត្រូវ។
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">
                <span className="mr-4">សរុបរួម / GRAND TOTAL:</span>
                <span className="text-3xl">${calculateGrandTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {qrCodeImage && (
            <div className="flex justify-center mt-4">
              <img src={qrCodeImage} alt="QR Code" className="w-48 h-auto" />
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

// Make component available globally
window.PrintView = PrintView;