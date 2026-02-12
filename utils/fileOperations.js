// ======================================================================
// FILE OPERATIONS UTILITIES
// ======================================================================

const FileOperations = {
  // QR Code Upload
  handleQRUpload: (e, setQrCodeImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setQrCodeImage(base64);
        localStorage.setItem('jewelryQRCode', base64);
      };
      reader.readAsDataURL(file);
    }
  },

  // Select Save Path
  handleSelectSavePath: async (setSavePath, showPopup, showInput) => {
    try {
      if (typeof require !== 'undefined') {
        try {
          const { ipcRenderer } = require('electron');
          const result = await ipcRenderer.invoke('select-save-path');
          if (result && result.success) {
            setSavePath(result.path);
            localStorage.setItem('jewelrySavePath', result.path);
            await showPopup('success', 'Success', `ទីតាំងរក្សាទុកត្រូវបានកំណត់!\nPath set: ${result.path}`);
          }
        } catch (electronError) {
          console.error('Electron IPC error:', electronError);
          const folderPath = await showInput('Enter save folder path:', 'C:\\Invoices');
          if (folderPath) {
            setSavePath(folderPath);
            localStorage.setItem('jewelrySavePath', folderPath);
            await showPopup('success', 'Success', `ទីតាំងរក្សាទុកត្រូវបានកំណត់!\nPath set: ${folderPath}`);
          }
        }
      } else {
        const folderPath = await showInput('Enter save folder path:', 'C:\\Invoices');
        if (folderPath) {
          setSavePath(folderPath);
          localStorage.setItem('jewelrySavePath', folderPath);
          await showPopup('success', 'Success', `ទីតាំងរក្សាទុកត្រូវបានកំណត់!\nPath set: ${folderPath}`);
        }
      }
    } catch (error) {
      console.error('Error selecting path:', error);
      alert('Error: ' + error.message);
    }
  },

  // Save Receipt as PDF
  handleSaveReceipt: async (
    formData,
    savePath,
    showPopup,
    generateInvoiceHTML,
    goldMixOptions,
    qrCodeImage,
    calculateItemTotal,
    formatDate,
    roundTotal,
    calculateGrandTotal,
    addPaymentRecord
  ) => {
    if (!formData.clientName || !formData.clientName.trim()) {
      await showPopup(
        'error',
        'មិនអាចរក្សាទុកបាន / Cannot Save',
        'សូមបញ្ចូលឈ្មោះអតិថិជន!\nPlease enter a client name!'
      );
      return;
    }
    
    if (!savePath) {
      await showPopup(
        'error',
        'មិនអាចរក្សាទុកបាន / Cannot Save',
        'សូមជ្រើសរើសទីតាំងរក្សាទុកជាមុនសិន!\nPlease select save path first (Go to Settings)'
      );
      return;
    }
    
    try {
      if (typeof require !== 'undefined') {
        const { ipcRenderer } = require('electron');
        
        const htmlContent = await generateInvoiceHTML(
          formData,
          goldMixOptions,
          qrCodeImage,
          calculateItemTotal,
          formatDate,
          roundTotal
        );

        const goodsList = formData.items.map(item => item.itemName).filter(name => name).join('_');
        const now = new Date();
        const timeStamp = `${now.getHours().toString().padStart(2, '0')}h${now.getMinutes().toString().padStart(2, '0')}`;
        const fileName = `${formatDate(formData.date).replace(/\//g, '-')}_${formData.clientName}_${goodsList}_${timeStamp}`;
        
        const result = await ipcRenderer.invoke('save-pdf', {
          clientName: formData.clientName,
          fileName: fileName,
          basePath: savePath,
          htmlContent: htmlContent
        });
                  
        if (result && result.success) {
          const orderSummary = formData.items
            .map(item => `${item.itemName}${item.productCode ? ` N${item.productCode}` : ''}`)
            .filter(Boolean)
            .join(', ');
          
          const paymentRecord = {
            id: Date.now(),
            clientName: formData.clientName,
            orders: orderSummary,
            savedTime: new Date().toLocaleString(),
            total: calculateGrandTotal(),
            status: 'pending',
            filePath: result.path
          };
          
          addPaymentRecord(paymentRecord);
          
          // Show success popup with open option
          await showPopup(
            'success',
            'រក្សាទុកជោគជ័យ! / Saved Successfully!',
            `Path: ${result.path}\n\nតើអ្នកចង់បើកឯកសារដើម្បីបោះពុម្ពទេ?\nDo you want to open the file to print?`,
            async () => {
              try {
                await ipcRenderer.invoke('open-file', result.path);
              } catch (error) {
                await showPopup('error', 'Error', 'Failed to open file: ' + error.message);
              }
            }
          );
        } else {
          await showPopup(
            'error',
            'បរាជ័យក្នុងការរក្សាទុក! / Save Failed!',
            result?.error || 'Unknown error'
          );
        }
      } else {
        alert('Save feature only works in desktop app');
      }
    } catch (error) {
      console.error('Save error:', error);
      await showPopup('error', 'Error', error.message);
    }
  },

  // Restart Print Spooler
  restartPrintSpooler: async (showPopup) => {
    try {
      if (typeof require !== 'undefined') {
        const { ipcRenderer } = require('electron');
        const result = await ipcRenderer.invoke('restart-print-spooler');
        
        if (result.success) {
          await showPopup('success', 'Success', '✓ Print Spooler restarted successfully!\nYou can now try printing again.');
        } else {
          await showPopup('error', 'Failed', '✗ Failed to restart Print Spooler.\nPlease try manually via services.msc');
        }
      } else {
        await showPopup('info', 'Not Available', 'This feature only works in the desktop app');
      }
    } catch (error) {
      await showPopup('error', 'Error', error.message);
    }
  }
};

// Make available globally
window.FileOperations = FileOperations;