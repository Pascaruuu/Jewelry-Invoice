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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">ជ្រើសរើសប្រភេទគ្រឿង / Select Type of Goods</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            {X && <X size={24} />}
          </button>
        </div>

        <div className="space-y-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-3 gap-4">
              {row.map((group, colIdx) => (
                <div key={colIdx} className="border border-tertiary rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-lg mb-3 text-primary border-b border-tertiary pb-2">
                    {group.name}
                  </h4>
                  <div className="space-y-1">
                    {group.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        onClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-accent transition-colors text-sm"
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