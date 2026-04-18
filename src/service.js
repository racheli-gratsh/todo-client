import axios from 'axios';

const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
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

// שמרנו את הכתובת במשתנה ברור
const API_URL = "https://todo-api-oyhv.onrender.com";

const service = {
    getTasks: async () => {
        try {
            // הזרקה ישירה של הכתובת המלאה לתוך הבקשה!
            const result = await apiClient.get(`${API_URL}/items`);
            return Array.isArray(result.data) ? result.data : [];
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            return [];
        }
    },

    addTask: async (name) => {
        const result = await apiClient.post(`${API_URL}/items`, { name: name, isComplete: false });
        return result.data;
    },

    setCompleted: async (id, isComplete, name) => {
        const result = await apiClient.put(`${API_URL}/items/${id}`, { id: id, name: name, isComplete: isComplete });
        return result.data;
    },

    deleteTask: async (id) => {
        const result = await apiClient.delete(`${API_URL}/items/${id}`);
        return result.data;
    }
};

export default service;