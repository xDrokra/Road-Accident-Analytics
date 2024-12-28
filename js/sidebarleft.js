// select all the major elements on the side bar
const title = document.querySelector(".total-info h1");
const latLon = document.querySelector(".total-info p");
const totalAccident = document.querySelector(".crash .value");
const totalVehicle = document.querySelector(".vehicle .value");
const totalDeath = document.querySelector(".death .value");
const totalInjury = document.querySelector(".injury .value");
const riskLevel = document.querySelector(".long div .risk");
const riskLevelValue = document.querySelector(".long div p");
const ctx = document.getElementById("pieChart").getContext("2d");

// setting the information on the sidebar
export function settingInfo(
  city,
  accident,
  vehicle,
  injury,
  death,
  lat = null,
  lon = null,
  colorMarker = null
) {
  title.textContent = city;
  latLon.textContent = lat && lon ? `lat: ${lat.slice(0, 6)}, lon: ${lon.slice(0, 6)}` : "2023 data";
  totalAccident.textContent = accident;
  totalVehicle.textContent = vehicle ? vehicle : "no data";
  totalDeath.textContent = death;
  totalInjury.textContent = injury;
  riskLevel.style.border = `5px solid ${colorMarker}`;
  if (colorMarker != null) {
    document.querySelector(".long").style.display = "block";
    riskLevelValue.textContent =
      colorMarker == "red"
        ? "High"
        : colorMarker == "orange"
        ? "Medium"
        : colorMarker == "yellow"
        ? "Low"
        : "Very Low";
  }
}

// setting the graph on the sidebar
export function settingGraph(type, labels, titleLabel, data, color) {
  const chartCreated = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: titleLabel,
          data: data,
          backgroundColor: color,
          borderWidth: 0,
          hoverOffset: 15,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {},
      },
      layout: {
        padding: 8,
      },
      cutout: "70%",
    },
  });

  return chartCreated;
}
