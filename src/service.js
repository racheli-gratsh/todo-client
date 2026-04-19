import axios from 'axios';
 
const api = axios.create({
    baseURL: 'https://todo-api-oyhv.onrender.com'
});
 
api.defaults.headers.post['Content-Type'] = 'application/json';
api.defaults.headers.put['Content-Type'] = 'application/json';
 
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
 
api.interceptors.response.use(
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
    login: async (username, password) => {
        const result = await api.post('/login', { username, password });
        return result.data;
    },
    register: async (username, password) => {
        const result = await api.post('/register', { username, password });
        return result.data;
    },
    getTasks: async () => {
        try {
            const result = await api.get('/items');
            return Array.isArray(result.data) ? result.data : [];
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            return [];
        }
    },
    addTask: async (name) => {
        const result = await api.post('/items', { name: name, isComplete: false });
        return result.data;
    },
    setCompleted: async (id, isComplete, name) => {
        const result = await api.put(`/items/${id}`, { id: id, name: name, isComplete: isComplete });
        return result.data;
    },
    deleteTask: async (id) => {
        const result = await api.delete(`/items/${id}`);
        return result.data;
    }
};
 
export default service;