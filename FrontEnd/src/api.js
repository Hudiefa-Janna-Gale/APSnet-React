import axios from "axios";

// Halkan kaliya ayaa lagu beddelaa cinwaanka API-ga (backend-ka)
const api = axios.create({
  baseURL: "http://localhost:5184/api",
});

// INTERCEPTOR: request KASTA ka hor inta uusan bixin,
// ku dar token-ka JWT header-ka "Authorization".
// Sidaas ayuu backend-ku ku garanayaa yaa codsanaya (authentication).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shopToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTOR: haddii jawaabtu tahay 401 (token dhacay ama la'aan),
// user-ka ka saar oo u dir bogga login-ka.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("shopToken")) {
      localStorage.removeItem("shopToken");
      localStorage.removeItem("shopUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
