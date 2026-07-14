import axios from "axios";

// Halkan kaliya ayaa lagu beddelaa cinwaanka API-ga (backend-ka)
const api = axios.create({
  baseURL: "http://localhost:5184/api",
});

export default api;
