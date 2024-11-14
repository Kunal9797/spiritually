import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with auth header
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

class ApiService {
    async getUserProfile() {
        return api.get('/auth/profile');
    }

    async updateUserProfile(userData) {
        return api.put('/auth/profile', userData);
    }

    async getReadings() {
        return api.get('/users/me/readings');
    }

    async getReading(id) {
        return api.get(`/readings/${id}`);
    }

    async createReading(readingData) {
        return api.post('/get-advice', readingData);
    }

    async deleteAccount() {
        return api.delete('/users/me');
    }
}

export default new ApiService();