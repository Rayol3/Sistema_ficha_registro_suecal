import { useState } from "react"
import { Building2, Award, Plus, Trash2, Pencil, Star, Info } from "lucide-react"
import { Input, Select, SectionTitle, FieldGrid } from "../ui/FormField"
import ModalFormulario from "../ui/ModalFormulario"
import { TIPO_PERSONAL } from "../../utils/constants"
import { useValidacion } from "../../hooks/useValidacion"
import { mostrarErroresPaso } from "../ui/ToastErrores"

// ── Reconocimiento vacío ───────────────────────────────────
const RECONOCIMIENTO_VACIO = (orden) => ({
  nombre_entidad: "",
  tipo_reconocimiento: "",
  documento_acredita: "",
  fecha_documento: "",
  orden,
})

// ── Reglas de validación reconocimientos ──────────────────
const reglasReconocimiento = {
  nombre_entidad: {
    requerido: true, minLength: 2,
    mensajeRequerido: "Nombre de la entidad es obligatorio",
  },
  tipo_reconocimiento: {
    requerido: true, minLength: 2,
    mensajeRequerido: "Tipo de reconocimiento es obligatorio",
  },
}

// ── Reglas otras instituciones ────────────────────────────
const reglasOtrasInst = {
  nombre_entidad: {
    requerido: true, minLength: 2,
    mensajeRequerido: "Nombre de la entidad es obligatorio",
  },
  tipo_personal: {
    requerido: true,
    mensajeRequerido: "Tipo de personal es obligatorio",
  },
}

// ── Formulario dentro del modal de reconocimiento ─────────
function FormReconocimiento({ item, onChange }) {
  const tocadosIniciales = Object.fromEntries(
    Object.keys(reglasReconocimiento).map((k) => [k, !!item[k]])
  )
  const { props: vProps } = useValidacion(reglasReconocimiento, tocadosIniciales)

  const campo = (nombre) => ({
    value: item[nombre] ?? "",
    ...vProps(nombre, item[nombre]),
    onChange: (e) => {
      vProps(nombre, item[nombre]).onChange(e)
      onChange(nombre, e.target.value)
    },
  })

  return (
    <div className="space-y-4">
      <Input
        label="Nombre de la Entidad que Otorga" required
        placeholder="Ej: Universidad Nacional Micaela Bastidas"
        {...campo("nombre_entidad")}
      />
      <Input
        label="Tipo de Reconocimiento / Felicitación" required
        placeholder="Ej: Felicitación por labor docente destacada"
        {...campo("tipo_reconocimiento")}
      />
      <FieldGrid cols={2}>
        <Input
          label="Documento que Acredita"
          placeholder="Ej: Resolución N° 089-2022"
          value={item.documento_acredita ?? ""}
          onChange={(e) => onChange("documento_acredita", e.target.value)}
          tocado={!!item.documento_acredita}
          valido={!!item.documento_acredita}
        />
        <Input
          label="Fecha del Documento" type="date"
          value={item.fecha_documento ?? ""}
          onChange={(e) => onChange("fecha_documento", e.target.value)}
          tocado={!!item.fecha_documento}
          valido={!!item.fecha_documento}
        />
      </FieldGrid>
    </div>
  )
}

// ── Card compacta de reconocimiento ───────────────────────
function ReconocimientoRow({ item, index, onEditar, onEliminar }) {
  return (
    <div className="flex items-center justify-between px-4 py-3
                    border border-slate-200 rounded-xl hover:border-slate-300
                    hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center
                        justify-center shrink-0">
          <Star size={14} className="text-amber-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {item.tipo_reconocimiento || `Reconocimiento ${index + 1}`}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {item.nombre_entidad || "Entidad no definida"}
            {item.fecha_documento && ` · ${item.fecha_documento}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button type="button" onClick={() => onEditar(index)}
          className="p-1.5 text-primary-400 hover:text-primary-600
                     hover:bg-primary-50 rounded-lg transition-colors"
          title="Editar">
          <Pencil size={14} />
        </button>
        <button type="button" onClick={() => onEliminar(index)}
          className="p-1.5 text-red-400 hover:text-red-600
                     hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────
export default function Step6Otros({
  otrasInstituciones, reconocimientos,
  onChangeInstituciones, onChangeReconocimientos,
}) {
  const set = (campo, valor) =>
    onChangeInstituciones({ ...otrasInstituciones, [campo]: valor })

  // ── Validación otras instituciones ────────────────────
  const tocadosInstIniciales = Object.fromEntries(
    Object.keys(reglasOtrasInst).map((k) => [k, !!otrasInstituciones[k]])
  )
  const { props: vPropsInst } = useValidacion(
    reglasOtrasInst,
    tocadosInstIniciales
  )

  const campoInst = (nombre) => ({
    value: otrasInstituciones[nombre] ?? "",
    ...vPropsInst(nombre, otrasInstituciones[nombre]),
    onChange: (e) => {
      vPropsInst(nombre, otrasInstituciones[nombre]).onChange(e)
      set(nombre, e.target.value)
    },
  })

  // ── Estado del modal de reconocimientos ───────────────
  const [modal, setModal] = useState({
    visible: false,
    index: null,
    item: null,
  })

  const abrirAgregar = () => {
    setModal({
      visible: true,
      index: null,
      item: RECONOCIMIENTO_VACIO(reconocimientos.length + 1),
    })
  }

  const abrirEditar = (index) => {
    setModal({
      visible: true,
      index,
      item: { ...reconocimientos[index] },
    })
  }

  const handleCampoModal = (campo, valor) => {
    setModal((prev) => ({
      ...prev,
      item: { ...prev.item, [campo]: valor },
    }))
  }

  const handleGuardar = () => {
    const { index, item } = modal
    const errores = []

    if (!item.nombre_entidad?.trim())
      errores.push("Nombre de la entidad es obligatorio")
    if (!item.tipo_reconocimiento?.trim())
      errores.push("Tipo de reconocimiento es obligatorio")

    if (errores.length > 0) {
      mostrarErroresPaso(errores, "Reconocimiento")
      return
    }

    if (index !== null) {
      const lista = [...reconocimientos]
      lista[index] = item
      onChangeReconocimientos(lista)
    } else {
      onChangeReconocimientos([...reconocimientos, item])
    }
    setModal({ visible: false, index: null, item: null })
  }

  const handleCancelar = () => {
    setModal({ visible: false, index: null, item: null })
  }

  const handleEliminar = (index) => {
    onChangeReconocimientos(reconocimientos.filter((_, i) => i !== index))
  }

  const DIAS = [
    { campo: "dia_lunes", label: "Lun" },
    { campo: "dia_martes", label: "Mar" },
    { campo: "dia_miercoles", label: "Mié" },
    { campo: "dia_jueves", label: "Jue" },
    { campo: "dia_viernes", label: "Vie" },
  ]

  return (
    <div className="space-y-5">

      {/* ══ SECCIÓN 7: OTRAS INSTITUCIONES ════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Building2}
          titulo="¿Labora en Otras Instituciones?"
          subtitulo="Empleos adicionales al momento del registro"
        />

        {/* Toggle principal */}
        <div className="flex items-center gap-4 p-4 bg-slate-50
                        rounded-lg border border-slate-200 mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">
              ¿Actualmente labora en otra institución?
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Además de su cargo en la UNAMBA
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeInstituciones({
                ...otrasInstituciones,
                labora_otra_inst: false,
                tipo_personal: "",
                nombre_entidad: "",
                horas_diarias: null,
                dia_lunes: false,
                dia_martes: false,
                dia_miercoles: false,
                dia_jueves: false,
                dia_viernes: false,
              })}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold
                          transition-all duration-150 border
                ${!otrasInstituciones.labora_otra_inst
                  ? "bg-slate-700 text-white border-slate-700"
                  : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
                }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => onChangeInstituciones({
                ...otrasInstituciones,
                labora_otra_inst: true,
              })}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold
                          transition-all duration-150 border
                ${otrasInstituciones.labora_otra_inst
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
                }`}
            >
              Sí
            </button>
          </div>
        </div>

        {/* Formulario condicional */}
        {otrasInstituciones.labora_otra_inst && (
          <div className="space-y-4">
            <FieldGrid cols={2}>
              <div className="sm:col-span-2">
                <Input
                  label="Nombre de la Entidad" required
                  placeholder="Ej: Universidad Andina del Cusco"
                  {...campoInst("nombre_entidad")}
                />
              </div>
              <Select
                label="Tipo de Personal" required
                opciones={TIPO_PERSONAL}
                {...campoInst("tipo_personal")}
              />
              <Input
                label="Horas Diarias" type="number"
                min={1} max={12}
                value={otrasInstituciones.horas_diarias ?? ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || null
                  if (val === null || (val >= 1 && val <= 12))
                    set("horas_diarias", val)
                }}
                tocado={!!otrasInstituciones.horas_diarias}
                valido={!!otrasInstituciones.horas_diarias &&
                  otrasInstituciones.horas_diarias >= 1 &&
                  otrasInstituciones.horas_diarias <= 12}
                error={otrasInstituciones.horas_diarias &&
                  (otrasInstituciones.horas_diarias < 1 ||
                    otrasInstituciones.horas_diarias > 12)
                  ? "Las horas diarias deben estar entre 1 y 12"
                  : ""}
                placeholder="Entre 1 y 12 horas"
              />
            </FieldGrid>

            {/* Días */}
            <div>
              <label className="input-label mb-2">
                Días de Asistencia Semanal
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {DIAS.map(({ campo, label }) => (
                  <button
                    key={campo}
                    type="button"
                    onClick={() => set(campo, !otrasInstituciones[campo])}
                    className={`w-12 h-12 rounded-xl text-xs font-bold
                                transition-all duration-150 border-2
                      ${otrasInstituciones[campo]
                        ? "bg-primary-600 text-white border-primary-600 shadow-md scale-105"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {DIAS.some(({ campo }) => otrasInstituciones[campo]) && (
                <p className="text-xs text-primary-600 font-medium mt-2">
                  ✓ Asiste los días:{" "}
                  {DIAS.filter(({ campo }) => otrasInstituciones[campo])
                    .map(({ label }) => label)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Confirmación cuando es No */}
        {!otrasInstituciones.labora_otra_inst && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-green-50
                          border border-green-200 rounded-lg">
            <Info size={13} className="text-green-500 shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">
              Confirmado: no labora en otra institución además de la UNAMBA.
            </p>
          </div>
        )}
      </div>

      {/* ══ SECCIÓN 8: RECONOCIMIENTOS ════════════════════ */}
      <div className="form-card">
        <div className="flex items-start justify-between mb-4">
          <SectionTitle
            icono={Award}
            titulo="Reconocimientos y Felicitaciones"
            subtitulo={`De relevancia institucional · ${reconocimientos.length}/6 registrados`}
          />
          {reconocimientos.length < 6 && (
            <button type="button" onClick={abrirAgregar}
              className="btn-secondary text-xs px-3 py-1.5 gap-1 shrink-0 mt-0.5">
              <Plus size={12} /> Agregar
            </button>
          )}
        </div>

        {reconocimientos.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Award size={32} className="text-slate-200 mx-auto" />
            <p className="text-sm text-slate-400">
              Sin reconocimientos registrados
            </p>
            <p className="text-xs text-slate-400">
              Este campo es opcional — solo si cuenta con reconocimientos
              de relevancia institucional
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {reconocimientos.map((rec, index) => (
              <ReconocimientoRow
                key={index}
                item={rec}
                index={index}
                onEditar={abrirEditar}
                onEliminar={handleEliminar}
              />
            ))}
          </div>
        )}

        {reconocimientos.length === 6 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50
                          border border-amber-200 rounded-lg">
            <Info size={13} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700">
              Ha alcanzado el límite máximo de 6 reconocimientos.
            </p>
          </div>
        )}
      </div>

      {/* ── Modal de reconocimiento ──────────────────────── */}
      {modal.item && (
        <ModalFormulario
          visible={modal.visible}
          titulo={modal.index !== null
            ? "Editar reconocimiento"
            : "Agregar reconocimiento"}
          subtitulo="Reconocimientos y felicitaciones de relevancia institucional"
          esEdicion={modal.index !== null}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        >
          <FormReconocimiento
            item={modal.item}
            onChange={handleCampoModal}
          />
        </ModalFormulario>
      )}

    </div>
  )
}