const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Function to get color based on depth
function getColor(depth) {
    if (depth < 10) return "#00FF00";
    else if (depth < 30) return "#FFFF00";
    else return "#FF0000";
}  

//Creates map
const map = L.map("map", {
    center: [0, 0],
    zoom: 2,
    });

//base map layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

d3.json(url).then((earthquakeData) => {
    earthquakeData.features.forEach((earthquake) => {
        const coordinates = earthquake.geometry.coordinates;
        const magnitude = earthquake.properties.mag;
        const depth = coordinates[2];

        const circle = L.circle([coordinates[1], coordinates[0]], {
            radius: magnitude * 10000,
            fillColor: getColor(depth),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
        }).addTo(map);

        circle.bindPopup(`<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km<br><strong>Location:</strong> ${earthquake.properties.place}`)
    });

    // Create Legend
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        const grades = [0, 10, 30];

        // Loop through grades and add color boxes with labels
        for (let i = 0; i < grades.length; i++) {
            const color = getColor(grades[i] + 1);
            div.innerHTML +=
                `<i style="background:${color}"></i> ${grades[i]}${grades[i + 1] ? "&ndash;" + grades[i + 1] + " km<br>" : "+ km"}`;
        }
        return div;
    };

    legend.addTo(map);
});