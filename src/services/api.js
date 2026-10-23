import axios from "axios";

// Instância do Axios conforme orientação do professor
const api = axios.create({
  baseURL: "https://api-chamados.jefersonqueiroga.com.br",
  headers: {
    "X-API-Key": import.meta.env.VITE_API_KEY,
  },
});

export default api;
