import { useState } from "react"
import { Users, Plus, Trash2, Pencil, UserCheck } from "lucide-react"
import { Input, Select, Checkbox, SectionTitle, FieldGrid } from "../ui/FormField"
import ModalFormulario from "../ui/ModalFormulario"
import { SEXO, PARENTESCO } from "../../utils/constants"
import { useValidacion } from "../../hooks/useValidacion"
import { mostrarErroresPaso } from "../ui/ToastErrores"

// ── Familiar vacío ─────────────────────────────────────────
const FAMILIAR_VACIO = {
  apellido_paterno:    "",
  apellido_materno:    "",
  nombres:             "",
  parentesco:          "",
  dni:                 "",
  fecha_nacimiento:    "",
  sexo:                "",
  nac_pais:            "Perú",
  nac_departamento:    "",
  nac_provincia:       "",
  nac_distrito:        "",
  nac_anexo:           "",
  vive_con_trabajador: false,
}

// ── Reglas de validación ───────────────────────────────────
const reglasFamiliar = {
  apellido_paterno: {
    requerido: true, minLength: 2,
    mensajeRequerido: "Apellido paterno es obligatorio",
  },
  apellido_materno: {
    requerido: true, minLength: 2,
    mensajeRequerido: "Apellido materno es obligatorio",
  },
  nombres: {
    requerido: true, minLength: 2,
    mensajeRequerido: "Nombres son obligatorios",
  },
  parentesco: {
    requerido: true,
    mensajeRequerido: "Seleccione el parentesco",
  },
  dni: {
    requerido: false,
    patron: /^\d{8}$/,
    mensajePatron: "DNI debe tener 8 dígitos",
  },
}

// ── Formulario dentro del modal ────────────────────────────
function FormFamiliar({ item, onChange }) {
  const tocadosIniciales = Object.fromEntries(
    Object.keys(reglasFamiliar).map((k) => [k, !!item[k]])
  )
  const { props: vProps } = useValidacion(reglasFamiliar, tocadosIniciales)

  const campo = (nombre) => ({
    value: item[nombre] ?? "",
    ...vProps(nombre, item[nombre]),
    onChange: (e) => {
      const val = e.target.type === "checkbox" ? e.target.checked : e.target.value
      vProps(nombre, item[nombre]).onChange(e)
      onChange(nombre, val)
    },
  })

  return (
    <div className="space-y-4">
      {/* Datos principales */}
      <FieldGrid cols={3}>
        <Input label="Apellido Paterno" required
          placeholder="Ej: García" {...campo("apellido_paterno")} />
        <Input label="Apellido Materno" required
          placeholder="Ej: López" {...campo("apellido_materno")} />
        <Input label="Nombres" required
          placeholder="Ej: María" {...campo("nombres")} />
      </FieldGrid>

      <FieldGrid cols={3}>
        <Select label="Parentesco" required opciones={PARENTESCO}
          {...campo("parentesco")} />
        <Input label="DNI" maxLength={8} placeholder="12345678"
          {...campo("dni")}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "")
            vProps("dni", item.dni).onChange({
              ...e, target: { ...e.target, value: val }
            })
            onChange("dni", val)
          }}
        />
        <Select label="Sexo" opciones={SEXO}
          value={item.sexo ?? ""}
          onChange={(e) => onChange("sexo", e.target.value)}
          tocado={!!item.sexo} valido={!!item.sexo}
        />
      </FieldGrid>

      <FieldGrid cols={2}>
        <Input label="Fecha de Nacimiento" type="date"
          value={item.fecha_nacimiento ?? ""}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => onChange("fecha_nacimiento", e.target.value)}
          tocado={!!item.fecha_nacimiento}
          valido={!!item.fecha_nacimiento &&
            item.fecha_nacimiento <= new Date().toISOString().split("T")[0]}
          error={item.fecha_nacimiento &&
            item.fecha_nacimiento > new Date().toISOString().split("T")[0]
            ? "La fecha de nacimiento no puede ser futura" : ""}
        />
        <div className="flex items-end pb-1">
          <Checkbox label="Vive con el trabajador"
            checked={item.vive_con_trabajador}
            onChange={(e) => onChange("vive_con_trabajador", e.target.checked)}
          />
        </div>
      </FieldGrid>

      {/* Lugar de nacimiento */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase
                      tracking-wide mb-3">
          Lugar de Nacimiento
        </p>
        <FieldGrid cols={2}>
          <Input label="País"
            value={item.nac_pais ?? ""}
            onChange={(e) => onChange("nac_pais", e.target.value)}
            tocado={!!item.nac_pais} valido={!!item.nac_pais}
          />
          <Input label="Departamento" placeholder="Ej: Apurímac"
            value={item.nac_departamento ?? ""}
            onChange={(e) => onChange("nac_departamento", e.target.value)}
            tocado={!!item.nac_departamento} valido={!!item.nac_departamento}
          />
          <Input label="Provincia" placeholder="Ej: Abancay"
            value={item.nac_provincia ?? ""}
            onChange={(e) => onChange("nac_provincia", e.target.value)}
            tocado={!!item.nac_provincia} valido={!!item.nac_provincia}
          />
          <Input label="Distrito" placeholder="Ej: Abancay"
            value={item.nac_distrito ?? ""}
            onChange={(e) => onChange("nac_distrito", e.target.value)}
            tocado={!!item.nac_distrito} valido={!!item.nac_distrito}
          />
          <Input label="Anexo / Centro Poblado" placeholder="Opcional"
            value={item.nac_anexo ?? ""}
            onChange={(e) => onChange("nac_anexo", e.target.value)}
            tocado={!!item.nac_anexo} valido={!!item.nac_anexo}
          />
        </FieldGrid>
      </div>
    </div>
  )
}

// ── Card compacta de familiar en la lista ──────────────────
function FamiliarRow({ familiar, index, onEditar, onEliminar }) {
  const nombre = familiar.nombres && familiar.apellido_paterno
    ? `${familiar.apellido_paterno} ${familiar.apellido_materno}, ${familiar.nombres}`
    : `Familiar ${index + 1}`

  const colorParentesco = {
    "Cónyuge": "bg-purple-100 text-purple-700",
    "Hijo":    "bg-blue-100 text-blue-700",
    "Hija":    "bg-blue-100 text-blue-700",
    "Padre":   "bg-amber-100 text-amber-700",
    "Madre":   "bg-amber-100 text-amber-700",
  }

  return (
    <div className="flex items-center justify-between px-4 py-3
                    border border-slate-200 rounded-xl hover:border-slate-300
                    hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center
                        justify-center shrink-0">
          <UserCheck size={14} className="text-primary-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {nombre}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {familiar.parentesco && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${colorParentesco[familiar.parentesco] || "bg-slate-100 text-slate-600"}`}>
                {familiar.parentesco}
              </span>
            )}
            {familiar.dni && (
              <span className="text-xs text-slate-400">
                DNI: {familiar.dni}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEditar(index)}
          className="p-1.5 text-primary-400 hover:text-primary-600
                     hover:bg-primary-50 rounded-lg transition-colors"
          title="Editar familiar"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onEliminar(index)}
          className="p-1.5 text-red-400 hover:text-red-600
                     hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar familiar"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────
export default function Step3Familiares({ datos, onChange }) {
  // ── Estado del modal ───────────────────────────────────
  const [modalVisible, setModalVisible]   = useState(false)
  const [itemActual,   setItemActual]     = useState(null)
  const [indexActual,  setIndexActual]    = useState(null)

  const tieneConyuge = datos.some((f) => f.parentesco === "Cónyuge")

  // ── Abrir modal para agregar ───────────────────────────
  const handleAgregar = () => {
    setItemActual({ ...FAMILIAR_VACIO })
    setIndexActual(null)
    setModalVisible(true)
  }

  // ── Abrir modal para editar ────────────────────────────
  const handleEditar = (index) => {
    setItemActual({ ...datos[index] })
    setIndexActual(index)
    setModalVisible(true)
  }

  // ── Actualizar campo dentro del modal ──────────────────
  const handleCampoModal = (campo, valor) => {
    setItemActual((prev) => ({ ...prev, [campo]: valor }))
  }

  // ── Guardar desde el modal ─────────────────────────────
  const handleGuardar = () => {
    const errores = []
    if (!itemActual.apellido_paterno?.trim())
      errores.push("Apellido paterno es obligatorio")
    if (!itemActual.apellido_materno?.trim())
      errores.push("Apellido materno es obligatorio")
    if (!itemActual.nombres?.trim())
      errores.push("Nombres son obligatorios")
    if (!itemActual.parentesco)
      errores.push("Parentesco es obligatorio")
    if (itemActual.dni && !/^\d{8}$/.test(itemActual.dni))
      errores.push("DNI debe tener 8 dígitos")

    // Validar fecha de nacimiento del familiar
    if (itemActual.fecha_nacimiento) {
      const hoy  = new Date()
      const fnac = new Date(itemActual.fecha_nacimiento)
      if (fnac > hoy)
        errores.push("La fecha de nacimiento del familiar no puede ser futura")
      else {
        const edad = hoy.getFullYear() - fnac.getFullYear()
        const cumple = new Date(hoy.getFullYear(), fnac.getMonth(), fnac.getDate())
        const edadExacta = hoy >= cumple ? edad : edad - 1
        if (edadExacta > 120)
          errores.push("Verifique la fecha de nacimiento del familiar")
      }
    }

    // Bloquear cónyuge duplicado — solo se permite uno
    if (itemActual.parentesco === "Cónyuge" && indexActual === null) {
      const yaExisteConyuge = datos.some((f) => f.parentesco === "Cónyuge")
      if (yaExisteConyuge) {
        errores.push("Ya registró un cónyuge. Solo se permite uno por trabajador.")
      }
    }

    if (errores.length > 0) {
      mostrarErroresPaso(errores, "Datos del familiar")
      return
    }
    if (indexActual !== null) {
      const lista = [...datos]
      lista[indexActual] = itemActual
      onChange("familiares", null, lista)
    } else {
      onChange("familiares", null, [...datos, itemActual])
    }
    setModalVisible(false)
    setItemActual(null)
    setIndexActual(null)
  }

  // ── Cancelar modal ─────────────────────────────────────
  const handleCancelar = () => {
    setModalVisible(false)
    setItemActual(null)
    setIndexActual(null)
  }

  // ── Eliminar ───────────────────────────────────────────
  const handleEliminar = (index) => {
    onChange("familiares", null, datos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-5">
      <div className="form-card">
        <SectionTitle
          icono={Users}
          titulo="Familiares y Derecho Habientes"
          subtitulo="Cónyuge, hijos, padres — beneficiarios de seguros y pensiones"
        />

        {/* Aviso cónyuge */}
        {tieneConyuge && (
          <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200
                          rounded-lg text-xs text-blue-700">
            ℹ️ Ya registró un cónyuge. Solo se permite uno por trabajador.
          </div>
        )}

        {/* Estado vacío */}
        {datos.length === 0 && (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center
                            justify-center mx-auto">
              <Users size={24} className="text-slate-300" />
            </div>
            <p className="text-sm text-slate-500">
              No hay familiares registrados aún
            </p>
            <p className="text-xs text-slate-400">
              Agregue a su cónyuge, hijos y padres como derecho habientes
            </p>
          </div>
        )}

        {/* Lista de familiares */}
        {datos.length > 0 && (
          <div className="space-y-2 mb-4">
            {datos.map((familiar, index) => (
              <FamiliarRow
                key={index}
                familiar={familiar}
                index={index}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            ))}
          </div>
        )}

        {/* Botón agregar */}
        <div className={datos.length > 0 ? "pt-4 border-t border-slate-100" : "mt-4"}>
          <button
            type="button"
            onClick={handleAgregar}
            className="btn-secondary w-full justify-center gap-2"
          >
            <Plus size={15} />
            Agregar familiar
          </button>
        </div>
      </div>

      {/* Resumen */}
      {datos.length > 0 && (
        <div className="form-card bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase
                        tracking-wide mb-3">
            Resumen — {datos.length} familiar{datos.length !== 1 ? "es" : ""} registrado{datos.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {datos.map((f, i) => (
              <div key={i}
                className="flex items-center justify-between text-xs
                           py-1.5 border-b border-slate-200 last:border-0">
                <span className="text-slate-700 font-medium">
                  {f.nombres || "—"} {f.apellido_paterno || ""}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-semibold text-xs
                  ${f.parentesco === "Cónyuge" ? "bg-purple-100 text-purple-700" :
                    f.parentesco === "Hijo" || f.parentesco === "Hija"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                  {f.parentesco || "Sin parentesco"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────── */}
      {itemActual && (
        <ModalFormulario
          visible={modalVisible}
          titulo={indexActual !== null ? "Editar familiar" : "Agregar familiar"}
          subtitulo="Complete los datos del familiar o derecho habiente"
          esEdicion={indexActual !== null}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        >
          <FormFamiliar
            item={itemActual}
            onChange={handleCampoModal}
          />
        </ModalFormulario>
      )}
    </div>
  )
}