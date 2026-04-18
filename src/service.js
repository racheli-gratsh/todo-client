import axios from 'axios';

// יצירת מופע ייעודי עם הכתובת של השרת
const apiClient = axios.create({
    baseURL: "https://todo-api-oyhv.onrender.com",
    headers: {
        'Content-Type': 'application/json'
    }
});

// הוספת ה-Token לכל בקשה דרך המופע החדש
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// טיפול בשגיאות 401
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

const service = {
    getTasks: async () => {
        // שים לב: משתמשים ב-apiClient במקום ב-axios
        const result = await apiClient.get('/items');
        return Array.isArray(result.data) ? result.data : [];
    },
    addTask: async (name) => {
        const result = await apiClient.post('/items', { name, isComplete: false });
        return result.data;
    },
    setCompleted: async (id, isComplete, name) => {
        const result = await apiClient.put(`/items/${id}`, { id, name, isComplete });
        return result.data;
    },
    deleteTask: async (id) => {
        const result = await apiClient.delete(`/items/${id}`);
        return result.data;
    }
};

export default service;