/* ═══════════════════════════════════════════════════
   SwasthyaSetu — app.js
   Main application entry point.
   Initialises all modules after DOM is ready.
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  // ── Load persisted data (localStorage + Supabase) ──
  await initStorage();

  // ── Render all views ────────────────────────────
  renderHomeDoctors();
  renderSymptomGrid();
  renderMedicines();
  renderClinics();

  // ── Start background processes ──────────────────
  animateVan();
  updateStats();

  // Modal close listeners are already handled in utils.js

  console.log('%c SwasthyaSetu v1.0 loaded ✅', 'color:#1B8A5A; font-weight:bold; font-size:14px');
  console.log('%c Intelligent Rural Healthcare Network', 'color:#1A56DB;');
});
