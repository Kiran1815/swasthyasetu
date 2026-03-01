/* ═══════════════════════════════════════════════════
   SwasthyaSetu — data.js
   All seed data: doctors, clinics, medicines,
   family members, pharmacies, relief steps
═══════════════════════════════════════════════════ */

const DOCTORS = [
  { id: 1,  name: 'Dr. Mohammed Rafiq',      specialty: 'General Physician',  location: 'Raichur',    languages: ['Hindi','Urdu','Kannada'],       distance: 0.8,  wait: 15, rating: 4.8, available: true,  fee: 150, avatar: '👨‍⚕️', bg: '#EBF0FC', phone: '+919845012345', specialties: ['fever','cold','general','diabetes','bp'] },
  { id: 2,  name: 'Dr. Priya Venkataraman',  specialty: 'Cardiologist',        location: 'Gulbarga',   languages: ['Hindi','Kannada','Telugu'],      distance: 2.4,  wait: 35, rating: 4.9, available: true,  fee: 400, avatar: '👩‍⚕️', bg: '#FEE8E8', phone: '+919845023456', specialties: ['chest','heart','bp','cardiac','sweating'] },
  { id: 3,  name: 'Dr. Sunita Devi',         specialty: 'Gynaecologist',       location: 'Bidar',      languages: ['Hindi','Marathi','Kannada'],     distance: 4.1,  wait: 25, rating: 4.7, available: true,  fee: 300, avatar: '👩‍⚕️', bg: '#F0FDF4', phone: '+919845034567', specialties: ['pregnancy','female','gynae','swollen feet','nausea'] },
  { id: 4,  name: 'Dr. Ramesh Nair',         specialty: 'Pediatrician',        location: 'Yadgir',     languages: ['Malayalam','Hindi','Kannada'],   distance: 3.2,  wait: 20, rating: 4.6, available: true,  fee: 200, avatar: '👨‍⚕️', bg: '#FEF3CD', phone: '+919845045678', specialties: ['child','fever','pediatric','kids'] },
  { id: 5,  name: 'Dr. Anita Sharma',        specialty: 'Dermatologist',       location: 'Koppal',     languages: ['Hindi','Rajasthani'],            distance: 5.7,  wait: 45, rating: 4.5, available: false, fee: 350, avatar: '👩‍⚕️', bg: '#F5F3FF', phone: '+919845056789', specialties: ['skin','rash','allergy','derma'] },
  { id: 6,  name: 'Dr. Suresh Kumar Rao',    specialty: 'Orthopedic Surgeon',  location: 'Bidar',      languages: ['Kannada','Hindi','Telugu'],      distance: 6.1,  wait: 60, rating: 4.4, available: true,  fee: 380, avatar: '👨‍⚕️', bg: '#F0F9FF', phone: '+919845067890', specialties: ['bone','joint','pain','back','orthopedic','injury'] },
  { id: 7,  name: 'Dr. Fatima Begum',        specialty: 'General Physician',   location: 'Kalaburagi', languages: ['Urdu','Hindi','Kannada'],        distance: 1.2,  wait: 10, rating: 4.7, available: true,  fee: 120, avatar: '👩‍⚕️', bg: '#EBF0FC', phone: '+919845078901', specialties: ['fever','cold','general','stomach','nausea','diarrhea'] },
  { id: 8,  name: 'Dr. Krishnamurthy P.',    specialty: 'Diabetologist',       location: 'Raichur',    languages: ['Kannada','Telugu','Hindi'],      distance: 2.0,  wait: 30, rating: 4.8, available: true,  fee: 280, avatar: '👨‍⚕️', bg: '#F0FDF4', phone: '+919845089012', specialties: ['diabetes','sugar','endocrine'] },
  { id: 9,  name: 'Dr. Vijaya Lakshmi',      specialty: 'ENT Specialist',      location: 'Gulbarga',   languages: ['Telugu','Hindi','Kannada'],      distance: 3.8,  wait: 40, rating: 4.5, available: false, fee: 320, avatar: '👩‍⚕️', bg: '#FFF0F0', phone: '+919845090123', specialties: ['ear','throat','nose','ent'] },
  { id: 10, name: 'Dr. Abdul Hameed',        specialty: 'Neurologist',         location: 'Bidar',      languages: ['Urdu','Hindi'],                  distance: 8.2,  wait: 90, rating: 4.9, available: true,  fee: 600, avatar: '👨‍⚕️', bg: '#F5F0FF', phone: '+919845001234', specialties: ['headache','nerve','brain','neurological','dizzy'] },
  { id: 11, name: 'Dr. Meenakshi Iyer',      specialty: 'Ophthalmologist',     location: 'Latur',      languages: ['Tamil','Hindi','Kannada'],       distance: 12.0, wait: 50, rating: 4.6, available: true,  fee: 250, avatar: '👩‍⚕️', bg: '#EFF6FF', phone: '+919845012346', specialties: ['eye','vision','ophtha'] },
  { id: 12, name: 'Dr. Ravi Shankar G.',     specialty: 'Pulmonologist',       location: 'Gulbarga',   languages: ['Kannada','Hindi'],               distance: 4.5,  wait: 55, rating: 4.7, available: true,  fee: 420, avatar: '👨‍⚕️', bg: '#F0FDF4', phone: '+919845023457', specialties: ['breathing','lung','asthma','cough','chest'] }
];

const MOBILE_CLINICS = [
  { id: 1, van: 'MH-04', name: 'Cardiology Camp',       route: 'Osmanabad → Latur',         days: ['Tue','Thu'],          specialty: 'Cardiologist + ECG Unit',         nextVisit: 'Thu, Feb 27', countdown: { h: 2,  m: 34, s: 10 }, capacity: 40, booked: 28, emoji: '🫀' },
  { id: 2, van: 'KA-07', name: 'Mother & Child Health', route: 'Bidar → Basavakalyan',      days: ['Mon','Wed','Fri'],    specialty: 'Gynaecologist + Pediatrician',    nextVisit: 'Wed, Feb 26', countdown: { h: 0,  m: 47, s: 30 }, capacity: 50, booked: 38, emoji: '👶' },
  { id: 3, van: 'TS-11', name: 'Eye Care Camp',         route: 'Nizamabad → Armoor',        days: ['Sat'],                specialty: 'Ophthalmologist + Vision Tests',  nextVisit: 'Sat, Mar 1',  countdown: { h: 48, m: 15, s: 0  }, capacity: 35, booked: 12, emoji: '👁' },
  { id: 4, van: 'KA-14', name: 'Dental & General OPD',  route: 'Yadgir → Shorapur',         days: ['Mon','Thu'],          specialty: 'Dentist + General Physician',     nextVisit: 'Mon, Feb 25', countdown: { h: 22, m: 0,  s: 0  }, capacity: 45, booked: 22, emoji: '🦷' },
  { id: 5, van: 'MH-19', name: 'Diabetes Screening',    route: 'Osmanabad → Naldurg',       days: ['Tue','Fri'],          specialty: 'Diabetologist + Lab Tests',       nextVisit: 'Fri, Feb 28', countdown: { h: 68, m: 30, s: 0  }, capacity: 60, booked: 41, emoji: '🩸' }
];

const MEDICINES = [
  { name: 'Paracetamol 500mg',   dose: '1 tablet', frequency: '3 times daily after meals',   duration: '5 days',  category: 'Antipyretic' },
  { name: 'Metformin 500mg',     dose: '1 tablet', frequency: 'Twice daily after meals',     duration: '30 days', category: 'Antidiabetic' },
  { name: 'Amlodipine 5mg',      dose: '1 tablet', frequency: 'Once daily (morning)',        duration: '30 days', category: 'Antihypertensive' }
];

// ── Condition-to-Medicine Mapping (AI prescription) ──
const CONDITION_MEDICINES = {
  chest:     [
    { name: 'Aspirin 75mg',         dose: '1 tablet', frequency: 'Once daily', duration: '30 days', category: 'Antiplatelet', generic: true },
    { name: 'Atorvastatin 10mg',    dose: '1 tablet', frequency: 'Once daily at night', duration: '30 days', category: 'Statin', generic: true },
    { name: 'Sorbitrate 5mg',       dose: '1 tablet', frequency: 'As needed (sublingual)', duration: '10 days', category: 'Nitrate', generic: false }
  ],
  fever:     [
    { name: 'Paracetamol 500mg',    dose: '1 tablet', frequency: '3 times daily', duration: '5 days', category: 'Antipyretic', generic: true },
    { name: 'Azithromycin 500mg',   dose: '1 tablet', frequency: 'Once daily', duration: '3 days', category: 'Antibiotic', generic: true },
    { name: 'Cetirizine 10mg',      dose: '1 tablet', frequency: 'Once daily at night', duration: '5 days', category: 'Antihistamine', generic: true }
  ],
  headache:  [
    { name: 'Paracetamol 500mg',    dose: '1 tablet', frequency: 'Twice daily', duration: '3 days', category: 'Analgesic', generic: true },
    { name: 'Domperidone 10mg',     dose: '1 tablet', frequency: 'Before meals', duration: '3 days', category: 'Antiemetic', generic: true }
  ],
  stomach:   [
    { name: 'Pantoprazole 40mg',    dose: '1 tablet', frequency: 'Before breakfast', duration: '14 days', category: 'PPI', generic: true },
    { name: 'ORS Sachet',           dose: '1 sachet', frequency: 'Mix in 1L water, sip throughout day', duration: '3 days', category: 'Rehydration', generic: true },
    { name: 'Domperidone 10mg',     dose: '1 tablet', frequency: 'Before meals', duration: '5 days', category: 'Antiemetic', generic: true }
  ],
  diarrhea:  [
    { name: 'ORS Sachet',           dose: '1 sachet', frequency: 'Mix in 1L water, sip frequently', duration: '3 days', category: 'Rehydration', generic: true },
    { name: 'Zinc Tablet 20mg',     dose: '1 tablet', frequency: 'Once daily', duration: '14 days', category: 'Supplement', generic: true },
    { name: 'Racecadotril 100mg',   dose: '1 capsule', frequency: '3 times daily', duration: '3 days', category: 'Antidiarrheal', generic: true }
  ],
  breathing: [
    { name: 'Salbutamol Inhaler',   dose: '2 puffs', frequency: 'As needed', duration: '30 days', category: 'Bronchodilator', generic: false },
    { name: 'Montelukast 10mg',     dose: '1 tablet', frequency: 'Once daily at night', duration: '30 days', category: 'Leukotriene', generic: true },
    { name: 'Budesonide Inhaler',   dose: '1 puff', frequency: 'Twice daily', duration: '30 days', category: 'Corticosteroid', generic: false }
  ],
  joint:     [
    { name: 'Diclofenac 50mg',      dose: '1 tablet', frequency: 'Twice daily after meals', duration: '7 days', category: 'NSAID', generic: true },
    { name: 'Calcium + Vitamin D3', dose: '1 tablet', frequency: 'Once daily', duration: '30 days', category: 'Supplement', generic: true }
  ],
  rash:      [
    { name: 'Cetirizine 10mg',      dose: '1 tablet', frequency: 'Once daily at night', duration: '7 days', category: 'Antihistamine', generic: true },
    { name: 'Calamine Lotion',      dose: 'Apply thin layer', frequency: '2–3 times daily', duration: '7 days', category: 'Topical', generic: true }
  ],
  eye:       [
    { name: 'Ciprofloxacin Eye Drops', dose: '1 drop', frequency: '4 times daily', duration: '7 days', category: 'Ophthalmic', generic: true }
  ],
  nausea:    [
    { name: 'Ondansetron 4mg',      dose: '1 tablet', frequency: 'Twice daily', duration: '3 days', category: 'Antiemetic', generic: true },
    { name: 'Pantoprazole 40mg',    dose: '1 tablet', frequency: 'Before breakfast', duration: '7 days', category: 'PPI', generic: true }
  ],
  sweating:  [
    { name: 'Aspirin 75mg',         dose: '1 tablet', frequency: 'Once daily', duration: '30 days', category: 'Antiplatelet', generic: true },
    { name: 'Atorvastatin 10mg',    dose: '1 tablet', frequency: 'Once daily at night', duration: '30 days', category: 'Statin', generic: true }
  ],
  injury:    [
    { name: 'Diclofenac 50mg',      dose: '1 tablet', frequency: 'Twice daily', duration: '5 days', category: 'NSAID', generic: true },
    { name: 'Paracetamol 500mg',    dose: '1 tablet', frequency: '3 times daily', duration: '5 days', category: 'Analgesic', generic: true }
  ],
  general:   [
    { name: 'Paracetamol 500mg',    dose: '1 tablet', frequency: 'Twice daily', duration: '3 days', category: 'Analgesic', generic: true },
    { name: 'Multivitamin Tablet',  dose: '1 tablet', frequency: 'Once daily after breakfast', duration: '30 days', category: 'Supplement', generic: true }
  ]
};

// ── Online Pharmacy Platform Data ────────────────
const PHARMACY_PLATFORMS = [
  {
    id: 'tata1mg',
    name: 'Tata 1mg',
    logo: '💚',
    baseUrl: 'https://www.1mg.com/search/all?name=',
    cartUrl: 'https://www.1mg.com/cart',
    discount: '18% off',
    rating: 4.5,
    delivery: '1–2 days',
    cod: true,
    freeDeliveryAbove: 149
  },
  {
    id: 'apollo',
    name: 'Apollo Pharmacy',
    logo: '🏥',
    baseUrl: 'https://www.apollopharmacy.in/search-medicines/',
    cartUrl: 'https://www.apollopharmacy.in/cart',
    discount: '15% off',
    rating: 4.6,
    delivery: 'Same day',
    cod: true,
    freeDeliveryAbove: 200
  },
  {
    id: 'medplus',
    name: 'MedPlus',
    logo: '💙',
    baseUrl: 'https://www.medplusmart.com/searchProduct.mart?searchKey=',
    cartUrl: 'https://www.medplusmart.com/cart.mart',
    discount: '20% off',
    rating: 4.4,
    delivery: '1–3 days',
    cod: true,
    freeDeliveryAbove: 199
  },
  {
    id: 'pharmeasy',
    name: 'PharmEasy',
    logo: '💛',
    baseUrl: 'https://pharmeasy.in/search/all?name=',
    cartUrl: 'https://pharmeasy.in/cart',
    discount: '22% off',
    rating: 4.3,
    delivery: '1–2 days',
    cod: true,
    freeDeliveryAbove: 249
  }
];

// ── Medicine price lookup (simulated — maps medicine name → price per platform) ──
const MEDICINE_PRICES = {
  'Paracetamol 500mg':       { mrp: 30,  tata1mg: 17,  apollo: 22,  medplus: 15,  pharmeasy: 18  },
  'Azithromycin 500mg':      { mrp: 120, tata1mg: 89,  apollo: 95,  medplus: 82,  pharmeasy: 86  },
  'Cetirizine 10mg':         { mrp: 35,  tata1mg: 22,  apollo: 28,  medplus: 20,  pharmeasy: 24  },
  'Metformin 500mg':         { mrp: 45,  tata1mg: 28,  apollo: 32,  medplus: 25,  pharmeasy: 30  },
  'Amlodipine 5mg':          { mrp: 55,  tata1mg: 35,  apollo: 40,  medplus: 32,  pharmeasy: 37  },
  'Aspirin 75mg':            { mrp: 25,  tata1mg: 15,  apollo: 18,  medplus: 14,  pharmeasy: 16  },
  'Atorvastatin 10mg':       { mrp: 95,  tata1mg: 55,  apollo: 62,  medplus: 50,  pharmeasy: 58  },
  'Sorbitrate 5mg':          { mrp: 45,  tata1mg: 32,  apollo: 36,  medplus: 30,  pharmeasy: 34  },
  'Domperidone 10mg':        { mrp: 40,  tata1mg: 24,  apollo: 30,  medplus: 22,  pharmeasy: 26  },
  'Pantoprazole 40mg':       { mrp: 80,  tata1mg: 48,  apollo: 55,  medplus: 42,  pharmeasy: 50  },
  'ORS Sachet':              { mrp: 22,  tata1mg: 18,  apollo: 20,  medplus: 16,  pharmeasy: 17  },
  'Zinc Tablet 20mg':        { mrp: 30,  tata1mg: 20,  apollo: 24,  medplus: 18,  pharmeasy: 22  },
  'Racecadotril 100mg':      { mrp: 85,  tata1mg: 60,  apollo: 68,  medplus: 55,  pharmeasy: 62  },
  'Salbutamol Inhaler':      { mrp: 120, tata1mg: 95,  apollo: 102, medplus: 90,  pharmeasy: 98  },
  'Montelukast 10mg':        { mrp: 90,  tata1mg: 55,  apollo: 65,  medplus: 50,  pharmeasy: 58  },
  'Budesonide Inhaler':      { mrp: 280, tata1mg: 210, apollo: 235, medplus: 200, pharmeasy: 220 },
  'Diclofenac 50mg':         { mrp: 35,  tata1mg: 20,  apollo: 25,  medplus: 18,  pharmeasy: 22  },
  'Calcium + Vitamin D3':    { mrp: 140, tata1mg: 95,  apollo: 110, medplus: 88,  pharmeasy: 100 },
  'Calamine Lotion':         { mrp: 65,  tata1mg: 48,  apollo: 55,  medplus: 42,  pharmeasy: 50  },
  'Ciprofloxacin Eye Drops': { mrp: 55,  tata1mg: 38,  apollo: 42,  medplus: 35,  pharmeasy: 40  },
  'Ondansetron 4mg':         { mrp: 60,  tata1mg: 35,  apollo: 42,  medplus: 32,  pharmeasy: 38  },
  'Multivitamin Tablet':     { mrp: 150, tata1mg: 110, apollo: 125, medplus: 100, pharmeasy: 115 },
  'Levothyroxine 50mcg':     { mrp: 120, tata1mg: 80,  apollo: 95,  medplus: 75,  pharmeasy: 85  },
  'Atenolol 25mg':           { mrp: 30,  tata1mg: 18,  apollo: 22,  medplus: 16,  pharmeasy: 20  }
};

const PHARMACIES = [
  { id: 1, name: 'Jan Aushadhi Kendra',  dist: '0.4 km', stock: 'All Available', price: 142, available: true },
  { id: 2, name: 'Ravi Medical Store',   dist: '1.2 km', stock: 'All Available', price: 178, available: true },
  { id: 3, name: 'Sai Pharma',           dist: '2.1 km', stock: 'Partial',       price: 131, available: true },
  { id: 4, name: 'National Pharmacy',    dist: '3.5 km', stock: 'All Available', price: 189, available: true }
];

const FAMILY_MEMBERS = [
  {
    id: 1, name: 'Ramesh', relation: 'Father', age: 58, avatar: '👨',
    chronic: ['Hypertension','Type 2 Diabetes'],
    lastVisit: 'Jan 15, 2026', nextDue: 'Feb 28, 2026', status: 'caution',
    meds: ['Metformin 500mg', 'Amlodipine 5mg'],
    visits: [2,3,2,4,3,2], riskAlerts: ['hypertension','chronic'],
    prescriptions: [
      { date: 'Jan 15', doc: 'Dr. Rafiq',   meds: 'Metformin, Amlodipine' },
      { date: 'Oct 12', doc: 'Dr. Priya V.', meds: 'Atenolol 25mg' }
    ]
  },
  {
    id: 2, name: 'Savitha', relation: 'Mother', age: 54, avatar: '👩',
    chronic: ['Hypothyroid'],
    lastVisit: 'Feb 5, 2026', nextDue: 'Mar 5, 2026', status: 'normal',
    meds: ['Levothyroxine 50mcg'],
    visits: [1,1,2,1,2,1], riskAlerts: ['reminder'],
    prescriptions: [
      { date: 'Feb 5', doc: 'Dr. Fatima', meds: 'Levothyroxine 50mcg' }
    ]
  },
  {
    id: 3, name: 'Arjun', relation: 'Son', age: 22, avatar: '🧑',
    chronic: [],
    lastVisit: 'Nov 20, 2025', nextDue: '—', status: 'normal',
    meds: [],
    visits: [0,1,0,1,0,1], riskAlerts: [],
    prescriptions: [
      { date: 'Nov 20', doc: 'Dr. Rafiq', meds: 'Azithromycin 500mg, ORS' }
    ]
  },
  {
    id: 4, name: 'Dadi', relation: 'Grandmother', age: 78, avatar: '👵',
    chronic: ['Arthritis','Hypertension','Cataract'],
    lastVisit: 'Feb 10, 2026', nextDue: 'Mar 10, 2026', status: 'urgent',
    meds: ['Amlodipine 5mg','Atorvastatin 10mg','Calcitrol'],
    visits: [3,4,3,5,4,4], riskAlerts: ['chronic','hypertension'],
    prescriptions: [
      { date: 'Feb 10', doc: 'Dr. Priya V.', meds: 'Amlodipine, Atorvastatin' },
      { date: 'Jan 2',  doc: 'Dr. Suresh',   meds: 'Calcitrol, Pantoprazole' }
    ]
  },
  {
    id: 5, name: 'Riya', relation: 'Child', age: 8, avatar: '👧',
    chronic: [],
    lastVisit: 'Jan 28, 2026', nextDue: 'Apr 28, 2026', status: 'normal',
    meds: [],
    visits: [0,1,0,0,1,0], riskAlerts: [],
    prescriptions: [
      { date: 'Jan 28', doc: 'Dr. Ramesh Nair', meds: 'Paracetamol, ORS' }
    ]
  }
];

const SYMPTOM_ICONS = [
  { emoji: '🫀', label: 'Chest',     key: 'chest',    severity: 9, specialties: ['Cardiologist','General Physician'] },
  { emoji: '🤒', label: 'Fever',     key: 'fever',    severity: 5, specialties: ['General Physician','Pediatrician'] },
  { emoji: '🤢', label: 'Nausea',    key: 'nausea',   severity: 4, specialties: ['General Physician'] },
  { emoji: '🧠', label: 'Headache',  key: 'headache', severity: 5, specialties: ['Neurologist','General Physician'] },
  { emoji: '🦴', label: 'Joint Pain',key: 'joint',    severity: 4, specialties: ['Orthopedic'] },
  { emoji: '🫁', label: 'Breathing', key: 'breathing',severity: 8, specialties: ['Pulmonologist','General Physician'] },
  { emoji: '💧', label: 'Diarrhea',  key: 'diarrhea', severity: 5, specialties: ['General Physician'] },
  { emoji: '👁️', label: 'Eye Pain',  key: 'eye',      severity: 4, specialties: ['Ophthalmologist'] },
  { emoji: '🦷', label: 'Tooth',     key: 'tooth',    severity: 3, specialties: ['Dentist'] },
  { emoji: '🩸', label: 'Bleeding',  key: 'bleeding', severity: 9, specialties: ['General Physician','Surgeon'] },
  { emoji: '🤕', label: 'Injury',    key: 'injury',   severity: 7, specialties: ['Orthopedic','General Physician'] },
  { emoji: '🌡️', label: 'High Temp', key: 'highfever',severity: 7, specialties: ['General Physician','Pediatrician'] },
  { emoji: '🤳', label: 'Skin Rash', key: 'rash',     severity: 4, specialties: ['Dermatologist'] },
  { emoji: '🫃', label: 'Stomach',   key: 'stomach',  severity: 5, specialties: ['General Physician'] },
  { emoji: '💊', label: 'Dizziness', key: 'dizzy',    severity: 6, specialties: ['Neurologist','General Physician'] },
  { emoji: '😰', label: 'Sweating',  key: 'sweating', severity: 7, specialties: ['Cardiologist','General Physician'] }
];

const RELIEF_STEPS = {
  emergency: [
    { text: 'Make the patient lie down comfortably. Loosen any tight clothing around neck and chest.' },
    { text: 'Do NOT give food or water if the patient is having chest pain or difficulty breathing.' },
    { text: 'If conscious and not allergic: 1 aspirin (300–325mg) may be chewed — only for chest pain in adults.' },
    { text: 'Keep the patient calm and still. Do not allow any exertion.' },
    { text: 'Monitor breathing. If breathing stops, begin CPR only if trained to do so.' }
  ],
  fever: [
    { text: 'Apply cool (not ice cold) wet cloth to forehead, armpits, and wrists.' },
    { text: 'Ensure the patient drinks ORS or clean water — at least 2–3 liters per day.' },
    { text: 'Paracetamol 500mg (adults) may be given every 6 hours for fever above 38.5°C.' },
    { text: 'Remove excess clothing. Maintain room ventilation and rest.' },
    { text: 'If temperature exceeds 39.5°C or child is convulsing, seek emergency care immediately.' }
  ],
  stomach: [
    { text: 'Start ORS (Oral Rehydration Salt) immediately — mix 1 sachet in 1 litre of clean water.' },
    { text: 'Avoid solid food for 4–6 hours. Stick to clear liquids, rice water, or diluted fruit juice.' },
    { text: 'Wash hands thoroughly. Maintain hygiene to prevent spread to family members.' },
    { text: 'Zinc tablet (20mg for adults) can reduce diarrhoea duration. Safe for children too.' }
  ],
  general: [
    { text: 'Rest and avoid physical exertion until symptoms are assessed by a doctor.' },
    { text: 'Stay hydrated — drink clean water or ORS. Avoid tea, coffee, or alcohol.' },
    { text: 'Note down when symptoms started, any changes, and any medicines already taken.' },
    { text: 'Avoid self-medicating beyond paracetamol for fever/pain without medical advice.' }
  ]
};

const DELIVERY_STEPS = [
  { label: 'Pharmacy\nConfirmed', emoji: '✅' },
  { label: 'Being\nPacked',       emoji: '📦' },
  { label: 'Out for\nDelivery',   emoji: '🛵' },
  { label: 'Delivered',           emoji: '🏠' }
];
