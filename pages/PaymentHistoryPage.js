// ======================================================================
// PAYMENT HISTORY PAGE
// ======================================================================

function PaymentHistoryPage({
  paymentHistory,
  updatePaymentStatus,
  deletePaymentRecord
}) {
  // Get icons from window
  const { X } = window.Icons || {};

  return (
    <div className="flex-1 ml-64 p-8">
      <h2 className="text-2xl font-bold mb-6">ប្រវត្តិការទូទាត់ / Payment History</h2>

      {/* Pending Orders */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-yellow-700">⏳ Pending Orders</h3>
        <div className="bg-white rounded-lg shadow">
          {paymentHistory.filter(r => r.status === 'pending').length === 0 ? (
            <div className="p-8 text-center text-gray-500">No pending orders</div>
          ) : (
            <div className="divide-y">
              {paymentHistory.filter(r => r.status === 'pending').map((record) => (
                <div key={record.id} className="p-4 hover:bg-white flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{record.clientName}</div>
                    <div className="text-sm text-gray-600">{record.orders}</div>
                    <div className="text-xs text-gray-500 mt-1">{record.savedTime}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">${record.total.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => updatePaymentStatus(record.id, 'paid')}
                      className="p-2 bg-green-600 text-white rounded hover:bg-green-700 text-xl"
                      title="Mark as Paid"
                    >
                      ✓
                    </button>
                    <div className="px-4 py-2 rounded border-2 bg-yellow-100 text-yellow-800 border-yellow-300 font-semibold text-sm min-w-28 text-center">
                      PENDING
                    </div>
                    <button
                      onClick={() => updatePaymentStatus(record.id, 'cancelled')}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700 text-xl"
                      title="Cancel"
                    >
                      ✗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">📋 History</h3>
        <div className="bg-white rounded-lg shadow">
          {paymentHistory.filter(r => r.status !== 'pending').length === 0 ? (
            <div className="p-8 text-center text-gray-500">No history yet</div>
          ) : (
            <div className="divide-y">
              {paymentHistory.filter(r => r.status !== 'pending').map((record) => {
                const statusColors = {
                  paid: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
                  cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
                };
                const colors = statusColors[record.status];
                
                return (
                  <div key={record.id} className="p-4 hover:bg-white flex items-center gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{record.clientName}</div>
                      <div className="text-sm text-gray-600">{record.orders}</div>
                      <div className="text-xs text-gray-500 mt-1">{record.savedTime}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">${record.total.toLocaleString()}</div>
                    </div>
                    <div className={`px-4 py-2 rounded border-2 ${colors.bg} ${colors.text} ${colors.border} font-semibold text-sm min-w-28 text-center`}>
                      {record.status.toUpperCase()}
                    </div>
                    <button
                      onClick={() => deletePaymentRecord(record.id)}
                      className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      title="Delete"
                    >
                      {X && <X size={16} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Make component available globally
window.PaymentHistoryPage = PaymentHistoryPage;