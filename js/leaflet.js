import { settingInfo, settingGraph } from "./sidebarleft.js";
let map = null;
let previousMarker = null;
let previousColorMarker = null;
let chartCreated = null;
let totalDeath = 0;
let totalInjury = 0;
let totalAccident = 0;
let totalVehicle = 0;
let totalCity = 0;
const exit = document.querySelector(".exit");

export { map };

// Create the map
function createMap() {
  map = L.map("map", {
    center: [61.8719, 12.5674],
    zoom: 6.3,
    minZoom: 6,
    maxZoom: 10,
    zoomControl: false,
    maxBoundsViscosity: 1.0,
  });

  // Block the borders on Italy
  const bounds = L.latLngBounds(
    [35.5, 6.5], // south-west
    [47.5, 19] // north-east
  );

  // Prevent dragging the map outside the bounds
  map.setMaxBounds(bounds);
  map.on("drag", function () {
    map.panInsideBounds(bounds, { animate: false });
  });

  map.attributionControl.remove();

  // Tile layer without labels (dark mode)
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }
  ).addTo(map);
}

// Create the markers
function createMarker(element) {
  let colorMarker = "null";
  switch (true) {
    case element.morti > 11:
      colorMarker = "red";
      break;
    case element.morti > 5 && element.morti <= 11:
      colorMarker = "orange";
      break;
    case element.morti > 1 && element.morti <= 5:
      colorMarker = "yellow";
      break;
    case element.morti <= 1:
      colorMarker = "green";
      break;
    default:
      colorMarker = "white";
  }

  const marker = L.circleMarker([element.lat, element.lon], {
    radius: 5,
    color: colorMarker,
    fillColor: colorMarker,
  })
    .addTo(map)
    .on("click", (e) => {
      if (previousMarker) {
        previousMarker.setStyle({
          color: previousColorMarker,
          fillColor: previousColorMarker,
          radius: 5,
        });
      }
      marker.setStyle({
        color:
          document.querySelector(".change-mode").dataset.type == "dark"
            ? "white"
            : "black",
        fillColor:
          document.querySelector(".change-mode").dataset.type == "dark"
            ? "white"
            : "black",
        radius: 10,
      });
      previousMarker = marker;
      previousColorMarker = colorMarker;

      settingInfo(
        element.comune,
        element.incidenti,
        element.tot_veicoli_incidenti,
        element.feriti,
        element.morti,
        element.lat,
        element.lon,
        colorMarker
      );

      if (chartCreated != null) {
        chartCreated.destroy();
      }

      try {
        chartCreated = settingGraph(
          "doughnut",
          ["Urban Street", "Motorway", "Other Street"],
          "Road fatality index ",
          [
            element.indice_mortalita.strada_urbana,
            element.indice_mortalita.autostrada,
            element.indice_mortalita.altra_strada,
          ],
          ["#014040", "#02735E", "#03A678"]
        );

        if (document.querySelector(".chart").style.display === "none") {
          document.querySelector(".chart").style.display = "block";
        }
      } catch (error) {
        document.querySelector(".chart").style.display = "none";
      }

      if (exit.style.display == "") {
        exit.style.display = "block";
      }

      exit.addEventListener("click", () => {
        marker.setStyle({
          color: colorMarker,
          fillColor: colorMarker,
          radius: 5,
        });
        settingInfo(
          "Italy",
          totalAccident,
          totalVehicle,
          totalInjury,
          totalDeath
        );
        if (chartCreated != null) {
          chartCreated.destroy();
        }
        chartCreated = settingGraph(
          "doughnut",
          ["Death", "Injury"],
          "Percentage of Death and Injury",
          [
            ((totalDeath / (totalDeath + totalInjury)) * 100).toFixed(2),
            ((totalInjury / (totalDeath + totalInjury)) * 100).toFixed(2),
          ],
          ["#014040", "#02735E"]
        );
        exit.style.display = "";
        document.querySelector(".long").style.display = "none";
      });
    });
}

// Load the data from the JSON file
async function loadingData() {
  const response = await fetch("./data/accident_data_italy.json");
  let data = await response.json();

  for (const element of data.data) {
    createMarker(element);
    totalDeath += element.morti;
    totalInjury += element.feriti;
    totalAccident += element.incidenti;
    totalVehicle += element.tot_veicoli_incidenti
      ? element.tot_veicoli_incidenti
      : 0;
    totalCity += 1;
  }

  // Default info
  settingInfo("Italy", totalAccident, totalVehicle, totalInjury, totalDeath);
  chartCreated = settingGraph(
    "doughnut",
    ["Death", "Injury"],
    "Percentage of Death and Injury",
    [
      ((totalDeath / (totalDeath + totalInjury)) * 100).toFixed(2),
      ((totalInjury / (totalDeath + totalInjury)) * 100).toFixed(2),
    ],
    ["#014040", "#02735E"]
  );
}

// Call the functions
createMap();
loadingData();
