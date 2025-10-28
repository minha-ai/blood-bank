// Donor form logic
const form = document.querySelector('#register form');
const tableBody = document.querySelector('#register table tbody');
const clearBtn = document.getElementById('clearTable');
let donors = [];

function updateTable() {
  tableBody.innerHTML = '';
  donors.forEach(d => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${d.name}</td><td>${d.phone}</td><td>${d.blood}</td><td>${d.city}</td>`;
    tableBody.appendChild(row);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.querySelector('input[placeholder="Full Name"]').value.trim();
  const phone = form.querySelector('input[placeholder="Phone Number"]').value.trim();
  const blood = form.querySelector('select').value;
  const city = form.querySelector('input[placeholder="City"]').value.trim();
  if(!name || !phone || !blood || !city) return;
  donors.push({name, phone, blood, city});
  updateTable();
  form.reset();
});

clearBtn.addEventListener('click', () => {
  donors = [];
  tableBody.innerHTML = '';
});

// Map logic
document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('map');
  if(mapContainer._leaflet_id) mapContainer._leaflet_id = null;

  const map = L.map('map', { dragging: true, scrollWheelZoom: true }).setView([20.5937,78.9629], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  map.invalidateSize();

  const bloodBanks = [
    {name:"Apollo Blood Bank", lat:13.0827, lng:80.2707},    // Chennai
    {name:"Red Cross Blood Bank", lat:12.9716, lng:77.5946}, // Bangalore
    {name:"Fortis Blood Bank", lat:28.6139, lng:77.2090},    // Delhi
    {name:"Kokilaben Blood Bank", lat:19.0760, lng:72.8777},  // Mumbai
    {name:"Father Mullers Medical College Blood Bank", lat:12.87, lng:74.5946}, // Mangalore
    {name:"Wenlock Blood Centre", lat:12.87, lng:74.84},    // Mangalore
    {name:"Red Cross Sanjeevini Blood Bank", lat:12.98444, lng:77.57867}  // Mangalore
  ];

  bloodBanks.forEach(bank => {
    L.marker([bank.lat, bank.lng]).addTo(map)
      .bindPopup(bank.name);
  });

  // "Use My Location"
  const locateBtn = document.getElementById('locateBtn');
  locateBtn.addEventListener('click', () => {
    if(!navigator.geolocation) return alert("Geolocation not supported!");
    locateBtn.textContent = "Locating...";
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 13);
      map.invalidateSize();
      L.marker([latitude, longitude]).addTo(map)
        .bindPopup("📍 You are here!")
        .openPopup();
      locateBtn.textContent = "Use My Location";
    }, err => {
      alert("Unable to get location: " + err.message);
      locateBtn.textContent = "Use My Location";
    }, { enableHighAccuracy:true, timeout:10000 });
  });
});
