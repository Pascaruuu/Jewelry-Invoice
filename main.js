const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require('fs');
const path = require('path');

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

// PDF Save Handler (updated)
ipcMain.handle('save-pdf', async (event, data) => {
  const { clientName, fileName, htmlContent, basePath } = data;
  
  if (!basePath) {
    return { success: false, error: 'No save path selected' };
  }
  
  const clientFolder = path.join(basePath, clientName);
  
  // Create client folder if doesn't exist
  if (!fs.existsSync(clientFolder)) {
    fs.mkdirSync(clientFolder, { recursive: true });
  }
  
  // Save HTML file with new naming format
  const fullFileName = `${fileName}.html`;
  const filePath = path.join(clientFolder, fullFileName);
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