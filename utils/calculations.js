// ======================================================================
// CALCULATION UTILITIES
// ======================================================================

const Calculations = {
  // Calculate sub-item total
  calculateSubItemTotal: (subItem, formData) => {
    const { weight, laborCost } = subItem;
    const { goldMix, goldPrice } = formData;

    if (!weight || !goldPrice || !laborCost) return 0;

    const w = parseFloat(weight);
    const gm = parseFloat(goldMix);
    const gp = parseFloat(goldPrice);
    const lc = parseFloat(laborCost);

    return (w * gm * gp / 100000) + lc;
  },

  // Round total with custom rule (≥0.7 rounds up, <0.7 rounds down)
  roundTotal: (value) => {
    const decimal = value - Math.floor(value);
    return decimal >= 0.7 ? Math.ceil(value) : Math.floor(value);
  },

  // Calculate item total (respects manual override)
  calculateItemTotal: (item, formData) => {
    if (item.manualTotal !== null && item.manualTotal !== undefined) {
      return parseFloat(item.manualTotal) || 0;
    }
    return item.subItems.reduce((sum, subItem) => 
      sum + Calculations.calculateSubItemTotal(subItem, formData), 0
    );
  },

  // Get calculated total (ignores manual override)
  getCalculatedTotal: (item, formData) => {
    return item.subItems.reduce((sum, subItem) => 
      sum + Calculations.calculateSubItemTotal(subItem, formData), 0
    );
  },

  // Calculate grand total
  calculateGrandTotal: (items, formData) => {
    const rawTotal = items.reduce((sum, item) => 
      sum + Calculations.calculateItemTotal(item, formData), 0
    );
    return Calculations.roundTotal(rawTotal);
  },

  // Calculate totals for quantity, weight, and labor
  calculateTotals: (items) => {
    const totalQty = items.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
    const totalWeight = items.reduce((sum, item) => {
      return sum + item.subItems.reduce((s, sub) => s + (parseFloat(sub.weight) || 0), 0);
    }, 0);
    const totalLabor = items.reduce((sum, item) => {
      return sum + item.subItems.reduce((s, sub) => s + (parseFloat(sub.laborCost) || 0), 0);
    }, 0);
    return { totalQty, totalWeight, totalLabor };
  },

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  formatDate: (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
};

// Make available globally
window.Calculations = Calculations;