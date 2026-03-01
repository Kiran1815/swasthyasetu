/* ═══════════════════════════════════════════════════
   SwasthyaSetu — ui-family.js
   Family Health Account (Module 6):
   Member grid, add/remove members, profile cards,
   health timeline, risk prediction, per-person
   prescription history & consult-tab integration
═══════════════════════════════════════════════════ */

const STATUS_COLOR = { normal: 'badge-safe',     caution: 'badge-moderate', urgent: 'badge-urgent' };
const STATUS_KEY   = { normal: 'status.healthy',  caution: 'status.watch',   urgent: 'status.attention' };
const CHART_COLORS = ['#1A56DB','#1B8A5A','#D97706','#E02020','#7C3AED','#0EA5E9'];

let _removeMode = false;  // toggle for delete-mode overlay on cards

// ── IDs ──────────────────────────────────────────
function _nextMemberId() {
  return FAMILY_MEMBERS.length ? Math.max(...FAMILY_MEMBERS.map(m => m.id)) + 1 : 1;
}

// ── Avatar picker ────────────────────────────────
const RELATION_AVATARS = {
  Self:'🧑', Father:'👨', Mother:'👩', Son:'👦', Daughter:'👧',
  Spouse:'💑', Brother:'🧑', Sister:'👩', Grandfather:'👴',
  Grandmother:'👵', Other:'🙂'
};

// ── Family Grid ───────────────────────────────────
function renderFamilyGrid() {
  const grid = document.getElementById('family-grid');
  if (!grid) return;
  grid.innerHTML = FAMILY_MEMBERS.map(m => {
    const rxCount = getMemberPrescriptions(m.id).length;
    return `
    <div class="family-card ${AppState.selectedFamilyMember === m.id ? 'active' : ''} ${_removeMode ? 'remove-mode' : ''}"
         id="fm-${m.id}" onclick="${_removeMode ? `confirmRemoveMember(${m.id})` : `selectFamilyMember(${m.id})`}">
      ${_removeMode ? '<div class="family-remove-badge">✕</div>' : ''}
      <div class="family-avatar">${m.avatar}</div>
      <div class="family-name">${m.name}</div>
      <div class="family-age">${m.relation} · ${m.age} yrs</div>
      <div class="family-status">
        <span class="badge ${STATUS_COLOR[m.status]}">${t(STATUS_KEY[m.status])}</span>
      </div>
      ${rxCount > 0 ? `<div class="family-rx-count">📋 ${rxCount}</div>` : ''}
    </div>`;
  }).join('');

  // Also refresh the consult dropdown
  populateConsultMemberDropdown();
}

// ── Select Member ─────────────────────────────────
function selectFamilyMember(id) {
  if (_removeMode) return;
  AppState.selectedFamilyMember = id;
  renderFamilyGrid();

  const member = FAMILY_MEMBERS.find(m => m.id === id);
  const profileSection = document.getElementById('member-profile');
  profileSection.style.display = 'block';

  renderMemberProfile(member);
  renderRiskAlerts(member);
  renderHealthChart(member);
  renderPrescriptionHistory(member);

  profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (AppState.a11y.voiceNav)
    speak(t('speak.profile', { name: member.name, age: member.age, relation: member.relation }));
}

// ══════════════════════════════════════════════════
//  ADD / REMOVE FAMILY MEMBERS
// ══════════════════════════════════════════════════

function showAddFamilyModal() {
  document.getElementById('add-family-modal').classList.add('active');
}
function closeAddFamilyModal() {
  document.getElementById('add-family-modal').classList.remove('active');
}

function addFamilyMember() {
  const name     = document.getElementById('add-member-name').value.trim();
  const relation = document.getElementById('add-member-relation').value;
  const age      = parseInt(document.getElementById('add-member-age').value) || 0;

  if (!name) { showToast('⚠️ ' + t('fam.enterName')); return; }
  if (!age)  { showToast('⚠️ ' + t('fam.enterAge')); return; }

  const newMember = {
    id: _nextMemberId(),
    name,
    relation,
    age,
    avatar: RELATION_AVATARS[relation] || '🙂',
    chronic: [],
    lastVisit: '—',
    nextDue: '—',
    status: 'normal',
    meds: [],
    visits: [0,0,0,0,0,0],
    riskAlerts: [],
    prescriptions: []
  };

  FAMILY_MEMBERS.push(newMember);
  persistData();
  closeAddFamilyModal();
  renderFamilyGrid();
  showToast('✅ ' + name + ' ' + t('fam.added'));

  // Clear form
  document.getElementById('add-member-name').value = '';
  document.getElementById('add-member-age').value = '';
  document.getElementById('add-member-relation').value = 'Self';
}

function toggleRemoveMode() {
  _removeMode = !_removeMode;
  renderFamilyGrid();
  if (_removeMode) showToast('🗑️ ' + t('fam.tapToRemove'));
}

function confirmRemoveMember(id) {
  const member = FAMILY_MEMBERS.find(m => m.id === id);
  if (!member) return;
  if (FAMILY_MEMBERS.length <= 1) {
    showToast('⚠️ ' + t('fam.cannotRemoveLast'));
    _removeMode = false;
    renderFamilyGrid();
    return;
  }
  if (confirm(t('fam.confirmRemove') + ' ' + member.name + '?')) {
    const idx = FAMILY_MEMBERS.findIndex(m => m.id === id);
    if (idx > -1) FAMILY_MEMBERS.splice(idx, 1);
    // Clean up stored prescriptions
    delete AppState.memberPrescriptions[id];
    persistData();
    if (AppState.selectedFamilyMember === id) {
      AppState.selectedFamilyMember = null;
      document.getElementById('member-profile').style.display = 'none';
    }
    if (AppState.consultForMember === id) {
      AppState.consultForMember = FAMILY_MEMBERS[0]?.id || 1;
    }
    showToast('🗑️ ' + member.name + ' ' + t('fam.removed'));
  }
  _removeMode = false;
  renderFamilyGrid();
}

// ══════════════════════════════════════════════════
//  CONSULT TAB — FAMILY MEMBER DROPDOWN
// ══════════════════════════════════════════════════

function populateConsultMemberDropdown() {
  const sel = document.getElementById('consult-member-select');
  if (!sel) return;
  const currentVal = AppState.consultForMember;
  sel.innerHTML = FAMILY_MEMBERS.map(m =>
    `<option value="${m.id}" ${m.id === currentVal ? 'selected' : ''}>${m.avatar} ${m.name} (${m.relation}, ${m.age}yr)</option>`
  ).join('');
}

function onConsultMemberChange(val) {
  AppState.consultForMember = parseInt(val);
}

// ══════════════════════════════════════════════════
//  PER-PERSON PRESCRIPTION STORAGE
// ══════════════════════════════════════════════════

function getMemberPrescriptions(memberId) {
  // Combine seed data + dynamic prescriptions
  const member = FAMILY_MEMBERS.find(m => m.id === memberId);
  const seedRx = member ? member.prescriptions : [];
  const dynRx  = AppState.memberPrescriptions[memberId] || [];
  return [...dynRx, ...seedRx];
}

function storePrescriptionForMember(memberId, medicines, doctorName) {
  if (!AppState.memberPrescriptions[memberId]) {
    AppState.memberPrescriptions[memberId] = [];
  }
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year:'numeric' });
  const medsStr = medicines.map(m => m.name).join(', ');

  AppState.memberPrescriptions[memberId].unshift({
    date: dateStr,
    doc: doctorName || 'AI Prescription',
    meds: medsStr,
    medicines: medicines.map(m => ({...m}))
  });

  persistData();

  // Update the family card if visible
  renderFamilyGrid();
}

// ── Member Profile Card ───────────────────────────
function renderMemberProfile(member) {
  const card = document.getElementById('member-profile-card');
  if (!card) return;

  const chronicBadges = member.chronic.length
    ? member.chronic.map(c => `<span class="badge badge-moderate">⚕ ${c}</span>`).join('')
    : `<span class="badge badge-safe">✓ ${t('fam.noChronicCond')}</span>`;

  const medsSection = member.meds.length ? `
    <div style="margin-top:12px">
      <div style="font-size:11px; font-weight:700; color:var(--color-muted); letter-spacing:0.6px;
                  text-transform:uppercase; margin-bottom:8px">${t('fam.currentMeds')}</div>
      ${member.meds.map(m =>
        `<div style="padding:8px 12px; background:var(--color-trust-light); border-radius:var(--radius-sm);
                     margin-bottom:4px; font-size:13px; color:var(--color-trust); font-weight:500">💊 ${m}</div>`
      ).join('')}
    </div>` : '';

  card.innerHTML = `
    <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px">
      <div style="font-size:44px">${member.avatar}</div>
      <div style="flex:1">
        <div style="font-size:20px; font-weight:700">${member.name} Sharma</div>
        <div style="font-size:14px; color:var(--color-muted)">${member.relation} · ${member.age} years old</div>
        <div style="margin-top:6px; display:flex; gap:6px; flex-wrap:wrap">${chronicBadges}</div>
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px">
      <div style="padding:12px; background:var(--color-surface); border-radius:var(--radius-md)">
        <div style="font-size:10px; color:var(--color-muted); font-weight:700;
                    text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px">${t('fam.lastVisit')}</div>
        <div style="font-size:14px; font-weight:600">${member.lastVisit}</div>
      </div>
      <div style="padding:12px; background:var(--color-surface); border-radius:var(--radius-md)">
        <div style="font-size:10px; color:var(--color-muted); font-weight:700;
                    text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px">${t('fam.nextDue')}</div>
        <div style="font-size:14px; font-weight:600">${member.nextDue}</div>
      </div>
    </div>
    ${medsSection}
    <div style="margin-top:14px; display:flex; gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="navigateTo('consult')">${t('fam.bookConsult')}</button>
      <button class="btn btn-ghost"   style="flex:1" onclick="navigateTo('medicines')">${t('fam.medicines')}</button>
    </div>`;
}

// ── Risk Prediction Alerts ────────────────────────
//
// Rules:
//  IF same symptom 3+ times in 60 days → Chronic Risk Alert
//  IF BP readings trend upward          → Hypertension Watch
//  IF no visit in 90 days (chronic)     → Check-in Reminder

function renderRiskAlerts(member) {
  const alertsDiv = document.getElementById('risk-alerts');
  if (!alertsDiv) return;
  alertsDiv.innerHTML = '';

  if (member.riskAlerts.includes('chronic')) {
    alertsDiv.innerHTML += `
      <div class="risk-alert chronic">
        <div class="risk-alert-icon">⚡</div>
        <div>
          <div class="risk-alert-title" style="color:var(--color-caution)">${t('risk.chronicTitle')}</div>
          <div class="risk-alert-desc">
            ${t('risk.chronicDesc')}
          </div>
        </div>
      </div>`;
  }

  if (member.riskAlerts.includes('hypertension')) {
    alertsDiv.innerHTML += `
      <div class="risk-alert hypertension">
        <div class="risk-alert-icon">⚠️</div>
        <div>
          <div class="risk-alert-title" style="color:var(--color-emergency)">${t('risk.hyperTitle')}</div>
          <div class="risk-alert-desc">
            ${t('risk.hyperDesc')}
          </div>
        </div>
      </div>`;
  }

  if (member.riskAlerts.includes('reminder')) {
    alertsDiv.innerHTML += `
      <div class="risk-alert reminder">
        <div class="risk-alert-icon">📅</div>
        <div>
          <div class="risk-alert-title" style="color:var(--color-trust)">${t('risk.reminderTitle')}</div>
          <div class="risk-alert-desc">
            ${t('risk.reminderDesc')}
          </div>
        </div>
      </div>`;
  }
}

// ── Health Timeline Chart (pure CSS bars) ─────────
function renderHealthChart(member) {
  const chartDiv = document.getElementById('health-chart');
  if (!chartDiv) return;

  const maxVisit = Math.max(...member.visits, 1);
  chartDiv.innerHTML = member.visits.map((v, i) => `
    <div class="chart-bar-group">
      <div class="chart-bar-wrap">
        <div class="chart-bar"
             style="height:${(v / maxVisit * 100)}%;
                    background:${CHART_COLORS[i]};
                    min-height:${v > 0 ? '4px' : '0'}">
        </div>
      </div>
      <div class="chart-label">${v}</div>
    </div>`).join('');

  // Risk trend badge
  const trend = member.riskAlerts.includes('hypertension') ? t('risk.worsening')
               : member.riskAlerts.includes('chronic')      ? t('risk.watch')
               : t('risk.stable');
  const trendBadge = document.getElementById('risk-trend-badge');
  if (trendBadge) {
    trendBadge.textContent = trend;
    trendBadge.className   = 'badge '
      + (trend === t('risk.worsening') ? 'badge-emergency'
       : trend === t('risk.watch')     ? 'badge-moderate'
       :                         'badge-normal');
  }
}

// ── Prescription History ──────────────────────────
function renderPrescriptionHistory(member) {
  const el = document.getElementById('member-prescriptions');
  if (!el) return;

  const allRx = getMemberPrescriptions(member.id);

  if (!allRx.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-state-icon">📋</div>
      <div class="empty-state-text">${t('fam.noRx')}</div>
    </div>`;
    return;
  }
  el.innerHTML = allRx.map(p => `
    <div class="history-item">
      <div class="history-icon-wrap">📋</div>
      <div style="flex:1">
        <div class="history-title">${p.meds}</div>
        <div class="history-date">${p.date} · ${p.doc}</div>
      </div>
      ${p.medicines ? `<button class="btn btn-ghost btn-sm" onclick="viewRxDetail(${JSON.stringify(p.medicines).replace(/"/g, '&quot;')})">View</button>` : ''}
    </div>`).join('');
}

// ── View prescription detail ──────────────────────
function viewRxDetail(medicines) {
  let html = '<div style="font-size:18px;font-weight:700;margin-bottom:16px">📋 Prescription Detail</div>';
  medicines.forEach(m => {
    html += `<div style="padding:10px 14px;background:var(--color-trust-light);border-radius:var(--radius-sm);margin-bottom:6px">
      <div style="font-weight:600;color:var(--color-trust)">💊 ${m.name}</div>
      <div style="font-size:12px;color:var(--color-muted);margin-top:2px">${m.dose} · ${m.frequency} · ${m.duration}</div>
    </div>`;
  });
  html += `<button class="btn btn-ghost btn-full" style="margin-top:12px" onclick="this.closest('.modal-overlay').classList.remove('active')">Close</button>`;

  // Reuse a generic modal pattern
  let modal = document.getElementById('rx-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'rx-detail-modal';
    modal.className = 'modal-overlay';
    modal.onclick = function(e) { if (e.target === modal) modal.classList.remove('active'); };
    modal.innerHTML = '<div class="modal" style="max-width:380px" id="rx-detail-content"></div>';
    document.body.appendChild(modal);
  }
  document.getElementById('rx-detail-content').innerHTML = html;
  modal.classList.add('active');
}
