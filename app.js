// Main App Logic

const app = {
    currentPage: 'home',
    root: document.getElementById('app-root'),
    navLinks: document.getElementById('nav-links'),
    mobileNavLinks: document.getElementById('mobile-nav-links'),

    init() {
        this.renderNav();
        this.navigate('home');
    },

    navigate(page, params = {}) {
        this.currentPage = page;
        window.scrollTo(0, 0);
        this.render(page, params);
        this.renderNav();
    },

    renderNav() {
        const user = Auth.getUser();
        let links = [];
        let mobileLinks = [];

        if (user) {
            const dashboardLink = user.type === 'donor' ? 'donor-dashboard' : 'requester-dashboard';
            links = [
                { label: 'Home', action: "app.navigate('home')" },
                { label: 'Dashboard', action: `app.navigate('${dashboardLink}')` },
                { label: 'Logout', action: "Auth.logout()" }
            ];
        } else {
            links = [
                { label: 'Home', action: "app.navigate('home')" },
                { label: 'Search Blood', action: "app.navigate('search')" },
                { label: 'Login', action: "app.navigate('login')" },
                { label: 'Register', action: "app.navigate('register')" }
            ];
        }

        // Desktop
        this.navLinks.innerHTML = links.map(l =>
            `<button onclick="${l.action}" class="text-slate-600 hover:text-primary font-medium transition">${l.label}</button>`
        ).join('');

        // Mobile
        this.mobileNavLinks.innerHTML = links.map(l =>
            `<button onclick="${l.action}; toggleMobileMenu()" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50">${l.label}</button>`
        ).join('');
    },

    render(page, params) {
        let content = '';

        switch (page) {
            case 'home':
                content = this.views.home();
                break;
            case 'login':
                content = this.views.login();
                break;
            case 'register':
                content = this.views.register();
                break;
            case 'donor-dashboard':
                content = this.views.donorDashboard();
                break;
            case 'requester-dashboard':
                content = this.views.requesterDashboard();
                break;
            case 'search':
                content = this.views.search();
                break;
            default:
                content = this.views.home();
        }

        this.root.innerHTML = content;

        // Post-render hooks
        if (page === 'search' || page === 'requester-dashboard') {
            setTimeout(() => {
                MapManager.init('map-container');
                const donors = DataManager.getDonors().filter(d => d.isAvailable);
                MapManager.showDonors(donors);
            }, 100);
        }
    },

    views: {
        home: () => `
            <!-- Hero Section -->
            <section class="relative bg-white overflow-hidden">
                <div class="max-w-7xl mx-auto">
                    <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div class="sm:text-center lg:text-left">
                                <h1 class="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                                    <span class="block xl:inline">Save a life today</span>
                                    <span class="block text-primary">be a hero.</span>
                                </h1>
                                <p class="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Every 2 seconds someone needs blood. LifeLink connects donors with those in need instantly based on location. Secure, fast, and free.
                                </p>
                                <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div class="rounded-md shadow">
                                        <button onclick="app.navigate('search')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-secondary md:py-4 md:text-lg transition-transform hover:scale-105">
                                            Find Blood
                                        </button>
                                    </div>
                                    <div class="mt-3 sm:mt-0 sm:ml-3">
                                        <button onclick="app.navigate('register')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-red-100 hover:bg-red-200 md:py-4 md:text-lg transition-colors">
                                            Donate Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-100 flex items-center justify-center">
                    <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-90" src="https://images.unsplash.com/photo-1615461066841-6116e61058f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Blood Donation">
                </div>
            </section>

            <!-- Features -->
            <section class="py-12 bg-light">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="lg:text-center">
                        <h2 class="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Why LifeLink?
                        </p>
                    </div>

                    <div class="mt-10">
                        <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            <div class="relative">
                                <dt>
                                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                        <i class="fa-solid fa-map-location-dot"></i>
                                    </div>
                                    <p class="ml-16 text-lg leading-6 font-medium text-slate-900">Location Based</p>
                                </dt>
                                <dd class="mt-2 ml-16 text-base text-slate-500">
                                    Find donors closest to the hospital or your location instantly using real-time maps.
                                </dd>
                            </div>

                            <div class="relative">
                                <dt>
                                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                        <i class="fa-solid fa-bell"></i>
                                    </div>
                                    <p class="ml-16 text-lg leading-6 font-medium text-slate-900">Instant Alerts</p>
                                </dt>
                                <dd class="mt-2 ml-16 text-base text-slate-500">
                                    Notify all nearby donors with a single click in case of emergencies.
                                </dd>
                            </div>

                            <div class="relative">
                                <dt>
                                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                        <i class="fa-solid fa-shield-halved"></i>
                                    </div>
                                    <p class="ml-16 text-lg leading-6 font-medium text-slate-900">Secure & Private</p>
                                </dt>
                                <dd class="mt-2 ml-16 text-base text-slate-500">
                                    Donor details are kept private until they accept a request.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>
        `,

        login: () => `
            <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div class="max-w-md w-full space-y-8 glass p-8 rounded-xl shadow-lg">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
                    </div>
                    <form class="mt-8 space-y-6" onsubmit="handleLogin(event)">
                        <div class="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input id="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Email address">
                            </div>
                            <div>
                                <input id="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Password">
                            </div>
                        </div>

                        <div id="login-error" class="text-red-500 text-sm hidden text-center"></div>

                        <div>
                            <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Sign in
                            </button>
                        </div>
                    </form>
                    <div class="text-center">
                         <button onclick="app.navigate('register')" class="text-sm text-primary hover:text-secondary">Don't have an account? Register</button>
                    </div>
                </div>
            </div>
        `,

        register: () => `
            <div class="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div class="max-w-md w-full space-y-8 glass p-8 rounded-xl shadow-lg">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Create an account</h2>
                    </div>
                    <form class="mt-8 space-y-4" onsubmit="handleRegister(event)">
                        <div>
                            <label class="block text-sm font-medium text-slate-700">I want to...</label>
                            <select id="userType" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                <option value="donor">Donate Blood</option>
                                <option value="requester">Request Blood</option>
                            </select>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <input id="reg-name" type="text" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Full Name">
                            <select id="reg-blood" class="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <input id="reg-email" type="email" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Email Address">
                        <input id="reg-phone" type="tel" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Phone Number">
                        <input id="reg-city" type="text" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="City">
                        <input id="reg-password" type="password" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Password">

                        <div>
                            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `,

        donorDashboard: () => {
            const user = Auth.getUser();
            if (!user || user.type !== 'donor') return app.views.login();

            return `
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 class="text-3xl font-bold text-slate-900 mb-6">Welcome, ${user.name} 👋</h1>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <!-- Status Card -->
                        <div class="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 ${user.isAvailable ? 'border-green-500' : 'border-red-500'}">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fa-solid fa-power-off text-2xl text-slate-400"></i>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-slate-500 truncate">Availability Status</dt>
                                        <dd>
                                            <div class="text-lg font-medium text-slate-900">${user.isAvailable ? 'Available to Donate' : 'Unavailable'}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                             <div class="mt-4">
                                <button onclick="toggleAvailability()" class="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 py-1 px-2 rounded text-sm transition">Change Status</button>
                            </div>
                        </div>

                        <!-- Requests Card -->
                        <div class="bg-white overflow-hidden shadow rounded-lg p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fa-solid fa-bell text-2xl text-primary"></i>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-slate-500 truncate">Emergency Requests</dt>
                                        <dd>
                                            <div class="text-lg font-medium text-slate-900">0 Nearby</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 class="text-xl font-bold text-slate-800 mb-4">Nearby Emergency Requests</h2>
                    <div class="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" class="divide-y divide-slate-200">
                             <li class="px-4 py-4 sm:px-6 text-center text-slate-500 text-sm">No urgent requests in your area right now.</li>
                        </ul>
                    </div>
                </div>
             `;
        },

        search: () => `
             <div class="h-[calc(100vh-64px)] flex flex-col md:flex-row">
                <!-- Sidebar -->
                <div class="w-full md:w-1/3 bg-white p-4 shadow-lg z-10 overflow-y-auto">
                    <h2 class="text-2xl font-bold text-slate-800 mb-4">Find Blood</h2>
                    
                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-700">Blood Group</label>
                            <select id="search-blood" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border" onchange="filterDonors()">
                                <option value="all">All Groups</option>
                                <option value="A+">A+</option>
                                <option value="O+">O+</option>
                                <option value="B+">B+</option>
                                <option value="AB+">AB+</option>
                                <option value="A-">A-</option>
                                <option value="O-">O-</option>
                                <option value="B-">B-</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                        <button onclick="filterDonors()" class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition">Apply Filter</button>
                    </div>

                    <div id="donor-list" class="space-y-4">
                        <!-- Donor Cards injected here -->
                    </div>
                </div>

                <!-- Map -->
                <div id="map-container" class="w-full md:w-2/3 h-64 md:h-full bg-slate-200"></div>
             </div>
        `,

        requesterDashboard: () => {
            const user = Auth.getUser();
            if (!user) return app.views.login();
            // Re-use search view essentially but wrapped
            return app.views.search();
        }
    },

    contactDonor(donorId) {
        alert("Contacting donor " + donorId + ". Feature would open SMS/Call in production.");
    }
};

// Handlers that need to be global for HTML event attributes
window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
};

window.handleLogin = function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = Auth.login(email, password);
    if (result.success) {
        const dashboardLink = result.user.type === 'donor' ? 'donor-dashboard' : 'requester-dashboard';
        app.navigate(dashboardLink);
    } else {
        const err = document.getElementById('login-error');
        err.innerText = result.message;
        err.classList.remove('hidden');
    }
};

window.handleRegister = function (e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        phone: document.getElementById('reg-phone').value,
        bloodGroup: document.getElementById('reg-blood').value,
        city: document.getElementById('reg-city').value,
        type: document.getElementById('userType').value,
        password: document.getElementById('reg-password').value,
        isAvailable: true,
        lastDonation: null
    };

    const result = Auth.register(data);
    if (result.success) {
        const dashboardLink = data.type === 'donor' ? 'donor-dashboard' : 'requester-dashboard';
        app.navigate(dashboardLink);
    } else {
        alert(result.message);
    }
};

window.toggleAvailability = function () {
    const user = Auth.getUser();
    user.isAvailable = !user.isAvailable;
    Auth.setCurrentUser(user);
    app.navigate('donor-dashboard'); // re-render
};

window.filterDonors = function () {
    const group = document.getElementById('search-blood').value;
    const list = document.getElementById('donor-list');

    const donors = DataManager.getDonors().filter(d => d.isAvailable);
    const filtered = group === 'all' ? donors : donors.filter(d => d.bloodGroup === group);

    // Update Map
    MapManager.showDonors(filtered);

    // Update List
    list.innerHTML = filtered.map(d => `
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition cursor-pointer" onclick="MapManager.flyTo(${d.lat}, ${d.lng})">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-slate-800">${d.name}</h3>
                    <p class="text-sm text-slate-500">${d.city}</p>
                </div>
                <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">${d.bloodGroup}</span>
            </div>
            <div class="mt-3 flex justify-between items-center">
                <span class="text-xs text-slate-400">Last donated: ${d.lastDonation || 'Never'}</span>
                <button onclick="app.contactDonor('${d.id}')" class="text-primary hover:text-secondary text-sm font-medium">Contact</button>
            </div>
        </div>
    `).join('');

    if (filtered.length === 0) {
        list.innerHTML = `<div class="text-center text-slate-500 py-4">No donors found.</div>`;
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
