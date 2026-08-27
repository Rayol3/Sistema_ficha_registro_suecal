import { useState } from "react"
import {
  Briefcase, GraduationCap, Plus, Trash2,
  Pencil, Building, Info
} from "lucide-react"
import { Input, SectionTitle, FieldGrid } from "../ui/FormField"
import ModalFormulario from "../ui/ModalFormulario"
import { useValidacion } from "../../hooks/useValidacion"
import { mostrarErroresPaso } from "../ui/ToastErrores"

// ── Registros vacíos ───────────────────────────────────────
const EXP_LABORAL_VACIA = (tipo, orden) => ({
  tipo_institucion: tipo,
  nombre_entidad: "",
  cargo: "",
  documento_acredita: "",
  fecha_inicio: "",
  fecha_culminacion: "",
  orden,
})

const EXP_DOCENTE_VACIA = (orden) => ({
  nombre_entidad: "",
  categoria: "",
  documento_acredita: "",
  fecha_inicio: "",
  fecha_culminacion: "",
  orden,
})

// ── Reglas de validación ───────────────────────────────────
const reglasExpLaboral = {
  nombre_entidad: {
    requerido: true, minLength: 2,
    mensajeRequerido: "Nombre de la entidad es obligatorio",
  },
  cargo: {
    requerido: true, minLength: 2,
    mensajeRequerido: "Cargo desempeñado es obligatorio",
  },
  fecha_inicio: {
    requerido: true,
    mensajeRequerido: "Fecha de inicio es obligatoria",
  },
}

const reglasExpDocente = {
  nombre_entidad: {
    requerido: true, minLength: 2,
    mensajeRequerido: "Nombre de la entidad es obligatorio",
  },
  fecha_inicio: {
    requerido: true,
    mensajeRequerido: "Fecha de inicio es obligatoria",
  },
}

// ── Calcula tiempo en el cargo ─────────────────────────────
function calcularTiempo(fechaInicio, fechaFin) {
  if (!fechaInicio) return ""
  const inicio = new Date(fechaInicio)
  const fin = fechaFin ? new Date(fechaFin) : new Date()
  if (isNaN(inicio.getTime())) return ""
  const meses = (fin.getFullYear() - inicio.getFullYear()) * 12
    + (fin.getMonth() - inicio.getMonth())
  const anios = Math.floor(meses / 12)
  const mesesR = meses % 12
  if (anios === 0) return `${mesesR} mes${mesesR !== 1 ? "es" : ""}`
  if (mesesR === 0) return `${anios} año${anios !== 1 ? "s" : ""}`
  return `${anios} año${anios !== 1 ? "s" : ""} ${mesesR} mes${mesesR !== 1 ? "es" : ""}`
}

// ── Formulario experiencia laboral ─────────────────────────
function FormExpLaboral({ item, onChange }) {
  const tocadosIniciales = Object.fromEntries(
    Object.keys(reglasExpLaboral).map((k) => [k, !!item[k]])
  )
  const { props: vProps } = useValidacion(reglasExpLaboral, tocadosIniciales)

  const campo = (nombre) => ({
    value: item[nombre] ?? "",
    ...vProps(nombre, item[nombre]),
    onChange: (e) => {
      vProps(nombre, item[nombre]).onChange(e)
      onChange(nombre, e.target.value)
    },
  })

  const tiempo = calcularTiempo(item.fecha_inicio, item.fecha_culminacion)

  return (
    <div className="space-y-4">
      <FieldGrid cols={2}>
        <div className="sm:col-span-2">
          <Input label="Nombre de la Entidad" required
            placeholder="Ej: Gobierno Regional de Apurímac"
            {...campo("nombre_entidad")} />
        </div>
        <Input label="Cargo Desempeñado" required
          placeholder="Ej: Analista de Sistemas"
          {...campo("cargo")} />
        <Input label="Documento que Acredita"
          placeholder="Ej: Resolución N° 045-2012"
          value={item.documento_acredita ?? ""}
          onChange={(e) => onChange("documento_acredita", e.target.value)}
          tocado={!!item.documento_acredita}
          valido={!!item.documento_acredita}
        />
      </FieldGrid>

      <FieldGrid cols={2}>
        <Input label="Fecha de Inicio" required type="date"
          {...campo("fecha_inicio")} />
        <Input label="Fecha de Culminación" type="date"
          value={item.fecha_culminacion ?? ""}
          onChange={(e) => onChange("fecha_culminacion", e.target.value)}
          tocado={!!item.fecha_culminacion}
          valido={!!item.fecha_culminacion &&
            (!item.fecha_inicio ||
              item.fecha_culminacion >= item.fecha_inicio)}
          error={item.fecha_culminacion && item.fecha_inicio &&
            item.fecha_culminacion < item.fecha_inicio
            ? "La fecha de culminación no puede ser anterior a la fecha de inicio"
            : ""}
        />
      </FieldGrid>

      {tiempo && (
        <div className="px-3 py-2 bg-primary-50 border border-primary-100
                        rounded-lg text-xs text-primary-700 font-medium">
          ⏱ Tiempo en el cargo: {tiempo}
        </div>
      )}
    </div>
  )
}

// ── Formulario experiencia docente ─────────────────────────
function FormExpDocente({ item, onChange }) {
  const tocadosIniciales = Object.fromEntries(
    Object.keys(reglasExpDocente).map((k) => [k, !!item[k]])
  )
  const { props: vProps } = useValidacion(reglasExpDocente, tocadosIniciales)

  const campo = (nombre) => ({
    value: item[nombre] ?? "",
    ...vProps(nombre, item[nombre]),
    onChange: (e) => {
      vProps(nombre, item[nombre]).onChange(e)
      onChange(nombre, e.target.value)
    },
  })

  const tiempo = calcularTiempo(item.fecha_inicio, item.fecha_culminacion)

  return (
    <div className="space-y-4">
      <FieldGrid cols={2}>
        <div className="sm:col-span-2">
          <Input label="Nombre de la Entidad / Universidad" required
            placeholder="Ej: Universidad Nacional del Cusco"
            {...campo("nombre_entidad")} />
        </div>
        <Input label="Categoría Docente"
          placeholder="Ej: Principal, Asociado, Auxiliar"
          value={item.categoria ?? ""}
          onChange={(e) => onChange("categoria", e.target.value)}
          tocado={!!item.categoria}
          valido={!!item.categoria}
        />
        <Input label="Documento que Acredita"
          placeholder="Ej: Resolución N° 120-2015"
          value={item.documento_acredita ?? ""}
          onChange={(e) => onChange("documento_acredita", e.target.value)}
          tocado={!!item.documento_acredita}
          valido={!!item.documento_acredita}
        />
      </FieldGrid>

      <FieldGrid cols={2}>
        <Input label="Fecha de Inicio" required type="date"
          {...campo("fecha_inicio")} />
        <Input label="Fecha de Culminación" type="date"
          value={item.fecha_culminacion ?? ""}
          onChange={(e) => onChange("fecha_culminacion", e.target.value)}
          tocado={!!item.fecha_culminacion}
          valido={!!item.fecha_culminacion &&
            (!item.fecha_inicio ||
              item.fecha_culminacion >= item.fecha_inicio)}
          error={item.fecha_culminacion && item.fecha_inicio &&
            item.fecha_culminacion < item.fecha_inicio
            ? "La fecha de culminación no puede ser anterior a la fecha de inicio"
            : ""}
        />
      </FieldGrid>

      {tiempo && (
        <div className="px-3 py-2 bg-primary-50 border border-primary-100
                        rounded-lg text-xs text-primary-700 font-medium">
          ⏱ Tiempo en el cargo: {tiempo}
        </div>
      )}
    </div>
  )
}

// ── Card compacta de experiencia ───────────────────────────
function ExpRow({ item, onEditar, onEliminar, tipo }) {
  const tiempo = calcularTiempo(item.fecha_inicio, item.fecha_culminacion)
  const esActual = !item.fecha_culminacion

  return (
    <div className="flex items-center justify-between px-4 py-3
                    border border-slate-200 rounded-xl hover:border-slate-300
                    hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center
                        justify-center shrink-0">
          <Building size={14} className="text-primary-600" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {item.nombre_entidad || `Registro ${item.orden}`}
            </p>
            {esActual && (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium
                               bg-green-100 text-green-700 shrink-0">
                Actual
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {(item.cargo || item.categoria) && (
              <span className="text-xs text-slate-500 truncate">
                {item.cargo || item.categoria}
              </span>
            )}
            {tiempo && (
              <span className="text-xs text-slate-400 shrink-0">
                · {tiempo}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button type="button" onClick={onEditar}
          className="p-1.5 text-primary-400 hover:text-primary-600
                     hover:bg-primary-50 rounded-lg transition-colors"
          title="Editar">
          <Pencil size={14} />
        </button>
        <button type="button" onClick={onEliminar}
          className="p-1.5 text-red-400 hover:text-red-600
                     hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Sección reutilizable ───────────────────────────────────
function SeccionExperiencia({
  titulo, subtitulo, icono: Icono,
  items, limite, onAgregar, onEditar, onEliminar,
}) {
  return (
    <div className="form-card">
      <div className="flex items-start justify-between mb-4">
        <SectionTitle
          icono={Icono}
          titulo={titulo}
          subtitulo={`${subtitulo} · ${items.length}/${limite} registrados`}
        />
        {items.length < limite && (
          <button type="button" onClick={onAgregar}
            className="btn-secondary text-xs px-3 py-1.5 gap-1 shrink-0 mt-0.5">
            <Plus size={12} /> Agregar
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 space-y-2">
          <Icono size={28} className="text-slate-200 mx-auto" />
          <p className="text-xs text-slate-400 italic">
            No hay registros — haga clic en "Agregar" para ingresar
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ExpRow
              key={item._index}
              item={item}
              onEditar={() => onEditar(item._index)}
              onEliminar={() => onEliminar(item._index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────
export default function Step5Experiencia({
  expLaboral, expDocente, tipoPersonal,
  onChangeLaboral, onChangeDocente,
}) {
  // ── Estado del modal ─────────────────────────────────
  const [modal, setModal] = useState({
    visible: false,
    tipo: null,       // "estatal" | "privada" | "docente"
    index: null,
    item: null,
  })

  // ── Abrir modal ───────────────────────────────────────
  const abrirAgregar = (tipo) => {
    const vacio = tipo === "docente"
      ? EXP_DOCENTE_VACIA(expDocente.length + 1)
      : EXP_LABORAL_VACIA(
        tipo === "estatal" ? "Estatal" : "Privada",
        expLaboral.filter((e) =>
          e.tipo_institucion === (tipo === "estatal" ? "Estatal" : "Privada")
        ).length + 1
      )
    setModal({ visible: true, tipo, index: null, item: vacio })
  }

  const abrirEditar = (tipo, index) => {
    const item = tipo === "docente"
      ? { ...expDocente[index] }
      : { ...expLaboral[index] }
    setModal({ visible: true, tipo, index, item })
  }

  // ── Actualizar campo dentro del modal ─────────────────
  const handleCampoModal = (campo, valor) => {
    setModal((prev) => ({
      ...prev,
      item: { ...prev.item, [campo]: valor },
    }))
  }

  // ── Guardar ───────────────────────────────────────────
  const handleGuardar = () => {
    const { tipo, index, item } = modal
    const errores = []

    if (tipo === "docente") {
      if (!item.nombre_entidad?.trim())
        errores.push("Nombre de la entidad es obligatorio")
      if (!item.fecha_inicio)
        errores.push("Fecha de inicio es obligatoria")
      if (item.fecha_culminacion && item.fecha_inicio &&
          item.fecha_culminacion < item.fecha_inicio)
        errores.push("La fecha de culminación no puede ser anterior a la fecha de inicio")
      if (errores.length > 0) {
        mostrarErroresPaso(errores, "Experiencia Docente")
        return
      }
      if (index !== null) {
        const lista = [...expDocente]
        lista[index] = item
        onChangeDocente(lista)
      } else {
        onChangeDocente([...expDocente, item])
      }
    } else {
      if (!item.nombre_entidad?.trim())
        errores.push("Nombre de la entidad es obligatorio")
      if (!item.cargo?.trim())
        errores.push("Cargo desempeñado es obligatorio")
      if (!item.fecha_inicio)
        errores.push("Fecha de inicio es obligatoria")
      if (item.fecha_culminacion && item.fecha_inicio &&
          item.fecha_culminacion < item.fecha_inicio)
        errores.push("La fecha de culminación no puede ser anterior a la fecha de inicio")
      if (errores.length > 0) {
        const titulo = tipo === "estatal"
          ? "Experiencia Estatal"
          : "Experiencia Privada"
        mostrarErroresPaso(errores, titulo)
        return
      }
      if (index !== null) {
        const lista = [...expLaboral]
        lista[index] = item
        onChangeLaboral(lista)
      } else {
        onChangeLaboral([...expLaboral, item])
      }
    }
    setModal({ visible: false, tipo: null, index: null, item: null })
  }

  const handleCancelar = () => {
    setModal({ visible: false, tipo: null, index: null, item: null })
  }

  // ── Eliminar ──────────────────────────────────────────
  const eliminarLaboral = (index) => {
    onChangeLaboral(expLaboral.filter((_, i) => i !== index))
  }
  const eliminarDocente = (index) => {
    onChangeDocente(expDocente.filter((_, i) => i !== index))
  }

  // ── Helpers ───────────────────────────────────────────
  const porTipo = (tipo) => expLaboral
    .map((e, i) => ({ ...e, _index: i }))
    .filter((e) => e.tipo_institucion === tipo)

  const expDocenteConIdx = expDocente.map((e, i) => ({ ...e, _index: i }))

  const esDocente = tipoPersonal === "Docente"
  const esAdministrativo = tipoPersonal === "Administrativo"
  const sinDefinir = !tipoPersonal

  // ── Título del modal ──────────────────────────────────
  const titulosModal = {
    estatal: { agregar: "Agregar experiencia estatal", editar: "Editar experiencia estatal" },
    privada: { agregar: "Agregar experiencia privada", editar: "Editar experiencia privada" },
    docente: { agregar: "Agregar experiencia docente", editar: "Editar experiencia docente" },
  }
  const tituloModal = modal.tipo
    ? (modal.index !== null
      ? titulosModal[modal.tipo].editar
      : titulosModal[modal.tipo].agregar)
    : ""

  return (
    <div className="space-y-5">

      {sinDefinir && (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-50
                        border border-amber-200 rounded-form">
          <Info size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            No definió el tipo de personal en el Paso 2. Complete ese campo
            para ver si aplica la sección de experiencia docente.
          </p>
        </div>
      )}

      <SeccionExperiencia
        titulo="Experiencia en Institución Estatal"
        subtitulo="Máximo 10 registros"
        icono={Briefcase}
        items={porTipo("Estatal")}
        limite={10}
        onAgregar={() => abrirAgregar("estatal")}
        onEditar={(i) => abrirEditar("estatal", i)}
        onEliminar={eliminarLaboral}
      />

      <SeccionExperiencia
        titulo="Experiencia en Institución Privada"
        subtitulo="Máximo 10 registros"
        icono={Briefcase}
        items={porTipo("Privada")}
        limite={10}
        onAgregar={() => abrirAgregar("privada")}
        onEditar={(i) => abrirEditar("privada", i)}
        onEliminar={eliminarLaboral}
      />

      {esDocente && (
        <SeccionExperiencia
          titulo="Experiencia Docente"
          subtitulo="Máximo 15 registros"
          icono={GraduationCap}
          items={expDocenteConIdx}
          limite={15}
          onAgregar={() => abrirAgregar("docente")}
          onEditar={(i) => abrirEditar("docente", i)}
          onEliminar={eliminarDocente}
        />
      )}

      {esAdministrativo && (
        <div className="flex items-start gap-3 px-4 py-3 bg-slate-50
                        border border-slate-200 rounded-form">
          <Info size={15} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">
            La sección de <strong>Experiencia Docente</strong> no aplica
            para personal administrativo.
          </p>
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────── */}
      {modal.item && (
        <ModalFormulario
          visible={modal.visible}
          titulo={tituloModal}
          subtitulo="Complete los datos de la experiencia laboral"
          esEdicion={modal.index !== null}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        >
          {modal.tipo === "docente" ? (
            <FormExpDocente
              item={modal.item}
              onChange={handleCampoModal}
            />
          ) : (
            <FormExpLaboral
              item={modal.item}
              onChange={handleCampoModal}
            />
          )}
        </ModalFormulario>
      )}

    </div>
  )
}