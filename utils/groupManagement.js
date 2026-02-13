// ======================================================================
// GROUP MANAGEMENT UTILITIES
// ======================================================================

const GroupManagement = {
  // ======================================================================
  // ITEM TYPE GROUPS
  // ======================================================================
  
  saveItemTypeGroups: (newGroups, setItemTypeGroups) => {
    setItemTypeGroups(newGroups);
    localStorage.setItem('jewelryItemTypeGroups', JSON.stringify(newGroups));
  },

  addGroup: (groupName, itemTypeGroups, setItemTypeGroups) => {
    const updated = [...itemTypeGroups, { name: groupName, items: [] }];
    GroupManagement.saveItemTypeGroups(updated, setItemTypeGroups);
  },

  removeGroup: (groupIndex, itemTypeGroups, setItemTypeGroups) => {
    const updated = itemTypeGroups.filter((_, i) => i !== groupIndex);
    GroupManagement.saveItemTypeGroups(updated, setItemTypeGroups);
  },

  renameGroup: (groupIndex, newName, itemTypeGroups, setItemTypeGroups) => {
    const updated = [...itemTypeGroups];
    updated[groupIndex].name = newName;
    GroupManagement.saveItemTypeGroups(updated, setItemTypeGroups);
  },

  addItemToGroup: (groupIndex, itemName, itemTypeGroups, setItemTypeGroups) => {
    const updated = [...itemTypeGroups];
    updated[groupIndex].items.push(itemName);
    GroupManagement.saveItemTypeGroups(updated, setItemTypeGroups);
  },

  removeItemFromGroup: (groupIndex, itemIndex, itemTypeGroups, setItemTypeGroups) => {
    const updated = [...itemTypeGroups];
    updated[groupIndex].items = updated[groupIndex].items.filter((_, i) => i !== itemIndex);
    GroupManagement.saveItemTypeGroups(updated, setItemTypeGroups);
  },

  // ======================================================================
  // CLIENT GROUPS
  // ======================================================================
  
  saveClientGroups: (newGroups, setClientGroups) => {
    setClientGroups(newGroups);
    localStorage.setItem('jewelryClientGroups', JSON.stringify(newGroups));
  },

  addClientGroup: (groupName, clientGroups, setClientGroups) => {
    const updated = [...clientGroups, { name: groupName, items: [] }];
    GroupManagement.saveClientGroups(updated, setClientGroups);
  },

  removeClientGroup: (groupIndex, clientGroups, setClientGroups) => {
    const updated = clientGroups.filter((_, i) => i !== groupIndex);
    GroupManagement.saveClientGroups(updated, setClientGroups);
  },

  renameClientGroup: (groupIndex, newName, clientGroups, setClientGroups) => {
    const updated = [...clientGroups];
    updated[groupIndex].name = newName;
    GroupManagement.saveClientGroups(updated, setClientGroups);
  },

  addClientToGroup: (groupIndex, clientName, clientGroups, setClientGroups) => {
    const updated = [...clientGroups];
    updated[groupIndex].items.push(clientName);
    GroupManagement.saveClientGroups(updated, setClientGroups);
  },

  removeClientFromGroup: (groupIndex, clientIndex, clientGroups, setClientGroups) => {
    const updated = [...clientGroups];
    updated[groupIndex].items = updated[groupIndex].items.filter((_, i) => i !== clientIndex);
    GroupManagement.saveClientGroups(updated, setClientGroups);
  },

  // ======================================================================
  // SETTINGS OPTIONS
  // ======================================================================
  
  // Quantity Units
  addQtyUnit: (newUnit, qtyUnitOptions, setQtyUnitOptions) => {
    const updated = [...qtyUnitOptions, newUnit];
    setQtyUnitOptions(updated);
    localStorage.setItem('jewelryQtyUnits', JSON.stringify(updated));
  },

  removeQtyUnit: (unitToRemove, qtyUnitOptions, setQtyUnitOptions) => {
    const updated = qtyUnitOptions.filter(u => u !== unitToRemove);
    setQtyUnitOptions(updated);
    localStorage.setItem('jewelryQtyUnits', JSON.stringify(updated));
  },

  // Gold Mix Options
  addGoldMix: (newMix, goldMixOptions, setGoldMixOptions) => {
    const isDuplicate = goldMixOptions.some(mix => mix.value === newMix.value);
    if (isDuplicate) {
      alert(`❌ Error: Value "${newMix.value}" already exists!\nPlease use a unique value.`);
      return false;
    }
    const updated = [...goldMixOptions, newMix];
    setGoldMixOptions(updated);
    localStorage.setItem('jewelryGoldMix', JSON.stringify(updated));
    return true;
  },

  removeGoldMix: (valueToRemove, goldMixOptions, setGoldMixOptions) => {
    const updated = goldMixOptions.filter(m => m.value !== valueToRemove);
    setGoldMixOptions(updated);
    localStorage.setItem('jewelryGoldMix', JSON.stringify(updated));
  }
};

// Make available globally
window.GroupManagement = GroupManagement;