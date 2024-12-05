// src/components/Api.js
import axios from "axios";

// Buat instance axios dengan konfigurasi default untuk API
const api = axios.create({
    baseURL: "https://backend-api.larasbasa.com//api",  // Sesuaikan dengan URL backend Anda
});

// Interceptor request untuk menambahkan token ke header Authorization
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem("user");
        const userParsed = user ? JSON.parse(user) : null;
        const token = userParsed ? userParsed.token : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor response untuk menangani refresh token jika access token kadaluarsa
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Jika error 401 dan belum mencoba refresh token, lakukan refresh token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Tandai agar hanya mencoba refresh token sekali

            try {
                // Dapatkan refresh token dari localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                const refreshToken = user ? user.refreshToken : null;

                if (refreshToken) {
                    // Meminta token baru menggunakan refresh token
                    const { data } = await axios.post("https://backend-api.larasbasa.com//api/users/refresh-token", { refreshToken });
                    
                    // Simpan access token baru di localStorage
                    const newAccessToken = data.token;
                    localStorage.setItem("user", JSON.stringify({ ...user, token: newAccessToken }));

                    // Update header Authorization dengan access token yang baru
                    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    // Coba kembali request asli dengan token yang diperbarui
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Jika refresh token gagal, hapus data user dari localStorage dan arahkan ke login
                localStorage.removeItem("user");
                window.location.href = "/login"; // Arahkan ke halaman login
            }
        }

        return Promise.reject(error);
    }
);

export default api;
