/* ═══════════════════════════════════════════════════
   SwasthyaSetu — ui-doctors.js
   Doctor card rendering, smart booking modal,
   voice input (Web Speech API), emergency flows
═══════════════════════════════════════════════════ */

// ── Doctor Card HTML ──────────────────────────────
function createDoctorCardHTML(doc) {
  return `
    <div class="doctor-card" onclick="openBooking(${doc.id})">
      <div class="doctor-avatar" style="background:${doc.bg}">${doc.avatar}</div>
      <div class="doctor-info">
        <div class="doctor-name">${doc.name}</div>
        <div class="doctor-specialty">${doc.specialty}</div>
        <div class="doctor-meta">
          <div class="doctor-meta-item">
            <div class="avail-dot ${doc.available ? 'available' : 'offline'}"></div>
            ${doc.available ? t('doc.available') : t('doc.unavailable')}
          </div>
          <div class="doctor-meta-item">📍 ${doc.distance}${t('doc.kmAway')}</div>
          <div class="doctor-meta-item">⏱ ${doc.wait}${t('doc.wait')}</div>
          <div class="doctor-meta-item">⭐ ${doc.rating}</div>
        </div>
        <div class="doctor-langs">
          ${doc.languages.map(l => `<span class="lang-tag">${l}</span>`).join('')}
        </div>
      </div>
      <div class="doctor-actions">
        <div class="fee-tag">₹${doc.fee}</div>
        <div style="display:flex; gap:6px">
          <a class="btn btn-outline btn-sm btn-call" href="tel:${doc.phone || ''}" onclick="event.stopPropagation()" title="${doc.phone || ''}">
            📞 ${t('doc.call')}
          </a>
          <button class="btn btn-primary btn-sm"
            onclick="event.stopPropagation(); openBooking(${doc.id})">${t('doc.book')}</button>
        </div>
      </div>
    </div>`;
}

// ── Render Home Doctors ───────────────────────────
function renderHomeDoctors() {
  const list = document.getElementById('home-doctor-list');
  if (!list) return;
  const top3 = DOCTORS.filter(d => d.available).slice(0, 3);
  list.innerHTML = top3.map(doc => createDoctorCardHTML(doc)).join('');
}

// ── Render Doctor Matches (consult view) ──────────
function renderDoctorMatches(doctors) {
  const list = document.getElementById('doctor-match-list');
  if (!list) return;
  list.innerHTML = doctors.map(doc => createDoctorCardHTML(doc)).join('');
}

// ── Booking Modal ─────────────────────────────────
function openBooking(docId) {
  const doc = DOCTORS.find(d => d.id === docId);
  AppState.selectedDoctor = doc;

  document.getElementById('booking-doctor-info').innerHTML = `
    <div style="display:flex; gap:14px; align-items:center; padding:14px;
                background:var(--color-surface); border-radius:var(--radius-md)">
      <div style="font-size:32px">${doc.avatar}</div>
      <div>
        <div style="font-size:16px; font-weight:700">${doc.name}</div>
        <div style="font-size:13px; color:var(--color-trust)">${doc.specialty}</div>
        <div style="font-size:12px; color:var(--color-muted)">
          📍 ${doc.location} · ${doc.distance}km away · ₹${doc.fee}
        </div>
      </div>
    </div>`;

  const times = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
                 '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM'];
  const unavailable = [2, 5, 8];

  document.getElementById('slot-grid').innerHTML = times.map((t, i) =>
    `<button class="time-slot ${unavailable.includes(i) ? 'unavailable' : ''}"
      ${unavailable.includes(i) ? 'disabled' : ''}
      onclick="selectSlot(this, '${t}')">${t}</button>`
  ).join('');

  openModal('modal-booking');
}

function selectSlot(el, time) {
  document.querySelectorAll('#slot-grid .time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  AppState.selectedSlot = time;
}

function confirmBooking() {
  if (!AppState.selectedSlot) { showToast(t('toast.selectSlot')); return; }
  closeModal('modal-booking');
  showToast(t('toast.apptConfirm', { doctor: AppState.selectedDoctor.name, time: AppState.selectedSlot }));
  if (AppState.a11y.voiceNav)
    speak(t('speak.apptConfirm', { doctor: AppState.selectedDoctor.name, time: AppState.selectedSlot }));
}

// ── Voice Input ───────────────────────────────────
let _recognition = null;

function toggleVoice() {
  const btn = document.getElementById('voice-btn');

  // Fallback demo if no Speech API available
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    const demos = [
      'I have chest pain and I am sweating a lot since morning',
      'I have fever and headache for 2 days',
      'My stomach is hurting and I feel nauseous'
    ];
    const transcript = document.getElementById('voice-transcript');
    transcript.innerText = demos[Math.floor(Math.random() * demos.length)];
    transcript.style.color = 'var(--color-ink)';
    document.getElementById('voice-analyze-btn').style.display = 'flex';
    showToast(t('toast.demoLoaded'));
    return;
  }

  if (!AppState.isListening) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    _recognition = new SpeechRecognition();
    // Match recognition language to selected app language
    _recognition.lang = LANG_VOICE_MAP[AppState.currentLang] || 'en-IN';
    _recognition.continuous = false;
    _recognition.interimResults = true;

    _recognition.onresult = e => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('');
      const transcript = document.getElementById('voice-transcript');
      transcript.innerText = text;
      transcript.style.color = 'var(--color-ink)';
      if (e.results[0].isFinal)
        document.getElementById('voice-analyze-btn').style.display = 'flex';
    };

    _recognition.onend = () => {
      AppState.isListening = false;
      btn.classList.remove('listening');
      btn.innerHTML = '🎤<div class="voice-ring"></div>';
    };

    _recognition.start();
    AppState.isListening = true;
    btn.classList.add('listening');
    btn.innerHTML = '⏹<div class="voice-ring"></div>';
    showToast(t('toast.listening'));
  } else {
    _recognition && _recognition.stop();
    AppState.isListening = false;
    btn.classList.remove('listening');
    btn.innerHTML = '🎤<div class="voice-ring"></div>';
  }
}

// ── Emergency Flows ───────────────────────────────
function triggerEmergency() {
  document.getElementById('emergency-overlay').classList.add('active');
  if (AppState.a11y.voiceNav)
    speak(t('speak.emergencyAlert'));
}

function dismissEmergency() {
  document.getElementById('emergency-overlay').classList.remove('active');
  showReliefModal('chest');
}

function callAmbulance() {
  window.location.href = 'tel:108';
  showToast(t('toast.ambulance'));
}

function setEmergencyMode() {
  AppState.selectedSymptoms = ['chest', 'sweating'];
  switchInputTab('icons');
  // Use requestAnimationFrame + timeout to ensure DOM is rendered
  requestAnimationFrame(() => {
    setTimeout(() => {
      const chest    = document.getElementById('icon-chest');
      const sweating = document.getElementById('icon-sweating');
      if (chest)    chest.classList.add('selected');
      if (sweating) sweating.classList.add('selected');
    }, 200);
  });
}
