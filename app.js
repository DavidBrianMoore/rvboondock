// Mock and Curated Data for Bellemont / Wing Mountain Area
// Mock and Curated Data for Bellemont / Wing Mountain Area
const FOREST_ROADS = [
  {
    id: "fr171",
    name: "Forest Road 171",
    number: "FR 171",
    maxLength: 55,
    minClearance: 8,
    difficulty: "Easy-Medium",
    cellSignal: { verizon: 3, att: 4, tmobile: 2 },
    roadGrade: "Wide gravel and dirt, some washboarding. Generally good for most tow rigs.",
    turnaround: "Excellent (multiple wide circular clearings at dispersed camps).",
    mvumCorridor: "300 feet dispersed camping corridor",
    satelliteLink: "https://www.google.com/maps/@35.2536,-111.7942,805m/data=!3m1!1e3",
    lat: 35.2536,
    lng: -111.7942
  },
  {
    id: "fr222",
    name: "Forest Road 222",
    number: "FR 222",
    maxLength: 42,
    minClearance: 10,
    difficulty: "Medium",
    cellSignal: { verizon: 4, att: 3, tmobile: 3 },
    roadGrade: "Gravel and hard dirt, gets narrower and rockier as you proceed north.",
    turnaround: "Fair (requires scouting; few large loops, mostly linear pullouts).",
    mvumCorridor: "300 feet dispersed camping corridor",
    satelliteLink: "https://www.google.com/maps/@35.2678,-111.7584,805m/data=!3m1!1e3",
    lat: 35.2678,
    lng: -111.7584
  },
  {
    id: "fr222b",
    name: "Wing Mountain Snowplay Corridor",
    number: "FR 222B",
    maxLength: 30,
    minClearance: 12,
    difficulty: "Hard",
    cellSignal: { verizon: 4, att: 4, tmobile: 4 },
    roadGrade: "Very narrow dirt tracks, soft shoulder, low overhanging ponderosa pine canopy.",
    turnaround: "Poor (extremely tight turnouts, high risk of jackknifing a long trailer).",
    mvumCorridor: "Designated dispersed camping sites only",
    satelliteLink: "https://www.google.com/maps/@35.2755,-111.7455,805m/data=!3m1!1e3",
    lat: 35.2755,
    lng: -111.7455
  },
  {
    id: "fr519",
    name: "Wing Mountain West",
    number: "FR 519",
    maxLength: 48,
    minClearance: 9,
    difficulty: "Medium",
    cellSignal: { verizon: 2, att: 3, tmobile: 1 },
    roadGrade: "Rocky tracks with basalt gravel. Some steep grading transitions near highway.",
    turnaround: "Good (large open staging areas at road intersections).",
    mvumCorridor: "300 feet dispersed camping corridor",
    satelliteLink: "https://www.google.com/maps/@35.2811,-111.7899,805m/data=!3m1!1e3",
    lat: 35.2811,
    lng: -111.7899
  },
  {
    id: "fr245",
    name: "Forest Road 245 (Kendrick Mtn)",
    number: "FR 245",
    maxLength: 38,
    minClearance: 10,
    difficulty: "Hard",
    cellSignal: { verizon: 2, att: 2, tmobile: 1 },
    roadGrade: "Rough dirt/gravel road with deep washboard sections and volcanic basalt rock surfaces.",
    turnaround: "Fair (mostly tight pullouts, requires scouting before parking a large rig).",
    mvumCorridor: "300 feet dispersed camping corridor",
    satelliteLink: "https://www.google.com/maps/@35.3130,-111.7580,805m/data=!3m1!1e3",
    lat: 35.3130,
    lng: -111.7580
  }
];

const DUMP_STATIONS = [
  {
    name: "Black Bart's RV Park",
    location: "Flagstaff, AZ (Exit 198)",
    address: "2760 E Butler Ave, Flagstaff, AZ 86004",
    phone: "(928) 774-1912",
    distance: "14 miles east of Bellemont",
    fee: "$20",
    water: "Potable water fill included",
    access: "Commercial paved layout, big rig friendly",
    status: "Open year-round",
    public: true,
    lat: 35.1980,
    lng: -111.6095
  },
  {
    name: "Fort Tuthill County Campground",
    location: "Flagstaff, AZ (Exit 337 on I-17)",
    address: "2446 Fort Tuthill Loop, Flagstaff, AZ 86005",
    phone: "(928) 286-7060",
    distance: "12 miles from Bellemont",
    fee: "$10",
    water: "Potable water fill included",
    access: "Good gravel access lane",
    status: "Open mid-April to mid-October",
    public: true,
    lat: 35.1315,
    lng: -111.6890
  },
  {
    name: "Maverik Adventure First Stop",
    location: "Flagstaff, AZ (Exit 191 on I-40)",
    address: "1690 W Route 66, Flagstaff, AZ 86001",
    phone: "(928) 773-0424",
    distance: "9 miles east of Bellemont",
    fee: "$10 (Rinse water only)",
    water: "No potable water at dump island",
    access: "Tight commercial layout, best for sub-30ft rigs",
    status: "Open year-round",
    public: true,
    lat: 35.1945,
    lng: -111.6660
  }
];

try {
// App State Management
let rigProfile = {
  length: 45,
  clearance: 10,
  wheelbase: 24,
  carrier: "verizon"
};

let loggedSpots = [];
let currentWizardStep = 1;

// Firebase / Shared Location state
let db = null;
let userLocation = null; // { lat, lng, timestamp }

// Elements
const navItems = document.querySelectorAll(".nav-item");
const tabViews = document.querySelectorAll(".tab-view");
const pageTitle = document.getElementById("page-title");
const pageSubtitle = document.getElementById("page-subtitle");
const pillCoords = document.getElementById("pill-coords");
const btnSyncGps = document.getElementById("btn-sync-gps");
const gpsTracker = document.getElementById("gps-tracker");

const rigForm = document.getElementById("rig-form");
const rigLengthInput = document.getElementById("rig-length");
const rigClearanceInput = document.getElementById("rig-clearance");
const rigWheelbaseInput = document.getElementById("rig-wheelbase");
const rigCarrierSelect = document.getElementById("rig-carrier");

const pillLength = document.getElementById("pill-length");
const pillClearance = document.getElementById("pill-clearance");
const visualTrailer = document.getElementById("visual-trailer");
const visualLengthText = document.getElementById("visual-length-text");
const threatLevelText = document.getElementById("threat-level");
const clearanceLevelText = document.getElementById("clearance-level");

// Route & Transit Selectors
const transitStartInput = document.getElementById("transit-start");
const transitDestSelect = document.getElementById("transit-dest");
const btnTransitRefresh = document.getElementById("btn-transit-refresh");
const btnNavGoogle = document.getElementById("btn-nav-google");
const btnNavGaia = document.getElementById("btn-nav-gaia");
const btnNavApple = document.getElementById("btn-nav-apple");
const transitSafetyContent = document.getElementById("transit-safety-content");
const transitServicesList = document.getElementById("transit-services-list");

// Haversine distance calculator
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function updateLocationPill() {
  if (userLocation) {
    const timeStr = userLocation.timestamp ? new Date(userLocation.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now';
    pillCoords.textContent = `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)} (${timeStr})`;
    
    if (gpsTracker) {
      gpsTracker.classList.remove("flash-success");
      void gpsTracker.offsetWidth; // Trigger reflow to restart animation
      gpsTracker.classList.add("flash-success");
    }
  } else {
    pillCoords.textContent = "Offline / No GPS";
  }
}

function syncCurrentGPS() {
  alert("GPS Sync Initiated!");
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser/device.");
    return;
  }
  
  btnSyncGps.textContent = "Locating...";
  btnSyncGps.disabled = true;

  // Safety timer to prevent button from getting stuck if iOS Safari blocks the prompt
  const safetyTimeout = setTimeout(() => {
    alert("GPS Request Timed Out.\n\nTo allow GPS access on your iPhone:\n1. Open iPhone Settings -> Privacy & Security -> Location Services (Turn ON).\n2. Ensure Safari Website access is allowed location permissions.\n3. Make sure you select 'Allow' when the browser prompts you.");
    btnSyncGps.textContent = "Sync GPS";
    btnSyncGps.disabled = false;
  }, 10000); // 10 seconds limit

  navigator.geolocation.getCurrentPosition(
    (position) => {
      clearTimeout(safetyTimeout); // Clear safety timer on success
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: Date.now()
      };
      
      userLocation = coords;
      updateLocationPill();
      renderRoadsList();
      renderDumpList();
      
      // Save to Firestore so it auto-uploads for desktop planning
      if (db) {
        db.collection("locations").doc("david").set({
          lat: coords.lat,
          lng: coords.lng,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          btnSyncGps.textContent = "Synced";
          setTimeout(() => {
            btnSyncGps.textContent = "Sync GPS";
            btnSyncGps.disabled = false;
          }, 1500);
        }).catch(err => {
          console.error("Firestore sync error:", err);
          alert(`Database sync failed: ${err.message}`);
          btnSyncGps.textContent = "Sync GPS";
          btnSyncGps.disabled = false;
        });
      } else {
        btnSyncGps.textContent = "Saved Local";
        setTimeout(() => {
          btnSyncGps.textContent = "Sync GPS";
          btnSyncGps.disabled = false;
        }, 1500);
      }
    },
    (error) => {
      clearTimeout(safetyTimeout); // Clear safety timer on error
      alert(`Error getting location (Code ${error.code}): ${error.message}\nTry moving closer to a window or checking Safari Location permissions in settings.`);
      btnSyncGps.textContent = "Sync GPS";
      btnSyncGps.disabled = false;
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
  );
}

btnSyncGps.addEventListener("click", syncCurrentGPS);
window.syncCurrentGPS = syncCurrentGPS;

// Tab Navigation
navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    tabViews.forEach(v => v.classList.remove("active"));
    
    item.classList.add("active");
    const targetTab = item.getAttribute("data-tab");
    document.getElementById(`tab-${targetTab}`).classList.add("active");
    
    updateHeaderMetadata(targetTab);
    
    if (targetTab === 'map') {
      if (typeof onMapTabActive === 'function') {
        onMapTabActive();
      }
    }
  });
});

function updateHeaderMetadata(tab) {
  const metadata = {
    profile: {
      title: "Rig Configuration",
      subtitle: "Configure your tow vehicle and trailer specifications for safe navigation."
    },
    wizard: {
      title: "Systematic Scouting Wizard",
      subtitle: "Execute the critical 4-step dual-app safety scouting workflow."
    },
    map: {
      title: "Interactive Mapping Center",
      subtitle: "Toggle terrain and satellite layers to scout roads, dumps, and logged spots."
    },
    transit: {
      title: "Route & Transit Planner",
      subtitle: "Plan navigation routes using Google Maps or Gaia, and check nearby dump stations."
    },
    roads: {
      title: "Forest Roads Explorer",
      subtitle: "Vetted trails and access corridors around Bellemont & Wing Mountain."
    },
    dumps: {
      title: "Dump & Water Stations",
      subtitle: "Locate crowdsourced dump stations and potable water fill stations."
    },
    calculator: {
      title: "Clearance & Turn Calculators",
      subtitle: "Ensure your trailer length and clearance aren't at risk of high-centering."
    },
    logger: {
      title: "Spot Logger & Exporter",
      subtitle: "Log coordinates and field data of scouted locations for offline recall."
    }
  };
  
  if (metadata[tab]) {
    pageTitle.textContent = metadata[tab].title;
    pageSubtitle.textContent = metadata[tab].subtitle;
  }
}

// Rig Profile Functionality
function updateRigUI() {
  pillLength.textContent = `${rigProfile.length} ft`;
  pillClearance.textContent = `${rigProfile.clearance} in`;
  
  // Update Visualizer Size
  // Assume standard truck is 18ft. Trailer is total length - 18ft.
  const truckLength = 18;
  const trailerLength = Math.max(5, rigProfile.length - truckLength);
  
  // Map trailer length (5-67ft) to 60px-240px width
  const visualWidth = 60 + ((trailerLength - 5) / (67 - 5)) * 180;
  visualTrailer.style.width = `${visualWidth}px`;
  
  visualLengthText.textContent = `Trailer (${trailerLength}ft)`;
  
  const visualTotalText = document.getElementById("visual-total-text");
  if (visualTotalText) {
    visualTotalText.textContent = `Total Combined: ${rigProfile.length}ft`;
  }
  
  // Update placeholders in Wizard
  document.querySelectorAll(".rig-len-ph").forEach(span => {
    span.textContent = rigProfile.length;
  });

  // Calculate Threat Levels
  if (rigProfile.length > 50) {
    threatLevelText.textContent = "CRITICAL (Turnarounds Rare)";
    threatLevelText.style.color = "var(--danger)";
  } else if (rigProfile.length > 35) {
    threatLevelText.textContent = "Medium (Check Satellite)";
    threatLevelText.style.color = "var(--warning)";
  } else {
    threatLevelText.textContent = "Low (Highly Maneuverable)";
    threatLevelText.style.color = "var(--primary)";
  }

  if (rigProfile.clearance < 8) {
    clearanceLevelText.textContent = "HIGH (Washout Risk)";
    clearanceLevelText.style.color = "var(--danger)";
  } else if (rigProfile.clearance < 11) {
    clearanceLevelText.textContent = "Standard";
    clearanceLevelText.style.color = "var(--warning)";
  } else {
    clearanceLevelText.textContent = "Off-Road Ready";
    clearanceLevelText.style.color = "var(--primary)";
  }

  // Refresh lists to highlight compatibility
  renderRoadsList();
  calculateCalculators();
}

rigForm.addEventListener("submit", (e) => {
  e.preventDefault();
  rigProfile.length = parseInt(rigLengthInput.value);
  rigProfile.clearance = parseInt(rigClearanceInput.value);
  rigProfile.wheelbase = parseInt(rigWheelbaseInput.value);
  rigProfile.carrier = rigCarrierSelect.value;
  
  localStorage.setItem("rv_boondock_rig", JSON.stringify(rigProfile));
  updateRigUI();
});

// Load saved profile
function loadRigProfile() {
  const saved = localStorage.getItem("rv_boondock_rig");
  if (saved) {
    rigProfile = JSON.parse(saved);
    rigLengthInput.value = rigProfile.length;
    rigClearanceInput.value = rigProfile.clearance;
    rigWheelbaseInput.value = rigProfile.wheelbase;
    rigCarrierSelect.value = rigProfile.carrier;
  }
  updateRigUI();
}

// Wizard Setup
const stepProgress = document.querySelectorAll(".progress-step");
const stepContents = document.querySelectorAll(".step-content");
const btnPrev = document.getElementById("wizard-prev");
const btnNext = document.getElementById("wizard-next-btn");

function updateWizardUI() {
  stepContents.forEach(step => step.classList.add("hidden"));
  document.getElementById(`step-${currentWizardStep}`).classList.remove("hidden");
  
  stepProgress.forEach(step => {
    const stepNum = parseInt(step.getAttribute("data-step"));
    step.classList.remove("active", "completed");
    if (stepNum === currentWizardStep) {
      step.classList.add("active");
    } else if (stepNum < currentWizardStep) {
      step.classList.add("completed");
    }
  });

  btnPrev.disabled = currentWizardStep === 1;
  btnNext.textContent = currentWizardStep === 4 ? "Restart Wizard" : "Next Step";
}

btnNext.addEventListener("click", () => {
  if (currentWizardStep === 4) {
    currentWizardStep = 1;
    // Clear all wizard checkboxes
    document.querySelectorAll(".wizard-check").forEach(c => c.checked = false);
  } else {
    currentWizardStep++;
  }
  updateWizardUI();
});

btnPrev.addEventListener("click", () => {
  if (currentWizardStep > 1) {
    currentWizardStep--;
    updateWizardUI();
  }
});

// Render Forest Roads List
function renderRoadsList() {
  const list = document.getElementById("roads-list");
  list.innerHTML = "";
  
  FOREST_ROADS.forEach(road => {
    // Check compatibility based on rig length and clearance
    let statusClass = "status-safe";
    let statusText = "COMPATIBLE";
    
    if (rigProfile.length > road.maxLength || rigProfile.clearance < road.minClearance) {
      statusClass = "status-danger";
      statusText = "DANGEROUS";
    } else if (rigProfile.length > road.maxLength - 10) {
      statusClass = "status-warning";
      statusText = "CAUTION REQUIRED";
    }

    const carrierVal = road.cellSignal[rigProfile.carrier];
    const carrierLabel = rigProfile.carrier.toUpperCase();

    let distanceHtml = "";
    if (userLocation && road.lat && road.lng) {
      const distance = getDistance(userLocation.lat, userLocation.lng, road.lat, road.lng);
      distanceHtml = `
        <div class="card-stat" style="border-bottom-color: rgba(56, 189, 248, 0.15); padding-bottom: 0.4rem;">
          <span class="card-stat-label" style="color: var(--accent); font-weight: 600;">Distance from GPS:</span>
          <span class="card-stat-val" style="color: var(--accent); font-weight: 700;">${distance.toFixed(1)} miles</span>
        </div>`;
    }

    const card = document.createElement("div");
    card.className = "road-card glass";
    card.innerHTML = `
      <div>
        <div class="card-header">
          <div class="card-title-group">
            <span class="road-number">${road.number}</span>
            <h3>${road.name}</h3>
          </div>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="card-body">
          ${distanceHtml}
          <div class="card-stat">
            <span class="card-stat-label">Max Safe Length:</span>
            <span class="card-stat-val">${road.maxLength} ft</span>
          </div>
          <div class="card-stat">
            <span class="card-stat-label">Min Ground Clearance:</span>
            <span class="card-stat-val">${road.minClearance} in</span>
          </div>
          <div class="card-stat">
            <span class="card-stat-label">Grade Severity:</span>
            <span class="card-stat-val">${road.difficulty}</span>
          </div>
          <div class="card-stat">
            <span class="card-stat-label">${carrierLabel} Office Signal:</span>
            <span class="card-stat-val">${"★".repeat(carrierVal)}${"☆".repeat(5 - carrierVal)}</span>
          </div>
          <p class="card-description"><strong>Road Grade:</strong> ${road.roadGrade}</p>
          <p class="card-description"><strong>Turnaround:</strong> ${road.turnaround}</p>
        </div>
      </div>
      <div class="btn-group" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <a href="${road.satelliteLink}" target="_blank" class="btn primary-btn mini-btn" style="flex: 1; text-align: center;">Ground Truth Check ↗</a>
        <a href="https://www.gaiagps.com/map/?loc=16.0/${road.lng}/${road.lat}" class="btn secondary-btn mini-btn" style="flex: 1; text-align: center; background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25);" target="_blank">Gaia GPS ↗</a>
        <button class="btn secondary-btn mini-btn" onclick="exportGPX('road', '${road.id}')" style="flex: 1; text-align: center;">Export GPX</button>
      </div>
    `;
    list.appendChild(card);
  });
}

// Render Dump Stations
function renderDumpList() {
  const list = document.getElementById("dumps-list");
  list.innerHTML = "";
  
  DUMP_STATIONS.forEach(dump => {
    const cleanPhone = dump.phone.replace(/\D/g, "");
    const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(dump.name + " " + dump.address)}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dump.name + " " + dump.address)}`;

    let distanceHtml = "";
    if (userLocation && dump.lat && dump.lng) {
      const distance = getDistance(userLocation.lat, userLocation.lng, dump.lat, dump.lng);
      distanceHtml = `
        <div class="card-stat" style="border-bottom-color: rgba(56, 189, 248, 0.15); padding-bottom: 0.4rem;">
          <span class="card-stat-label" style="color: var(--accent); font-weight: 600;">Distance from GPS:</span>
          <span class="card-stat-val" style="color: var(--accent); font-weight: 700;">${distance.toFixed(1)} miles</span>
        </div>`;
    }

    const card = document.createElement("div");
    card.className = "dump-card glass";
    
    let restrictionBadge = "";
    if (dump.public === false) {
      card.style.borderColor = "rgba(239, 68, 68, 0.35)";
      restrictionBadge = `<span class="status-badge status-danger" style="margin-top: 0.4rem; display: inline-block;">MILITARY ONLY</span>`;
    } else {
      restrictionBadge = `<span class="status-badge status-safe" style="margin-top: 0.4rem; display: inline-block;">OPEN TO PUBLIC</span>`;
    }

    card.innerHTML = `
      <div>
        <div class="card-header" style="flex-direction: column; align-items: flex-start; gap: 0.25rem;">
          <div class="card-title-group" style="width: 100%;">
            <span class="road-number">${dump.location}</span>
            <h3 style="margin-top: 0.2rem;">${dump.name}</h3>
          </div>
          ${restrictionBadge}
        </div>
        <div class="card-body">
          ${distanceHtml}
          ${dump.restriction ? `
          <div class="card-stat" style="border-bottom-color: rgba(239, 68, 68, 0.15); padding-bottom: 0.4rem;">
            <span class="card-stat-label" style="color: var(--danger)">Restriction:</span>
            <span class="card-stat-val" style="color: var(--danger); font-weight: 700;">${dump.restriction}</span>
          </div>` : ""}
          <div class="card-stat">
            <span class="card-stat-label">Address:</span>
            <span class="card-stat-val text-right">${dump.address}</span>
          </div>
          <div class="card-stat">
            <span class="card-stat-label">Phone:</span>
            <span class="card-stat-val"><a href="tel:${cleanPhone}" class="phone-link">📞 ${dump.phone}</a></span>
          </div>
          <div class="card-stat">
            <span class="card-stat-label">Transit Distance:</span>
            <span class="card-stat-val">${dump.distance}</span>
          </div>
          <div class="card-stat">
            <span class="card-stat-label">Sanidump Fee:</span>
            <span class="card-stat-val">${dump.fee}</span>
          </div>
          <div class="card-stat">
            <span class="card-stat-label">Potable Water:</span>
            <span class="card-stat-val">${dump.water}</span>
          </div>
          <div class="card-stat">
            <span class="card-stat-label">Rig Access:</span>
            <span class="card-stat-val">${dump.access}</span>
          </div>
          <p class="card-description"><strong>Seasonality:</strong> ${dump.status}</p>
        </div>
      </div>
      <div class="btn-group" style="margin-top: 1rem; width: 100%; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <a href="${appleMapsUrl}" class="btn secondary-btn mini-btn maps-btn" style="flex: 1; text-align: center;" target="_blank">🍎 Apple Maps</a>
        <a href="${googleMapsUrl}" class="btn secondary-btn mini-btn maps-btn" style="flex: 1; text-align: center;" target="_blank">🗺️ Google Maps</a>
        <a href="https://www.gaiagps.com/map/?loc=16.0/${dump.lng}/${dump.lat}" class="btn secondary-btn mini-btn maps-btn" style="flex: 1; text-align: center; background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25);" target="_blank">Gaia GPS ↗</a>
        <button class="btn secondary-btn mini-btn maps-btn" onclick="exportGPX('dump', '${dump.name}')" style="flex: 1; text-align: center;">Export GPX</button>
      </div>
    `;
    list.appendChild(card);
  });
}

// Safety Calculators Setup
const calcRoadWidth = document.getElementById("calc-road-width");
const calcTurnAngle = document.getElementById("calc-turn-angle");
const turnOutput = document.getElementById("turn-output");

const calcWashoutDepth = document.getElementById("calc-washout-depth");
const calcWashoutWidth = document.getElementById("calc-washout-width");
const clearanceOutput = document.getElementById("clearance-output");

function calculateCalculators() {
  // 1. Turning radius check
  const w = parseFloat(calcRoadWidth.value) || 12;
  const a = parseFloat(calcTurnAngle.value) || 90;
  
  // Approximate offtracking: OT = (Wheelbase^2) / (2 * turning radius)
  // Let's assume a reasonable turning radius of the tow vehicle itself.
  // For standard trucks, radius is approx 25ft to negotiate a 90 deg turn.
  // If the road width is very narrow, the radius is constrained.
  const estRadius = w * 1.5;
  const offTracking = (Math.pow(rigProfile.wheelbase, 2)) / (2 * estRadius) * (a / 90);
  const totalRequiredWidth = 8.5 + offTracking; // 8.5ft is standard rig width
  
  let turnStatus = "COMPATIBLE";
  let turnColor = "var(--primary)";
  let turnDesc = `Your configuration requires approximately <strong>${totalRequiredWidth.toFixed(1)} ft</strong> of roadway width to complete this ${a}deg turn. Since the road is ${w}ft wide, you have adequate clearance.`;

  if (totalRequiredWidth > w) {
    turnStatus = "CRITICAL (Jackknife Risk)";
    turnColor = "var(--danger)";
    turnDesc = `High risk of trailer tires leaving the road track or your truck jackknifing. Your rig needs at least <strong>${totalRequiredWidth.toFixed(1)} ft</strong> of width for a ${a}deg turn. Scout this section on foot first.`;
  } else if (totalRequiredWidth > w - 2) {
    turnStatus = "CAUTION (Tight Squeeze)";
    turnColor = "var(--warning)";
    turnDesc = `Narrow fit. You require <strong>${totalRequiredWidth.toFixed(1)} ft</strong> of the ${w}ft available road. Maintain slow speeds and check your mirror for trailer off-tracking.`;
  }

  turnOutput.innerHTML = `
    <div class="calc-result-title" style="color: ${turnColor}">
      <span>●</span> ${turnStatus}
    </div>
    <p class="calc-result-desc">${turnDesc}</p>
  `;

  // 2. High centering check
  const d = parseFloat(calcWashoutDepth.value) || 0;
  const s = parseFloat(calcWashoutWidth.value) || 10;

  // Simplistic high centering model:
  // If the washout forms a V with width S and depth D.
  // Maximum ground clearance threat occurs when the trailer tires are on the crest and the bumper is in the dip,
  // or when the vehicle tires are on both crests and the trailer center hangs over the apex.
  // Clearance requirement at center: H = (D * (wheelbase / 2)) / (s / 2) = (D * wheelbase) / s
  const requiredClearance = (d * rigProfile.wheelbase) / s;

  let clearStatus = "COMPATIBLE";
  let clearColor = "var(--primary)";
  let clearDesc = `Calculated high-center clearance demand is <strong>${requiredClearance.toFixed(1)} inches</strong>. Your rig has ${rigProfile.clearance} inches of clearance, leaving a safe buffer.`;

  if (requiredClearance >= rigProfile.clearance) {
    clearStatus = "CRITICAL HAZARD";
    clearColor = "var(--danger)";
    clearDesc = `Your plumbing or frame is highly likely to scrape or hang up on this washout. The transition requires at least <strong>${requiredClearance.toFixed(1)} inches</strong> of clearance, exceeding your rig's ${rigProfile.clearance} inches.`;
  } else if (requiredClearance >= rigProfile.clearance - 3) {
    clearStatus = "CAUTION (Low Clearance)";
    clearColor = "var(--warning)";
    clearDesc = `Tight clearance transition. The washout requires <strong>${requiredClearance.toFixed(1)} inches</strong> of your ${rigProfile.clearance} inch limit. Traverse at an angle to prevent bottoming out.`;
  }

  clearanceOutput.innerHTML = `
    <div class="calc-result-title" style="color: ${clearColor}">
      <span>●</span> ${clearStatus}
    </div>
    <p class="calc-result-desc">${clearDesc}</p>
  `;
}

[calcRoadWidth, calcTurnAngle, calcWashoutDepth, calcWashoutWidth].forEach(el => {
  el.addEventListener("input", calculateCalculators);
});

// Spot Logger Logic
const logRoadSelect = document.getElementById("log-road");
const logDumpSelect = document.getElementById("log-dump");
const logForm = document.getElementById("spot-logger-form");
const logList = document.getElementById("logged-spots-list");

function initLoggerSelects() {
  logRoadSelect.innerHTML = FOREST_ROADS.map(r => `<option value="${r.id}">${r.number} - ${r.name}</option>`).join("");
  logDumpSelect.innerHTML = DUMP_STATIONS.map(d => `<option value="${d.name}">${d.name} (${d.fee})</option>`).join("");
}

logForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const roadId = logRoadSelect.value;
  const road = FOREST_ROADS.find(r => r.id === roadId);
  
  const newSpot = {
    roadName: road.name,
    roadNumber: road.number,
    coords: document.getElementById("log-coords").value,
    signal: parseInt(document.getElementById("log-signal").value),
    dumpStation: logDumpSelect.value,
    notes: document.getElementById("log-notes").value,
    timestamp: new Date().toLocaleDateString(),
    createdAt: Date.now()
  };

  if (db) {
    db.collection("logged_spots").add(newSpot).then(() => {
      logForm.reset();
      initLoggerSelects();
    }).catch(err => console.error("Error adding spot to Firestore:", err));
  } else {
    newSpot.id = Date.now().toString();
    loggedSpots.unshift(newSpot);
    localStorage.setItem("rv_boondock_spots", JSON.stringify(loggedSpots));
    renderLoggedSpots();
    logForm.reset();
    initLoggerSelects();
  }
});

function renderLoggedSpots() {
  logList.innerHTML = "";
  if (loggedSpots.length === 0) {
    logList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; margin-top: 2rem;">No spots logged yet. Go scout some trails!</p>`;
    return;
  }

  loggedSpots.forEach(spot => {
    const item = document.createElement("div");
    item.className = "logged-item";
    item.innerHTML = `
      <div class="logged-item-header">
        <span class="logged-road-name">${spot.roadNumber} - ${spot.roadName}</span>
        <span class="logged-time">${spot.timestamp}</span>
      </div>
      <div class="logged-details">
        <div><strong>Coordinates:</strong> ${spot.coords}</div>
        <div><strong>Cell Signal:</strong> ${"★".repeat(spot.signal)}${"☆".repeat(5 - spot.signal)}</div>
        <div><strong>Closest Dump Station:</strong> ${spot.dumpStation}</div>
        <p class="logged-notes">"${spot.notes}"</p>
      </div>
      <div class="logged-item-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn primary-btn mini-btn" onclick="exportSpot('${spot.id}')">Export MD</button>
        <button class="btn secondary-btn mini-btn" onclick="exportGPX('spot', '${spot.id}')">Export GPX</button>
        ${spot.coords ? `<a href="https://www.gaiagps.com/map/?loc=16.0/${spot.coords.split(',')[1].trim()}/${spot.coords.split(',')[0].trim()}" class="btn secondary-btn mini-btn" style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25);" target="_blank">Gaia GPS ↗</a>` : ''}
        <button class="btn secondary-btn mini-btn" onclick="deleteSpot('${spot.id}')" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.2); margin-left: auto;">Delete</button>
      </div>
    `;
    logList.appendChild(item);
  });
}

window.deleteSpot = function(id) {
  if (db) {
    db.collection("logged_spots").doc(id).delete()
      .catch(err => console.error("Error deleting spot from Firestore:", err));
  } else {
    loggedSpots = loggedSpots.filter(s => s.id !== id);
    localStorage.setItem("rv_boondock_spots", JSON.stringify(loggedSpots));
    renderLoggedSpots();
  }
};

window.exportSpot = function(id) {
  const spot = loggedSpots.find(s => s.id === id);
  if (!spot) return;

  const md = `# Scouted Site: ${spot.roadNumber} - ${spot.roadName}
* **Logged Date:** ${spot.timestamp}
* **Coordinates:** ${spot.coords}
* **Cell Signal:** ${spot.signal}/5 Stars (carrier adjusted)
* **Closest Checked Dump Station:** ${spot.dumpStation}

## Field Assessment & Obstacle Notes
> ${spot.notes}

---
*Generated by RVBoondock Bellemont & Wing Mountain Scout App*`;

  const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Scouted-Site-${spot.roadNumber.replace(" ", "-")}-${spot.id}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

window.exportGPX = function(type, identifier) {
  let lat, lng, name, desc;
  
  if (type === 'road') {
    const road = FOREST_ROADS.find(r => r.id === identifier);
    if (!road) return;
    lat = road.lat;
    lng = road.lng;
    name = `${road.number} - ${road.name}`;
    desc = `Max Safe Length: ${road.maxLength} ft\nMin Clearance: ${road.minClearance} in\nDifficulty: ${road.difficulty}\nRoad Grade: ${road.roadGrade}\nTurnaround: ${road.turnaround}`;
  } else if (type === 'dump') {
    const dump = DUMP_STATIONS.find(d => d.name === identifier);
    if (!dump) return;
    lat = dump.lat;
    lng = dump.lng;
    name = dump.name;
    desc = `Location: ${dump.location}\nAddress: ${dump.address}\nFee: ${dump.fee}\nWater: ${dump.water}\nAccess: ${dump.access}`;
  } else if (type === 'spot') {
    const spot = loggedSpots.find(s => s.id === identifier);
    if (!spot) return;
    const parts = spot.coords.split(",");
    if (parts.length === 2) {
      lat = parseFloat(parts[0].trim());
      lng = parseFloat(parts[1].trim());
    } else {
      return;
    }
    name = `Scouted Spot - ${spot.roadNumber}`;
    desc = `Logged Date: ${spot.timestamp}\nSignal: ${spot.signal}/5 Stars\nClosest Dump: ${spot.dumpStation}\nNotes: ${spot.notes}`;
  }

  if (typeof lat === 'undefined' || typeof lng === 'undefined') return;

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RVBoondock" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <wpt lat="${lat}" lon="${lng}">
    <name>${escapeXml(name)}</name>
    <desc>${escapeXml(desc)}</desc>
    <sym>Campground</sym>
  </wpt>
</gpx>`;

  const blob = new Blob([gpx], { type: "application/gpx+xml;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = (err) => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

function startFirebaseSync() {
  if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
    db = firebase.firestore();
  }
  
  if (db) {
    // 1. Subscribe to shared real-time location sync
    db.collection("locations").doc("david").onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        if (data.lat && data.lng) {
          const t = data.timestamp ? data.timestamp.toDate() : new Date();
          userLocation = {
            lat: data.lat,
            lng: data.lng,
            timestamp: t
          };
          updateLocationPill();
          renderRoadsList();
          renderDumpList();
          if (typeof updateTransitRoute === 'function') {
            updateTransitRoute();
          }
        }
      }
    });

    // 2. Subscribe to synced spots database
    db.collection("logged_spots").orderBy("createdAt", "desc").onSnapshot(snapshot => {
      loggedSpots = [];
      snapshot.forEach(doc => {
        loggedSpots.push({
          id: doc.id,
          ...doc.data()
        });
      });
      renderLoggedSpots();
      if (typeof populateTransitDestinations === 'function') {
        populateTransitDestinations();
      }
    }, err => {
      console.error("Firestore snapshot error (check if Firestore is provisioned in the console):", err);
    });
  }
}

function populateTransitDestinations() {
  const selectedVal = transitDestSelect.value;
  transitDestSelect.innerHTML = "";
  
  // Forest Roads Group
  const roadGroup = document.createElement("optgroup");
  roadGroup.label = "Forest Roads";
  FOREST_ROADS.forEach(road => {
    const opt = document.createElement("option");
    opt.value = `road_${road.id}`;
    opt.textContent = `${road.number} - ${road.name}`;
    roadGroup.appendChild(opt);
  });
  transitDestSelect.appendChild(roadGroup);
  
  // Dump Stations Group
  const dumpGroup = document.createElement("optgroup");
  dumpGroup.label = "Dump Stations";
  DUMP_STATIONS.forEach(dump => {
    const opt = document.createElement("option");
    opt.value = `dump_${dump.name}`;
    opt.textContent = dump.name;
    dumpGroup.appendChild(opt);
  });
  transitDestSelect.appendChild(dumpGroup);
  
  // Scouted Spots Group
  if (loggedSpots.length > 0) {
    const spotGroup = document.createElement("optgroup");
    spotGroup.label = "Scouted Spots";
    loggedSpots.forEach(spot => {
      const opt = document.createElement("option");
      opt.value = `spot_${spot.id}`;
      opt.textContent = `${spot.roadNumber} - Scouted Spot`;
      spotGroup.appendChild(opt);
    });
    transitDestSelect.appendChild(spotGroup);
  }
  
  // Restore selection if valid
  if (selectedVal) {
    transitDestSelect.value = selectedVal;
  }
  
  // If nothing is selected, select the first option
  if (!transitDestSelect.value && transitDestSelect.options.length > 0) {
    transitDestSelect.selectedIndex = 0;
  }
  
  updateTransitRoute();
}

function updateTransitRoute() {
  // 1. Get Start Coordinates
  let startLat = 35.2536; // Default to Bellemont coordinates
  let startLng = -111.7942;
  
  if (userLocation) {
    startLat = userLocation.lat;
    startLng = userLocation.lng;
    const timeStr = userLocation.timestamp ? new Date(userLocation.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now';
    transitStartInput.value = `${startLat.toFixed(5)}, ${startLng.toFixed(5)} (${timeStr})`;
  } else {
    transitStartInput.value = "Offline / No GPS (Using Bellemont Default)";
  }
  
  // 2. Resolve Selected Destination
  const destVal = transitDestSelect.value;
  if (!destVal) return;
  
  let destLat, destLng, destName, destType, destObj;
  
  if (destVal.startsWith("road_")) {
    const id = destVal.replace("road_", "");
    destObj = FOREST_ROADS.find(r => r.id === id);
    if (destObj) {
      destLat = destObj.lat;
      destLng = destObj.lng;
      destName = destObj.name;
      destType = "road";
    }
  } else if (destVal.startsWith("dump_")) {
    const name = destVal.replace("dump_", "");
    destObj = DUMP_STATIONS.find(d => d.name === name);
    if (destObj) {
      destLat = destObj.lat;
      destLng = destObj.lng;
      destName = destObj.name;
      destType = "dump";
    }
  } else if (destVal.startsWith("spot_")) {
    const id = destVal.replace("spot_", "");
    destObj = loggedSpots.find(s => s.id === id);
    if (destObj && destObj.coords) {
      const parts = destObj.coords.split(",");
      if (parts.length === 2) {
        destLat = parseFloat(parts[0].trim());
        destLng = parseFloat(parts[1].trim());
        destName = `Scouted Spot (${destObj.roadNumber})`;
        destType = "spot";
      }
    }
  }
  
  if (typeof destLat === 'undefined' || typeof destLng === 'undefined') {
    return;
  }
  
  // 3. Update Nav Links
  btnNavGoogle.href = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${destLat},${destLng}&travelmode=driving`;
  btnNavGaia.href = `https://www.gaiagps.com/map/?loc=14.0/${destLng}/${destLat}`;
  btnNavApple.href = `https://maps.apple.com/?saddr=${startLat},${startLng}&daddr=${destLat},${destLng}&dirflg=d`;
  
  // 4. Update Rig Safety Verification Panel
  if (destType === "road") {
    let statusClass = "status-safe";
    let statusText = "COMPATIBLE";
    let message = "";
    
    if (rigProfile.length > destObj.maxLength || rigProfile.clearance < destObj.minClearance) {
      statusClass = "status-danger";
      statusText = "DANGEROUS";
      message = `<p style="color: var(--danger); font-weight: 700; margin-top: 0.5rem;">⚠️ WARNING: This road is NOT safe for your rig!</p>
                 <ul style="margin-left: 1.25rem; margin-top: 0.25rem; font-size: 0.85rem; color: var(--text-main); text-align: left;">
                   ${rigProfile.length > destObj.maxLength ? `<li>Your rig length (${rigProfile.length}ft) exceeds the road limit (${destObj.maxLength}ft).</li>` : ''}
                   ${rigProfile.clearance < destObj.minClearance ? `<li>Your ground clearance (${rigProfile.clearance}in) is less than the road requirement (${destObj.minClearance}in).</li>` : ''}
                 </ul>`;
    } else if (rigProfile.length > destObj.maxLength - 10) {
      statusClass = "status-warning";
      statusText = "CAUTION";
      message = `<p style="color: var(--warning); font-weight: 700; margin-top: 0.5rem;">⚠️ CAUTION: Tight fit!</p>
                 <p style="font-size: 0.85rem; margin-top: 0.25rem;">Your rig length (${rigProfile.length}ft) is very close to the safe limit (${destObj.maxLength}ft). Scout the turnaround loops before entering.</p>`;
    } else {
      message = `<p style="color: var(--primary); font-weight: 700; margin-top: 0.5rem;">✅ Safe & Vetted!</p>
                 <p style="font-size: 0.85rem; margin-top: 0.25rem;">Your rig dimensions are within safe parameters for this forest road corridor.</p>`;
    }
    
    const carrierVal = destObj.cellSignal[rigProfile.carrier];
    const carrierLabel = rigProfile.carrier.toUpperCase();
    
    transitSafetyContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
        <span style="font-family: var(--font-heading); font-weight: 600; font-size: 1.1rem;">${destObj.number} - ${destObj.name}</span>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      <div style="margin-top: 0.75rem; font-size: 0.9rem; text-align: left;">
        <div><strong>Road Grade:</strong> ${destObj.roadGrade}</div>
        <div style="margin-top: 0.25rem;"><strong>Turnaround:</strong> ${destObj.turnaround}</div>
        <div style="margin-top: 0.25rem;"><strong>Cell Signal (${carrierLabel}):</strong> ${"★".repeat(carrierVal)}${"☆".repeat(5 - carrierVal)}</div>
      </div>
      ${message}
    `;
  } else if (destType === "dump") {
    transitSafetyContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
        <span style="font-family: var(--font-heading); font-weight: 600; font-size: 1.1rem;">${destObj.name}</span>
        <span class="status-badge ${destObj.public ? 'status-safe' : 'status-danger'}">${destObj.public ? 'PUBLIC' : 'MILITARY ONLY'}</span>
      </div>
      <div style="margin-top: 0.75rem; font-size: 0.9rem; text-align: left;">
        <div><strong>Access Quality:</strong> ${destObj.access}</div>
        <div style="margin-top: 0.25rem;"><strong>Potable Water:</strong> ${destObj.water}</div>
        <div style="margin-top: 0.25rem;"><strong>Fee:</strong> ${destObj.fee}</div>
        <div style="margin-top: 0.25rem;"><strong>Phone:</strong> <a href="tel:${destObj.phone.replace(/\D/g, "")}" class="phone-link">${destObj.phone}</a></div>
      </div>
    `;
  } else if (destType === "spot") {
    transitSafetyContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
        <span style="font-family: var(--font-heading); font-weight: 600; font-size: 1.1rem;">Scouted Spot (${destObj.roadNumber})</span>
        <span class="status-badge status-safe">SCOUTED SPOT</span>
      </div>
      <div style="margin-top: 0.75rem; font-size: 0.9rem; text-align: left;">
        <div><strong>Logged Signal:</strong> ${"★".repeat(destObj.signal)}${"☆".repeat(5 - destObj.signal)}</div>
        <div style="margin-top: 0.25rem;"><strong>Notes:</strong> "${destObj.notes}"</div>
        <div style="margin-top: 0.25rem;"><strong>Closest Checked Dump:</strong> ${destObj.dumpStation}</div>
      </div>
    `;
  }
  
  // 5. Update Services List Sorted by Distance from Destination
  const sortedDumps = DUMP_STATIONS.map(dump => {
    const dist = getDistance(destLat, destLng, dump.lat, dump.lng);
    return { ...dump, transitDist: dist };
  }).sort((a, b) => a.transitDist - b.transitDist);
  
  transitServicesList.innerHTML = "";
  
  // Display top 3 closest dump stations
  sortedDumps.slice(0, 3).forEach(dump => {
    const div = document.createElement("div");
    div.style.background = "rgba(255,255,255,0.02)";
    div.style.border = "1px solid var(--border)";
    div.style.padding = "0.75rem";
    div.style.borderRadius = "8px";
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    
    div.innerHTML = `
      <div style="text-align: left;">
        <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">${dump.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
          ${dump.water} | Fee: ${dump.fee}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="color: var(--accent); font-weight: 700; font-size: 0.95rem;">${dump.transitDist.toFixed(1)} mi</div>
        <a href="https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${dump.lat},${dump.lng}&travelmode=driving" target="_blank" style="font-size: 0.75rem; color: var(--primary); text-decoration: none; margin-top: 0.2rem; display: block;">Route ↗</a>
      </div>
    `;
    transitServicesList.appendChild(div);
  });
}

// ==========================================================================
// Interactive Map Controller (Leaflet.js + Google Maps)
// ==========================================================================

let mapInstance = null; // Leaflet map object
let googleMap = null; // Google Maps object
let isGoogleMapsApiLoaded = false;
let leafletMarkers = [];
let googleMarkersArray = [];
let currentTileLayer = null;

// Campsite Scouting & Staged Queue State
let stagedCampsites = [];
let sharedCampsites = []; // Loaded from Firestore/shared DB

// DOM Elements for Map Tab
let googleApiKeyInput = null;
let btnSaveApiKey = null;
let btnClearApiKey = null;
let mapFilters = {
  roads: null,
  dumps: null,
  logs: null
};

// Modal Elements
let modalCampCreator = null;
let campCreatorForm = null;
let campCoordsInput = null;
let btnCloseCampModal = null;
let btnCancelCampModal = null;
let starButtons = [];
let campRatingInput = null;
let amenityPills = [];
let selectedAmenities = new Set();
let currentModalCoords = null; // Store temp coords clicked

// Scouting Banner Elements
let scoutingStatusBar = null;
let scoutingStatusText = null;
let btnClaimCampWizard = null;

// Initialize Map Tab functionality
function initMapTab() {
  googleApiKeyInput = document.getElementById("google-api-key");
  btnSaveApiKey = document.getElementById("btn-save-api-key");
  btnClearApiKey = document.getElementById("btn-clear-api-key");
  importCoordsInput = document.getElementById("import-coords-input");
  btnImportCoords = document.getElementById("btn-import-coords");
  mapFilters.roads = document.getElementById("map-filter-roads");
  mapFilters.dumps = document.getElementById("map-filter-dumps");
  mapFilters.logs = document.getElementById("map-filter-logs");

  // Modal DOM
  modalCampCreator = document.getElementById("modal-camp-creator");
  campCreatorForm = document.getElementById("camp-creator-form");
  campCoordsInput = document.getElementById("camp-coords");
  btnCloseCampModal = document.getElementById("btn-close-camp-modal");
  btnCancelCampModal = document.getElementById("btn-cancel-camp-modal");
  campRatingInput = document.getElementById("camp-rating");
  starButtons = document.querySelectorAll("#camp-star-selector .star-btn");
  amenityPills = document.querySelectorAll("#camp-amenities-tags .amenity-tag-pill");

  // Banner DOM
  scoutingStatusBar = document.getElementById("scouting-status-bar");
  scoutingStatusText = document.getElementById("scouting-status-text");
  btnClaimCampWizard = document.getElementById("btn-claim-camp-wizard");

  // Sandwich Menu Drawer Listeners
  const btnHamburger = document.getElementById("btn-hamburger");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  
  if (btnHamburger) {
    btnHamburger.addEventListener("click", () => {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar && sidebarBackdrop) {
        const isOpen = sidebar.classList.contains("open");
        if (isOpen) {
          sidebar.classList.remove("open");
          sidebarBackdrop.classList.add("hidden");
        } else {
          sidebar.classList.add("open");
          sidebarBackdrop.classList.remove("hidden");
        }
        // Force mapping canvas redraw to adjust boundaries during drawer animation
        setTimeout(() => {
          if (mapInstance) mapInstance.invalidateSize();
          if (googleMap) google.maps.event.trigger(googleMap, 'resize');
        }, 360);
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", () => {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar) sidebar.classList.remove("open");
      sidebarBackdrop.classList.add("hidden");
    });
  }

  // Auto-close sliding drawer when navigation menu items are selected
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar) sidebar.classList.remove("open");
      if (sidebarBackdrop) sidebarBackdrop.classList.add("hidden");
    });
  });

  // Clipboard Importer Action
  if (btnImportCoords) {
    btnImportCoords.addEventListener("click", handleClipboardImport);
  }

  // Load saved Google API Key if exists
  const savedKey = localStorage.getItem("rv_boondock_google_key");
  if (savedKey && googleApiKeyInput) {
    googleApiKeyInput.value = savedKey;
  }

  // Load local staged campsites
  const savedStaged = localStorage.getItem("rv_boondock_staged_camps");
  if (savedStaged) {
    stagedCampsites = JSON.parse(savedStaged);
  }
  updateScoutingBanner();

  // Radio Toggles for map layers
  document.querySelectorAll('input[name="map-layer"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      switchMapLayer(e.target.value);
    });
  });

  // Checkbox filters
  Object.keys(mapFilters).forEach(key => {
    if (mapFilters[key]) {
      mapFilters[key].addEventListener("change", () => {
        refreshMapMarkers();
      });
    }
  });

  // Save/Clear Google API Key
  if (btnSaveApiKey) {
    btnSaveApiKey.addEventListener("click", () => {
      const key = googleApiKeyInput ? googleApiKeyInput.value.trim() : "";
      if (!key) {
        alert("Please enter a valid Google Maps API Key.");
        return;
      }
      localStorage.setItem("rv_boondock_google_key", key);
      alert("Google API Key saved! Reloading map...");
      const selectedLayerEl = document.querySelector('input[name="map-layer"]:checked');
      if (selectedLayerEl && selectedLayerEl.value === "google-sat") {
        loadGoogleMapsApi(key).then(() => {
          switchMapLayer("google-sat");
        });
      }
    });
  }

  if (btnClearApiKey) {
    btnClearApiKey.addEventListener("click", () => {
      localStorage.removeItem("rv_boondock_google_key");
      if (googleApiKeyInput) googleApiKeyInput.value = "";
      alert("Google API Key removed.");
      const selectedLayerEl = document.querySelector('input[name="map-layer"]:checked');
      if (selectedLayerEl && selectedLayerEl.value === "google-sat") {
        const topoRadio = document.querySelector('input[name="map-layer"][value="topo"]');
        if (topoRadio) topoRadio.checked = true;
        switchMapLayer("topo");
      }
    });
  }

  // Star Rating Interaction
  starButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const rating = parseInt(btn.getAttribute("data-value"));
      setModalStarRating(rating);
    });
  });

  // Amenity Pills Interaction
  amenityPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const val = pill.getAttribute("data-val");
      if (selectedAmenities.has(val)) {
        selectedAmenities.delete(val);
        pill.classList.remove("active");
      } else {
        selectedAmenities.add(val);
        pill.classList.add("active");
      }
    });
  });

  // Modal Close/Cancel
  if (btnCloseCampModal) btnCloseCampModal.addEventListener("click", hideCampModal);
  if (btnCancelCampModal) btnCancelCampModal.addEventListener("click", hideCampModal);

  // Form Submit (Save Staged Campsite)
  if (campCreatorForm) {
    campCreatorForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveStagedCampsite();
    });
  }

  // Claim and Set Up Camp Banner Trigger
  if (btnClaimCampWizard) {
    btnClaimCampWizard.addEventListener("click", () => {
      // Prompt user to select which spot they are claiming
      claimAndPublishStagedCampsites();
    });
  }
}

// Update scouting progress banner
function updateScoutingBanner() {
  if (!scoutingStatusBar || !scoutingStatusText) return;
  
  if (stagedCampsites.length > 0) {
    scoutingStatusBar.style.display = "flex";
    scoutingStatusText.textContent = `📝 You have ${stagedCampsites.length} staged campsite candidate(s). Set up camp at one to publish them!`;
  } else {
    scoutingStatusBar.style.display = "none";
  }
}

// Show creator modal
function showCampModal(lat, lng) {
  if (!modalCampCreator) return;
  currentModalCoords = { lat, lng };
  if (campCoordsInput) {
    campCoordsInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
  
  // Reset fields
  if (campCreatorForm) campCreatorForm.reset();
  setModalStarRating(3); // Default rating
  selectedAmenities.clear();
  amenityPills.forEach(p => p.classList.remove("active"));

  modalCampCreator.classList.remove("hidden");
}

function hideCampModal() {
  if (!modalCampCreator) return;
  modalCampCreator.classList.add("hidden");
  currentModalCoords = null;
}

// Set rating stars UI state
function setModalStarRating(rating) {
  if (campRatingInput) campRatingInput.value = rating;
  starButtons.forEach(btn => {
    const val = parseInt(btn.getAttribute("data-value"));
    if (val <= rating) {
      btn.style.color = "var(--warning)";
    } else {
      btn.style.color = "var(--text-muted)";
    }
  });
}

// Save campsite to local queue
function saveStagedCampsite() {
  if (!currentModalCoords) return;
  
  const statusEl = document.querySelector('input[name="camp-status"]:checked');
  const status = statusEl ? statusEl.value : "available";
  const rating = parseInt(campRatingInput.value);
  const notes = document.getElementById("camp-notes").value;
  
  const newCamp = {
    id: "staged_" + Date.now(),
    lat: currentModalCoords.lat,
    lng: currentModalCoords.lng,
    status: status,
    rating: rating,
    amenities: Array.from(selectedAmenities),
    notes: notes,
    timestamp: Date.now()
  };

  // If marked occupied, prompt if they want to claim it immediately
  if (status === "occupied") {
    const confirmImmediately = confirm("You marked this campsite as Occupied. Would you like to set up camp here immediately?\n\nThis will publish this spot and all other staged candidates to the community map.");
    if (confirmImmediately) {
      // Push to staged list momentarily, then publish everything
      stagedCampsites.push(newCamp);
      localStorage.setItem("rv_boondock_staged_camps", JSON.stringify(stagedCampsites));
      hideCampModal();
      claimAndPublishStagedCampsites(newCamp.id);
      return;
    }
  }

  // Otherwise, just stage it locally
  stagedCampsites.push(newCamp);
  localStorage.setItem("rv_boondock_staged_camps", JSON.stringify(stagedCampsites));
  
  hideCampModal();
  updateScoutingBanner();
  refreshMapMarkers();
}

// Check-in and upload staging queue to public database
function claimAndPublishStagedCampsites(claimedId = null) {
  if (stagedCampsites.length === 0) {
    alert("No staged campsites in your scouting queue to claim.");
    return;
  }

  let chosenCamp = null;

  if (claimedId) {
    chosenCamp = stagedCampsites.find(c => c.id === claimedId);
  } else {
    // If only one campsite is staged, auto-select it. Otherwise prompt the user.
    if (stagedCampsites.length === 1) {
      chosenCamp = stagedCampsites[0];
    } else {
      const options = stagedCampsites.map((c, idx) => `${idx + 1}: [Rating: ${c.rating}★] (${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}) - Notes: "${c.notes.slice(0, 20)}..."`).join("\n");
      const selection = prompt(`Please select which campsite number you are setting up camp at:\n\n${options}\n\nEnter number (1-${stagedCampsites.length}):`);
      if (!selection) return;
      const idx = parseInt(selection) - 1;
      if (isNaN(idx) || idx < 0 || idx >= stagedCampsites.length) {
        alert("Invalid selection. Check-in canceled.");
        return;
      }
      chosenCamp = stagedCampsites[idx];
    }
  }

  if (!chosenCamp) return;

  // Final check-in updates
  // 1. Chosen spot becomes occupied
  chosenCamp.status = "occupied";
  
  // 2. All other staged spots become available
  stagedCampsites.forEach(c => {
    if (c.id !== chosenCamp.id) {
      c.status = "available";
    }
    // Remove temporary client-side prefix
    if (c.id.startsWith("staged_")) {
      c.id = c.id.replace("staged_", "camp_");
    }
  });

  // 3. Batch commit to Firestore
  if (db) {
    const batch = db.batch();
    stagedCampsites.forEach(c => {
      const ref = db.collection("shared_campsites").doc(c.id);
      batch.set(ref, {
        lat: c.lat,
        lng: c.lng,
        status: c.status,
        rating: c.rating,
        amenities: c.amenities,
        notes: c.notes,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    batch.commit().then(() => {
      alert("🎉 Setup Camp successful! All scouted spots have been published to the community map.");
      stagedCampsites = [];
      localStorage.removeItem("rv_boondock_staged_camps");
      updateScoutingBanner();
      refreshMapMarkers();
    }).catch(err => {
      console.error("Batch write failed, saving locally:", err);
      alert("Database offline. Campsites saved locally to community spots instead.");
      fallbackOfflinePublish();
    });
  } else {
    // Offline / Local-only mock database fallback
    fallbackOfflinePublish();
  }
}

// Fallback logic when Firebase connection is unavailable
function fallbackOfflinePublish() {
  // Add to local shared arrays
  stagedCampsites.forEach(c => {
    sharedCampsites.push(c);
  });
  localStorage.setItem("rv_boondock_shared_camps", JSON.stringify(sharedCampsites));
  
  alert("🎉 Scouted sites saved to your local offline shared storage.");
  stagedCampsites = [];
  localStorage.removeItem("rv_boondock_staged_camps");
  updateScoutingBanner();
  refreshMapMarkers();
}

// Map Tab Active Trigger (from sidebar)
function onMapTabActive() {
  setTimeout(() => {
    const selectedLayerEl = document.querySelector('input[name="map-layer"]:checked');
    const currentLayer = selectedLayerEl ? selectedLayerEl.value : "topo";
    
    if (currentLayer === "google-sat" && isGoogleMapsApiLoaded) {
      if (googleMap) {
        google.maps.event.trigger(googleMap, 'resize');
      } else {
        switchMapLayer("google-sat");
      }
    } else {
      if (!mapInstance) {
        const defaultCenter = [35.2536, -111.7942]; // Bellemont
        mapInstance = L.map("interactive-map-canvas").setView(defaultCenter, 12);
        setLeafletTileLayer("topo");
        
        // Leaflet click handler to log campsites
        mapInstance.on("click", (e) => {
          showCampModal(e.latlng.lat, e.latlng.lng);
        });
      }
      
      mapInstance.invalidateSize();
      refreshMapMarkers();
    }
  }, 100);
}

// Switch mapping environment/provider
function switchMapLayer(layerType) {
  const canvas = document.getElementById("interactive-map-canvas");
  if (!canvas) return;
  
  if (layerType === "google-sat") {
    const key = localStorage.getItem("rv_boondock_google_key");
    if (!key) {
      alert("No Google Maps API Key found. Please enter a key in the Google API Integration settings first.\n\nFalling back to Leaflet Satellite (Esri Imagery) instead.");
      const esriRadio = document.querySelector('input[name="map-layer"][value="esri-sat"]');
      if (esriRadio) esriRadio.checked = true;
      switchMapLayer("esri-sat");
      return;
    }

    destroyLeafletMap();
    canvas.innerHTML = "";
    
    loadGoogleMapsApi(key)
      .then(() => {
        initGoogleMap();
      })
      .catch(err => {
        alert(err.message + "\nFalling back to Leaflet Satellite.");
        const esriRadio = document.querySelector('input[name="map-layer"][value="esri-sat"]');
        if (esriRadio) esriRadio.checked = true;
        switchMapLayer("esri-sat");
      });
  } else {
    // Leaflet Layers
    if (googleMap) {
      destroyGoogleMap();
      canvas.innerHTML = "";
    }
    
    if (!mapInstance) {
      mapInstance = L.map("interactive-map-canvas").setView([35.2536, -111.7942], 12);
      mapInstance.on("click", (e) => {
        showCampModal(e.latlng.lat, e.latlng.lng);
      });
    }
    
    setLeafletTileLayer(layerType);
    refreshMapMarkers();
    mapInstance.invalidateSize();
  }
}

// Set or replace Leaflet Tile Layers
function setLeafletTileLayer(type) {
  if (!mapInstance) return;
  
  if (currentTileLayer) {
    mapInstance.removeLayer(currentTileLayer);
  }
  
  if (type === "topo") {
    currentTileLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  } else if (type === "esri-sat") {
    currentTileLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
  }
  
  if (currentTileLayer) {
    currentTileLayer.addTo(mapInstance);
  }
}

// Load Google Maps Script Asynchronously
function loadGoogleMapsApi(apiKey) {
  if (isGoogleMapsApiLoaded) {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      isGoogleMapsApiLoaded = true;
      resolve();
      return;
    }
    
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=onGoogleMapsApiCallback`;
    script.async = true;
    script.defer = true;
    
    window.onGoogleMapsApiCallback = () => {
      isGoogleMapsApiLoaded = true;
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error("Failed to load Google Maps SDK. Please check your network connection or API Key."));
    };
    
    document.head.appendChild(script);
  });
}

// Initialize Google Maps instance
function initGoogleMap() {
  const canvas = document.getElementById("interactive-map-canvas");
  if (!canvas) return;
  
  googleMap = new google.maps.Map(canvas, {
    center: { lat: 35.2536, lng: -111.7942 },
    zoom: 12,
    mapTypeId: 'satellite',
    tilt: 45
  });

  // Google Maps click listener for campsite creation
  googleMap.addListener("click", (e) => {
    showCampModal(e.latLng.lat(), e.latLng.lng());
  });

  refreshMapMarkers();
}

// Destroy Leaflet map completely to release DOM
function destroyLeafletMap() {
  if (mapInstance) {
    leafletMarkers.forEach(m => m.remove());
    leafletMarkers = [];
    mapInstance.remove();
    mapInstance = null;
    currentTileLayer = null;
  }
}

// Destroy Google map components
function destroyGoogleMap() {
  if (googleMap) {
    googleMarkersArray.forEach(m => m.setMap(null));
    googleMarkersArray = [];
    googleMap = null;
  }
}

// Re-render markers depending on mapping engine (Leaflet vs Google)
function refreshMapMarkers() {
  const showRoads = mapFilters.roads ? mapFilters.roads.checked : true;
  const showDumps = mapFilters.dumps ? mapFilters.dumps.checked : true;
  const showLogs = mapFilters.logs ? mapFilters.logs.checked : true;

  if (mapInstance) {
    // --- LEAFLET MARKERS ---
    leafletMarkers.forEach(m => m.remove());
    leafletMarkers = [];

    // User GPS location marker
    if (userLocation) {
      const gpsIcon = L.divIcon({
        className: 'gps-pulse-marker-wrapper',
        html: '<div class="gps-pulse-marker"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: gpsIcon })
        .addTo(mapInstance)
        .bindPopup("<b>My GPS Location</b><br>Currently synced.");
      leafletMarkers.push(userMarker);
    }

    // Forest Roads
    if (showRoads) {
      FOREST_ROADS.forEach(road => {
        let pinColor = "#10b981"; // Safe Green
        let status = "COMPATIBLE";
        if (rigProfile.length > road.maxLength || rigProfile.clearance < road.minClearance) {
          pinColor = "#ef4444"; // Dangerous Red
          status = "DANGEROUS";
        } else if (rigProfile.length > road.maxLength - 10) {
          pinColor = "#f59e0b"; // Caution Orange
          status = "CAUTION";
        }

        const svgIcon = L.divIcon({
          html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="${pinColor}"/>
                 </svg>`,
          className: "custom-leaflet-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -20]
        });

        const m = L.marker([road.lat, road.lng], { icon: svgIcon })
          .addTo(mapInstance)
          .bindPopup(`
            <h4>${road.number} - ${road.name}</h4>
            <p><strong>Status:</strong> <span class="status-badge" style="background:${pinColor}22; color:${pinColor}; border:1px solid ${pinColor}33; padding: 0.2rem 0.4rem; font-size: 0.75rem; font-weight:700; border-radius:4px; display:inline-block; margin-top:0.2rem;">${status}</span></p>
            <p style="margin-top:0.4rem;"><strong>Max Length:</strong> ${road.maxLength} ft | <strong>Clearance:</strong> ${road.minClearance} in</p>
            <p style="margin-top:0.2rem;">${road.difficulty} grade complexity</p>
            <p style="margin-top:0.4rem;"><a href="${road.satelliteLink}" target="_blank">Google Maps Satellite ↗</a></p>
          `);
        leafletMarkers.push(m);
      });
    }

    // Dump Stations
    if (showDumps) {
      DUMP_STATIONS.forEach(dump => {
        const svgIcon = L.divIcon({
          html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#38bdf8"/>
                 </svg>`,
          className: "custom-leaflet-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -20]
        });

        const m = L.marker([dump.lat, dump.lng], { icon: svgIcon })
          .addTo(mapInstance)
          .bindPopup(`
            <h4>${dump.name}</h4>
            <p><strong>Location:</strong> ${dump.location}</p>
            <p style="margin-top:0.2rem;"><strong>Fee:</strong> ${dump.fee} | <strong>Water:</strong> ${dump.water}</p>
            <p style="margin-top:0.2rem;">${dump.access}</p>
            <p style="margin-top:0.4rem;"><a href="tel:${dump.phone.replace(/\D/g, "")}">📞 Call Station</a></p>
          `);
        leafletMarkers.push(m);
      });
    }

    // Logged Field Spots
    if (showLogs) {
      loggedSpots.forEach(spot => {
        if (!spot.coords) return;
        const parts = spot.coords.split(",");
        if (parts.length !== 2) return;
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        if (isNaN(lat) || isNaN(lng)) return;

        const svgIcon = L.divIcon({
          html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#a855f7"/>
                 </svg>`,
          className: "custom-leaflet-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -20]
        });

        const m = L.marker([lat, lng], { icon: svgIcon })
          .addTo(mapInstance)
          .bindPopup(`
            <h4>Scouted FR: ${spot.roadNumber}</h4>
            <p><strong>Logged:</strong> ${spot.timestamp}</p>
            <p style="margin-top:0.2rem;"><strong>Signal:</strong> ${"★".repeat(spot.signal)}${"☆".repeat(5 - spot.signal)}</p>
            <p style="font-style:italic; margin-top:0.4rem; padding-top:0.4rem; border-top:1px solid rgba(255,255,255,0.05);">"${spot.notes}"</p>
          `);
        leafletMarkers.push(m);
      });
    }

    // --- STAGED/LOCAL PRIVATE SCOUTED CAMPSITES ---
    stagedCampsites.forEach(c => {
      const pinColor = "#f59e0b"; // Yellow for staged
      const svgIcon = L.divIcon({
        html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="${pinColor}" stroke-width="2.5" stroke-dasharray="4" fill="rgba(245,158,11,0.15)" />
                <path d="M12 7V17M7 12H17" stroke="${pinColor}" stroke-width="2" stroke-linecap="round"/>
               </svg>`,
        className: "staged-leaflet-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -10]
      });

      const m = L.marker([c.lat, c.lng], { icon: svgIcon })
        .addTo(mapInstance)
        .bindPopup(`
          <h4 style="border-left-color: var(--warning);">Candidate (Staged)</h4>
          <p><strong>Status:</strong> <span style="color:var(--warning); font-weight:700;">Local Draft</span></p>
          <p><strong>Staged status:</strong> ${c.status.toUpperCase()}</p>
          <p><strong>Rating:</strong> ${"★".repeat(c.rating)}${"☆".repeat(5 - c.rating)}</p>
          <p><strong>Amenities:</strong> ${c.amenities.join(", ") || "None"}</p>
          <p style="font-style:italic; margin-top:0.3rem;">"${c.notes}"</p>
          <hr style="margin: 0.5rem 0; border:0; border-top: 1px solid var(--border);">
          <button onclick="claimAndPublishStagedCampsites('${c.id}')" class="btn primary-btn mini-btn" style="width:100%; justify-content:center;">Claim this site & Setup Camp</button>
        `);
      leafletMarkers.push(m);
    });

    // --- SHARED PUBLIC/COMMUNITY CAMPSITES ---
    sharedCampsites.forEach(c => {
      const isAvailable = (c.status === "available");
      const pinColor = isAvailable ? "#10b981" : "#ef4444";
      const statusText = isAvailable ? "AVAILABLE" : "OCCUPIED";

      const svgIcon = L.divIcon({
        html: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="${pinColor}" stroke="#fff" stroke-width="1.5"/>
               </svg>`,
        className: "shared-camp-leaflet-marker",
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -12]
      });

      const m = L.marker([c.lat, c.lng], { icon: svgIcon })
        .addTo(mapInstance)
        .bindPopup(`
          <h4 style="border-left-color: ${pinColor};">${isAvailable ? '🏕️ Open Campsite' : '🔒 Occupied Spot'}</h4>
          <p><strong>Status:</strong> <span class="status-badge" style="background:${pinColor}22; color:${pinColor}; border:1px solid ${pinColor}33; padding: 0.2rem 0.4rem; font-size: 0.75rem; font-weight:700; border-radius:4px; display:inline-block;">${statusText}</span></p>
          <p style="margin-top:0.4rem;"><strong>Rating:</strong> ${"★".repeat(c.rating)}${"☆".repeat(5 - c.rating)}</p>
          <p><strong>Amenities:</strong> ${c.amenities.join(", ") || "None"}</p>
          <p style="font-style:italic; margin-top:0.4rem; border-top:1px solid rgba(255,255,255,0.05); padding-top:0.4rem;">"${c.notes}"</p>
        `);
      leafletMarkers.push(m);
    });

  } else if (googleMap) {
    // --- GOOGLE MAPS MARKERS ---
    googleMarkersArray.forEach(m => m.setMap(null));
    googleMarkersArray = [];

    // GPS location
    if (userLocation) {
      const marker = new google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: googleMap,
        title: "My GPS Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#0ea5e9",
          fillOpacity: 1.0,
          strokeColor: "#ffffff",
          strokeWeight: 2
        }
      });
      googleMarkersArray.push(marker);
    }

    // Forest Roads
    if (showRoads) {
      FOREST_ROADS.forEach(road => {
        let pinColor = "#10b981"; // Safe Green
        if (rigProfile.length > road.maxLength || rigProfile.clearance < road.minClearance) {
          pinColor = "#ef4444"; // Dangerous Red
        } else if (rigProfile.length > road.maxLength - 10) {
          pinColor = "#f59e0b"; // Caution Orange
        }

        const marker = new google.maps.Marker({
          position: { lat: road.lat, lng: road.lng },
          map: googleMap,
          title: `${road.number} - ${road.name}`,
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z",
            fillColor: pinColor,
            fillOpacity: 1.0,
            strokeWeight: 0,
            scale: 1.5,
            anchor: new google.maps.Point(12, 22)
          }
        });

        const infowindow = new google.maps.InfoWindow({
          content: `
            <div style="color:#0f172a; padding: 4px; font-family: var(--font-body);">
              <h4 style="margin: 0 0 4px 0; color:#0f172a; font-family:var(--font-heading); font-size:1.05rem; font-weight:700; border-left: 3px solid ${pinColor}; padding-left:6px;">${road.number} - ${road.name}</h4>
              <p style="margin: 4px 0; font-size:0.85rem;"><strong>Max Length:</strong> ${road.maxLength} ft | <strong>Clearance:</strong> ${road.minClearance} in</p>
              <p style="margin: 4px 0; font-size: 0.8rem; color:#64748b;">Difficulty: ${road.difficulty}</p>
            </div>
          `
        });

        marker.addListener("click", () => {
          infowindow.open(googleMap, marker);
        });

        googleMarkersArray.push(marker);
      });
    }

    // Dump Stations
    if (showDumps) {
      DUMP_STATIONS.forEach(dump => {
        const marker = new google.maps.Marker({
          position: { lat: dump.lat, lng: dump.lng },
          map: googleMap,
          title: dump.name,
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z",
            fillColor: "#38bdf8",
            fillOpacity: 1.0,
            strokeWeight: 0,
            scale: 1.5,
            anchor: new google.maps.Point(12, 22)
          }
        });

        const infowindow = new google.maps.InfoWindow({
          content: `
            <div style="color:#0f172a; padding: 4px; font-family: var(--font-body);">
              <h4 style="margin: 0 0 4px 0; color:#0f172a; font-family:var(--font-heading); font-size:1.05rem; font-weight:700; border-left:3px solid #38bdf8; padding-left:6px;">${dump.name}</h4>
              <p style="margin: 4px 0; font-size:0.85rem;"><strong>Fee:</strong> ${dump.fee} | <strong>Water:</strong> ${dump.water}</p>
              <p style="margin: 4px 0; font-size: 0.8rem; color:#64748b;">${dump.access}</p>
            </div>
          `
        });

        marker.addListener("click", () => {
          infowindow.open(googleMap, marker);
        });

        googleMarkersArray.push(marker);
      });
    }

    // Logged Spots
    if (showLogs) {
      loggedSpots.forEach(spot => {
        if (!spot.coords) return;
        const parts = spot.coords.split(",");
        if (parts.length !== 2) return;
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        if (isNaN(lat) || isNaN(lng)) return;

        const marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: googleMap,
          title: `Scouted Spot - ${spot.roadNumber}`,
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z",
            fillColor: "#a855f7",
            fillOpacity: 1.0,
            strokeWeight: 0,
            scale: 1.5,
            anchor: new google.maps.Point(12, 22)
          }
        });

        const infowindow = new google.maps.InfoWindow({
          content: `
            <div style="color:#0f172a; padding: 4px; font-family: var(--font-body);">
              <h4 style="margin: 0 0 4px 0; color:#0f172a; font-family:var(--font-heading); font-size:1.05rem; font-weight:700; border-left:3px solid #a855f7; padding-left:6px;">Scouted Spot (${spot.roadNumber})</h4>
              <p style="margin: 4px 0; font-size:0.85rem; font-style: italic;">"${spot.notes}"</p>
              <p style="margin: 4px 0; font-size: 0.8rem; color:#64748b;">Signal Strength: ${spot.signal}/5</p>
            </div>
          `
        });

        marker.addListener("click", () => {
          infowindow.open(googleMap, marker);
        });

        googleMarkersArray.push(marker);
      });
    }

    // Google Maps Staged/Shared Campsites (Dynamic)
    stagedCampsites.forEach(c => {
      const marker = new google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map: googleMap,
        title: "Candidate Site (Staged)",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#f59e0b",
          fillOpacity: 0.5,
          strokeColor: "#f59e0b",
          strokeWeight: 2
        }
      });
      googleMarkersArray.push(marker);
    });

    sharedCampsites.forEach(c => {
      const isAvailable = (c.status === "available");
      const pinColor = isAvailable ? "#10b981" : "#ef4444";
      const marker = new google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map: googleMap,
        title: isAvailable ? "Open Campsite" : "Occupied Campsite",
        icon: {
          path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
          fillColor: pinColor,
          fillOpacity: 1.0,
          strokeColor: "#ffffff",
          strokeWeight: 1.5,
          scale: 1.3
        }
      });
      googleMarkersArray.push(marker);
    });
  }
}

// Subscribe to Firestore shared campsites database updates
function startCampsiteSync() {
  if (!db) return;
  db.collection("shared_campsites").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    sharedCampsites = [];
    snapshot.forEach(doc => {
      sharedCampsites.push({
        id: doc.id,
        ...doc.data()
      });
    });
    refreshMapMarkers();
  }, err => {
    console.warn("Firestore campsite sync failed. Running with offline data.");
  });
}

// ==========================================================================
// Coordinates Parser & Location Importer Helpers (Google/Apple Maps/Clipboard)
// ==========================================================================

function extractCoordinates(text) {
  if (!text) return null;
  
  // 1. Try matching simple decimal coordinates like 35.2536, -111.7942
  const coordRegex = /(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/;
  const match = text.match(coordRegex);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  // 2. Try parsing from Google Maps standard share links or query strings
  const urlParams = ['q', 'query', 'll', 'daddr', 'saddr'];
  for (const param of urlParams) {
    const reg = new RegExp(`[?&]${param}=([^&]+)`);
    const m = text.match(reg);
    if (m) {
      const decoded = decodeURIComponent(m[1]);
      const parts = decoded.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
      if (parts) {
        const lat = parseFloat(parts[1]);
        const lng = parseFloat(parts[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
    }
  }

  // 3. Fallback: search for any two float numbers near each other in the string
  const floats = text.match(/-?\d+\.\d+/g);
  if (floats && floats.length >= 2) {
    const lat = parseFloat(floats[0]);
    const lng = parseFloat(floats[1]);
    // Safety check coordinates range limits
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }
  
  return null;
}

function handleClipboardImport() {
  if (!importCoordsInput) return;
  const text = importCoordsInput.value.trim();
  if (!text) {
    alert("Please paste coordinates or a link first.");
    return;
  }
  
  const coords = extractCoordinates(text);
  if (coords) {
    zoomToCoordinates(coords.lat, coords.lng);
    showCampModal(coords.lat, coords.lng);
    importCoordsInput.value = "";
  } else {
    alert("Could not extract coordinates from the pasted text. Make sure it contains decimal coordinates like '35.2536, -111.7942'.");
  }
}

function zoomToCoordinates(lat, lng) {
  if (mapInstance) {
    mapInstance.setView([lat, lng], 15);
  }
  if (googleMap) {
    googleMap.setCenter({ lat, lng });
    googleMap.setZoom(15);
  }
}

function handleIncomingShareTarget() {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "";
  const text = params.get("text") || "";
  const url = params.get("url") || "";
  
  const payload = `${title} ${text} ${url}`.trim();
  if (!payload) return;
  
  const coords = extractCoordinates(payload);
  if (coords) {
    console.log("Successfully extracted PWA Share Target coordinates:", coords);
    // Delay slightly to ensure map container has loaded
    setTimeout(() => {
      onMapTabActive();
      zoomToCoordinates(coords.lat, coords.lng);
      showCampModal(coords.lat, coords.lng);
      
      // Clean query params so reload doesn't trigger modal again
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }, 1000);
  } else {
    console.warn("Share target payload did not contain parseable coordinates.");
  }
}

// Initializer
function init() {
  loadRigProfile();
  initLoggerSelects();
  
  // Initialize dynamic interactive map controls
  initMapTab();

  // Load offline shared camps
  const savedShared = localStorage.getItem("rv_boondock_shared_camps");
  if (savedShared) {
    sharedCampsites = JSON.parse(savedShared);
  }
  
  // Fallback to local storage initially/offline
  const savedSpots = localStorage.getItem("rv_boondock_spots");
  if (savedSpots) {
    loggedSpots = JSON.parse(savedSpots);
  }
  renderLoggedSpots();
  
  renderRoadsList();
  renderDumpList();
  updateWizardUI();
  
  // Initialize Transit tab dropdown & routing setup
  populateTransitDestinations();
  transitDestSelect.addEventListener("change", updateTransitRoute);
  btnTransitRefresh.addEventListener("click", () => {
    syncCurrentGPS();
  });

  // Load Firebase dynamically in the background to ensure immediate app responsiveness
  loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js")
    .then(() => loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"))
    .then(() => loadScript("/__/firebase/init.js?useEmulator=false"))
    .then(() => {
      console.log("Firebase SDKs loaded successfully.");
      startFirebaseSync();
      startCampsiteSync();
    })
    .catch(err => {
      console.warn("Firebase failed to load dynamically (running in offline/local-only mode):", err);
    });

  // Force Leaflet map tab initial setup on load
  onMapTabActive();

  // Inspect shared payload if shared via operating system
  handleIncomingShareTarget();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
} catch (globalInitError) {
  alert("CRITICAL APP INITIALIZATION ERROR:\n" + globalInitError.message + "\n\nStack:\n" + globalInitError.stack);
}
