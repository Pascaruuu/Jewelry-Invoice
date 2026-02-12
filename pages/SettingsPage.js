// ======================================================================
// SETTINGS PAGE
// ======================================================================

function SettingsPage({
  savePath,
  handleSelectSavePath,
  clientGroups,
  addClientGroup,
  renameClientGroup,
  removeClientGroup,
  addClientToGroup,
  removeClientFromGroup,
  qrCodeImage,
  handleQRUpload,
  itemTypeGroups,
  addGroup,
  renameGroup,
  removeGroup,
  addItemToGroup,
  removeItemFromGroup,
  qtyUnitOptions,
  addQtyUnit,
  removeQtyUnit,
  goldMixOptions,
  addGoldMix,
  removeGoldMix,
  showInput
}) {
  // Get icons from window
  const { Plus, X } = window.Icons || {};

  return (
    <div className="flex-1 ml-64 p-8">
      <h2 className="text-2xl font-bold mb-6">ការកំណត់ / Settings</h2>

      {/* Save Path */}
      <div className="bg-white rounded-lg shadow-md border border-tertiary p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">រក្សាទុកទី / Save Path</h3>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleSelectSavePath}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
          >
            Browse...
          </button>
          <span className="text-sm text-gray-600">{savePath || 'Not set'}</span>
        </div>
      </div>

      {/* GROUPED Client Management */}
      <div className="bg-white rounded-lg shadow-md border border-tertiary p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">ផ្សារ / Markets & Locations (Grouped Clients)</h3>
          <button
            onClick={async () => {
              const groupName = await showInput('Enter market/location name:');
              if (groupName) {
                addClientGroup(groupName);
              }
            }}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
          >
            {Plus && <Plus size={14} />}
            Add Market
          </button>
        </div>

        {clientGroups.length === 0 ? (
          <p className="text-sm text-gray-500">No markets yet. Click "Add Market" to create one.</p>
        ) : (
          <div className="space-y-4">
            {clientGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="border border-tertiary rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-md text-primary">{group.name}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const newName = await showInput('Rename market:', group.name);
                        if (newName) {
                          renameClientGroup(groupIdx, newName);
                        }
                      }}
                      className="text-xs px-2 py-1 bg-accent text-primary rounded hover:bg-tertiary transition-colors"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete market "${group.name}"?`)) {
                          removeClientGroup(groupIdx);
                        }
                      }}
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete Market
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    id={`newClient-${groupIdx}`}
                    placeholder="Add new client..."
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        addClientToGroup(groupIdx, e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(`newClient-${groupIdx}`);
                      if (input.value.trim()) {
                        addClientToGroup(groupIdx, input.value.trim());
                        input.value = '';
                      }
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.items.length === 0 ? (
                    <p className="text-xs text-gray-500">No clients in this market yet</p>
                  ) : (
                    group.items.map((client, clientIdx) => (
                      <span
                        key={clientIdx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border rounded text-sm"
                      >
                        {client}
                        <button
                          onClick={() => removeClientFromGroup(groupIdx, clientIdx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          {X && <X size={12} />}
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-lg shadow-md border border-tertiary p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">QR Code</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleQRUpload}
          className="mb-2"
        />
        {qrCodeImage && (
          <img src={qrCodeImage} alt="QR Preview" className="w-32 h-auto mt-2" />
        )}
      </div>

      {/* GROUPED Type of Goods */}
      <div className="bg-white rounded-lg shadow-md border border-tertiary p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">ប្រភេទគ្រឿង / Type of Goods (Grouped)</h3>
          <button
            onClick={async () => {
              const groupName = await showInput('Enter group name:');
              if (groupName) {
                addGroup(groupName);
              }
            }}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
          >
            {Plus && <Plus size={14} />}
            Add Group
          </button>
        </div>

        {itemTypeGroups.length === 0 ? (
          <p className="text-sm text-gray-500">No groups yet. Click "Add Group" to create one.</p>
        ) : (
          <div className="space-y-4">
            {itemTypeGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="border border-tertiary rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-md text-primary">{group.name}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const newName = await showInput('Rename group:', group.name);
                        if (newName) {
                          renameGroup(groupIdx, newName);
                        }
                      }}
                      className="text-xs px-2 py-1 bg-accent text-primary rounded hover:bg-tertiary transition-colors"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete group "${group.name}"?`)) {
                          removeGroup(groupIdx);
                        }
                      }}
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete Group
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    id={`newItem-${groupIdx}`}
                    placeholder="Add new item..."
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        addItemToGroup(groupIdx, e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(`newItem-${groupIdx}`);
                      if (input.value.trim()) {
                        addItemToGroup(groupIdx, input.value.trim());
                        input.value = '';
                      }
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.items.length === 0 ? (
                    <p className="text-xs text-gray-500">No items in this group yet</p>
                  ) : (
                    group.items.map((item, itemIdx) => (
                      <span
                        key={itemIdx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border rounded text-sm"
                      >
                        {item}
                        <button
                          onClick={() => removeItemFromGroup(groupIdx, itemIdx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          {X && <X size={12} />}
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quantity Units */}
      <div className="bg-white rounded-lg shadow-md border border-tertiary p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">ឯកតាចំនួន / Quantity Units</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            id="newQtyUnit"
            placeholder="Add new unit..."
            className="flex-1 px-3 py-2 border rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                addQtyUnit(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById('newQtyUnit');
              if (input.value.trim()) {
                addQtyUnit(input.value.trim());
                input.value = '';
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {qtyUnitOptions.filter(u => u).map((unit, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded"
            >
              {unit}
              <button
                onClick={() => removeQtyUnit(unit)}
                className="text-red-600 hover:text-red-800"
              >
                {X && <X size={14} />}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Gold Mix */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">ផ្លាទីនទឹក / Gold Mix Options</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            id="newGoldLabel"
            placeholder="Label (e.g., 80%)"
            className="flex-1 px-3 py-2 border rounded"
          />
          <input
            type="text"
            id="newGoldValue"
            placeholder="Value (e.g., 80)"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={() => {
              const labelInput = document.getElementById('newGoldLabel');
              const valueInput = document.getElementById('newGoldValue');
              if (labelInput.value.trim() && valueInput.value.trim()) {
                const newMix = { label: labelInput.value.trim(), value: valueInput.value.trim() };
                const isDuplicate = goldMixOptions.some(mix => mix.value === newMix.value);
                addGoldMix(newMix);
                if (!isDuplicate) {
                  labelInput.value = '';
                  valueInput.value = '';
                }
              } else {
                alert('Please fill in both label and value');
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {goldMixOptions.map((mix, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded"
            >
              {mix.label} <span className="text-xs text-gray-500">({mix.value})</span>
              <button
                onClick={() => removeGoldMix(mix.value)}
                className="text-red-600 hover:text-red-800"
              >
                {X && <X size={14} />}
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Make component available globally
window.SettingsPage = SettingsPage;