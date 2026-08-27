// Servicio API para el panel de administración
import axios from "axios"

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

const adminApi = axios.create({ baseURL: BASE, timeout: 120000 })

// Interceptor: agrega token JWT a cada petición
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor: si el token expiró, redirige al login
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("admin_token")
      window.location.href = "/admin/login"
    }
    return Promise.reject(err)
  }
)

export const authService = {
  login: (usuario, contrasena) =>
    adminApi.post("/auth/login", { usuario, contrasena }),
  logout: () => localStorage.removeItem("admin_token"),
  estaAutenticado: () => !!localStorage.getItem("admin_token"),
}

export const adminService = {
  listarPersonal: (params) =>
    adminApi.get("/admin/personal", { params }),
  obtenerFicha: (id) =>
    adminApi.get(`/admin/personal/${id}`, { timeout: 120000 }),
  eliminarPersonal: (id) =>
    adminApi.delete(`/admin/personal/${id}`),
  exportarExcel: () =>
    adminApi.get("/admin/exportar/excel", {
      responseType: "blob",
      timeout: 120000,
    }),
}

export const solicitudService = {
  // Consultar estado por DNI (público)
  consultarDNI: (dni) =>
    adminApi.get(`/solicitudes/estado/${dni}`),

  // Crear solicitud de actualización (público — sin token)
  crear: (personal_id, motivo) =>
    axios.post(`${BASE}solicitudes`, { personal_id, motivo }),

  // Admin: listar solicitudes
  listar: (estado) =>
    adminApi.get("/admin/solicitudes", { params: estado ? { estado } : {} }),

  // Admin: aprobar o rechazar
  resolver: (id, estado, motivo) =>
    adminApi.put(`/admin/solicitudes/${id}`, { estado, motivo }),

  // Admin: conteo para badge
  conteo: () =>
    adminApi.get("/admin/solicitudes/conteo"),

  cerrar: (personal_id) =>
    axios.post(`${BASE}/solicitudes/cerrar/${personal_id}`),
}