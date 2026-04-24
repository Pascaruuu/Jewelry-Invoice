// ======================================================================
// HEADER COMPONENT (Updated with space for refresh button)
// ======================================================================

function Header({ formData, setFormData, saveDraft, handleSaveReceipt, globalGoldPrice, setGlobalGoldPrice }) {
  const { Save, FolderOpen } = window.Icons || {};

  return (
    <div className="header-bar">
      <div className="header-inner">
        {/* Left: Title and Date */}
        <div className="header-group">
          <div className="date-control">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Center: Gold Price */}
        <div className="header-group">
          <label className="header-label">
            Today's Gold Price:
          </label>
          <div className="input-with-prefix">
            <span className="input-prefix">$</span>
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
              className="form-control has-prefix"
            />
          </div>
        </div>

        <div className="header-group">
          <button
            onClick={saveDraft}
            className="btn btn-secondary"
          >
            {Save && <Save size={18} />}
            រក្សាទុក / Save Draft
          </button>
          <button
            onClick={handleSaveReceipt}
            className="btn btn-success"
          >
            {FolderOpen && <FolderOpen size={18} />}
            រក្សាទុកវិក្កយបត្រ / Save Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

window.Header = Header;
