// Mock Data for LifeLink

const MOCK_DONORS = [
    {
        id: 'd1',
        name: 'Arun Kumar',
        bloodGroup: 'O+',
        phone: '9876543210',
        city: 'Chennai',
        district: 'Chennai',
        lastDonation: '2025-11-15',
        lat: 13.0827,
        lng: 80.2707,
        isAvailable: true,
        type: 'donor'
    },
    {
        id: 'd2',
        name: 'Priya Sharma',
        bloodGroup: 'A+',
        phone: '9876543211',
        city: 'Chennai',
        district: 'Chennai',
        lastDonation: '2026-01-10',
        lat: 13.0850,
        lng: 80.2100, // Anna Nagar
        isAvailable: true,
        type: 'donor'
    },
    {
        id: 'd3',
        name: 'Vijay Sethupathi',
        bloodGroup: 'B-',
        phone: '9876543212',
        city: 'Chennai',
        district: 'Chennai',
        lastDonation: '2025-10-01',
        lat: 12.9716,
        lng: 80.2433, // Adyar
        isAvailable: true,
        type: 'donor'
    },
    {
        id: 'd4',
        name: 'Anita Raj',
        bloodGroup: 'AB+',
        phone: '9876543213',
        city: 'Chennai',
        district: 'Chennai',
        lastDonation: '2026-02-01',
        lat: 12.9800,
        lng: 80.2000, // Guindy
        isAvailable: false,
        type: 'donor'
    },
    {
        id: 'd5',
        name: 'Suresh Raina',
        bloodGroup: 'O-',
        phone: '9876543214',
        city: 'Chennai',
        district: 'Chennai',
        lastDonation: '2025-08-15',
        lat: 13.0600,
        lng: 80.2500, // Nungambakkam
        isAvailable: true,
        type: 'donor'
    }
];

const MOCK_REQUESTS = [
    {
        id: 'r1',
        requesterName: 'Mercy Hospital',
        bloodGroup: 'B+',
        units: 2,
        city: 'Chennai',
        hospital: 'Apollo Hospitals, Greams Road',
        contact: '044-28293333',
        date: '2026-02-15',
        lat: 13.0632,
        lng: 80.2517,
        urgency: 'high'
    },
    {
        id: 'r2',
        requesterName: 'Rajiv Gandhi Govt Hospital',
        bloodGroup: 'AB-',
        units: 1,
        city: 'Chennai',
        hospital: 'RGGGH',
        contact: '044-25305000',
        date: '2026-02-14',
        lat: 13.0815,
        lng: 80.2768,
        urgency: 'critical'
    }
];

const DataManager = {
    init() {
        if (!localStorage.getItem('lifelink_users')) {
            localStorage.setItem('lifelink_users', JSON.stringify(MOCK_DONORS));
        }
        if (!localStorage.getItem('lifelink_requests')) {
            localStorage.setItem('lifelink_requests', JSON.stringify(MOCK_REQUESTS));
        }
    },

    getDonors() {
        return JSON.parse(localStorage.getItem('lifelink_users') || '[]').filter(u => u.type === 'donor');
    },

    getRequests() {
        return JSON.parse(localStorage.getItem('lifelink_requests') || '[]');
    },

    addRequest(request) {
        const requests = this.getRequests();
        request.id = 'r' + (requests.length + 1);
        request.date = new Date().toISOString().split('T')[0];
        requests.unshift(request); // Add to top
        localStorage.setItem('lifelink_requests', JSON.stringify(requests));
        return request;
    },
    
    // Calculate distance between two points in km
    getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c; // Distance in km
        return d.toFixed(1);
    },

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }
};

// Initialize data on load
DataManager.init();
