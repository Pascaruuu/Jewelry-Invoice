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
    <div className="flex-1 ml-64 p-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">📁 Saved Files</h2>

      {/* No save path configured */}
      {!savePath ? (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
          <p className="text-yellow-800 mb-4 text-lg">
            ⚠️ No save path configured
          </p>
          <p className="text-yellow-700 mb-4">
            Please set a save path in Settings to view saved files.
          </p>
          <button
            onClick={() => setCurrentPage('settings')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
          >
            Go to Settings
          </button>
        </div>
      ) : loading ? (
        /* Loading state */
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Loading files...</div>
        </div>
      ) : files.length === 0 ? (
        /* Empty state */
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg mb-2">📭 No saved files found</p>
          <p className="text-gray-500 text-sm mb-4">
            Files will appear here once you save invoices.
          </p>
          <button
            onClick={loadFiles}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      ) : (
        <>
          {/* Search & Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 mb-4">
            <div className="flex gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search by client, items, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>

              {/* Date Filter */}
              <div className="w-48">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="all">All Files</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="date-desc">📅 Newest First</option>
                  <option value="date-asc">📅 Oldest First</option>
                  <option value="total-desc">💰 Highest Total</option>
                  <option value="total-asc">💰 Lowest Total</option>
                  <option value="client-asc">👤 Client A-Z</option>
                  <option value="client-desc">👤 Client Z-A</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredFiles.length} of {files.length} files
              {searchQuery && <span className="ml-2 text-blue-600">• Filtered by search</span>}
              {dateFilter !== 'all' && <span className="ml-2 text-blue-600">• Filtered by date</span>}
            </div>
          </div>

          {/* File list table */}
          {filteredFiles.length === 0 ? (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg mb-2">No files match your filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('all');
                }}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-primary">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Client</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Items</th>
                    <th className="text-right py-3 px-4 font-semibold text-primary">Total</th>
                    <th className="text-center py-3 px-4 font-semibold text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file, idx) => (
                    <tr 
                      key={idx}
                      onDoubleClick={() => handleDoubleClick(file)}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">{file.date}</td>
                      <td className="py-3 px-4 text-sm font-medium">{file.clientName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{file.items}</td>
                      <td className="text-right py-3 px-4 text-sm font-semibold">
                        {file.total ? `$${file.total.toLocaleString()}` : '-'}
                      </td>
                      <td className="text-center py-3 px-4">
                        <button
                          onClick={(e) => handleDelete(file, e)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          🗑 Delete
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300">
              <h3 className="text-lg font-bold text-primary">{selectedFile.fileName}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* iframe Preview */}
            {selectedFile.fileType === 'HTML' ? (
              <iframe
                src={getFileUrl(selectedFile.filePath)}
                className="w-full border border-gray-300 rounded mb-4"
                style={{ height: '65vh' }}
                title="Invoice Preview"
              />
            ) : (
              <div className="bg-gray-100 border border-gray-300 rounded p-12 text-center mb-4" style={{ height: '65vh' }}>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-700 text-lg font-semibold mb-2">PDF File</p>
                  <p className="text-gray-500 text-sm">
                    PDF preview not available in modal
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Click "Open in Browser" below to view the PDF
                  </p>
                </div>
              </div>
            )}

            {/* File Info Summary - Compact Version */}
            <div className="bg-gray-50 rounded-lg px-4 py-2 mb-4">
              <div className="text-sm text-gray-700">
                <strong>Date:</strong> {selectedFile.date}
                <span className="mx-3">•</span>
                <strong>Client:</strong> {selectedFile.clientName}
                <span className="mx-3">•</span>
                <strong>Items:</strong> {selectedFile.items}
                <span className="mx-3">•</span>
                <strong>Total:</strong> {selectedFile.total ? `$${selectedFile.total.toLocaleString()}` : '-'}
              </div>
            </div>

            {/* Preview Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleOpenInBrowser(selectedFile)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                🌐 Open in Browser
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
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