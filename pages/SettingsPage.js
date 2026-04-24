// ======================================================================
// SETTINGS PAGE
// ======================================================================

function SettingsPage({
  currentSettingsSection,
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
  showInput,
  restartPrintSpooler
}) {
  // Get icons from window
  const { Plus, X } = window.Icons || {};

  const sectionMeta = {
    'settings-paths': {
      title: 'រក្សាទុកទី / Save Path & QR Code',
      subtitle: 'Manage the invoice save destination and uploaded QR code.'
    },
    'settings-clients': {
      title: 'ផ្សារ / Markets & Locations',
      subtitle: 'Organize grouped clients by market or location.'
    },
    'settings-products': {
      title: 'ប្រភេទគ្រឿង / Type of Goods',
      subtitle: 'Manage grouped product names for quick selection.'
    },
    'settings-units': {
      title: 'ឯកតាចំនួន / Units & Gold Values',
      subtitle: 'Control quantity units and available gold mix values.'
    },
    'settings-printer': {
      title: 'Printer Settings',
      subtitle: 'Use maintenance actions when Windows printing gets stuck.'
    }
  };

  const activeSection = sectionMeta[currentSettingsSection] || sectionMeta['settings-paths'];

  return (
    <div className="page">
      <div className="page-narrow settings-page">
        <div className="page-heading-row">
          <div>
            <h2 className="page-title">ការកំណត់ / Settings</h2>
            <p className="page-subtitle">{activeSection.subtitle}</p>
          </div>
        </div>

        {currentSettingsSection === 'settings-paths' && (
        <section id="settings-paths" className="editor-section settings-section">
          <div className="section-heading-row">
            <h3 className="section-title">{sectionMeta['settings-paths'].title}</h3>
          </div>
          <div className="panel settings-panel">
            <div className="settings-card-heading">Save Path</div>
            <div className="settings-inline-row">
              <button
                onClick={handleSelectSavePath}
                className="btn btn-primary"
              >
                Browse...
              </button>
              <span className="settings-path-value">{savePath || 'Not set'}</span>
            </div>
          </div>
          <div className="panel settings-panel">
            <div className="settings-card-heading">QR Code</div>
            <div className="settings-inline-row">
              <button
                onClick={() => document.getElementById('qrFileInput').click()}
                className="btn btn-secondary"
              >
                Upload Image
              </button>
              <span className="settings-file-status">{qrCodeImage ? 'Image loaded' : 'No image set'}</span>
            </div>
            <input
              type="file"
              id="qrFileInput"
              accept="image/*"
              onChange={handleQRUpload}
              style={{display: 'none'}}
            />
            {qrCodeImage && (
              <img src={qrCodeImage} alt="QR Preview" className="qr-preview" />
            )}
          </div>
        </section>
        )}

        {currentSettingsSection === 'settings-clients' && (
        <section id="settings-clients" className="editor-section settings-section">
          <div className="section-heading-row">
            <h3 className="section-title">{sectionMeta['settings-clients'].title}</h3>
            <button
              onClick={async () => {
                const groupName = await showInput('Enter market/location name:');
                if (groupName) {
                  addClientGroup(groupName);
                }
              }}
              className="btn btn-success btn-small"
            >
              {Plus && <Plus size={14} />}
              Add Market
            </button>
          </div>

          {clientGroups.length === 0 ? (
            <div className="muted-panel">No markets yet</div>
          ) : (
            <div className="settings-group-list">
              {clientGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="panel settings-group-card">
                  <div className="settings-group-header">
                    <div>
                      <h4 className="subsection-title">{group.name}</h4>
                      <p className="help-text">{group.items.length} clients</p>
                    </div>
                    <div className="row-wrap">
                      <button
                        onClick={async () => {
                          const newName = await showInput('Rename market:', group.name);
                          if (newName) {
                            renameClientGroup(groupIdx, newName);
                          }
                        }}
                        className="btn btn-secondary btn-xs"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete market "${group.name}"?`)) {
                            removeClientGroup(groupIdx);
                          }
                        }}
                        className="btn btn-link-danger btn-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="settings-add-row">
                    <input
                      type="text"
                      id={`newClient-${groupIdx}`}
                      placeholder="Add new client..."
                      className="form-control flex-fill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addClientToGroup(groupIdx, e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = /** @type {HTMLInputElement} */ (document.getElementById(`newClient-${groupIdx}`));
                        if (input.value.trim()) {
                          addClientToGroup(groupIdx, input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="btn btn-success btn-small"
                    >
                      Add
                    </button>
                  </div>

                  <div className="row-wrap">
                    {group.items.length === 0 ? (
                      <p className="empty-text empty-text-xs">No clients in this market yet</p>
                    ) : (
                      group.items.map((client, clientIdx) => (
                        <span
                          key={clientIdx}
                          className="pill settings-pill"
                        >
                          {client}
                          <button
                            onClick={() => removeClientFromGroup(groupIdx, clientIdx)}
                            className="btn-link-danger"
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
        </section>
        )}

        {currentSettingsSection === 'settings-products' && (
        <section id="settings-products" className="editor-section settings-section">
          <div className="section-heading-row">
            <h3 className="section-title">{sectionMeta['settings-products'].title}</h3>
            <button
              onClick={async () => {
                const groupName = await showInput('Enter group name:');
                if (groupName) {
                  addGroup(groupName);
                }
              }}
              className="btn btn-success btn-small"
            >
              {Plus && <Plus size={14} />}
              Add Group
            </button>
          </div>

          {itemTypeGroups.length === 0 ? (
            <div className="muted-panel">No groups yet</div>
          ) : (
            <div className="settings-group-list">
              {itemTypeGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="panel settings-group-card">
                  <div className="settings-group-header">
                    <div>
                      <h4 className="subsection-title">{group.name}</h4>
                      <p className="help-text">{group.items.length} items</p>
                    </div>
                    <div className="row-wrap">
                      <button
                        onClick={async () => {
                          const newName = await showInput('Rename group:', group.name);
                          if (newName) {
                            renameGroup(groupIdx, newName);
                          }
                        }}
                        className="btn btn-secondary btn-xs"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete group "${group.name}"?`)) {
                            removeGroup(groupIdx);
                          }
                        }}
                        className="btn btn-link-danger btn-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="settings-add-row">
                    <input
                      type="text"
                      id={`newItem-${groupIdx}`}
                      placeholder="Add new item..."
                      className="form-control flex-fill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addItemToGroup(groupIdx, e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = /** @type {HTMLInputElement} */ (document.getElementById(`newItem-${groupIdx}`));
                        if (input.value.trim()) {
                          addItemToGroup(groupIdx, input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="btn btn-success btn-small"
                    >
                      Add
                    </button>
                  </div>

                  <div className="row-wrap">
                    {group.items.length === 0 ? (
                      <p className="empty-text empty-text-xs">No items in this group yet</p>
                    ) : (
                      group.items.map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="pill settings-pill"
                        >
                          {item}
                          <button
                            onClick={() => removeItemFromGroup(groupIdx, itemIdx)}
                            className="btn-link-danger"
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
        </section>
        )}

        {currentSettingsSection === 'settings-units' && (
        <>
        <section id="settings-units" className="editor-section settings-section">
          <div className="section-heading-row">
            <h3 className="section-title">ឯកតាចំនួន / Quantity Units</h3>
          </div>
          <div className="settings-add-row">
            <input
              type="text"
              id="newQtyUnit"
              placeholder="Add new unit..."
              className="form-control flex-fill"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  addQtyUnit(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = /** @type {HTMLInputElement} */ (document.getElementById('newQtyUnit'));
                if (input.value.trim()) {
                  addQtyUnit(input.value.trim());
                  input.value = '';
                }
              }}
              className="btn btn-success"
            >
              Add
            </button>
          </div>
          <div className="row-wrap">
            {qtyUnitOptions.filter(u => u).map((unit, idx) => (
              <span
                key={idx}
                className="pill settings-pill"
              >
                {unit}
                <button
                  onClick={() => removeQtyUnit(unit)}
                  className="btn-link-danger"
                >
                  {X && <X size={14} />}
                </button>
              </span>
            ))}
          </div>
        </section>

        <section className="editor-section settings-section">
          <div className="section-heading-row">
            <h3 className="section-title">ផ្លាទីនទឹក / Gold Mix Options</h3>
          </div>
          <div className="settings-gold-row">
            <input
              type="text"
              id="newGoldLabel"
              placeholder="Label (e.g., 80%)"
              className="form-control flex-fill"
            />
            <input
              type="text"
              id="newGoldValue"
              placeholder="Value (e.g., 80)"
              className="form-control flex-fill"
            />
            <button
              onClick={() => {
                const labelInput = /** @type {HTMLInputElement} */ (document.getElementById('newGoldLabel'));
                const valueInput = /** @type {HTMLInputElement} */ (document.getElementById('newGoldValue'));
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
              className="btn btn-success"
            >
              Add
            </button>
          </div>
          <div className="row-wrap">
            {goldMixOptions.map((mix, idx) => (
              <span
                key={idx}
                className="pill settings-pill"
              >
                {mix.label} <span className="help-text">({mix.value})</span>
                <button
                  onClick={() => removeGoldMix(mix.value)}
                  className="btn-link-danger"
                >
                  {X && <X size={14} />}
                </button>
              </span>
            ))}
          </div>
        </section>
        </>
        )}

        {currentSettingsSection === 'settings-printer' && (
        <section id="settings-printer" className="editor-section settings-section">
          <div className="section-heading-row">
            <h3 className="section-title">{sectionMeta['settings-printer'].title}</h3>
          </div>
          <p className="help-text">
            Use this when Windows printing gets stuck and the printer queue needs a restart.
          </p>
          <div>
            <button
              onClick={restartPrintSpooler}
              className="btn btn-secondary"
            >
              Restart Printer Spooler
            </button>
          </div>
        </section>
        )}
      </div>
    </div>
  );
}

// Make component available globally
window.SettingsPage = SettingsPage;
