import { useState, useCallback } from "react"

export function useValidacion(reglas = {}, tocadosExternos = {}) {
  const [errores,       setErrores]       = useState({})
  const [tocadosLocales, setTocadosLocales] = useState({})

  // Combinar tocados externos (persistidos) con locales
  const tocados = { ...tocadosExternos, ...tocadosLocales }

  const marcarTocado = useCallback((campo) => {
    setTocadosLocales((prev) => ({ ...prev, [campo]: true }))
  }, [])

  const validarCampo = useCallback((campo, valor) => {
    const regla = reglas[campo]
    if (!regla) return ""

    if (regla.requerido) {
      const vacio = valor === "" || valor === null ||
                    valor === undefined ||
                    (typeof valor === "string" && !valor.trim())
      if (vacio) return regla.mensajeRequerido || `${campo} es obligatorio`
    }

    if (regla.patron && valor) {
      if (!regla.patron.test(valor)) {
        return regla.mensajePatron || "Formato inválido"
      }
    }

    if (regla.minLength && valor && valor.length < regla.minLength) {
      return `Mínimo ${regla.minLength} caracteres`
    }

    if (regla.length && valor && valor.length !== regla.length) {
      return `Debe tener exactamente ${regla.length} caracteres`
    }

    if (regla.validar && valor) {
      const resultado = regla.validar(valor)
      if (resultado !== true) return resultado
    }

    return ""
  }, [reglas])

  const validar = useCallback((campo, valor) => {
    const error = validarCampo(campo, valor)
    setErrores((prev) => ({ ...prev, [campo]: error }))
    setTocadosLocales((prev) => ({ ...prev, [campo]: true }))
    return error === ""
  }, [validarCampo])

  const validarTodo = useCallback((datos) => {
    const nuevosErrores  = {}
    const nuevosTocados  = {}
    let esValido = true

    Object.keys(reglas).forEach((campo) => {
      const error = validarCampo(campo, datos[campo])
      nuevosErrores[campo] = error
      nuevosTocados[campo] = true
      if (error) esValido = false
    })

    setErrores(nuevosErrores)
    setTocadosLocales(nuevosTocados)
    return esValido
  }, [reglas, validarCampo])

  const props = useCallback((campo, valor) => {
    const estaTocado = tocados[campo] || false
    const error      = errores[campo] || ""
    const valido     = estaTocado && !error &&
                       valor !== "" && valor !== null && valor !== undefined

    return {
      error,
      tocado: estaTocado,
      valido,
      onBlur: () => {
        marcarTocado(campo)
        const e = validarCampo(campo, valor)
        setErrores((prev) => ({ ...prev, [campo]: e }))
      },
      onChange: (e) => {
        const nuevoValor = e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value
        marcarTocado(campo)
        const error = validarCampo(campo, nuevoValor)
        setErrores((prev) => ({ ...prev, [campo]: error }))
        return nuevoValor
      },
    }
  }, [errores, tocados, marcarTocado, validarCampo])

  return {
    errores,
    tocados,
    validar,
    validarTodo,
    marcarTocado,
    props,
  }
}