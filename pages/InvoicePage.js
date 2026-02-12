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
  handleReset,
  handlePrint,
  addNewDraft,
  drafts,
  globalGoldPrice
}) {
  // Get components from window
  const { GroupedTypeSelector, GroupedClientSelector } = window;
  const { Plus, X, Printer } = window.Icons || {};

  const totals = calculateTotals();

  return (
    <div className="flex-1 ml-64 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">

          {drafts.length === 0 && (
            <div className="mb-4">
              <button
                onClick={addNewDraft}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
              >
                {Plus && <Plus size={14} />}
                បន្ថែមថ្មី / New Draft
              </button>
            </div>
          )}

          <div className="space-y-4">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                ឈ្មោះអតិថិជន / Client Name
              </label>
              <button
                onClick={() => setShowClientSelector(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-left hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {formData.clientName || 'ជ្រើសរើសអតិថិជន... / Select client...'}
              </button>
              <p className="text-xs text-gray-500 mt-1">Add new clients in Settings</p>
            </div>

            {/* Gold Mix and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  ផ្លាទីនទឹក / Gold Mix
                </label>
                <select
                  value={formData.goldMix}
                  onChange={(e) => setFormData({ ...formData, goldMix: e.target.value })}
                  className="w-full px-3 py-2 border border-tertiary rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="">-- ជ្រើសរើស / Select --</option>
                  {goldMixOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

            <div>
                <label className="block text-sm font-medium text-primary mb-1">
                    ហាងឆេង / Gold Market Price
                </label>
                <div className="flex gap-1 items-center">
                    <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    <input
                        type="number"
                        step="1"
                        value={formData.manualGoldPrice !== null ? formData.manualGoldPrice : ''}
                        onChange={(e) => setFormData({ ...formData, manualGoldPrice: e.target.value === '' ? null : e.target.value })}
                        placeholder={globalGoldPrice || 'Enter price'}
                        className={`w-full pl-7 pr-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        formData.manualGoldPrice !== null 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 bg-white'
                        }`}
                    />
                    </div>
                    {formData.manualGoldPrice !== null && (
                    <button
                        onClick={() => setFormData({ ...formData, manualGoldPrice: null })}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Reset to global price"
                    >
                        ↻
                    </button>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {formData.manualGoldPrice !== null 
                    ? `Custom price (Global: $${globalGoldPrice})` 
                    : `Using global price: $${globalGoldPrice || 'Not set'}`
                    }
                </p>
                </div>
            </div>

            {/* Items Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">គ្រឿង / Items</h2>
                <button
                  onClick={addItem}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                >
                  {Plus && <Plus size={16} />}
                  បន្ថែម / Add Item
                </button>
              </div>

              {formData.items.map((item, idx) => (
                <div key={idx} className="mb-4 p-4 bg-white rounded border border-tertiary">
                  <div className="flex gap-2 items-start mb-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">ប្រភេទគ្រឿង / Type of Goods</label>
                      <button
                        onClick={() => {
                          setCurrentItemIndex(idx);
                          setShowTypeSelector(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-left hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                      >
                        {item.itemName || '-- ជ្រើសរើស / Select --'}
                      </button>
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-medium text-gray-600 mb-1">លេខកូដ / Code</label>
                      <input
                        type="text"
                        placeholder="№"
                        value={item.productCode}
                        onChange={(e) => updateItem(idx, 'productCode', e.target.value)}
                        className="w-full px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-medium text-gray-600 mb-1">ចំនួន / Qty</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          className="w-16 px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={item.qtyUnit}
                          onChange={(e) => updateItem(idx, 'qtyUnit', e.target.value)}
                          className="w-14 px-1 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-xs"
                        >
                          {qtyUnitOptions.map((unit, i) => (
                            <option key={i} value={unit}>{unit || '-'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="w-40 pt-6">
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          step="1"
                          value={item.manualTotal !== null ? item.manualTotal : ''}
                          onChange={(e) => updateItem(idx, 'manualTotal', e.target.value === '' ? null : e.target.value)}
                          className="w-24 text-sm font-semibold text-gray-700 px-2 py-2 bg-white rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          placeholder={roundTotal(getCalculatedTotal(item)).toString()}
                        />
                        {item.manualTotal !== null && (
                          <button
                            onClick={() => updateItem(idx, 'manualTotal', null)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Reset to calculated"
                          >
                            ↻
                          </button>
                        )}
                      </div>
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        {X && <X size={20} />}
                      </button>
                    )}
                  </div>

                  {/* Sub Items */}
                  <div className="ml-4 space-y-2">
                    {item.subItems.map((subItem, subIdx) => (
                      <div key={subIdx} className="flex gap-2 items-center bg-white p-2 rounded border border-tertiary">
                        <span className="text-xs text-gray-500 w-12">#{subIdx + 1}</span>
                        <div className="flex-1">
                          <input
                            type="number"
                            step="1"
                            placeholder="ទំងន់ / Weight"
                            value={subItem.weight}
                            onChange={(e) => updateSubItem(idx, subIdx, 'weight', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <span className="absolute left-2 top-1 text-gray-500 text-xs">$</span>
                            <input
                              type="number"
                              step="1"
                              placeholder="ឈ្នួល / Labor"
                              value={subItem.laborCost}
                              onChange={(e) => updateSubItem(idx, subIdx, 'laborCost', e.target.value)}
                              className="w-full pl-5 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="w-24 text-right text-sm font-semibold text-gray-700">
                          ${calculateSubItemTotal(subItem).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="mt-2 p-3 bg-accent rounded border border-secondary">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">សរុប / TOTAL</div>
                    <div className="font-semibold text-gray-700">សរុប / TOTAL</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">ចំនួន / Qty</div>
                    <div className="font-semibold text-gray-700">{totals.totalQty}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">ទំងន់ / Weight</div>
                    <div className="font-semibold text-gray-700">{totals.totalWeight.toFixed(1)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">ឈ្នួល / Labor</div>
                    <div className="font-semibold text-gray-700">${totals.totalLabor}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grand Total */}
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">សរុបរួម / Grand Total:</span>
                <span className="text-2xl font-bold text-primary">${calculateGrandTotal().toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                កំណត់ឡើងវិញ / Reset
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {Printer && <Printer size={18} />}
                បោះពុម្ព / Print
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