// ======================================================================
// GROUPED TYPE SELECTOR POPUP
// ======================================================================

function GroupedTypeSelector({ groups, onSelect, onClose }) {
  // Get icons from window (loaded from Icons.js)
  const { X } = window.Icons || {};

  // Organize groups into rows of 3
  const rows = [];
  for (let i = 0; i < groups.length; i += 3) {
    rows.push(groups.slice(i, i + 3));
  }

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
    >
      <div 
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">ជ្រើសរើសប្រភេទគ្រឿង / Select Type of Goods</h3>
          <button onClick={onClose} className="modal-close">
            {X && <X size={24} />}
          </button>
        </div>

        <div className="stack-lg">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid-3">
              {row.map((group, colIdx) => (
                <div key={colIdx} className="panel">
                  <h4 className="selector-group-title">
                    {group.name}
                  </h4>
                  <div className="stack">
                    {group.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        onClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                        className="selector-option"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Make component available globally
window.GroupedTypeSelector = GroupedTypeSelector;
