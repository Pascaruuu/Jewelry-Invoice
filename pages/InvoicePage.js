// ======================================================================
// INVOICE PAGE (MAIN)
// ======================================================================

function InvoicePage({ 
  formData, 
  setFormData, 
  itemTypeGroups,
  clientGroups,
  goldMixOptions,
  qtyUnitOptions,
  getEffectiveGoldPrice,
  showTypeSelector,
  setShowTypeSelector,
  showClientSelector,
  setShowClientSelector,
  currentItemIndex,
  setCurrentItemIndex,
  updateItem,
  updateSubItem,
  addItem,
  removeItem,
  calculateSubItemTotal,
  calculateItemTotal,
  getCalculatedTotal,
  calculateGrandTotal,
  calculateTotals,
  roundTotal,
  handleResetInvoice,
  addNewDraft,
  drafts,
  globalGoldPrice
}) {
  // Get components from window
  const { GroupedTypeSelector, GroupedClientSelector } = window;
  const { Plus, X } = window.Icons || {};

  const totals = calculateTotals();

  return (
    <div className="page">
      <div className="page-narrow">
        <div className="card invoice-editor">

          {drafts.length === 0 && (
            <div className="invoice-empty-action">
              <button
                onClick={addNewDraft}
                className="btn btn-success btn-small"
              >
                {Plus && <Plus size={14} />}
                បន្ថែមថ្មី / New Draft
              </button>
            </div>
          )}

          <div className="invoice-editor-stack">
            <div className="invoice-editor-header">
              <div className="field invoice-client-field">
                <label className="label">
                  ឈ្មោះអតិថិជន / Client Name
                </label>
                <button
                  onClick={() => setShowClientSelector(true)}
                  className="select-button"
                >
                  {formData.clientName || 'ជ្រើសរើសអតិថិជន... / Select client...'}
                </button>
                <p className="help-text">Add new clients in Settings</p>
              </div>
            </div>

            <section className="editor-section gold-value-section">
              <div className="section-heading-row">
                <h2 className="section-title">តម្លៃមាស / Gold Value</h2>
              </div>
              <div className="grid-2">
              <div className="field">
                <label className="label">
                  ផ្លាទីនទឹក / Gold Mix
                </label>
                <select
                  value={formData.goldMix}
                  onChange={(e) => setFormData({ ...formData, goldMix: e.target.value })}
                  className="form-control"
                >
                  <option value="">-- ជ្រើសរើស / Select --</option>
                  {goldMixOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <div className="field-label-row">
                  <label className="label">
                    ហាងឆេង / Gold Market Price
                  </label>
                  <span className="inline-help-text">
                    {formData.manualGoldPrice !== null 
                      ? `Custom (Global: $${globalGoldPrice})` 
                      : `Global: $${globalGoldPrice || 'Not set'}`
                    }
                  </span>
                </div>
                <div className="row">
                  <div className="input-with-prefix flex-fill">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      step="1"
                      value={formData.manualGoldPrice !== null ? formData.manualGoldPrice : ''}
                      onChange={(e) => setFormData({ ...formData, manualGoldPrice: e.target.value === '' ? null : e.target.value })}
                      placeholder={globalGoldPrice || 'Enter price'}
                      className={`form-control has-prefix ${
                        formData.manualGoldPrice !== null 
                          ? 'is-highlighted' 
                          : ''
                      }`}
                    />
                  </div>
                  {formData.manualGoldPrice !== null && (
                    <button
                      onClick={() => setFormData({ ...formData, manualGoldPrice: null })}
                      className="btn btn-ghost btn-icon"
                      title="Reset to global price"
                    >
                      ↻
                    </button>
                  )}
                </div>
              </div>
            </div>
            </section>

            <section className="editor-section items-section">
              <div className="section-heading-row">
                <h2 className="section-title">គ្រឿង / Items</h2>
                <button
                  onClick={addItem}
                  className="btn btn-success btn-small"
                >
                  {Plus && <Plus size={16} />}
                  បន្ថែម / Add Item
                </button>
              </div>

              <div className="items-stack">
              {formData.items.map((item, idx) => (
                <div key={idx} className="item-card">
                  <div className="item-card-header">
                    <span className="item-number">Item {idx + 1}</span>
                    {formData.items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="btn btn-link-danger btn-icon item-remove"
                        title="Remove item"
                        aria-label={`Remove item ${idx + 1}`}
                      >
                        {X && <X size={18} />}
                      </button>
                    )}
                  </div>
                  <div className="item-main-row">
                    <div className="flex-fill field">
                      <label className="label-sm">ប្រភេទគ្រឿង / Type of Goods</label>
                      <button
                        onClick={() => {
                          setCurrentItemIndex(idx);
                          setShowTypeSelector(true);
                        }}
                        className="select-button"
                      >
                        {item.itemName || '-- ជ្រើសរើស / Select --'}
                      </button>
                    </div>
                    <div className="field-code field">
                      <label className="label-sm">លេខកូដ / Code</label>
                      <input
                        type="text"
                        placeholder="№"
                        value={item.productCode}
                        onChange={(e) => updateItem(idx, 'productCode', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="field-qty field">
                      <label className="label-sm">ចំនួន / Qty</label>
                      <div className="row">
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          className="form-control qty-number"
                        />
                        <select
                          value={item.qtyUnit}
                          onChange={(e) => updateItem(idx, 'qtyUnit', e.target.value)}
                          className="form-control qty-unit"
                        >
                          {qtyUnitOptions.map((unit, i) => (
                            <option key={i} value={unit}>{unit || '-'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="field-total field">
                      <label className="label-sm">សរុប / Total</label>
                      <div className="row">
                        <input
                          type="number"
                          step="1"
                          value={item.manualTotal !== null ? item.manualTotal : ''}
                          onChange={(e) => updateItem(idx, 'manualTotal', e.target.value === '' ? null : e.target.value)}
                          className="form-control total-input"
                          placeholder={roundTotal(getCalculatedTotal(item)).toString()}
                        />
                        {item.manualTotal !== null && (
                          <button
                            onClick={() => updateItem(idx, 'manualTotal', null)}
                            className="btn btn-ghost btn-icon"
                            title="Reset to calculated"
                          >
                            ↻
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sub Items */}
                  <div className="subitem-stack">
                    {item.subItems.map((subItem, subIdx) => (
                      <div key={subIdx} className="subitem-row">
                        <span className="subitem-index">#{subIdx + 1}</span>
                        <div className="flex-fill">
                          <input
                            type="number"
                            step="1"
                            placeholder="ទំងន់ / Weight"
                            value={subItem.weight}
                            onChange={(e) => updateSubItem(idx, subIdx, 'weight', e.target.value)}
                            className="form-control form-control-sm"
                          />
                        </div>
                        <div className="flex-fill">
                          <div className="input-with-prefix">
                            <span className="input-prefix">$</span>
                            <input
                              type="number"
                              step="1"
                              placeholder="ឈ្នួល / Labor"
                              value={subItem.laborCost}
                              onChange={(e) => updateSubItem(idx, subIdx, 'laborCost', e.target.value)}
                              className="form-control form-control-sm has-prefix"
                            />
                          </div>
                        </div>
                        <div className="subitem-total">
                          ${calculateSubItemTotal(subItem).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              </div>

              <div className="totals-bar">
                <div className="row">
                  <div className="flex-fill">
                    <div className="total-label">សរុប / TOTAL</div>
                    <div className="total-value">សរុប / TOTAL</div>
                  </div>
                  <div className="text-center">
                    <div className="total-label">ចំនួន / Qty</div>
                    <div className="total-value">{totals.totalQty}</div>
                  </div>
                  <div className="text-center">
                    <div className="total-label">ទំងន់ / Weight</div>
                    <div className="total-value">{totals.totalWeight.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="total-label">ឈ្នួល / Labor</div>
                    <div className="total-value">${totals.totalLabor}</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grand-total-block">
              <div>
                <div className="grand-total-label">សរុបរួម / Grand Total</div>
                <div className="grand-total-help">Rounded from item totals</div>
              </div>
              <span className="grand-total">${calculateGrandTotal().toLocaleString()}</span>
            </section>

            <div className="invoice-editor-footer">
              <span className="help-text">Use Save Invoice in the top bar to create the invoice file.</span>
              <button
                onClick={handleResetInvoice}
                className="btn btn-link-danger btn-small"
              >
                សម្អាតវិក្កយបត្រ / Clear invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Make component available globally
window.InvoicePage = InvoicePage;
