// ======================================================================
// SIDEBAR COMPONENT
// ======================================================================

function Sidebar({ currentPage, setCurrentPage, currentSettingsSection, setCurrentSettingsSection, drafts, activeTab, loadDraft, deleteDraft, addNewDraft, theme, toggleTheme }) {
  const { FileText, Wallet, Settings, Folder, Plus, X } = window.Icons || {};
  const isDarkTheme = theme === 'dark';

  const navItems = [
    { id: 'invoice', label: 'Invoice', icon: FileText },
    { id: 'payment', label: 'Payment History', icon: Wallet },
    { id: 'files', label: 'Files Management', icon: Folder }
  ];

  const settingsSections = [
    { id: 'settings-paths', label: 'Paths & QR Code' },
    { id: 'settings-clients', label: 'Client Management' },
    { id: 'settings-products', label: 'Product Management' },
    { id: 'settings-units', label: 'Unit & Value Management' },
    { id: 'settings-printer', label: 'Printer Settings' }
  ];

  return (
    <>
      <nav className="activity-bar" aria-label="Primary navigation">
        <div className="activity-bar-main">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`activity-button ${currentPage === item.id ? 'is-active' : ''}`}
                title={item.label}
                aria-label={item.label}
              >
                {Icon && <Icon size={26} />}
              </button>
            );
          })}
        </div>

        <div className="activity-bar-bottom">
          <button
            type="button"
            onClick={toggleTheme}
            className="activity-button"
            title={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`}
          >
            <span className="activity-theme-icon">{isDarkTheme ? '☀' : '☾'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="activity-button"
            title="Refresh page"
            aria-label="Refresh page"
          >
            <span className="activity-refresh-icon">↻</span>
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`activity-button ${currentPage === 'settings' ? 'is-active' : ''}`}
            title="Settings"
            aria-label="Settings"
          >
            {Settings && <Settings size={26} />}
          </button>
        </div>
      </nav>

      {currentPage === 'invoice' && (
        <aside className="page-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-heading">Drafts</span>
            <button
              onClick={addNewDraft}
              className="btn btn-secondary btn-icon"
              title="New draft"
              aria-label="New draft"
            >
              {Plus && <Plus size={14} />}
            </button>
          </div>

          <div className="draft-list">
            {drafts.length === 0 ? (
              <p className="empty-text sidebar-empty">No drafts yet</p>
            ) : drafts.map((draft, idx) => {
              const orderItems = draft.items.map(i => i.itemName).filter(Boolean).join(', ');
              const draftName = `${idx + 1} - ${draft.clientName || 'New'}${orderItems ? `_${orderItems}` : ''}`;
              return (
                <div
                  key={idx}
                  className={`draft-button ${activeTab === idx ? 'is-active' : ''}`}
                >
                  <button
                    onClick={() => {
                      loadDraft(idx);
                      setCurrentPage('invoice');
                    }}
                    className="draft-load"
                  >
                    <span className="truncate">{draftName}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDraft(idx);
                    }}
                    className="draft-delete"
                    title="Delete draft"
                    aria-label="Delete draft"
                  >
                    {X && <X size={12} />}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {currentPage === 'settings' && (
        <aside className="page-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-heading">Settings</span>
          </div>
          <div className="sidebar-stack">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSettingsSection(section.id)}
                className={`nav-button ${currentSettingsSection === section.id ? 'is-active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </aside>
      )}
    </>
  );
}

window.Sidebar = Sidebar;
