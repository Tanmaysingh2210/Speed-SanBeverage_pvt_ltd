import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:3000',
    baseURL: 'https://speed-sanbeverage-pvt-ltd-ojt3.onrender.com',
    withCredentials: true, // send/receive cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;