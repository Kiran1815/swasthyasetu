/* ═══════════════════════════════════════════════════
   SwasthyaSetu — nearby-search.js
   Real-time nearby healthcare facility search using:
   • Browser Geolocation API for user position
   • Overpass API (OpenStreetMap) for real facilities
   • Leaflet.js for interactive map rendering
═══════════════════════════════════════════════════ */

// ── State ────────────────────────────────────────
let _nearbyMap = null;
let _userLat = null;
let _userLon = null;
let _nearbyMarkers = [];

// ── Type → color / emoji mapping ─────────────────
const FACILITY_STYLE = {
  hospital: { color: '#E74C3C', emoji: '🏥', label: 'nearby.hospital' },
  clinic:   { color: '#3498DB', emoji: '🏪', label: 'nearby.clinic'   },
  doctors:  { color: '#2ECC71', emoji: '🩺', label: 'nearby.doctor'   },
  pharmacy: { color: '#F39C12', emoji: '💊', label: 'nearby.pharmacy' }
};

// ── Get User Location ────────────────────────────
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        _userLat = pos.coords.latitude;
        _userLon = pos.coords.longitude;
        resolve({ lat: _userLat, lon: _userLon });
      },
      err => {
        // Fallback to Gulbarga, Karnataka (common demo location)
        _userLat = 17.3297;
        _userLon = 76.8343;
        resolve({ lat: _userLat, lon: _userLon });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 600000 }
    );
  });
}

// ── Query Overpass API for nearby facilities ─────
async function queryNearbyFacilities(lat, lon, radiusMeters) {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"~"hospital|clinic|doctors|pharmacy"](around:${radiusMeters},${lat},${lon});
      way["amenity"~"hospital|clinic|doctors|pharmacy"](around:${radiusMeters},${lat},${lon});
      node["healthcare"](around:${radiusMeters},${lat},${lon});
    );
    out center body;
  `;

  const resp = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  if (!resp.ok) throw new Error('Overpass API error');
  const data = await resp.json();
  return parseOverpassResults(data.elements, lat, lon);
}

// ── Parse Overpass elements into facility objects ─
function parseOverpassResults(elements, userLat, userLon) {
  const seen = new Set();

  return elements
    .map(el => {
      const tags = el.tags || {};
      const name = tags.name || tags['name:en'] || '';
      if (!name) return null; // skip unnamed

      // Deduplicate by name
      const dedupKey = name.toLowerCase().replace(/\s+/g, '');
      if (seen.has(dedupKey)) return null;
      seen.add(dedupKey);

      // Get coordinates (nodes have lat/lon, ways have center)
      const lat = el.lat || (el.center && el.center.lat);
      const lon = el.lon || (el.center && el.center.lon);
      if (!lat || !lon) return null;

      // Determine facility type
      const amenity = tags.amenity || tags.healthcare || 'clinic';
      let type = 'clinic';
      if (amenity === 'hospital') type = 'hospital';
      else if (amenity === 'doctors' || amenity === 'doctor') type = 'doctors';
      else if (amenity === 'pharmacy') type = 'pharmacy';

      // Calculate distance
      const dist = haversineDistance(userLat, userLon, lat, lon);

      return {
        name: name,
        type: type,
        lat: lat,
        lon: lon,
        distance: dist,
        phone: tags.phone || tags['contact:phone'] || tags['phone:mobile'] || '',
        address: tags['addr:full'] || tags['addr:street'] || '',
        website: tags.website || tags['contact:website'] || '',
        openNow: tags.opening_hours || '',
        specialty: tags['healthcare:speciality'] || tags.speciality || ''
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 20);
}

// ── Haversine distance (km) ──────────────────────
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
          + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
          * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Render Nearby Facility Card ──────────────────
function createNearbyCardHTML(facility) {
  const style = FACILITY_STYLE[facility.type] || FACILITY_STYLE.clinic;
  const distText = facility.distance < 1
    ? (facility.distance * 1000).toFixed(0) + 'm'
    : facility.distance.toFixed(1) + 'km';

  const phoneDisplay = facility.phone
    ? facility.phone
    : t('nearby.noPhone');

  const callBtnDisabled = facility.phone ? '' : 'disabled style="opacity:0.5;pointer-events:none"';

  return `
    <div class="nearby-card" onclick="panToFacility(${facility.lat}, ${facility.lon})">
      <div class="nearby-card-header">
        <div class="nearby-type-badge" style="background:${style.color}15; color:${style.color}; border:1px solid ${style.color}30">
          ${style.emoji} ${t(style.label)}
        </div>
        <div class="nearby-distance">📍 ${distText}</div>
      </div>
      <div class="nearby-card-body">
        <div class="nearby-name">${facility.name}</div>
        ${facility.address ? `<div class="nearby-address">${facility.address}</div>` : ''}
        <div class="nearby-phone">
          📞 ${phoneDisplay}
        </div>
        ${facility.specialty ? `<div class="nearby-specialty">🩺 ${facility.specialty}</div>` : ''}
      </div>
      <div class="nearby-card-actions">
        <a class="btn btn-outline btn-sm btn-call" href="tel:${facility.phone}" ${callBtnDisabled}
           onclick="event.stopPropagation()">
          📞 ${t('doc.call')}
        </a>
        <button class="btn btn-primary btn-sm"
          onclick="event.stopPropagation(); openDirections(${facility.lat}, ${facility.lon})">
          🗺️ ${t('nearby.directions')}
        </button>
      </div>
    </div>`;
}

// ── Open Directions in Google Maps ───────────────
function openDirections(lat, lon) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
}

// ── Pan Map to Facility ──────────────────────────
function panToFacility(lat, lon) {
  if (_nearbyMap) {
    _nearbyMap.setView([lat, lon], 16);
  }
}

// ── Render Leaflet Map ───────────────────────────
function renderNearbyMap(facilities) {
  const mapDiv = document.getElementById('nearby-map');
  if (!mapDiv) return;

  // Destroy old map if exists
  if (_nearbyMap) {
    _nearbyMap.remove();
    _nearbyMap = null;
  }

  _nearbyMap = L.map('nearby-map', {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true
  }).setView([_userLat, _userLon], 13);

  // OpenStreetMap tiles (free, no API key)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/">OSM</a>'
  }).addTo(_nearbyMap);

  // User location marker
  const userIcon = L.divIcon({
    className: 'user-location-marker',
    html: '<div class="user-dot-outer"><div class="user-dot-inner"></div></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  L.marker([_userLat, _userLon], { icon: userIcon })
    .addTo(_nearbyMap)
    .bindPopup('<strong>' + t('nearby.youAreHere') + '</strong>');

  // Facility markers
  _nearbyMarkers = [];
  facilities.forEach(f => {
    const style = FACILITY_STYLE[f.type] || FACILITY_STYLE.clinic;
    const icon = L.divIcon({
      className: 'facility-marker',
      html: `<div class="facility-dot" style="background:${style.color}">${style.emoji}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const distText = f.distance < 1
      ? (f.distance * 1000).toFixed(0) + 'm'
      : f.distance.toFixed(1) + 'km';

    const phoneLink = f.phone
      ? `<br><a href="tel:${f.phone}">📞 ${f.phone}</a>`
      : '';

    const marker = L.marker([f.lat, f.lon], { icon: icon })
      .addTo(_nearbyMap)
      .bindPopup(`
        <strong>${f.name}</strong><br>
        ${style.emoji} ${t(style.label)} · ${distText}
        ${phoneLink}
      `);

    _nearbyMarkers.push(marker);
  });

  // Fit bounds to include all markers
  if (facilities.length > 0) {
    const allPoints = [[_userLat, _userLon], ...facilities.map(f => [f.lat, f.lon])];
    _nearbyMap.fitBounds(allPoints, { padding: [40, 40], maxZoom: 15 });
  }

  // Invalidate size after a short delay (fixes rendering in hidden containers)
  setTimeout(() => _nearbyMap && _nearbyMap.invalidateSize(), 300);
}

// ── Main: Search & Render Nearby Healthcare ──────
async function searchNearbyHealthcare(specialistType) {
  const container = document.getElementById('nearby-healthcare');
  const mapSection = document.getElementById('nearby-map-section');
  const resultsList = document.getElementById('nearby-results-list');
  const loading = document.getElementById('nearby-loading');
  const specBadge = document.getElementById('nearby-spec-badge');

  if (!container) return;

  // Show sections
  container.style.display = 'block';
  mapSection.style.display = 'block';
  loading.style.display = 'block';
  resultsList.innerHTML = '';

  // Set specialist badge
  specBadge.textContent = '🩺 ' + t('nearby.lookingFor') + ' ' + specialistType;

  try {
    // Get user location
    const loc = await getUserLocation();

    // Query Overpass API (10km radius)
    let facilities = await queryNearbyFacilities(loc.lat, loc.lon, 10000);

    // If no results, expand to 25km
    if (facilities.length === 0) {
      facilities = await queryNearbyFacilities(loc.lat, loc.lon, 25000);
    }

    loading.style.display = 'none';

    if (facilities.length === 0) {
      resultsList.innerHTML = `
        <div style="text-align:center; padding:24px; color:var(--color-muted)">
          <div style="font-size:48px; margin-bottom:12px">🔍</div>
          <div style="font-size:14px">${t('nearby.noResults')}</div>
        </div>`;
      return;
    }

    // Sort: hospitals and clinics first (more likely to have specialists)
    const typeOrder = { hospital: 0, clinic: 1, doctors: 2, pharmacy: 3 };
    facilities.sort((a, b) => {
      const typeA = typeOrder[a.type] ?? 4;
      const typeB = typeOrder[b.type] ?? 4;
      if (typeA !== typeB) return typeA - typeB;
      return a.distance - b.distance;
    });

    // Render cards
    resultsList.innerHTML = facilities.map(f => createNearbyCardHTML(f)).join('');

    // Render map
    renderNearbyMap(facilities);

    // Toast
    showToast(t('nearby.found', { count: facilities.length }));

  } catch (err) {
    loading.style.display = 'none';
    console.error('Nearby search error:', err);

    // Fallback: show a message with a "retry" button
    resultsList.innerHTML = `
      <div style="text-align:center; padding:24px">
        <div style="font-size:48px; margin-bottom:12px">📡</div>
        <div style="font-size:14px; color:var(--color-muted); margin-bottom:12px">${t('nearby.error')}</div>
        <button class="btn btn-primary btn-sm" onclick="searchNearbyHealthcare('${specialistType}')">
          🔄 ${t('nearby.retry')}
        </button>
      </div>`;
  }
}
