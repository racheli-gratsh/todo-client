import axios from 'axios';

const api = axios.create();

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
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
    login: (u, p) => api.post('/api/login', { username: u, password: p }).then(r => r.data),
    register: (u, p) => api.post('/api/register', { username: u, password: p }).then(r => r.data),
    getTasks: () => api.get('/api/items').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
    addTask: (name) => api.post('/api/items', { name, isComplete: false }).then(r => r.data),
    setCompleted: (id, isComplete, name) => api.put('/api/items/' + id, { id, name, isComplete }).then(r => r.data),
    deleteTask: (id) => api.delete('/api/items/' + id).then(r => r.data)
};

export default service;
