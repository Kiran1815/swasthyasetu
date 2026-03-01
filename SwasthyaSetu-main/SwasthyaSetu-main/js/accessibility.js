/* ═══════════════════════════════════════════════════
   SwasthyaSetu — accessibility.js
   AccessibilityController:
   - Elderly / Caretaker Mode
   - Icon Navigation (Illiterate) Mode
   - Low Bandwidth / Offline Mode
   - Voice Navigation
   - High Contrast
   - Deaf / Caption Mode
═══════════════════════════════════════════════════ */

// ── Panel Toggle ──────────────────────────────────
function toggleA11yPanel() {
  document.getElementById('a11y-panel').classList.toggle('active');
}

// ── Master Toggle Handler ─────────────────────────
function toggleA11y(mode) {
  AppState.a11y[mode] = !AppState.a11y[mode];
  const active = AppState.a11y[mode];

  // Sync toggle switch visual
  const toggleId = 'toggle-' + (mode === 'voiceNav' ? 'voice-nav' : mode);
  const btn = document.getElementById(toggleId);
  if (btn) btn.classList.toggle('on', active);

  switch (mode) {
    case 'caretaker': _applyCaretakerMode(active);  break;
    case 'bandwidth': _applyLiteMode(active);       break;
    case 'contrast':  _applyHighContrast(active);   break;
    case 'icons':     _applyIconMode(active);       break;
    case 'voiceNav':  _applyVoiceNav(active);       break;
    case 'deaf':      _applyDeafMode(active);       break;
  }

  showToast(active ? `✅ ${t('speak.modeEnabled', { mode: mode })}` : `⭕ ${t('speak.modeDisabled', { mode: mode })}`);
}

// ── Caretaker Mode ────────────────────────────────
//  Large text, giant buttons, voice guidance,
//  floating SOS always visible, WCAG AAA contrast
function toggleCaretakerMode(forceState) {
  const active = typeof forceState !== 'undefined'
    ? forceState
    : !AppState.caretakerMode;
  AppState.caretakerMode    = active;
  AppState.a11y.caretaker   = active;
  _applyCaretakerMode(active);
}

function _applyCaretakerMode(active) {
  document.body.classList.toggle('caretaker-mode', active);

  const caretakerBtn = document.getElementById('caretaker-btn');
  if (caretakerBtn)
    caretakerBtn.className = active ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm';

  const toggleBtn = document.getElementById('toggle-caretaker');
  if (toggleBtn) toggleBtn.classList.toggle('on', active);

  if (active) {
    AppState.a11y.voiceNav = true;
    const vnToggle = document.getElementById('toggle-voice-nav');
    if (vnToggle) vnToggle.classList.add('on');
    speak(t('speak.caretaker'));
  }
}

// ── Low Bandwidth / Lite Mode ─────────────────────
//  No animations, text-first, offline cache,
//  SMS fallback simulation panel
function _applyLiteMode(active) {
  document.body.classList.toggle('lite-mode', active);
  document.getElementById('offline-banner').classList.toggle('active', active);
  document.getElementById('sms-banner').classList.toggle('active', active);
  if (active) {
    showToast(t('toast.liteMode'));
  }
}

// ── High Contrast ─────────────────────────────────
function _applyHighContrast(active) {
  document.body.classList.toggle('high-contrast', active);
}

// ── Icon Navigation Mode (Illiterate users) ───────
function _applyIconMode(active) {
  if (active) {
    navigateTo('consult');
    switchInputTab('icons');
    showToast(t('toast.iconMode'));
    speak(t('speak.iconMode'));
  }
}

// ── Voice Navigation ──────────────────────────────
function _applyVoiceNav(active) {
  if (active) {
    speak(t('speak.voiceNav'));
  }
}

// ── Deaf / Caption Mode ───────────────────────────
//  For deaf & mute users:
//  • Hide voice UI (mic, voice tab) — unusable
//  • Auto-switch consult to text or icon input
//  • Persistent caption bar shows all speak() output
//  • Screen flash for emergency / critical alerts
//  • Enhanced longer-lasting visual toasts
//  • Visual vibration cues on notifications

let _captionBar      = null;
let _captionTimer     = null;
let _origSpeak        = null;
let _flashOverlay     = null;

function _applyDeafMode(active) {
  document.body.classList.toggle('deaf-mode', active);

  if (active) {
    // 1. Create caption bar if not exists
    _ensureCaptionBar();
    _captionBar.classList.add('visible');

    // 2. Create flash overlay for emergencies
    _ensureFlashOverlay();

    // 3. Override speak() → visual caption instead of audio
    if (!_origSpeak) _origSpeak = window.speak;
    window.speak = function(text) {
      _showCaption(text);
    };

    // 4. Override showToast for longer display in deaf mode
    _patchToastForDeaf(true);

    // 5. Auto-switch away from voice input tab
    if (document.getElementById('input-voice')?.style.display !== 'none') {
      if (typeof switchInputTab === 'function') switchInputTab('text');
    }

    // 6. Show activation caption
    _showCaption(t('deaf.activated'));

  } else {
    // Restore speak()
    if (_origSpeak) { window.speak = _origSpeak; _origSpeak = null; }

    // Hide caption bar
    if (_captionBar) _captionBar.classList.remove('visible');

    // Restore toast timing
    _patchToastForDeaf(false);
  }
}

// ── Caption Bar (subtitle strip) ──────────────────
function _ensureCaptionBar() {
  if (_captionBar) return;
  _captionBar = document.createElement('div');
  _captionBar.id = 'deaf-caption-bar';
  _captionBar.innerHTML = '<span id="deaf-caption-text"></span>';
  document.body.appendChild(_captionBar);
}

function _showCaption(text) {
  if (!_captionBar) return;
  const el = document.getElementById('deaf-caption-text');
  if (!el) return;

  el.textContent = '💬 ' + text;
  _captionBar.classList.add('visible', 'flash');
  clearTimeout(_captionTimer);

  // Remove flash animation class after it plays
  setTimeout(() => _captionBar.classList.remove('flash'), 600);

  // Auto-hide after 6 seconds
  _captionTimer = setTimeout(() => {
    _captionBar.classList.remove('visible');
  }, 6000);
}

// ── Screen Flash for emergencies ──────────────────
function _ensureFlashOverlay() {
  if (_flashOverlay) return;
  _flashOverlay = document.createElement('div');
  _flashOverlay.id = 'deaf-flash-overlay';
  document.body.appendChild(_flashOverlay);
}

function deafFlash(color) {
  if (!AppState.a11y.deaf || !_flashOverlay) return;
  _flashOverlay.style.background = color || 'rgba(224,32,32,0.35)';
  _flashOverlay.classList.add('active');
  setTimeout(() => _flashOverlay.classList.remove('active'), 700);
}

// ── Patch showToast for deaf: longer + bigger ─────
let _origToastTimeout = 3200;
function _patchToastForDeaf(active) {
  // We wrap the existing showToast to extend timing when deaf mode is on
  if (active) {
    const origShowToast = window.showToast;
    window._origShowToast = origShowToast;
    window.showToast = function(msg) {
      const toast = document.getElementById('toast');
      toast.innerHTML = msg;
      toast.classList.add('show');
      clearTimeout(window._deafToastTimer);
      // Also show as caption
      _showCaption(msg.replace(/<[^>]*>/g, ''));
      window._deafToastTimer = setTimeout(() => toast.classList.remove('show'), 6000);
    };
  } else {
    if (window._origShowToast) {
      window.showToast = window._origShowToast;
      delete window._origShowToast;
    }
  }
}

// Hook into emergency overlay for deaf flash
const _origTriggerEmergency = typeof triggerEmergency === 'function' ? triggerEmergency : null;
if (_origTriggerEmergency) {
  window.triggerEmergency = function() {
    _origTriggerEmergency();
    if (AppState.a11y.deaf) {
      deafFlash('rgba(224,32,32,0.45)');
      setTimeout(() => deafFlash('rgba(224,32,32,0.45)'), 800);
      setTimeout(() => deafFlash('rgba(224,32,32,0.45)'), 1600);
      _showCaption('🚨 EMERGENCY — High-risk symptoms detected!');
    }
  };
}
