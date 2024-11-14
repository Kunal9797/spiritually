import axios from 'axios';

const API_URL = 'http://localhost:8001';

class AuthService {
    async login(email, password) {
        const formData = new FormData();
        formData.append('username', email);  // FastAPI expects 'username'
        formData.append('password', password);
        
        const response = await axios.post(`${API_URL}/token`, formData);
        if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }

    async register(userData) {
        return axios.post(`${API_URL}/register`, userData);
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    getToken() {
        const user = this.getCurrentUser();
        return user?.access_token;
    }
}

export default new AuthService();