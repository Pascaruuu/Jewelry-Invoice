// ======================================================================
// PAYMENT HISTORY PAGE
// ======================================================================

function PaymentHistoryPage({
  paymentHistory,
  updatePaymentStatus,
  deletePaymentRecord
}) {
  // Get icons from window
  const { X, Wallet } = window.Icons || {};
  const pendingOrders = paymentHistory.filter(r => r.status === 'pending');
  const recentHistory = paymentHistory.filter(r => r.status !== 'pending');

  const renderRecordMain = (record) => (
    <div className="payment-record-main">
      <div className="payment-record-icon">
        {Wallet && <Wallet size={18} />}
      </div>
      <div className="payment-record-copy">
        <div className="payment-client-name">{record.clientName}</div>
        <div className="payment-orders">{record.orders || 'No order details'}</div>
        <div className="help-text">{record.savedTime}</div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-narrow payment-page">
        <div className="page-heading-row">
          <div>
            <h2 className="page-title">Payment History</h2>
            <p className="page-subtitle">Current pending orders and the last 7 days of completed or cancelled orders.</p>
          </div>
        </div>

        <section className="editor-section payment-section">
          <div className="section-heading-row">
            <h3 className="section-title">Pending Orders</h3>
            <span className="status-badge status-pending">{pendingOrders.length} Pending</span>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="muted-panel">No pending orders</div>
          ) : (
            <div className="payment-list">
              {pendingOrders.map((record) => (
                <div key={record.id} className="payment-record">
                  {renderRecordMain(record)}
                  <div className="payment-amount">
                    ${record.total.toLocaleString()}
                  </div>
                  <div className="payment-actions">
                    <button
                      onClick={() => updatePaymentStatus(record.id, 'paid')}
                      className="btn btn-success btn-icon"
                      title="Mark as Paid"
                      aria-label={`Mark ${record.clientName} as paid`}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => updatePaymentStatus(record.id, 'cancelled')}
                      className="btn btn-link-danger btn-icon"
                      title="Cancel"
                      aria-label={`Cancel ${record.clientName}`}
                    >
                      {X && <X size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="editor-section payment-section">
          <div className="section-heading-row">
            <h3 className="section-title">Recent History</h3>
            <span className="pill">{recentHistory.length} Records</span>
          </div>

          {recentHistory.length === 0 ? (
            <div className="muted-panel">No history yet</div>
          ) : (
            <div className="payment-list">
              {recentHistory.map((record) => {
                const statusColors = {
                  paid: 'status-paid',
                  cancelled: 'status-cancelled'
                };
                const statusClass = statusColors[record.status];
                
                return (
                  <div key={record.id} className="payment-record">
                    {renderRecordMain(record)}
                    <div className="payment-amount">
                      ${record.total.toLocaleString()}
                    </div>
                    <div className={`status-badge ${statusClass}`}>
                      {record.status.toUpperCase()}
                    </div>
                    <button
                      onClick={() => deletePaymentRecord(record.id)}
                      className="btn btn-link-danger btn-icon"
                      title="Delete"
                      aria-label={`Delete ${record.clientName}`}
                    >
                      {X && <X size={16} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Make component available globally
window.PaymentHistoryPage = PaymentHistoryPage;
