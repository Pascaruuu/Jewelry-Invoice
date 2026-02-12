// ======================================================================
// STORAGE UTILITIES
// ======================================================================

const Storage = {
  // ======================================================================
  // LOAD FUNCTIONS
  // ======================================================================
  
  // Load all data at once
  loadAll: () => {
    return {
      drafts: JSON.parse(localStorage.getItem('jewelryDrafts') || '[]'),
      savePath: localStorage.getItem('jewelrySavePath') || '',
      globalGoldPrice: localStorage.getItem('jewelryGlobalGoldPrice') || '',
      qrCodeImage: localStorage.getItem('jewelryQRCode') || '',
      paymentHistory: JSON.parse(localStorage.getItem('jewelryPaymentHistory') || '[]'),
      itemTypeGroups: JSON.parse(localStorage.getItem('jewelryItemTypeGroups') || '[]'),
      clientGroups: JSON.parse(localStorage.getItem('jewelryClientGroups') || '[]'),
      goldMixOptions: JSON.parse(localStorage.getItem('jewelryGoldMix') || '[]'),
      qtyUnitOptions: JSON.parse(localStorage.getItem('jewelryQtyUnits') || '[]')
    };
  },

  // Load individual items
  loadDrafts: () => {
    return JSON.parse(localStorage.getItem('jewelryDrafts') || '[]');
  },

  loadSavePath: () => {
    return localStorage.getItem('jewelrySavePath') || '';
  },

  loadGlobalGoldPrice: () => {
    return localStorage.getItem('jewelryGlobalGoldPrice') || '';
  },

  loadQRCode: () => {
    return localStorage.getItem('jewelryQRCode') || '';
  },

  loadPaymentHistory: () => {
    return JSON.parse(localStorage.getItem('jewelryPaymentHistory') || '[]');
  },

  loadItemTypeGroups: () => {
    return JSON.parse(localStorage.getItem('jewelryItemTypeGroups') || '[]');
  },

  loadClientGroups: () => {
    return JSON.parse(localStorage.getItem('jewelryClientGroups') || '[]');
  },

  loadGoldMixOptions: () => {
    return JSON.parse(localStorage.getItem('jewelryGoldMix') || '[]');
  },

  loadQtyUnitOptions: () => {
    return JSON.parse(localStorage.getItem('jewelryQtyUnits') || '[]');
  },

  // ======================================================================
  // SAVE FUNCTIONS
  // ======================================================================
  
  saveDrafts: (drafts) => {
    localStorage.setItem('jewelryDrafts', JSON.stringify(drafts));
  },

  savePath: (path) => {
    localStorage.setItem('jewelrySavePath', path);
  },

  saveGlobalGoldPrice: (price) => {
    localStorage.setItem('jewelryGlobalGoldPrice', price);
  },

  saveQRCode: (base64) => {
    localStorage.setItem('jewelryQRCode', base64);
  },

  savePaymentHistory: (history) => {
    localStorage.setItem('jewelryPaymentHistory', JSON.stringify(history));
  },

  saveItemTypeGroups: (groups) => {
    localStorage.setItem('jewelryItemTypeGroups', JSON.stringify(groups));
  },

  saveClientGroups: (groups) => {
    localStorage.setItem('jewelryClientGroups', JSON.stringify(groups));
  },

  saveGoldMixOptions: (options) => {
    localStorage.setItem('jewelryGoldMix', JSON.stringify(options));
  },

  saveQtyUnitOptions: (options) => {
    localStorage.setItem('jewelryQtyUnits', JSON.stringify(options));
  },

  // ======================================================================
  // CLEAR FUNCTIONS
  // ======================================================================
  
  clearDrafts: () => {
    localStorage.removeItem('jewelryDrafts');
  },

  clearPaymentHistory: () => {
    localStorage.removeItem('jewelryPaymentHistory');
  },

  clearAll: () => {
    const keys = [
      'jewelryDrafts',
      'jewelrySavePath',
      'jewelryGlobalGoldPrice',
      'jewelryQRCode',
      'jewelryPaymentHistory',
      'jewelryItemTypeGroups',
      'jewelryClientGroups',
      'jewelryGoldMix',
      'jewelryQtyUnits'
    ];
    keys.forEach(key => localStorage.removeItem(key));
  }
};

// Make available globally
window.Storage = Storage;