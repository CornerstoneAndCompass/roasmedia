/* ============================================
   ROAS Calculator - Standalone (no jQuery dependency)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adSpendCalculator');
  if (!form) return;

  const fields = {};
  const fieldSelectors = {
    adBudget: '#adBudget',
    cpm: '#cpm',
    ctr: '#ctr',
    boundRate: '#boundRate',
    webCVR: '#webCVR',
    aov: '#aov'
  };

  const fieldTextConfig = {
    adBudget: { selector: '#adBudgetText', prepend: '$', append: '' },
    cpm: { selector: '#cpmText', prepend: '$', append: '' },
    ctr: { selector: '#ctrText', prepend: '', append: '%' },
    boundRate: { selector: '#boundRateText', prepend: '', append: '%' },
    webCVR: { selector: '#webCVRText', prepend: '', append: '%' },
    aov: { selector: '#aovText', prepend: '$', append: '' }
  };

  function toFloat(s) {
    return parseFloat((s || '0').toString().replace(/[^0-9.]+/g, '')) || 0;
  }

  function formatNumber(num, decimals) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function applyFields() {
    Object.keys(fieldSelectors).forEach(key => {
      const el = form.querySelector(fieldSelectors[key]);
      fields[key] = toFloat(el ? el.value : 0);
    });
    applySlideToTextFields();
  }

  function applySlideToTextFields() {
    Object.keys(fieldSelectors).forEach(key => {
      const rangeEl = form.querySelector(fieldSelectors[key]);
      const config = fieldTextConfig[key];
      const textEl = form.querySelector(config.selector);
      const val = toFloat(rangeEl ? rangeEl.value : 0);
      const display = (config.prepend || '') + val.toLocaleString() + (config.append || '');
      if (textEl) textEl.value = display;
      if (rangeEl) rangeEl.value = val;
    });
  }

  function calculate() {
    const f = fields;
    const impressions = (f.adBudget / f.cpm) * 1000;
    const clicks = (impressions * f.ctr) / 100;
    const lpv = clicks * (1 - (f.boundRate / 100));
    const purchases = (lpv * f.webCVR) / 100;
    const revenue = purchases * f.aov;

    const revenueEl = form.querySelector('#revenue');
    if (revenueEl) revenueEl.innerHTML = formatNumber(revenue, 2);

    const roas = revenue / f.adBudget;
    const roasEl = form.querySelector('#roas');
    if (roasEl) roasEl.innerHTML = formatNumber(roas, 2);

    return roas;
  }

  function init() {
    applyFields();
    calculate();
  }

  // Bind range inputs
  Object.keys(fieldSelectors).forEach(key => {
    const el = form.querySelector(fieldSelectors[key]);
    if (el) {
      el.addEventListener('input', () => {
        fields[key] = toFloat(el.value);
        applySlideToTextFields();
        init();
      });
    }
  });

  // Initialize
  init();
});
