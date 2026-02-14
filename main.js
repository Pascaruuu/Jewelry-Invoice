const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');

// Load invoice template
function loadInvoiceTemplate() {
  const templatePath = path.join(__dirname, 'invoice-template.html');
  return fs.readFileSync(templatePath, 'utf8');
}

app.disableHardwareAcceleration();

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false  // Allow file:// protocol in iframes
    }
  });

  win.on('focus', () => {
    if (!win.isDestroyed()) {
      win.webContents.focus();
    }
  });

  win.loadFile('index.html');
  
  // Remove menu bar
  win.setMenuBarVisibility(false);
}

// ======================================================================
// IPC HANDLERS
// ======================================================================

// PDF Save Handler
ipcMain.handle('save-pdf', async (event, data) => {
  const { clientName, fileName, htmlContent, basePath } = data;

  if (!basePath) {
    return { success: false, error: 'No save path selected' };
  }

  const clientFolder = path.join(basePath, clientName);

  if (!fs.existsSync(clientFolder)) {
    fs.mkdirSync(clientFolder, { recursive: true });
  }

  const filePath = path.join(clientFolder, `${fileName}.html`);
  fs.writeFileSync(filePath, htmlContent);

  return { success: true, path: filePath };
});

// Select Save Path Handler
ipcMain.handle('select-save-path', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select folder to save invoices'
  });
  
  if (result.filePaths.length > 0) {
    return { success: true, path: result.filePaths[0] };
  }
  
  return { success: false };
});

// Open File Handler
ipcMain.handle('open-file', async (event, filePath) => {
  try {
    await shell.openPath(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Helper function to extract grand total from HTML file
function extractGrandTotalFromHTML(htmlContent) {
  try {
    // Look for the grand total pattern in the HTML
    // Pattern: សរុបរួម / GRAND TOTAL: $1,234
    const grandTotalMatch = htmlContent.match(/GRAND TOTAL:\s*\$([0-9,]+)/i);
    
    if (grandTotalMatch && grandTotalMatch[1]) {
      // Remove commas and parse as number
      const totalString = grandTotalMatch[1].replace(/,/g, '');
      return parseFloat(totalString) || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting grand total:', error);
    return null;
  }
}

// List all saved invoice files (including nested client folders)
ipcMain.handle('list-saved-files', async (event, folderPath) => {
  try {
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      return { success: false, error: 'Folder does not exist' };
    }

    const parsedFiles = [];

    // Function to scan a directory recursively
    function scanDirectory(dirPath, isRoot = false) {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory() && isRoot) {
          // If it's a directory in the root, scan it (client folder)
          scanDirectory(itemPath, false);
        } else if (stats.isFile() && (item.endsWith('.html') || item.endsWith('.pdf'))) {
          // If it's an invoice file, parse it
          const nameWithoutExt = item.replace('.html', '').replace('.pdf', '');
          const parts = nameWithoutExt.split('_');
          
          // Extract total from HTML file content
          let total = null;
          if (item.endsWith('.html')) {
            try {
              const htmlContent = fs.readFileSync(itemPath, 'utf8');
              total = extractGrandTotalFromHTML(htmlContent);
            } catch (error) {
              console.error('Error reading HTML file:', item, error);
            }
          }
          
          parsedFiles.push({
            fileName: item,
            filePath: itemPath,
            date: parts[0] || '',
            clientName: parts[1] || '',
            items: parts.length > 3 ? parts.slice(2, -1).join(', ') : (parts[2] || ''),
            total: total,
            modifiedDate: stats.mtime,
            fileSize: stats.size,
            fileType: item.endsWith('.pdf') ? 'PDF' : 'HTML'
          });
        }
      });
    }

    // Start scanning from the root folder
    scanDirectory(folderPath, true);

    // Sort by modified date (newest first)
    parsedFiles.sort((a, b) => b.modifiedDate - a.modifiedDate);

    return { success: true, files: parsedFiles };
  } catch (error) {
    console.error('Error listing files:', error);
    return { success: false, error: error.message };
  }
});

// Delete file
ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'File does not exist' };
    }
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Restart Print Spooler Handler
ipcMain.handle('restart-print-spooler', async () => {
  try {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    const command = `powershell -Command "Start-Process powershell -ArgumentList 'Restart-Service -Name Spooler -Force' -Verb RunAs"`;
    
    await execPromise(command);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ======================================================================
// APP LIFECYCLE
// ======================================================================

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});