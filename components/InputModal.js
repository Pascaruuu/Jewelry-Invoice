// ======================================================================
// INPUT MODAL COMPONENT
// ======================================================================

function InputModal({ isOpen, title, defaultValue, onSubmit, onCancel }) {
  // Need to use React hooks
  const { useState, useEffect } = React;
  
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-tertiary rounded focus:ring-2 focus:ring-secondary mb-4"
            autoFocus
            placeholder="Enter value..."
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Make component available globally
window.InputModal = InputModal;