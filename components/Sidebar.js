// ======================================================================
// SIDEBAR COMPONENT
// ======================================================================

function Sidebar({ currentPage, setCurrentPage, drafts, activeTab, loadDraft, deleteDraft, addNewDraft, restartPrintSpooler }) {
  // Get icons from window (loaded from Icons.js)
  const { Plus, X } = window.Icons || {};

  return (
    <div className="fixed left-0 top-20 bottom-0 w-64 bg-tertiary shadow-lg p-4 overflow-y-auto">
      <div className="space-y-2 mb-6">
        <button
          onClick={() => setCurrentPage('invoice')}
          className={`w-full text-left px-4 py-2 rounded transition-colors ${
            currentPage === 'invoice' 
              ? 'bg-primary text-white font-semibold' 
              : 'text-primary hover:bg-accent'
          }`}
        >
          📄 Invoice
        </button>
        <button
          onClick={() => setCurrentPage('payment')}
          className={`w-full text-left px-4 py-2 rounded transition-colors ${
            currentPage === 'payment' 
              ? 'bg-primary text-white font-semibold' 
              : 'text-primary hover:bg-accent'
          }`}
        >
          💰 Payment History
        </button>
        <button
          onClick={() => setCurrentPage('settings')}
          className={`w-full text-left px-4 py-2 rounded transition-colors ${
            currentPage === 'settings' 
              ? 'bg-primary text-white font-semibold' 
              : 'text-primary hover:bg-accent'
          }`}
        >
          ⚙️ Settings
        </button>
        <button
          onClick={restartPrintSpooler}
          className="w-full text-left px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 font-semibold transition-colors"
        >
          🖨️ Fix Printer
        </button>
      </div>

      <div className="border-t border-secondary pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-primary">Drafts</span>
          <button
            onClick={addNewDraft}
            className="w-6 h-6 bg-secondary text-white rounded flex items-center justify-center hover:bg-primary transition-colors"
          >
            {Plus && <Plus size={14} />}
          </button>
        </div>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {drafts.map((draft, idx) => {
            const orderItems = draft.items.map(i => i.itemName).filter(Boolean).join(', ');
            const draftName = `${idx + 1} - ${draft.clientName || 'New'}${orderItems ? `_${orderItems}` : ''}`;
            return (
              <button
                key={idx}
                onClick={() => {
                  loadDraft(idx);
                  setCurrentPage('invoice');
                }}
                className={`w-full text-left px-2 py-1 text-xs rounded flex items-center justify-between group transition-colors ${
                  activeTab === idx ? 'bg-accent text-primary font-semibold' : 'text-primary hover:bg-accent'
                }`}
              >
                <span className="truncate">{draftName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDraft(idx);
                  }}
                  className="opacity-0 group-hover:opacity-100"
                >
                  {X && <X size={12} />}
                </button>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Make component available globally
window.Sidebar = Sidebar;