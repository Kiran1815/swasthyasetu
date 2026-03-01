/* ═══════════════════════════════════════════════════
   SwasthyaSetu — supabase-db.js
   Persistent storage: localStorage (instant / offline)
   + Supabase cloud backup (sync when online).

   ── SETUP (run ONCE in Supabase → SQL Editor) ────
   
   create table if not exists app_data (
     key   text primary key,
     value jsonb not null,
     updated_at timestamptz default now()
   );

   alter table app_data enable row level security;
   create policy "allow_anon_all" on app_data
     for all to anon using (true) with check (true);

   ──────────────────────────────────────────────────
═══════════════════════════════════════════════════ */

const SUPA_URL = 'https://ejjzspuhihxgbbmzyynl.supabase.co';
const SUPA_KEY = 'sb_publishable_wZAK9Si-N8Ye32ayLPlGnA_wxQf_f-w';

let _sb  = null;   // Supabase client

// ── Initialise Supabase client ───────────────────
function _initSB() {
  try {
    if (window.supabase && window.supabase.createClient) {
      _sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
      console.log('☁️  Supabase client ready');
    }
  } catch (e) {
    console.warn('⚠️ Supabase init failed — using localStorage only', e.message);
  }
}

// ══════════════════════════════════════════════════
//  LOCAL STORAGE  (primary — instant & offline)
// ══════════════════════════════════════════════════

const _LS_MEMBERS = 'setu_family_members';
const _LS_RX      = 'setu_prescriptions';

function _lsSave() {
  try {
    localStorage.setItem(_LS_MEMBERS, JSON.stringify(FAMILY_MEMBERS));
    localStorage.setItem(_LS_RX,      JSON.stringify(AppState.memberPrescriptions));
  } catch (e) { /* storage full — fail silently */ }
}

function _lsLoad() {
  try {
    const mRaw = localStorage.getItem(_LS_MEMBERS);
    const rRaw = localStorage.getItem(_LS_RX);

    if (mRaw) {
      const arr = JSON.parse(mRaw);
      FAMILY_MEMBERS.length = 0;          // clear seed data
      arr.forEach(m => FAMILY_MEMBERS.push(m));
    }
    if (rRaw) {
      AppState.memberPrescriptions = JSON.parse(rRaw);
    }
    return !!(mRaw || rRaw);
  } catch (e) { return false; }
}

// ══════════════════════════════════════════════════
//  SUPABASE CLOUD  (secondary — async backup)
// ══════════════════════════════════════════════════

async function _sbSave() {
  if (!_sb) return;
  try {
    const now = new Date().toISOString();
    const { error } = await _sb.from('app_data').upsert([
      { key: 'family_members', value: FAMILY_MEMBERS,                  updated_at: now },
      { key: 'prescriptions',  value: AppState.memberPrescriptions,    updated_at: now }
    ]);
    if (error) throw error;
  } catch (e) {
    if (String(e.message || e).includes('does not exist')) {
      console.warn('☁️  Supabase table "app_data" not found. Run the SQL from supabase-db.js in your Supabase SQL Editor.');
    }
  }
}

async function _sbLoad() {
  if (!_sb) return false;
  try {
    const { data, error } = await _sb
      .from('app_data')
      .select('key, value')
      .in('key', ['family_members', 'prescriptions']);

    if (error) throw error;
    if (!data || data.length === 0) return false;

    data.forEach(row => {
      if (row.key === 'family_members' && Array.isArray(row.value) && row.value.length) {
        FAMILY_MEMBERS.length = 0;
        row.value.forEach(m => FAMILY_MEMBERS.push(m));
      }
      if (row.key === 'prescriptions' && row.value && typeof row.value === 'object') {
        AppState.memberPrescriptions = row.value;
      }
    });

    console.log('☁️  Loaded data from Supabase');
    return true;
  } catch (e) {
    if (String(e.message || e).includes('does not exist')) {
      console.warn('☁️  Supabase table "app_data" not found — using localStorage.');
    } else {
      console.warn('☁️  Supabase load failed — using localStorage.', e.message);
    }
    return false;
  }
}

// ══════════════════════════════════════════════════
//  PUBLIC API
// ══════════════════════════════════════════════════

/** Call after every data mutation (add/remove member, new prescription). */
function persistData() {
  _lsSave();        // instant
  _sbSave();        // async cloud backup (non-blocking)
}

/**
 * Master init — called once from app.js on DOMContentLoaded.
 * 1. Load localStorage (instant)
 * 2. Try Supabase cloud (overwrites if newer)
 * 3. Push seed/local data to cloud if cloud was empty
 * 4. Re-render family grid with loaded data
 */
async function initStorage() {
  // 1. Instant load from browser
  const hadLocal = _lsLoad();

  // 2. Init Supabase client
  _initSB();

  // 3. Try cloud load
  if (_sb) {
    const cloudOk = await _sbLoad();

    if (cloudOk) {
      _lsSave();            // cache cloud data locally
    } else {
      // Cloud empty or unavailable — push current data up
      _lsSave();
      _sbSave();
    }
  } else if (!hadLocal) {
    // No cloud, no local — first visit; persist seed data
    _lsSave();
  }

  // 4. Refresh UI with loaded data
  renderFamilyGrid();
  console.log('💾 Storage initialised —', FAMILY_MEMBERS.length, 'members,',
    Object.values(AppState.memberPrescriptions).flat().length, 'prescriptions');
}
