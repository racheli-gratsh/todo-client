import axios from 'axios';

// 1. יצירת מופע ייעודי (Instance) עם הכתובת המדויקת של השרת
const apiClient = axios.create({
    baseURL: "https://todo-api-oyhv.onrender.com",
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. הוספת ה-Token לכל בקשה שיוצאת דרך המופע החדש
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 3. טיפול בשגיאות 401 (ניתוק משתמש לא מורשה) דרך המופע החדש
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

const service = {
    getTasks: async () => {
        try {
            // שים לב: כאן ובכל הפונקציות למטה משתמשים ב-apiClient במקום ב-axios
            const result = await apiClient.get('/items');
            return Array.isArray(result.data) ? result.data : [];
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            return [];
        }
    },

    addTask: async (name) => {
        const result = await apiClient.post('/items', { name: name, isComplete: false });
        return result.data;
    },

    setCompleted: async (id, isComplete, name) => {
        const result = await apiClient.put(`/items/${id}`, { id: id, name: name, isComplete: isComplete });
        return result.data;
    },

    deleteTask: async (id) => {
        const result = await apiClient.delete(`/items/${id}`);
        return result.data;
    }
};

export default service;