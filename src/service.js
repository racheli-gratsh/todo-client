import axios from 'axios';

const API_URL = 'https://todo-api-oyhv.onrender.com';
axios.defaults.baseURL = API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

// הוסף token לכל בקשה אוטומטית
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// interceptor לתפיסת שגיאה 401
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

const service = {
    getTasks: async () => {
        try {
            const result = await axios.get('/items');
            return Array.isArray(result.data) ? result.data : [];
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            return [];
        }
    },
    addTask: async (name) => {
        const result = await axios.post('/items', { name: name, isComplete: false });
        return result.data;
    },
    setCompleted: async (id, isComplete, name) => {
        const result = await axios.put(`/items/${id}`, { id: id, name: name, isComplete: isComplete });
        return result.data;
    },
    deleteTask: async (id) => {
        const result = await axios.delete(`/items/${id}`);
        return result.data;
    }
};

export default service;