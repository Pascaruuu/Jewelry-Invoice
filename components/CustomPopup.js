// ======================================================================
// CUSTOM POPUP COMPONENT
// ======================================================================

function CustomPopup({ type, title, message, onConfirm, onCancel, showCancel = true }) {
  const icons = {
    success: { symbol: '✓', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    error: { symbol: '✗', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    warning: { symbol: '⚠', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    info: { symbol: 'ℹ', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    question: { symbol: '?', color: 'text-primary', bg: 'bg-accent', border: 'border-tertiary' }
  };

  const style = icons[type] || icons.info;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={onCancel}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 border-2 ${style.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${style.bg} rounded-t-lg p-6 border-b ${style.border}`}>
          <div className={`text-6xl ${style.color} mb-3 text-center font-bold`}>
            {style.symbol}
          </div>
          <h3 className="text-xl font-bold text-center text-gray-800">{title}</h3>
        </div>
        
        <div className="p-6">
          <p className="text-center text-gray-700 whitespace-pre-line mb-6">{message}</p>
          
          <div className="flex gap-3 justify-center">
            {showCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium"
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