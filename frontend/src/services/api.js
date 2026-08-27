import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
})

// ── Interceptor: manejo global de errores ──────────────────
const MAX_REINTENTOS = 2
const DELAY_REINTENTO = 3000 // 3 segundos entre reintentos

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config

    // Solo reintentar en errores de red o timeout (no en errores 4xx)
    const esErrorRed = !error.response
    const esTimeout  = error.code === "ECONNABORTED"

    if ((esErrorRed || esTimeout) && config && !config._reintentando) {
      config._reintentos = config._reintentos || 0

      if (config._reintentos < MAX_REINTENTOS) {
        config._reintentos++
        config._reintentando = false

        // Esperar antes de reintentar
        await new Promise((r) => setTimeout(r, DELAY_REINTENTO))

        try {
          return await api(config)
        } catch {
          // Si falla el reintento, continúa al manejo de error normal
        }
      }
    }

    const msg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (esTimeout
        ? "El servidor tardó demasiado. Intente nuevamente."
        : "Error de conexión con el servidor. Verifique su internet.")

    return Promise.reject(new Error(
      Array.isArray(msg)
        ? msg.map((e) => e.msg).join(", ")
        : msg
    ))
  }
)

// ── Personal ───────────────────────────────────────────────
export const personalService = {

  crear: async (ficha) => {
    const { data } = await api.post("/api/personal/", ficha)
    return data
  },

  obtenerPorId: async (id) => {
    const { data } = await api.get(`/api/personal/${id}`)
    return data
  },

  obtenerPorDni: async (dni) => {
    const { data } = await api.get(`/api/personal/dni/${dni}`)
    return data
  },

  listar: async () => {
    const { data } = await api.get("/api/personal/")
    return data
  },

  actualizar: async (id, ficha) => {
    const { data } = await api.put(`/api/personal/${id}`, ficha)
    return data
  },
}

// ── Fotos ──────────────────────────────────────────────────
export const fotosService = {

  subir: async (personalId, archivo) => {
    const formData = new FormData()
    formData.append("archivo", archivo)
    const { data } = await api.post(
      `/api/fotos/${personalId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    return data
  },

  eliminar: async (personalId) => {
    const { data } = await api.delete(`/api/fotos/${personalId}`)
    return data
  },
}

// ── Health check ───────────────────────────────────────────
export const checkBackend = async () => {
  const { data } = await api.get("/health")
  return data
}

// ── Keep-alive: mantiene el servidor despierto ─────────────
// Hace un ping cada 10 minutos mientras el usuario está en la página
let keepAliveInterval = null

export const iniciarKeepAlive = () => {
  if (keepAliveInterval) return // ya está corriendo
  keepAliveInterval = setInterval(async () => {
    try {
      await api.get("/health", { timeout: 5000 })
    } catch {
      // silencioso — no interrumpe al usuario
    }
  }, 10 * 60 * 1000) // cada 10 minutos
}

export const detenerKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval)
    keepAliveInterval = null
  }
}

export default api