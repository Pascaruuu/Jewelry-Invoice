// ======================================================================
// SAVED FILES PAGE - Phase 3: iframe Preview (Fixed Spacing)
// ======================================================================

function SavedFilesPage({ savePath, setCurrentPage }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Load files from folder
  useEffect(() => {
    loadFiles();
  }, [savePath]);

  const loadFiles = async () => {
    if (!savePath) {
      setLoading(false);
      return;
    }

    try {
      if (typeof require !== 'undefined') {
        const { ipcRenderer } = require('electron');
        const result = await ipcRenderer.invoke('list-saved-files', savePath);
        
        if (result.success) {
          setFiles(result.files);
        } else {
          console.error('Error loading files:', result.error);
        }
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
    setLoading(false);
  };

  // Convert Windows file path to proper file:// URL
  const getFileUrl = (filePath) => {
    // Convert backslashes to forward slashes
    let url = filePath.replace(/\\/g, '/');
    
    // Encode special characters but keep forward slashes
    url = url.split('/').map(segment => encodeURIComponent(segment)).join('/');
    
    // Add file:// protocol
    return `file:///${url}`;
  };

  // Filter and sort files
  const getFilteredAndSortedFiles = () => {
    let filtered = [...files];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.clientName.toLowerCase().includes(query) ||
        file.items.toLowerCase().includes(query) ||
        file.date.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(file => {
        const fileDate = new Date(file.modifiedDate);
        
        if (dateFilter === 'yesterday') {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return fileDate >= yesterday && fileDate < today;
        }
        
        if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return fileDate >= weekAgo;
        }
        
        if (dateFilter === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return fileDate >= monthAgo;
        }
        
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date-desc') return b.modifiedDate - a.modifiedDate;
      if (sortBy === 'date-asc') return a.modifiedDate - b.modifiedDate;
      if (sortBy === 'total-desc') return (b.total || 0) - (a.total || 0);
      if (sortBy === 'total-asc') return (a.total || 0) - (b.total || 0);
      if (sortBy === 'client-asc') return a.clientName.localeCompare(b.clientName);
      if (sortBy === 'client-desc') return b.clientName.localeCompare(a.clientName);
      return 0;
    });

    return filtered;
  };

  const filteredFiles = getFilteredAndSortedFiles();

  const handleDoubleClick = (file) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  const handleDelete = async (file, e) => {
    e.stopPropagation();
    
    const confirmed = window.confirm(
      `Delete this file?\n\n${file.fileName}\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      if (typeof require !== 'undefined') {
        const { ipcRenderer } = require('electron');
        const result = await ipcRenderer.invoke('delete-file', file.filePath);
        
        if (result.success) {
          loadFiles();
        } else {
          alert('Error deleting file: ' + result.error);
        }
      }
    } catch (error) {
      alert('Error deleting file: ' + error.message);
    }
  };

  const handleOpenInBrowser = async (file) => {
    try {
      if (typeof require !== 'undefined') {
        const { ipcRenderer } = require('electron');
        await ipcRenderer.invoke('open-file', file.filePath);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">Files Management</h2>

      {/* No save path configured */}
      {!savePath ? (
        <div className="warning-panel">
          <p className="text-lg">
            No save path configured
          </p>
          <p>
            Please set a save path in Settings to view saved files.
          </p>
          <button
            onClick={() => setCurrentPage('settings')}
            className="btn btn-primary"
          >
            Go to Settings
          </button>
        </div>
      ) : loading ? (
        /* Loading state */
        <div className="muted-panel">
          <div className="text-muted text-lg">Loading files...</div>
        </div>
      ) : files.length === 0 ? (
        /* Empty state */
        <div className="muted-panel">
          <p className="text-lg">No saved files found</p>
          <p className="text-muted">
            Files will appear here once you save invoices.
          </p>
          <button
            onClick={loadFiles}
            className="btn btn-primary"
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          {/* Search & Filter Controls */}
          <div className="section-card">
            <div className="row">
              {/* Search Input */}
              <div className="flex-fill">
                <input
                  type="text"
                  placeholder="Search by client, items, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Date Filter */}
              <div className="filter-control">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="form-control"
                >
                  <option value="all">All Files</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="filter-control">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-control"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="total-desc">Highest Total</option>
                  <option value="total-asc">Lowest Total</option>
                  <option value="client-asc">Client A-Z</option>
                  <option value="client-desc">Client Z-A</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="help-text">
              Showing {filteredFiles.length} of {files.length} files
              {searchQuery && <span className="file-summary-separator text-primary">• Filtered by search</span>}
              {dateFilter !== 'all' && <span className="file-summary-separator text-primary">• Filtered by date</span>}
            </div>
          </div>

          {/* File list table */}
          {filteredFiles.length === 0 ? (
            <div className="muted-panel">
              <p className="text-lg">No files match your filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('all');
                }}
                className="btn btn-muted"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="table-shell">
              <table className="main-table">
                <thead>
                  <tr>
                    <th className="text-left">Date</th>
                    <th className="text-left">Client</th>
                    <th className="text-left">Items</th>
                    <th className="text-right">Total</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file, idx) => (
                    <tr 
                      key={idx}
                      onDoubleClick={() => handleDoubleClick(file)}
                      className="clickable-row"
                    >
                      <td>{file.date}</td>
                      <td className="font-medium">{file.clientName}</td>
                      <td className="text-muted">{file.items}</td>
                      <td className="text-right font-semibold">
                        {file.total ? `$${file.total.toLocaleString()}` : '-'}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={(e) => handleDelete(file, e)}
                          className="btn btn-link-danger btn-small"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Preview Modal with iframe */}
      {showPreview && selectedFile && (
        <div 
          className="modal-overlay"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="modal-card modal-card-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Header */}
            <div className="modal-header divider-bottom">
              <h3 className="modal-title text-primary">{selectedFile.fileName}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="modal-close text-2xl"
              >
                ✕
              </button>
            </div>

            {/* iframe Preview */}
            {selectedFile.fileType === 'HTML' ? (
              <iframe
                src={getFileUrl(selectedFile.filePath)}
                className="preview-frame"
                title="Invoice Preview"
              />
            ) : (
              <div className="preview-placeholder">
                <div>
                  <div className="text-6xl">PDF</div>
                  <p className="text-lg font-semibold">PDF File</p>
                  <p className="text-muted">
                    PDF preview not available in modal
                  </p>
                  <p className="text-muted">
                    Click "Open in Browser" below to view the PDF
                  </p>
                </div>
              </div>
            )}

            {/* File Info Summary - Compact Version */}
            <div className="file-summary">
              <div>
                <strong>Date:</strong> {selectedFile.date}
                <span className="file-summary-separator">•</span>
                <strong>Client:</strong> {selectedFile.clientName}
                <span className="file-summary-separator">•</span>
                <strong>Items:</strong> {selectedFile.items}
                <span className="file-summary-separator">•</span>
                <strong>Total:</strong> {selectedFile.total ? `$${selectedFile.total.toLocaleString()}` : '-'}
              </div>
            </div>

            {/* Preview Actions */}
            <div className="row row-center">
              <button
                onClick={() => handleOpenInBrowser(selectedFile)}
                className="btn btn-primary"
              >
                Open in Browser
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="btn btn-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.SavedFilesPage = SavedFilesPage;
