/* ═══════════════════════════════════════════════════
   SwasthyaSetu — ai-engine.js
   AI Health Analysis Pipeline:
   Input → Tokenize → Symptom Map → Risk Classifier
   → Urgency Scorer → Specialist Matcher → Output
═══════════════════════════════════════════════════ */

// ── Risk Scoring Formula ─────────────────────────
//
//  urgencyScore = (symptomSeverity × 0.40)
//               + (symptomDuration × 0.25)
//               + (patientAge      × 0.15)
//               + (chronicHistory  × 0.20)
//
//  Score  0–39  → Normal    (Green)
//  Score 40–69  → Moderate  (Yellow)
//  Score 70–84  → Urgent    (Orange)
//  Score 85–100 → Emergency (Red)

function computeUrgencyScore(symptoms, age, duration, chronicHistory) {
  // Age risk mapping
  const AGE_RANGES  = [0, 12, 18, 40, 60, 75, 200];
  const AGE_SCORES  = [6,  3,  0,  2,  5,  8];
  let ageScore = 0;
  for (let i = 0; i < AGE_RANGES.length - 1; i++) {
    if (age >= AGE_RANGES[i] && age < AGE_RANGES[i + 1]) {
      ageScore = AGE_SCORES[i];
      break;
    }
  }

  // Symptom severity (highest severity among selected symptoms)
  const symptomSeverity = symptoms.reduce((max, s) => {
    const found = SYMPTOM_ICONS.find(si =>
      si.key === s ||
      si.label.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(si.key)
    );
    return found ? Math.max(max, found.severity) : Math.max(max, 3);
  }, 3);

  // Chronic history risk
  const chronicScore = chronicHistory.length > 0
    ? (chronicHistory.includes('heart') ? 10 : 6)
    : 0;

  const raw = (symptomSeverity * 10 * 0.40)
            + (Math.min(duration * 10, 50) * 0.25)
            + (ageScore * 10 * 0.15)
            + (chronicScore * 10 * 0.20);

  return Math.min(Math.round(raw), 100);
}

// ── Urgency Classification ───────────────────────
function classifyUrgency(score) {
  if (score >= 85) return {
    level: t('urg.emergency'), color: 'emergency', badge: 'badge-emergency',
    action: t('urg.emergencyAct'), emoji: '🚨'
  };
  if (score >= 70) return {
    level: t('urg.urgent'), color: 'urgent', badge: 'badge-urgent',
    action: t('urg.urgentAct'), emoji: '⚠️'
  };
  if (score >= 40) return {
    level: t('urg.moderate'), color: 'caution', badge: 'badge-moderate',
    action: t('urg.moderateAct'), emoji: '⚡'
  };
  return {
    level: t('urg.normal'), color: 'safe', badge: 'badge-normal',
    action: t('urg.normalAct'), emoji: '✅'
  };
}

// ── Doctor Ranking Algorithm ─────────────────────
//
//  score = (availability × 30)
//        + (1/distance   × 25)
//        + (1/waitTime   × 25)
//        + (rating       × 20)
//        + symptomMatch bonus
//        + age-specific specialty boost

function rankDoctors(symptoms, age) {
  return DOCTORS.map(doc => {
    const availScore   = doc.available ? 30 : 0;
    const distScore    = (1 / Math.max(doc.distance, 0.1)) * 25;
    const waitScore    = (1 / Math.max(doc.wait, 1)) * 25;
    const ratingScore  = doc.rating * 4;

    const symptomMatch = symptoms.some(s =>
      doc.specialties.some(sp => sp.includes(s) || s.includes(sp))
    ) ? 20 : 0;

    // Age-specific specialty boosts
    const childBoost      = (age <= 14 && doc.specialty === 'Pediatrician') ? 40 : 0;
    const pregnancyBoost  = (symptoms.includes('pregnancy') || symptoms.includes('swollen feet'))
                            ? (doc.specialty === 'Gynaecologist' ? 40 : 0)
                            : 0;
    const cardioBoost     = (symptoms.includes('chest') || symptoms.includes('sweating'))
                            ? (doc.specialty === 'Cardiologist' ? 30 : 0)
                            : 0;

    return {
      ...doc,
      rankScore: availScore + distScore + waitScore + ratingScore
                 + symptomMatch + childBoost + pregnancyBoost + cardioBoost
    };
  })
  .sort((a, b) => b.rankScore - a.rankScore)
  .slice(0, 4);
}

// ── Specialist Resolver ───────────────────────────
function getSpecialistType(symptoms) {
  const map = {
    chest: 'Cardiologist', sweating: 'Cardiologist',
    fever: 'General Physician', general: 'General Physician',
    headache: 'Neurologist', dizzy: 'Neurologist',
    breathing: 'Pulmonologist',
    joint: 'Orthopedic', injury: 'Orthopedic',
    rash: 'Dermatologist',
    eye: 'Ophthalmologist',
    pregnancy: 'Gynaecologist', 'swollen feet': 'Gynaecologist',
    stomach: 'General Physician', diarrhea: 'General Physician', nausea: 'General Physician',
    child: 'Pediatrician',
    bleeding: 'General Physician',
    tooth: 'Dentist'
  };
  for (const s of symptoms) { if (map[s]) return map[s]; }
  return 'General Physician';
}

// ── Condition Descriptions ────────────────────────
const CONDITION_MAP = {
  chest:    'Possible cardiac involvement — chest pain requires immediate evaluation',
  sweating: 'Possible autonomic or cardiac event — monitor closely',
  fever:    'Acute febrile illness — likely viral or bacterial infection',
  headache: 'Tension or vascular headache — neurological evaluation recommended',
  breathing:'Respiratory distress — pulmonary or cardiac cause possible',
  joint:    'Musculoskeletal disorder — inflammatory or degenerative joint condition',
  rash:     'Dermatological condition — allergic, infectious, or inflammatory origin',
  stomach:  'Gastrointestinal disturbance — infection, intolerance, or inflammation',
  diarrhea: 'Acute gastroenteritis — risk of dehydration, monitor fluid intake',
  nausea:   'Gastrointestinal upset — possible infection or metabolic cause',
  injury:   'Traumatic injury — musculoskeletal assessment required',
  eye:      'Ocular complaint — examination by ophthalmologist recommended',
  dizzy:    'Vertigo or presyncope — neurological or inner ear cause possible',
  bleeding: 'Haemorrhage event — immediate assessment required',
  highfever:'High-grade fever — risk of febrile convulsion in children',
  general:  'Systemic health concern — comprehensive evaluation recommended'
};

// ── Full Analysis Pipeline ────────────────────────
function runAnalysis(symptoms, age, duration, chronic) {
  const score    = computeUrgencyScore(symptoms, age, duration, chronic);
  const urgency  = classifyUrgency(score);
  const specialist = getSpecialistType(symptoms);
  const doctors  = rankDoctors(symptoms, age);

  renderAIResult(score, urgency, specialist, symptoms);
  renderDoctorMatches(doctors);

  document.getElementById('ai-result-container').style.display = 'block';
  document.getElementById('doctor-matches').style.display      = 'block';

  // Generate AI prescription from detected symptoms
  generateAIPrescription(symptoms, specialist);

  // Trigger real-time nearby healthcare search based on specialist
  searchNearbyHealthcare(specialist);

  if (urgency.level === 'EMERGENCY') {
    setTimeout(() => document.getElementById('emergency-overlay').classList.add('active'), 800);
    if (AppState.a11y.deaf) showToast(t('toast.highRisk'));
  }

  // Trigger Instant Relief Engine on delays (score ≥ 40 or long duration)
  if (score >= 40 || duration >= 4) showReliefModal(symptoms[0] || 'general');

  showToast(urgency.emoji + ' ' + t('ai.title') + ' — ' + urgency.level);
  if (AppState.a11y.voiceNav) speak(t('speak.analysis', { level: urgency.level, action: urgency.action }));
}

// ── Text Input Analysis ───────────────────────────
function analyzeSymptoms() {
  const text     = document.getElementById('symptom-text').value;
  const age      = parseInt(document.getElementById('patient-age').value) || 35;
  const duration = parseInt(document.getElementById('symptom-duration').value) || 3;

  if (!text.trim() && AppState.selectedSymptoms.length === 0) {
    showToast(t('toast.descFirst'));
    return;
  }

  const words    = text.toLowerCase().split(/\s+/);
  const symptoms = SYMPTOM_ICONS
    .filter(si => words.some(w => si.key.includes(w) || w.includes(si.key) || si.label.toLowerCase().includes(w)))
    .map(si => si.key);

  if (symptoms.length === 0) symptoms.push('general');
  runAnalysis(symptoms, age, duration, AppState.chronicConditions);
}

// ── Icon Input Analysis ───────────────────────────
function analyzeFromIcons() {
  if (AppState.selectedSymptoms.length === 0) {
    showToast(t('toast.selectOne'));
    return;
  }
  const age      = parseInt(document.getElementById('icon-age').value) || 35;
  const severity = parseInt(document.getElementById('icon-severity').value) || 5;
  const duration = severity >= 7 ? 5 : 3;
  runAnalysis(AppState.selectedSymptoms, age, duration, AppState.chronicConditions);
}

// ── Voice Input Analysis ──────────────────────────
function analyzeFromVoice() {
  const transcript = document.getElementById('voice-transcript').innerText;
  document.getElementById('symptom-text').value = transcript;
  switchInputTab('text');
  analyzeSymptoms();
}

// ── Render AI Result Card ─────────────────────────
function renderAIResult(score, urgency, specialist, symptoms) {
  const container = document.getElementById('ai-result-container');
  const condKey = 'cond.' + (symptoms[0] || 'general');
  const condition = t(condKey) !== condKey ? t(condKey) : t('cond.general');

  container.innerHTML = `
    <div class="ai-result">
      <div class="ai-result-header">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--color-muted); letter-spacing:0.8px; text-transform:uppercase; margin-bottom:6px">
            ${t('ai.title')}
          </div>
          <span class="badge ${urgency.badge}" style="font-size:14px; padding:6px 14px">
            ${urgency.emoji} ${urgency.level}
          </span>
        </div>
        <div style="text-align:right">
          <div style="font-size:28px; font-weight:800; color:var(--color-${urgency.color})">${score}</div>
          <div style="font-size:10px; color:var(--color-muted); text-transform:uppercase; letter-spacing:0.5px">${t('ai.score')}</div>
        </div>
      </div>
      <div class="ai-result-body">
        <div class="ai-result-section">
          <div class="ai-result-label">${t('ai.action')}</div>
          <div class="ai-result-value" style="font-weight:600; color:var(--color-${urgency.color})">${urgency.action}</div>
        </div>
        <div class="ai-result-section">
          <div class="ai-result-label">${t('ai.condition')}</div>
          <div class="ai-result-value">${condition}</div>
        </div>
        <div class="ai-result-section">
          <div class="ai-result-label">${t('ai.specialist')}</div>
          <div class="ai-result-value" style="display:flex; align-items:center; gap:8px">
            🩺 ${specialist} <span class="badge badge-trust">${t('ai.primary')}</span>
          </div>
        </div>
        <div class="disclaimer-box">
          <span>⚠️</span>
          <span>${t('ai.disclaimer')}</span>
        </div>
      </div>
    </div>`;
}

// ── Input Tab Switcher ────────────────────────────
function switchInputTab(tab) {
  ['voice', 'text', 'icons'].forEach(t => {
    const panel = document.getElementById('input-' + t);
    const btn   = document.getElementById('tab-' + t);
    if (panel) panel.style.display = t === tab ? (t === 'voice' ? 'flex' : 'block') : 'none';
    if (btn)   btn.className = t === tab ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm';
  });
}

// ── Symptom Toggles ───────────────────────────────
function renderSymptomGrid() {
  const grid = document.getElementById('symptom-icon-grid');
  if (!grid) return;
  grid.innerHTML = SYMPTOM_ICONS.map(s => `
    <button class="symptom-icon-btn" id="icon-${s.key}" onclick="toggleSymptom('${s.key}', this)">
      <div class="symptom-emoji">${s.emoji}</div>
      <div>${t('sym.' + s.key)}</div>
    </button>`).join('');
}

function toggleSymptom(key, el) {
  const idx = AppState.selectedSymptoms.indexOf(key);
  if (idx > -1) { AppState.selectedSymptoms.splice(idx, 1); el.classList.remove('selected'); }
  else          { AppState.selectedSymptoms.push(key);      el.classList.add('selected'); }
  if (AppState.a11y.voiceNav) speak(idx > -1 ? t('speak.deselected', { symptom: key }) : t('speak.selected', { symptom: key }));
}

function toggleChronic(el, val) {
  const idx = AppState.chronicConditions.indexOf(val);
  if (idx > -1) { AppState.chronicConditions.splice(idx, 1); el.className = 'btn btn-ghost btn-sm'; }
  else          { AppState.chronicConditions.push(val);      el.className = 'btn btn-primary btn-sm'; }
}
