// src/components/Api.js
import axios from "axios";

// Buat instance axios dengan konfigurasi default untuk API Anda
const api = axios.create({
    baseURL: "http://localhost:5000/api",  // Ganti dengan base URL backend Anda
});

// Interceptor request untuk menambahkan token ke header Authorization
api.interceptors.request.use(
    (config) => {
        // Mengambil objek user dari localStorage dan parsing ke JSON
        const user = localStorage.getItem("user");
        const userParsed = user ? JSON.parse(user) : null;
        const token = userParsed ? userParsed.token : null; // Mendapatkan token dari objek user

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;  // Menyertakan token di header Authorization
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
