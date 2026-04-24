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
      className="modal-overlay"
      onClick={onCancel}
    >
      <div 
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="form-control"
            autoFocus
            placeholder="Enter value..."
          />
          <div className="row row-end">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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
