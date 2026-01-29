const { app, BrowserWindow, ipcMain, dialog} = require('electron');
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
    contextIsolation: false
  }
  });

  win.on('focus', () => {
    if (!win.isDestroyed()) {
      win.webContents.focus();
    }
  });

  //const ses = win.webContents.session;

  // ses.clearCache();
  // ses.clearStorageData({
  //   storages: [
  //     'localstorage',
  //     'sessionstorage',
  //     'indexeddb',
  //     'websql',
  //     'cachestorage'
  //   ]
  // });

  win.loadFile('index.html');
  
  // Remove menu bar
  win.setMenuBarVisibility(false);
}

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
    const { shell } = require('electron');
    await shell.openPath(filePath);
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
    
    // Use PowerShell to restart the service with elevation
    const command = `powershell -Command "Start-Process powershell -ArgumentList 'Restart-Service -Name Spooler -Force' -Verb RunAs"`;
    
    await execPromise(command);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

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