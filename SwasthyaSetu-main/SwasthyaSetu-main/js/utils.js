/* ═══════════════════════════════════════════════════
   SwasthyaSetu — utils.js
   Navigation, toast notifications, modals,
   speech synthesis, language switcher
═══════════════════════════════════════════════════ */

// ── Navigation ──────────────────────────────────
function navigateTo(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const viewEl = document.getElementById('view-' + view);
  if (viewEl) viewEl.classList.add('active');

  document.querySelectorAll('[data-view="' + view + '"]')
    .forEach(n => n.classList.add('active'));

  AppState.currentView = view;

  // Scroll to top on view change
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Invalidate Leaflet maps when switching to their tab
  if (view === 'clinic' && typeof _clinicMap !== 'undefined' && _clinicMap) {
    setTimeout(() => _clinicMap.invalidateSize(), 200);
  }

  if (AppState.a11y.voiceNav) speak(t('speak.navigateTo', { view: view }));
}

// ── Toast ────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerHTML = msg;
  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── Modals ───────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// Close modal when clicking overlay background
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
});

// ── Speech Synthesis ────────────────────────────
function speak(text) {
  if (!AppState.a11y.voiceNav) return;
  if (!('speechSynthesis' in window)) return;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = LANG_VOICE_MAP[AppState.currentLang] || 'en-IN';
  utt.rate = 0.9;
  speechSynthesis.speak(utt);
}

// ── Language Switcher ────────────────────────────
function changeLanguage(lang) {
  AppState.currentLang = lang;

  // Apply translations to all static HTML elements with data-i18n
  applyTranslations();

  // Re-render all dynamic content so it picks up the new language
  renderHomeDoctors();
  renderSymptomGrid();
  renderMedicines();
  renderClinics();
  renderFamilyGrid();

  // If a family member was selected, re-render their profile
  if (AppState.selectedFamilyMember) {
    const member = FAMILY_MEMBERS.find(m => m.id === AppState.selectedFamilyMember);
    if (member) {
      renderMemberProfile(member);
      renderRiskAlerts(member);
      renderHealthChart(member);
      renderPrescriptionHistory(member);
    }
  }

  showToast(t('toast.langSwitch'));
}

// ── Live Stats Ticker ────────────────────────────
let _statsInterval = null;
function updateStats() {
  if (_statsInterval) clearInterval(_statsInterval);
  _statsInterval = setInterval(() => {
    AppState.consultationCount += Math.floor(Math.random() * 3) + 1;
    const el = document.getElementById('stat-consultations');
    if (el) el.textContent = AppState.consultationCount.toLocaleString('en-IN') + ' ' + t('stats.consultations');
  }, 8000);
}

// ── Van Animation ────────────────────────────────
let _vanInterval = null;
function animateVan() {
  // Legacy: CSS map van animation removed — now using Leaflet map
  // Kept as no-op for backward compatibility
}
