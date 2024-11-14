import axios from 'axios';

const API_URL = 'http://localhost:5001/api';  // Note: Changed from 8001 to 5001 to match your backend

const authService = {
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            birthDetails: {
                date: userData.birth_date,
                time: userData.birth_time,
                location: userData.location
            }
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    getToken: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.token;
    }
};

export default authService;