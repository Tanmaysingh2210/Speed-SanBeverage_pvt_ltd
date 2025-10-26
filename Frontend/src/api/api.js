import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // send/receive cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;