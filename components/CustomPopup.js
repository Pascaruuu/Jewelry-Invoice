// ======================================================================
// CUSTOM POPUP COMPONENT
// ======================================================================

function CustomPopup({ type, title, message, onConfirm, onCancel, showCancel = true }) {
  const icons = {
    success: { symbol: '✓', tone: 'tone-success' },
    error: { symbol: '✗', tone: 'tone-error' },
    warning: { symbol: '⚠', tone: 'tone-warning' },
    info: { symbol: 'ℹ', tone: 'tone-info' },
    question: { symbol: '?', tone: 'tone-info' }
  };

  const style = icons[type] || icons.info;

  return (
    <div 
      className="modal-overlay modal-overlay-top"
      onClick={onCancel}
    >
      <div 
        className={`modal-card modal-card-md ${style.tone}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <div className="text-6xl font-bold">
            {style.symbol}
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <div className="popup-body">
          <p className="popup-message">{message}</p>
          
          <div className="row">
            {showCancel && (
              <button
                onClick={onCancel}
                className="btn btn-muted"
              >
                Cancel
              </button>
            )}
            <button
              onClick={onConfirm}
              className="btn btn-primary"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Make component available globally
window.CustomPopup = CustomPopup;
