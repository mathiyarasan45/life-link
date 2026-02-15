// Auth Logic for LifeLink

const Auth = {
    currentUser: null,

    init() {
        const user = localStorage.getItem('lifelink_current_user');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    },

    login(email, password) {
        // Simulating backend check
        const users = JSON.parse(localStorage.getItem('lifelink_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        // For prototype, we also allow specific mock logins or just any reg user
        // Mock Admin/Demo login
        if (email === 'demo@lifelink.com' && password === 'demo123') {
            const demoUser = {
                id: 'd1',
                name: 'Arun Kumar',
                bloodGroup: 'O+',
                type: 'donor',
                email: 'demo@lifelink.com'
            };
            this.setCurrentUser(demoUser);
            return { success: true, user: demoUser };
        }

        if (user) {
            this.setCurrentUser(user);
            return { success: true, user };
        }

        return { success: false, message: 'Invalid email or password' };
    },

    register(userData) {
        const users = JSON.parse(localStorage.getItem('lifelink_users') || '[]');

        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        userData.id = 'u' + (users.length + 1);
        // Default lat/long for prototype if not provided (Chennai Center)
        if (!userData.lat) {
            userData.lat = 13.0827 + (Math.random() * 0.05 - 0.025);
            userData.lng = 80.2707 + (Math.random() * 0.05 - 0.025);
        }

        users.push(userData);
        localStorage.setItem('lifelink_users', JSON.stringify(users));

        this.setCurrentUser(userData);
        return { success: true, user: userData };
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('lifelink_current_user');
        window.location.reload(); // Simple reload to reset state
    },

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('lifelink_current_user', JSON.stringify(user));
    },

    isLoggedIn() {
        return !!this.currentUser;
    },

    getUser() {
        return this.currentUser;
    }
};

Auth.init();
