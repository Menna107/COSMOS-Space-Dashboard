const sideBarLinks = document.querySelectorAll("aside [data-section]");
const sections = document.querySelectorAll("section");

// to display Planet data when we click on it.
let planetsData = {};
const planets = document.querySelectorAll(".planet-card");
const planetIdMap = {
  earth: "terre",
  mercury: "mercure",
  venus: "venus",
  mars: "mars",
  jupiter: "jupiter",
  saturn: "saturne",
  uranus: "uranus",
  neptune: "neptune",
};

// display the section we clicked on and hide the other sections.
for (let i = 0; i < sideBarLinks.length; i++) {
  sideBarLinks[i].addEventListener("click", function () {
    const targetSectionId = this.dataset.section;

    sections.forEach((element) => {
      element.classList.add("hidden");
    });

    document.getElementById(targetSectionId).classList.remove("hidden");

    sideBarLinks.forEach((element) => {
      element.classList.add("text-slate-300");
      element.classList.remove("bg-blue-500/10", "text-blue-400");
    });

    this.classList.remove("text-slate-300");
    this.classList.add("bg-blue-500/10", "text-blue-400");
  });
}

// display data from API In launches section:
const launchesGridElement = document.getElementById("launches-grid");
const featuredLaunchElement = document.getElementById("featured-launch");

// ~==================Section Launches=======================
function displayLaunchesData(data) {
  if (!data || data.length === 0) return;

  // Featured launch
  let firstLaunch =
    data.find((launch) => launch.name.includes("Falcon 9 Block 5 | CSG-3")) ||
    data[0];

  document.getElementById("latchesName").textContent = firstLaunch.name;
  document.getElementById("launch_service_provider").textContent =
    firstLaunch.launch_service_provider?.name || "N/A";
  document.getElementById("rocket").textContent =
    firstLaunch.rocket?.configuration?.name || "N/A";

  document.getElementById("latchesLocation").textContent =
    firstLaunch.pad?.location?.name || "N/A";
  const country = firstLaunch.pad?.location?.country;

  document.getElementById("latchesCountry").textContent = firstLaunch.pad.country.name;

  document.getElementById("missionDiscription").textContent =
    firstLaunch.mission?.description || "No mission description";

  const launchImg = document.getElementById("launchImg");
  if (firstLaunch.image?.image_url) {
    launchImg.src = firstLaunch.image.image_url;
  } else {
    launchImg.src = "";
  }

  // ====== Add dynamic cards to launches-grid ======
  const grid = document.getElementById("launches-grid");
  grid.innerHTML = "";

  data.forEach((launch) => {
    if(launch.id === firstLaunch.id) return;
    const card = document.createElement("div");
    card.className =
      "bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer";

    const imageUrl = launch.image?.image_url || "";
    const provider = launch.launch_service_provider?.name || "N/A";
    const rocket = launch.rocket?.configuration?.name || "N/A";
    const location = launch.pad?.location?.name || "N/A";
    const date = launch.net
      ? new Date(launch.net).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "TBD";
    const time = launch.net
      ? new Date(launch.net).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) + " UTC"
      : "TBD";

    card.innerHTML = `
      <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="${launch.name}" class="object-cover w-full h-full">`
            : `<i class="fas fa-rocket text-5xl text-slate-700"></i>`
        }
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 ${
            launch.status?.name === "Go"
              ? "bg-green-500/90"
              : "bg-yellow-500/90"
          } text-white backdrop-blur-sm rounded-full text-xs font-semibold">
            ${launch.status?.name || "TBD"}
          </span>
        </div>
      </div>
      <div class="p-5">
        <div class="mb-3">
          <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            ${launch.name}
          </h4>
          <p class="text-sm text-slate-400 flex items-center gap-2">
            <i class="fas fa-building text-xs"></i>
            ${provider}
          </p>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-calendar text-slate-500 w-4"></i>
            <span class="text-slate-300">${date}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-clock text-slate-500 w-4"></i>
            <span class="text-slate-300">${time}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-rocket text-slate-500 w-4"></i>
            <span class="text-slate-300">${rocket}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
            <span class="text-slate-300 line-clamp-1">${location}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
          <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
            Details
          </button>
          <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

async function getLaunches() {
  try {
    let response = await fetch(
      "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?format=json"
    );
    if (!response.ok) {
      console.log("HTTP error", response.status);
      return;
    }
    let data = await response.json();
    displayLaunchesData(data.results);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

getLaunches();

// ~==================Section Today in space=======================
async function getTodayAPOD() {
  try {
    // const response = await fetch(
    //   "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
    // );

    // !Personal API to make it work when the server is not working.
    const response = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=pOu1DoXcQVSK6HC47iXoNk2g7jpWgBsBIq3hFaZ3"
    );
    
    const data = await response.json();
    updateTodayApod(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function updateTodayApod(apod) {
  document.getElementById(
    "apod-date"
  ).textContent = `Astronomy Picture of the Day — ${formatDate(apod.date)}`;

  document.getElementById("todayDate").textContent = formatDate(apod.date);
  document.getElementById("apod-title").textContent = apod.title;
  document.getElementById("apod-date-detail").textContent = formatDate(
    apod.date
  );
  document.getElementById("apod-explanation").textContent = apod.explanation;
  document.getElementById("apod-date-info").textContent = apod.date;
  document.getElementById("apod-media-type").textContent = apod.media_type;

  document.getElementById("apod-image").src = apod.url;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

getTodayAPOD();

const apodImage = document.getElementById("apod-image");
const viewFullBtn = document.getElementById("view-full-btn");

viewFullBtn.addEventListener("click", () => {
  window.open(apodImage.src, "_blank");
});

// ~==================Section Planets=======================
// get planets data from API
async function getPlanets() {
  try {
    let response = await fetch(
      "https://solar-system-opendata-proxy.vercel.app/api/planets"
    );
    let data = await response.json();

    data.bodies.forEach((planet) => {
      planetsData[planet.id.toLowerCase()] = planet;
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
getPlanets();
// to display Planet data when we click on it.
for (let i = 0; i < planets.length; i++) {
  planets[i].addEventListener("click", function () {
    const targetPlanetId = this.dataset.planetId;
    const apiId = planetIdMap[targetPlanetId.toLowerCase()];

    const planet = planetsData[apiId.toLowerCase()];
    if (planet) {
      updatePlanetDetails(planet);
    }
  });
}
// to update HTML with specific planet.
function updatePlanetDetails(planet) {
  document.getElementById("planet-detail-name").textContent = planet.name;
  document.getElementById("planet-detail-description").textContent =
    planet.description;
  document.getElementById("planet-detail-image").src = planet.image;

  document.getElementById("planet-distance").textContent =
    planet.semimajorAxis.toLocaleString() + " km";
  document.getElementById("planet-radius").textContent =
    planet.meanRadius.toLocaleString() + " km";

  document.getElementById(
    "planet-mass"
  ).textContent = `${planet.mass.massValue} x 10^${planet.mass.massExponent} kg`;

  // document.getElementById("planet-mass").textContent = "N/A";

  document.getElementById("planet-density").textContent =
    planet.density + " g/cm³";
  document.getElementById("planet-orbital-period").textContent =
    planet.sideralOrbit + " days";
  document.getElementById("planet-rotation").textContent =
    planet.sideralRotation + " hours";

  document.getElementById("planet-moons").textContent = planet.moons.length;

  document.getElementById("planet-gravity").textContent =
    planet.gravity + " m/s²";

  document.getElementById("planet-discoverer").textContent =
    planet.discoveredBy || "Known since antiquity";
  document.getElementById("planet-discovery-date").textContent =
    planet.discoveryDate || "Ancient times";
  document.getElementById("planet-body-type").textContent =
    planet.bodyType || "Planet";

  if (planet.vol) {
    document.getElementById(
      "planet-volume"
    ).textContent = `${planet.vol.volValue}e${planet.vol.volExponent} km³`;
  } else {
    document.getElementById("planet-volume").textContent = "N/A";
  }

  const factsList = document.getElementById("planet-facts");
  factsList.innerHTML = "";

  const facts = [];
  facts.push(
    `Mass: ${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`
  );
  facts.push(`Surface gravity: ${planet.gravity} m/s²`);
  facts.push(`Density: ${planet.density} g/cm³`);

  if (planet.axialTilt) {
    facts.push(`Axial tilt: ${planet.axialTilt}°`);
  }

  facts.forEach((fact) => {
    const li = document.createElement("li");
    li.classList.add("flex", "items-start");
    li.innerHTML = `<i class="fas fa-check text-green-400 mt-1 mr-2"></i> <span class="text-slate-300">${fact}</span>`;
    factsList.appendChild(li);
  });

  document.getElementById("planet-perihelion").textContent =
    (planet.perihelion / 1e6).toFixed(1) + "M km";
  document.getElementById("planet-aphelion").textContent =
    (planet.aphelion / 1e6).toFixed(1) + "M km";
  document.getElementById("planet-eccentricity").textContent =
    planet.eccentricity.toFixed(5);
  document.getElementById("planet-inclination").textContent =
    planet.inclination + "°";
  document.getElementById("planet-axial-tilt").textContent =
    planet.axialTilt + "°";
  document.getElementById("planet-temp").textContent = planet.avgTemp + "°C";
  document.getElementById("planet-escape").textContent = planet.escape;
}
