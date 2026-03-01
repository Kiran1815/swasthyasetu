/* ═══════════════════════════════════════════════════
   SwasthyaSetu — state.js
   Centralized reactive app state
═══════════════════════════════════════════════════ */

const AppState = {
  currentLang:           'en',
  currentView:           'home',
  selectedDoctor:        null,
  selectedSlot:          null,
  selectedPharmacy:      1,
  selectedPlatform:      null,    // 'tata1mg' | 'apollo' | 'medplus' | 'pharmeasy'
  aiPrescription:        [],      // medicines from AI analysis
  selectedClinic:        null,
  selectedClinicSlot:    null,
  deliveryStep:          0,
  selectedFamilyMember:  null,
  consultForMember:      1,       // family member ID the consult is for (default: self)
  memberPrescriptions:   {},      // { memberId: [ { date, doc, meds, medicines[] } ] }
  selectedSymptoms:      [],
  chronicConditions:     [],
  caretakerMode:         false,
  isListening:           false,
  reliefCountdown:       1680,
  consultationCount:     1247,
  a11y: {
    caretaker:  false,
    icons:      false,
    bandwidth:  false,
    voiceNav:   false,
    contrast:   false,
    deaf:       false
  }
};
