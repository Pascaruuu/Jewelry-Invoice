// ======================================================================
// HEADER COMPONENT (Updated with space for refresh button)
// ======================================================================

function Header({ formData, setFormData, saveDraft, handleSaveReceipt, globalGoldPrice, setGlobalGoldPrice }) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-primary shadow-md border-b border-tertiary border-secondary z-40">
      <div className="flex items-center justify-between px-6 py-4 pr-16">
        {/* Left: Title and Date */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">
            វិក័យប័ត្រ / Invoice
          </h1>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="px-3 py-2 border border-tertiary bg-white rounded focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Center: Gold Price */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-white whitespace-nowrap">
            Today's Gold Price:
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              type="number"
              step="1"
              value={globalGoldPrice}
              onChange={(e) => {
                const newPrice = e.target.value;
                setGlobalGoldPrice(newPrice);
                localStorage.setItem('jewelryGlobalGoldPrice', newPrice);
              }}
              placeholder="Set price"
              className="w-32 pl-7 pr-3 py-2 border border-tertiary bg-white rounded focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={saveDraft}
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-primary flex items-center gap-2 transition-colors"
          >
            <Save size={18} />
            រក្សាទុក / Save Draft
          </button>
          <button
            onClick={handleSaveReceipt}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <FolderOpen size={18} />
            រក្សាទុក PDF / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}

window.Header = Header;