import { map } from "./leaflet.js";

const changeMode = document.querySelector(".change-mode");

// function to change the mode of the map (withe)
function whiteMode() {
  document.documentElement.style.setProperty("--bg-main", "#d4d4d4");
  document.documentElement.style.setProperty("--bg-main-darker", "#ffff");
  document.documentElement.style.setProperty("--font-main", "black");
  document.documentElement.style.setProperty("--bg-secondary", "#fff");
  document.documentElement.style.setProperty("--color-text", "#2b2b2b");

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }
  ).addTo(map);
}

// function to change the mode of the map (dark)
function darkMode() {
  document.documentElement.style.setProperty("--bg-main", "#262626");
  document.documentElement.style.setProperty("--bg-main-darker", "#090909");
  document.documentElement.style.setProperty("--font-main", "#fff");
  document.documentElement.style.setProperty("--bg-secondary", "#0f0f0f");
  document.documentElement.style.setProperty("--color-text", "gray");

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }
  ).addTo(map);
}

// event listener to change the mode of the map
changeMode.addEventListener("click", () => {
  const type = changeMode.dataset.type;

  if (type === "dark") {
    changeMode.dataset.type = "withe";
    whiteMode();
  } else {
    changeMode.dataset.type = "dark";
    darkMode();
  }
});
