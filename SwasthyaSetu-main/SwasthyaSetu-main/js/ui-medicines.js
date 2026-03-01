/* ═══════════════════════════════════════════════════
   SwasthyaSetu — ui-medicines.js
   Medicine delivery system:
   • AI prescription → multi-platform price comparison
   • Tata 1mg, Apollo, MedPlus, PharmEasy integration
   • Nearby pharmacy stock + pricing
   • Auto-tracking delivery
   • COD payment → redirect to platform
   • Instant Relief Engine (Module 7)
═══════════════════════════════════════════════════ */

// ── Generate AI Prescription ─────────────────────
function generateAIPrescription(symptoms, specialist) {
  // Collect unique medicines from all detected symptoms
  const seen = new Set();
  const meds = [];
  symptoms.forEach(s => {
    const condMeds = CONDITION_MEDICINES[s] || CONDITION_MEDICINES.general;
    condMeds.forEach(m => {
      if (!seen.has(m.name)) {
        seen.add(m.name);
        meds.push({ ...m });
      }
    });
  });

  AppState.aiPrescription = meds;
  AppState.selectedPlatform = null;
  AppState.deliveryStep = 0;

  // Store prescription for the selected family member
  const memberId = AppState.consultForMember || 1;
  storePrescriptionForMember(memberId, meds, specialist || 'AI Health Assistant');

  // Update the medicines tab with fresh data
  renderMedicines();
}

// ── Get price for a medicine on a platform ───────
function getMedPrice(medName, platformId) {
  const prices = MEDICINE_PRICES[medName];
  if (!prices) return null;
  return prices[platformId] || prices.mrp;
}

function getMedMRP(medName) {
  const prices = MEDICINE_PRICES[medName];
  return prices ? prices.mrp : 0;
}

// ── Calculate total for a platform ───────────────
function getPlatformTotal(meds, platformId) {
  return meds.reduce((sum, m) => sum + (getMedPrice(m.name, platformId) || 0), 0);
}

// ── Find best platform for given medicines ───────
function getBestPlatform(meds) {
  let bestId = 'medplus';
  let bestTotal = Infinity;
  PHARMACY_PLATFORMS.forEach(p => {
    const total = getPlatformTotal(meds, p.id);
    if (total < bestTotal) { bestTotal = total; bestId = p.id; }
  });
  return bestId;
}

// ── Prescription + Pharmacy Render ───────────────
function renderMedicines() {
  const meds = AppState.aiPrescription.length > 0 ? AppState.aiPrescription : MEDICINES;

  // ── Prescription medicines with per-platform prices ──
  const prescrEl = document.getElementById('prescription-medicines');
  if (prescrEl) {
    const bestPlatform = getBestPlatform(meds);
    prescrEl.innerHTML = meds.map(m => {
      const mrp = getMedMRP(m.name);
      // Find cheapest price across all platforms
      let cheapest = mrp;
      let cheapestPlatform = '';
      PHARMACY_PLATFORMS.forEach(p => {
        const pr = getMedPrice(m.name, p.id);
        if (pr && pr < cheapest) { cheapest = pr; cheapestPlatform = p.name; }
      });
      const saving = mrp - cheapest;
      const savePct = mrp > 0 ? Math.round((saving / mrp) * 100) : 0;

      return `
        <div class="med-row med-row-enhanced">
          <div style="flex:1">
            <div class="med-name">${m.name} ${m.generic ? '<span class="badge badge-safe" style="font-size:9px;padding:2px 6px">' + t('med.generic') + '</span>' : ''}</div>
            <div class="med-dose">${m.dose} · ${m.frequency}</div>
            <div class="med-dose" style="color:var(--color-trust)">${m.duration} · ${m.category}</div>
          </div>
          <div style="text-align:right; min-width:90px">
            <div style="font-size:10px;color:var(--color-muted);text-decoration:line-through">MRP ₹${mrp}</div>
            <div style="font-size:16px;font-weight:700;color:var(--color-safe)">₹${cheapest}</div>
            ${savePct > 0 ? `<div style="font-size:10px;color:var(--color-safe)">${t('med.save')} ${savePct}%</div>` : ''}
          </div>
        </div>`;
    }).join('');

    // Total row
    const totalMRP = meds.reduce((s, m) => s + getMedMRP(m.name), 0);
    const totalBest = getPlatformTotal(meds, bestPlatform);
    prescrEl.innerHTML += `
      <div class="med-total-row">
        <div style="flex:1;font-weight:700">${t('med.totalLabel')}</div>
        <div style="text-align:right">
          <span style="text-decoration:line-through;color:var(--color-muted);font-size:12px">₹${totalMRP}</span>
          <span style="font-size:18px;font-weight:800;color:var(--color-safe);margin-left:8px">₹${totalBest}</span>
        </div>
      </div>`;
  }

  // ── Online Platform Comparison ──
  renderPlatformComparison(meds);

  // ── Local Pharmacy Options ──
  renderLocalPharmacies(meds);

  // ── Delivery Tracker ──
  renderDeliveryTracker();
}

// ── Online Platform Cards ────────────────────────
function renderPlatformComparison(meds) {
  const pharmEl = document.getElementById('pharmacy-list');
  if (!pharmEl) return;

  const bestId = getBestPlatform(meds);

  pharmEl.innerHTML = `
    <div class="platform-section-label">${t('med.onlinePlatforms')}</div>
    ${PHARMACY_PLATFORMS.map(p => {
      const total = getPlatformTotal(meds, p.id);
      const mrpTotal = meds.reduce((s, m) => s + getMedMRP(m.name), 0);
      const savings = mrpTotal - total;
      const isSelected = AppState.selectedPlatform === p.id;
      const isBest = p.id === bestId;

      return `
        <div class="platform-card ${isSelected ? 'platform-selected' : ''} ${isBest ? 'platform-best' : ''}"
             onclick="selectPlatform('${p.id}')">
          <div class="platform-header">
            <div class="platform-logo">${p.logo}</div>
            <div style="flex:1">
              <div class="platform-name">
                ${p.name}
                ${isBest ? '<span class="badge badge-safe" style="font-size:9px;padding:2px 6px;margin-left:6px">' + t('med.bestPrice') + '</span>' : ''}
              </div>
              <div class="platform-meta">
                ⭐ ${p.rating} · 🚚 ${p.delivery} · ${p.discount}
              </div>
            </div>
            <div style="text-align:right">
              <div class="platform-price">₹${total}</div>
              <div style="font-size:10px;color:var(--color-safe)">${t('med.save')} ₹${savings}</div>
            </div>
          </div>
          <div class="platform-details">
            ${meds.map(m => {
              const pr = getMedPrice(m.name, p.id);
              return `<div class="platform-med-row">
                <span>${m.name}</span>
                <span style="font-weight:600">₹${pr}</span>
              </div>`;
            }).join('')}
          </div>
          <div class="platform-footer">
            <div class="platform-badges">
              ${p.cod ? '<span class="badge badge-normal" style="font-size:9px;padding:2px 6px">💵 ' + t('med.cod') + '</span>' : ''}
              <span class="badge badge-normal" style="font-size:9px;padding:2px 6px">🚚 ${t('med.freeAbove')} ₹${p.freeDeliveryAbove}</span>
            </div>
            <a class="btn btn-ghost btn-sm" href="${p.baseUrl}${encodeURIComponent(meds[0].name)}" target="_blank" rel="noopener"
               onclick="event.stopPropagation()">
              ${t('med.viewSite')} ↗
            </a>
          </div>
        </div>`;
    }).join('')}`;
}

function selectPlatform(platformId) {
  AppState.selectedPlatform = platformId;
  renderMedicines();
}

// ── Local Pharmacies (nearby shops) ──────────────
function renderLocalPharmacies(meds) {
  const container = document.getElementById('local-pharmacy-list');
  if (!container) return;

  // Calculate total for each local pharmacy (use random variance based on their original price ratio)
  const medTotal = meds.reduce((s, m) => s + getMedMRP(m.name), 0);

  container.innerHTML = PHARMACIES.map(p => {
    // Scale local price proportionally
    const localTotal = Math.round(medTotal * (p.price / 160));
    const isSelected = AppState.selectedPlatform === ('local-' + p.id);
    const allInStock = p.stock === 'All Available';

    return `
      <div class="pharmacy-row ${isSelected ? 'selected' : ''}" onclick="selectPlatform('local-${p.id}')">
        <div style="width:18px;height:18px;border-radius:50%;border:2px solid ${isSelected ? 'var(--color-trust)' : 'var(--color-border)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${isSelected ? '<div style="width:8px;height:8px;border-radius:50%;background:var(--color-trust)"></div>' : ''}
        </div>
        <div style="flex:1">
          <div class="pharmacy-name">${p.name}</div>
          <div class="pharmacy-dist">📍 ${p.dist}</div>
        </div>
        <div style="width:100px;text-align:center">
          <span class="badge ${allInStock ? 'badge-safe' : 'badge-moderate'}">
            ${allInStock ? t('med.inStock') : t('med.partial')}
          </span>
        </div>
        <div class="pharmacy-price">₹${localTotal}</div>
      </div>`;
  }).join('');
}

function selectPharmacy(id) {
  AppState.selectedPharmacy = id;
  renderMedicines();
}

// ── Confirm Order — COD + Redirect ───────────────
function confirmOrder() {
  const meds = AppState.aiPrescription.length > 0 ? AppState.aiPrescription : MEDICINES;
  const platformId = AppState.selectedPlatform;

  if (!platformId) {
    showToast(t('toast.selectPlatform'));
    return;
  }

  // Check if local pharmacy
  if (platformId.startsWith('local-')) {
    const localId = parseInt(platformId.replace('local-', ''));
    const ph = PHARMACIES.find(p => p.id === localId);
    if (!ph) return;
    const medTotal = meds.reduce((s, m) => s + getMedMRP(m.name), 0);
    const localTotal = Math.round(medTotal * (ph.price / 160));

    showToast(t('toast.orderPlaced', { pharmacy: ph.name, price: localTotal }));
    AppState.deliveryStep = 0;
    startAutoDeliveryTracking();
    if (AppState.a11y.voiceNav) speak(t('speak.orderConfirm', { pharmacy: ph.name }));
    return;
  }

  // Online platform — redirect to their site
  const platform = PHARMACY_PLATFORMS.find(p => p.id === platformId);
  if (!platform) return;

  const total = getPlatformTotal(meds, platformId);

  // Show confirmation toast
  showToast(t('toast.orderCOD', { platform: platform.name, price: total }));
  if (AppState.a11y.voiceNav) speak(t('speak.orderConfirm', { pharmacy: platform.name }));

  // Start delivery tracking
  AppState.deliveryStep = 0;
  startAutoDeliveryTracking();

  // Build search URL for the first medicine and redirect after a short delay
  const searchQuery = meds.map(m => m.name).join(' ');
  const redirectUrl = platform.baseUrl + encodeURIComponent(searchQuery);

  setTimeout(() => {
    window.open(redirectUrl, '_blank', 'noopener');
  }, 1500);
}

// ── Delivery Tracker ──────────────────────────────
function renderDeliveryTracker() {
  const tracker = document.getElementById('delivery-tracker');
  if (!tracker) return;
  const delKeys = ['del.confirmed', 'del.packing', 'del.outDelivery', 'del.delivered'];
  tracker.innerHTML = DELIVERY_STEPS.map((step, i) => {
    const state = i < AppState.deliveryStep ? 'completed' : i === AppState.deliveryStep ? 'active' : '';
    return `
      <div class="progress-step ${state}">
        <div class="progress-dot">${i < AppState.deliveryStep ? '✓' : step.emoji}</div>
        <div class="progress-text">${t(delKeys[i])}</div>
      </div>`;
  }).join('');
}

// ── Auto Delivery Tracking (replaces manual simulate) ──
let _autoDeliveryInterval = null;
function startAutoDeliveryTracking() {
  if (_autoDeliveryInterval) clearInterval(_autoDeliveryInterval);

  AppState.deliveryStep = 1;
  renderDeliveryTracker();

  const etaEl = document.getElementById('delivery-eta');
  let secondsLeft = 45 * 60; // 45 minutes total estimate

  _autoDeliveryInterval = setInterval(() => {
    secondsLeft -= 30; // speed up: each real second = 30 simulated seconds
    const mins = Math.max(0, Math.floor(secondsLeft / 60));

    if (etaEl) etaEl.textContent = t('med.etaLive', { mins: mins });

    // Auto-advance delivery steps based on time elapsed
    const elapsed = (45 * 60) - secondsLeft;
    const newStep = elapsed > 35 * 60 ? 3
                  : elapsed > 20 * 60 ? 2
                  : elapsed > 5  * 60 ? 1
                  : 0;

    if (newStep > AppState.deliveryStep) {
      AppState.deliveryStep = newStep;
      renderDeliveryTracker();
      const step = DELIVERY_STEPS[newStep];
      showToast(step.emoji + ' ' + step.label.replace('\n', ' '));
    }

    if (AppState.deliveryStep >= 3) {
      clearInterval(_autoDeliveryInterval);
      _autoDeliveryInterval = null;
      if (etaEl) etaEl.textContent = '✅ ' + t('del.delivered');
      showToast('🏠 ' + t('del.delivered') + '!');
      if (AppState.a11y.voiceNav) speak(t('speak.medsDelivered'));
    }
  }, 1000);
}

// (keep old function for backward compat — now auto)
function advanceDelivery() {
  // No-op — delivery tracking is now automatic
}

// ── Instant Relief Engine (Module 7) ─────────────
function showReliefModal(symptomKey) {
  let stepsKey = 'general';
  if (['chest', 'sweating', 'heart', 'bleeding'].includes(symptomKey)) stepsKey = 'emergency';
  else if (['fever', 'highfever'].includes(symptomKey))                 stepsKey = 'fever';
  else if (['stomach', 'diarrhea', 'nausea'].includes(symptomKey))      stepsKey = 'stomach';

  const steps = RELIEF_STEPS[stepsKey];
  const stepsEl = document.getElementById('relief-steps');
  if (stepsEl) {
    stepsEl.innerHTML = steps.map((step, i) => `
      <div class="relief-step">
        <div class="relief-step-num">${i + 1}</div>
        <div class="relief-step-text">${step.text}</div>
      </div>`).join('');
  }

  startReliefCountdown();
  openModal('modal-relief');
}

function startReliefCountdown() {
  AppState.reliefCountdown = 1680;
  if (window._reliefInterval) clearInterval(window._reliefInterval);
  window._reliefInterval = setInterval(() => {
    AppState.reliefCountdown--;
    const m = Math.floor(AppState.reliefCountdown / 60);
    const s = AppState.reliefCountdown % 60;
    const el = document.getElementById('relief-countdown');
    if (el) el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (AppState.reliefCountdown <= 0) clearInterval(window._reliefInterval);
  }, 1000);
}

function alertFamilyMember() {
  closeModal('modal-relief');
  showToast(t('toast.alertFamily'));
  if (AppState.a11y.voiceNav) speak(t('speak.alertFamily'));
}
