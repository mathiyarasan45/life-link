// Map Logic for LifeLink

const MapManager = {
    map: null,
    markers: [],
    userMarker: null,

    init(elementId, center = [13.0827, 80.2707], zoom = 13) { // Default Chennai
        if (this.map) {
            this.map.remove(); // Cleanup existing map if any
        }

        this.map = L.map(elementId).setView(center, zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        // Fix for default icon issues in some bundlers/browsers
        // We will use FontAwesome icons as custom markers usually, but for now standard leafleft
    },

    showDonors(donors) {
        // Clear existing markers
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];

        donors.forEach(donor => {
            const el = document.createElement('div');
            el.className = 'custom-marker';

            const marker = L.marker([donor.lat, donor.lng])
                .addTo(this.map)
                .bindPopup(this.createPopupContent(donor));

            this.markers.push(marker);
        });
    },

    createPopupContent(donor) {
        return `
            <div class="p-2">
                <h3 class="font-bold text-slate-800">${donor.name}</h3>
                <div class="flex items-center gap-2 mt-1">
                    <span class="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">${donor.bloodGroup}</span>
                    <span class="text-xs text-slate-500">${donor.district}</span>
                </div>
                <div class="mt-2 text-sm">
                    <p><i class="fa-solid fa-phone text-slate-400 mr-1"></i> ${donor.phone}</p>
                </div>
                <button onclick="app.contactDonor('${donor.id}')" class="mt-2 w-full bg-primary text-white text-xs py-1 px-2 rounded hover:bg-secondary transition">
                    Contact
                </button>
            </div>
        `;
    },

    flyTo(lat, lng, zoom = 15) {
        this.map.flyTo([lat, lng], zoom);
    }
};
