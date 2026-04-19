import axios from 'axios';

const BASE = 'https://todo-api-oyhv.onrender.com';

const api = axios.create({
    baseURL: BASE
});

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
        const result = await api.post(BASE + '/login', { username, password });
        return result.data;
    },
    register: async (username, password) => {
        const result = await api.post(BASE + '/register', { username, password });
        return result.data;
    },
    getTasks: async () => {
        try {
            const result = await api.get(BASE + '/items');
            return Array.isArray(result.data) ? result.data : [];
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            return [];
        }
    },
    addTask: async (name) => {
        const result = await api.post(BASE + '/items', { name: name, isComplete: false });
        return result.data;
    },
    setCompleted: async (id, isComplete, name) => {
        const result = await api.put(BASE + `/items/${id}`, { id: id, name: name, isComplete: isComplete });
        return result.data;
    },
    deleteTask: async (id) => {
        const result = await api.delete(BASE + `/items/${id}`);
        return result.data;
    }
};

export default service;
