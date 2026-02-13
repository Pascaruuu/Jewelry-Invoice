// ======================================================================
// MAIN APP COMPONENT
// ======================================================================

const { useState, useEffect } = React;

function ReceiptCalculator() {
  // Get components from window
  const { Header, Sidebar, GroupedTypeSelector, GroupedClientSelector, InputModal, CustomPopup } = window;
  const { InvoicePage, PaymentHistoryPage, SettingsPage, PrintView } = window;

  // State declarations
  const [showPrintView, setShowPrintView] = useState(false);
  const [currentPage, setCurrentPage] = useState('invoice');
  const [drafts, setDrafts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [savePath, setSavePath] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [globalGoldPrice, setGlobalGoldPrice] = useState('');
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputModalData, setInputModalData] = useState({ title: '', defaultValue: '', onSubmit: null });
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [popup, setPopup] = useState(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    goldMix: '',
    goldPrice: '',
    manualGoldPrice: null,
    items: [{ 
      itemName: '', 
      quantity: '1',
      qtyUnit: '',
      productCode: '',
      subItems: [{ weight: '', laborCost: '' }],
      manualTotal: null
    }]
  });

  const [itemTypeGroups, setItemTypeGroups] = useState([
    {
      name: '3D Series',
      items: ['ខ្សែក SVZ', 'ខ្សែដៃ BZ']
    },
    {
      name: 'Molded Series',
      items: ['KZ', 'PZ', 'EZ', 'RZ']
    },
    {
      name: 'Client Provided',
      items: ['ខ្សែក', 'ខ្សែដៃ', 'កងដៃ', 'ក្រវឹល', 'កាវ', 'បន្តោង', 'ចិញ្ចៀន']
    }
  ]);

  const [clientGroups, setClientGroups] = useState([
    {
      name: 'ផ្សារ Olympic',
      items: []
    },
    {
      name: 'ផ្សារ អូរឫស្សី',
      items: []
    },
    {
      name: 'ផ្សារ ទទព',
      items: []
    },
    {
      name: 'ផ្សារថ្មី',
      items: []
    },
    {
      name: 'នៅផ្ទះ',
      items: []
    }
  ]);

  const [goldMixOptions, setGoldMixOptions] = useState([
    { label: '50%', value: '50' },
    { label: '60%', value: '60' },
    { label: '65%', value: '65' },
    { label: '70%', value: '70' },
    { label: '75%', value: '75' },
    { label: '78%', value: '78' },
    { label: 'ស58.5%', value: '58.5' },
    { label: 'ស70%', value: '70-white' },
    { label: 'ស78%', value: '78-white' }
  ]);

  const [qtyUnitOptions, setQtyUnitOptions] = useState(['', 'P', 'ដុំ', 'គូ']);

  // Load data from localStorage
  useEffect(() => {
    const savedDrafts = localStorage.getItem('jewelryDrafts');
    if (savedDrafts) setDrafts(JSON.parse(savedDrafts));
    
    const savedPath = localStorage.getItem('jewelrySavePath');
    if (savedPath) setSavePath(savedPath);

    const savedGlobalGoldPrice = localStorage.getItem('jewelryGlobalGoldPrice');
    if (savedGlobalGoldPrice) setGlobalGoldPrice(savedGlobalGoldPrice);

    const savedQR = localStorage.getItem('jewelryQRCode');
    if (savedQR) setQrCodeImage(savedQR);

    const savedPaymentHistory = localStorage.getItem('jewelryPaymentHistory');
    if (savedPaymentHistory) setPaymentHistory(JSON.parse(savedPaymentHistory));

    const savedItemTypeGroups = localStorage.getItem('jewelryItemTypeGroups');
    if (savedItemTypeGroups) setItemTypeGroups(JSON.parse(savedItemTypeGroups));

    const savedClientGroups = localStorage.getItem('jewelryClientGroups');
    if (savedClientGroups) setClientGroups(JSON.parse(savedClientGroups));
    
    const savedGoldMix = localStorage.getItem('jewelryGoldMix');
    if (savedGoldMix) setGoldMixOptions(JSON.parse(savedGoldMix));

    const savedQtyUnits = localStorage.getItem('jewelryQtyUnits');
    if (savedQtyUnits) setQtyUnitOptions(JSON.parse(savedQtyUnits));
  }, []);

  // ======================================================================
  // MODAL HELPERS
  // ======================================================================
  const showInput = (title, defaultValue = '') => {
    return new Promise((resolve) => {
      setInputModalData({
        title,
        defaultValue,
        onSubmit: (value) => {
          setShowInputModal(false);
          resolve(value);
        }
      });
      setShowInputModal(true);
    });
  };

  const closeInputModal = () => {
    setShowInputModal(false);
    setInputModalData({ title: '', defaultValue: '', onSubmit: null });
  };

  const showPopup = (type, title, message, onConfirm = null) => {
    return new Promise((resolve) => {
      setPopup({
        type,
        title,
        message,
        onConfirm: () => {
          setPopup(null);
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setPopup(null);
          resolve(false);
        },
        showCancel: onConfirm !== null
      });
    });
  };

  // ======================================================================
  // GROUP MANAGEMENT
  // ======================================================================
  const saveItemTypeGroups = (newGroups) => {
    setItemTypeGroups(newGroups);
    localStorage.setItem('jewelryItemTypeGroups', JSON.stringify(newGroups));
  };

  const addGroup = (groupName) => {
    const updated = [...itemTypeGroups, { name: groupName, items: [] }];
    saveItemTypeGroups(updated);
  };

  const removeGroup = (groupIndex) => {
    const updated = itemTypeGroups.filter((_, i) => i !== groupIndex);
    saveItemTypeGroups(updated);
  };

  const renameGroup = (groupIndex, newName) => {
    const updated = [...itemTypeGroups];
    updated[groupIndex].name = newName;
    saveItemTypeGroups(updated);
  };

  const addItemToGroup = (groupIndex, itemName) => {
    const updated = [...itemTypeGroups];
    updated[groupIndex].items.push(itemName);
    saveItemTypeGroups(updated);
  };

  const removeItemFromGroup = (groupIndex, itemIndex) => {
    const updated = [...itemTypeGroups];
    updated[groupIndex].items = updated[groupIndex].items.filter((_, i) => i !== itemIndex);
    saveItemTypeGroups(updated);
  };

  // ======================================================================
  // CLIENT GROUP MANAGEMENT
  // ======================================================================
  const saveClientGroups = (newGroups) => {
    setClientGroups(newGroups);
    localStorage.setItem('jewelryClientGroups', JSON.stringify(newGroups));
  };

  const addClientGroup = (groupName) => {
    const updated = [...clientGroups, { name: groupName, items: [] }];
    saveClientGroups(updated);
  };

  const removeClientGroup = (groupIndex) => {
    const updated = clientGroups.filter((_, i) => i !== groupIndex);
    saveClientGroups(updated);
  };

  const renameClientGroup = (groupIndex, newName) => {
    const updated = [...clientGroups];
    updated[groupIndex].name = newName;
    saveClientGroups(updated);
  };

  const addClientToGroup = (groupIndex, clientName) => {
    const updated = [...clientGroups];
    updated[groupIndex].items.push(clientName);
    saveClientGroups(updated);
  };

  const removeClientFromGroup = (groupIndex, clientIndex) => {
    const updated = [...clientGroups];
    updated[groupIndex].items = updated[groupIndex].items.filter((_, i) => i !== clientIndex);
    saveClientGroups(updated);
  };

  // ======================================================================
  // DRAFT MANAGEMENT
  // ======================================================================
  const saveDraft = async () => {
    const newDrafts = [...drafts];
    
    // Create draft data
    const draftData = { 
      ...formData, 
      timestamp: new Date().toISOString() 
    };
    
    // If goldPrice field is empty (using global), don't save it
    if (!formData.goldPrice || formData.goldPrice.trim() === '') {
      delete draftData.goldPrice;
    }
    
    newDrafts[activeTab] = draftData;
    setDrafts(newDrafts);
    localStorage.setItem('jewelryDrafts', JSON.stringify(newDrafts));
    await showPopup('success', 'រក្សាទុក / Saved', 'ទិន្នន័យត្រូវបានរក្សាទុក!\nDraft saved!');
  };

  const addNewDraft = () => {
    const newDraft = {
      date: new Date().toISOString().split('T')[0],
      clientName: '',
      goldMix: '',
      // Don't set goldPrice - let it use global
      goldPrice: '',
      items: [{ 
        itemName: '', 
        quantity: '1',
        qtyUnit: '',
        productCode: '',
        subItems: [{ weight: '', laborCost: '' }],
        manualTotal: null
      }],
      timestamp: new Date().toISOString()
    };
    const newDrafts = [...drafts, newDraft];
    setDrafts(newDrafts);
    setActiveTab(newDrafts.length - 1);
    setFormData(newDraft);
    localStorage.setItem('jewelryDrafts', JSON.stringify(newDrafts));
  };

    const loadDraft = (index) => {
    setActiveTab(index);
    const draft = drafts[index];
    
    const normalizedItems = draft.items.map(item => ({
      itemName: item.itemName || '',
      quantity: item.quantity || '1',
      qtyUnit: item.qtyUnit || '',
      productCode: item.productCode || '',
      subItems: Array.isArray(item.subItems) && item.subItems.length > 0 
        ? item.subItems.map(sub => ({ weight: sub.weight || '', laborCost: sub.laborCost || '' }))
        : [{ weight: '', laborCost: '' }],
      manualTotal: item.manualTotal || null
    }));
    
    setFormData({
      date: draft.date || new Date().toISOString().split('T')[0],
      clientName: draft.clientName || '',
      goldMix: draft.goldMix || '',
      goldPrice: draft.hasOwnProperty('goldPrice') ? draft.goldPrice : '',
      items: normalizedItems
    });
  };

  const deleteDraft = (index) => {
    const newDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(newDrafts);
    localStorage.setItem('jewelryDrafts', JSON.stringify(newDrafts));
    if (activeTab >= newDrafts.length) {
      setActiveTab(Math.max(0, newDrafts.length - 1));
    }
    if (newDrafts.length > 0) {
      loadDraft(Math.min(activeTab, newDrafts.length - 1));
    } else {
      handleReset();
    }
  };

  // ======================================================================
  // ITEM MANAGEMENT
  // ======================================================================
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { 
        itemName: '', 
        quantity: '1',
        qtyUnit: '',
        productCode: '',
        subItems: [{ weight: '', laborCost: '' }],
        manualTotal: null
      }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    
    if (field === 'quantity') {
      const newQty = parseInt(value) || 1;
      const currentQty = newItems[index].subItems.length;
      
      if (newQty > currentQty) {
        for (let i = currentQty; i < newQty; i++) {
          newItems[index].subItems.push({ weight: '', laborCost: '' });
        }
      } else if (newQty < currentQty) {
        newItems[index].subItems = newItems[index].subItems.slice(0, newQty);
      }
      newItems[index][field] = value;
    } else {
      newItems[index][field] = value;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const updateSubItem = (itemIndex, subIndex, field, value) => {
    const newItems = [...formData.items];
    newItems[itemIndex].subItems[subIndex][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  // ======================================================================
  // CALCULATIONS
  // ======================================================================
    const calculateSubItemTotal = (subItem) => {
    const { weight, laborCost } = subItem;
    const { goldMix } = formData;
    const goldPrice = getEffectiveGoldPrice();  // CHANGED

    if (!weight || !goldPrice || !laborCost) return 0;

    const w = parseFloat(weight);
    const gm = parseFloat(goldMix);
    const gp = parseFloat(goldPrice);
    const lc = parseFloat(laborCost);

    return (w * gm * gp / 100000) + lc;
    };

    const roundTotal = (value) => {
    const decimal = value - Math.floor(value);
    return decimal >= 0.7 ? Math.ceil(value) : Math.floor(value);
    };

    const calculateItemTotal = (item) => {
    if (item.manualTotal !== null && item.manualTotal !== undefined) {
        return parseFloat(item.manualTotal) || 0;
    }
    return item.subItems.reduce((sum, subItem) => sum + calculateSubItemTotal(subItem), 0);
    };

    const getCalculatedTotal = (item) => {
    return item.subItems.reduce((sum, subItem) => sum + calculateSubItemTotal(subItem), 0);
    };

    const calculateGrandTotal = () => {
    const rawTotal = formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    return roundTotal(rawTotal);
    };

    const calculateTotals = () => {
    const totalQty = formData.items.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
    const totalWeight = formData.items.reduce((sum, item) => {
        return sum + item.subItems.reduce((s, sub) => s + (parseFloat(sub.weight) || 0), 0);
    }, 0);
    const totalLabor = formData.items.reduce((sum, item) => {
        return sum + item.subItems.reduce((s, sub) => s + (parseFloat(sub.laborCost) || 0), 0);
    }, 0);
    return { totalQty, totalWeight, totalLabor };
    };

    const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
    };

    const handleReset = () => {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        clientName: '',
        goldMix: '',
        goldPrice: '',
        items: [{ 
          itemName: '', 
          quantity: '1',
          qtyUnit: '',
          productCode: '',
          subItems: [{ weight: '', laborCost: '' }],
          manualTotal: null
        }]
      });
    };

    // Get effective gold price (manual override or global)
    const getEffectiveGoldPrice = () => {
        if (formData.manualGoldPrice !== null && formData.manualGoldPrice !== undefined) {
            return formData.manualGoldPrice;
        }
        return globalGoldPrice || '';
    };

  // ======================================================================
  // FILE OPERATIONS
  // ======================================================================
  const handleQRUpload = (e) => {
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
  };

  const handleSelectSavePath = async () => {
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
  };

  const handlePrint = () => {
    setShowPrintView(true);
  };

  const handleSaveReceipt = async () => {
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
          roundTotal,
          getEffectiveGoldPrice
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
  };

  // ======================================================================
  // SETTINGS OPTIONS MANAGEMENT
  // ======================================================================
  const addQtyUnit = (newUnit) => {
    const updated = [...qtyUnitOptions, newUnit];
    setQtyUnitOptions(updated);
    localStorage.setItem('jewelryQtyUnits', JSON.stringify(updated));
  };

  const removeQtyUnit = (unitToRemove) => {
    const updated = qtyUnitOptions.filter(u => u !== unitToRemove);
    setQtyUnitOptions(updated);
    localStorage.setItem('jewelryQtyUnits', JSON.stringify(updated));
  };

  const addGoldMix = (newMix) => {
    const isDuplicate = goldMixOptions.some(mix => mix.value === newMix.value);
    if (isDuplicate) {
      alert(`❌ Error: Value "${newMix.value}" already exists!\nPlease use a unique value.`);
      return;
    }
    const updated = [...goldMixOptions, newMix];
    setGoldMixOptions(updated);
    localStorage.setItem('jewelryGoldMix', JSON.stringify(updated));
  };

  const removeGoldMix = (valueToRemove) => {
    const updated = goldMixOptions.filter(m => m.value !== valueToRemove);
    setGoldMixOptions(updated);
    localStorage.setItem('jewelryGoldMix', JSON.stringify(updated));
  };

  // ======================================================================
  // PAYMENT HISTORY
  // ======================================================================
  const addPaymentRecord = (record) => {
    const updated = [record, ...paymentHistory];
    setPaymentHistory(updated);
    localStorage.setItem('jewelryPaymentHistory', JSON.stringify(updated));
  };

  const updatePaymentStatus = (id, status) => {
    const updated = paymentHistory.map(record => 
      record.id === id ? { ...record, status } : record
    );
    setPaymentHistory(updated);
    localStorage.setItem('jewelryPaymentHistory', JSON.stringify(updated));
  };

  const deletePaymentRecord = (id) => {
    const updated = paymentHistory.filter(record => record.id !== id);
    setPaymentHistory(updated);
    localStorage.setItem('jewelryPaymentHistory', JSON.stringify(updated));
  };

  const restartPrintSpooler = async () => {
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
  };

  // ======================================================================
  // RENDER PAGES
  // ======================================================================
  
  // Print View
  if (showPrintView) {
    return (
      <PrintView
        formData={formData}
        goldMixOptions={goldMixOptions}
        qrCodeImage={qrCodeImage}
        formatDate={formatDate}
        calculateItemTotal={calculateItemTotal}
        calculateGrandTotal={calculateGrandTotal}
        calculateTotals={calculateTotals}
        roundTotal={roundTotal}
        setShowPrintView={setShowPrintView}
        getEffectiveGoldPrice={getEffectiveGoldPrice}
      />
    );
  }

  // Payment History Page
  if (currentPage === 'payment') {
    return (
      <div className="min-h-screen bg-accent">
        <Header 
          formData={formData}
          setFormData={setFormData}
          saveDraft={saveDraft}
          handleSaveReceipt={handleSaveReceipt}
          globalGoldPrice={globalGoldPrice}
          setGlobalGoldPrice={setGlobalGoldPrice}
        />

        <div className="flex pt-20">
          <Sidebar 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            drafts={drafts}
            activeTab={activeTab}
            loadDraft={loadDraft}
            deleteDraft={deleteDraft}
            addNewDraft={addNewDraft}
            restartPrintSpooler={restartPrintSpooler}
          />

          {popup && (
            <CustomPopup
              type={popup.type}
              title={popup.title}
              message={popup.message}
              onConfirm={popup.onConfirm}
              onCancel={popup.onCancel}
              showCancel={popup.showCancel}
            />
          )}

          <PaymentHistoryPage
            paymentHistory={paymentHistory}
            updatePaymentStatus={updatePaymentStatus}
            deletePaymentRecord={deletePaymentRecord}
          />
        </div>
      </div>
    );
  }

  // Settings Page
  if (currentPage === 'settings') {
    return (
      <div className="min-h-screen bg-accent">
        <Header 
          formData={formData}
          setFormData={setFormData}
          saveDraft={saveDraft}
          handleSaveReceipt={handleSaveReceipt}
          globalGoldPrice={globalGoldPrice}
          setGlobalGoldPrice={setGlobalGoldPrice}
        />

        <div className="flex pt-20">
          <Sidebar 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            drafts={drafts}
            activeTab={activeTab}
            loadDraft={loadDraft}
            deleteDraft={deleteDraft}
            addNewDraft={addNewDraft}
            restartPrintSpooler={restartPrintSpooler}
          />

          {popup && (
            <CustomPopup
              type={popup.type}
              title={popup.title}
              message={popup.message}
              onConfirm={popup.onConfirm}
              onCancel={popup.onCancel}
              showCancel={popup.showCancel}
            />
          )}

          <InputModal
            isOpen={showInputModal}
            title={inputModalData.title}
            defaultValue={inputModalData.defaultValue}
            onSubmit={inputModalData.onSubmit}
            onCancel={closeInputModal}
          />

          <SettingsPage
            savePath={savePath}
            handleSelectSavePath={handleSelectSavePath}
            clientGroups={clientGroups}
            addClientGroup={addClientGroup}
            renameClientGroup={renameClientGroup}
            removeClientGroup={removeClientGroup}
            addClientToGroup={addClientToGroup}
            removeClientFromGroup={removeClientFromGroup}
            qrCodeImage={qrCodeImage}
            handleQRUpload={handleQRUpload}
            itemTypeGroups={itemTypeGroups}
            addGroup={addGroup}
            renameGroup={renameGroup}
            removeGroup={removeGroup}
            addItemToGroup={addItemToGroup}
            removeItemFromGroup={removeItemFromGroup}
            qtyUnitOptions={qtyUnitOptions}
            addQtyUnit={addQtyUnit}
            removeQtyUnit={removeQtyUnit}
            goldMixOptions={goldMixOptions}
            addGoldMix={addGoldMix}
            removeGoldMix={removeGoldMix}
            showInput={showInput}
          />
        </div>
      </div>
    );
  }

  // Invoice Page (Default)
  return (
    <div className="min-h-screen bg-accent">
      <Header 
        formData={formData}
        setFormData={setFormData}
        saveDraft={saveDraft}
        handleSaveReceipt={handleSaveReceipt}
        globalGoldPrice={globalGoldPrice}
        setGlobalGoldPrice={setGlobalGoldPrice}
      />

      <div className="flex pt-20">
        <Sidebar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          drafts={drafts}
          activeTab={activeTab}
          loadDraft={loadDraft}
          deleteDraft={deleteDraft}
          addNewDraft={addNewDraft}
          restartPrintSpooler={restartPrintSpooler}
        />

        {popup && (
          <CustomPopup
            type={popup.type}
            title={popup.title}
            message={popup.message}
            onConfirm={popup.onConfirm}
            onCancel={popup.onCancel}
            showCancel={popup.showCancel}
          />
        )}

        {showTypeSelector && (
          <GroupedTypeSelector
            groups={itemTypeGroups}
            onSelect={(selectedItem) => {
              updateItem(currentItemIndex, 'itemName', selectedItem);
            }}
            onClose={() => {
              setShowTypeSelector(false);
              setCurrentItemIndex(null);
            }}
          />
        )}

        {showClientSelector && (
          <GroupedClientSelector
            groups={clientGroups}
            onSelect={(selectedClient) => {
              setFormData({ ...formData, clientName: selectedClient });
            }}
            onClose={() => setShowClientSelector(false)}
          />
        )}

        <InvoicePage
          formData={formData}
          setFormData={setFormData}
          itemTypeGroups={itemTypeGroups}
          clientGroups={clientGroups}
          goldMixOptions={goldMixOptions}
          qtyUnitOptions={qtyUnitOptions}
          getEffectiveGoldPrice={getEffectiveGoldPrice}
          showTypeSelector={showTypeSelector}
          setShowTypeSelector={setShowTypeSelector}
          showClientSelector={showClientSelector}
          setShowClientSelector={setShowClientSelector}
          currentItemIndex={currentItemIndex}
          setCurrentItemIndex={setCurrentItemIndex}
          updateItem={updateItem}
          updateSubItem={updateSubItem}
          addItem={addItem}
          removeItem={removeItem}
          calculateSubItemTotal={calculateSubItemTotal}
          calculateItemTotal={calculateItemTotal}
          getCalculatedTotal={getCalculatedTotal}
          calculateGrandTotal={calculateGrandTotal}
          calculateTotals={calculateTotals}
          roundTotal={roundTotal}
          handleReset={handleReset}
          handlePrint={handlePrint}
          addNewDraft={addNewDraft}
          drafts={drafts}
          globalGoldPrice={globalGoldPrice}
        />
      </div>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ReceiptCalculator />);