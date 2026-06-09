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
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
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
      <div class="btn-group">
        <a href="${road.satelliteLink}" target="_blank" class="btn primary-btn mini-btn">Ground Truth Check ↗</a>
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
      <div class="btn-group" style="margin-top: 1rem; width: 100%;">
        <a href="${appleMapsUrl}" class="btn secondary-btn mini-btn maps-btn" style="flex: 1;" target="_blank">🍎 Apple Maps</a>
        <a href="${googleMapsUrl}" class="btn secondary-btn mini-btn maps-btn" style="flex: 1;" target="_blank">🗺️ Google Maps</a>
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
      <div class="logged-item-actions">
        <button class="btn primary-btn mini-btn" onclick="exportSpot('${spot.id}')">Export MD</button>
        <button class="btn secondary-btn mini-btn" onclick="deleteSpot('${spot.id}')" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.2)">Delete</button>
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

// Initializer
function init() {
  loadRigProfile();
  initLoggerSelects();
  
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
    }, err => {
      console.error("Firestore snapshot error (check if Firestore is provisioned in the console):", err);
    });
  } else {
    // Fallback to local storage if running without Firebase backend
    const savedSpots = localStorage.getItem("rv_boondock_spots");
    if (savedSpots) {
      loggedSpots = JSON.parse(savedSpots);
    }
    renderLoggedSpots();
  }
  
  renderRoadsList();
  renderDumpList();
  updateWizardUI();
}

window.addEventListener("DOMContentLoaded", init);
