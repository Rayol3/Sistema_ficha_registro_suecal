import { useState } from "react"

const SESSION_KEY = "unamba_bienvenida_vista"

export function useModalBienvenida() {
  // Usar sessionStorage para que aparezca una vez por sesión
  // (se resetea al cerrar la pestaña, pero no al recargar)
  const yaVisto = sessionStorage.getItem(SESSION_KEY) === "true"

  const [mostrar, setMostrar] = useState(!yaVisto)

  const cerrar = () => {
    sessionStorage.setItem(SESSION_KEY, "true")
    setMostrar(false)
  }

  return { mostrar, cerrar }
}