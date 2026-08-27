import { useState } from "react"
import {
    GraduationCap, BookOpen, Plus, Trash2, Pencil, Award
} from "lucide-react"
import { Input, Select, SectionTitle, FieldGrid } from "../ui/FormField"
import ModalFormulario from "../ui/ModalFormulario"
import {
    ESTADO_ESTUDIO, TIPO_CONSTANCIA,
} from "../../utils/constants"
import { useValidacion } from "../../hooks/useValidacion"
import { mostrarErroresPaso } from "../ui/ToastErrores"

// ── Límites por nivel ──────────────────────────────────────
const LIMITES = {
    "Primaria": 1,
    "Secundaria": 1,
    "Técnico": 1,
    "Bachiller Universitario": 3,
    "Título Universitario": 3,
    "Segunda Especialidad": 3,
    "Maestría": 3,
    "Doctorado": 3,
}

// ── Registros vacíos ───────────────────────────────────────
const FORMACION_VACIA = (nivel, orden) => ({
    nivel,
    estado: "",
    centro_estudios: "",
    grado_obtenido: "",
    mencion: "",
    fecha_inicio: "",
    fecha_conclusion: "",
    documento_acredita: "",
    orden,
})

const OTRO_ESTUDIO_VACIO = (tipo, orden) => ({
    tipo,
    nombre_curso: "",
    centro_estudios: "",
    fecha_inicio: "",
    fecha_fin: "",
    fecha_emision: "",
    duracion_horas: "",
    tipo_constancia: "",
    orden,
})

// ── Reglas de validación ───────────────────────────────────
const reglasFormacion = {
    estado: {
        requerido: true,
        mensajeRequerido: "Seleccione el estado",
    },
    centro_estudios: {
        requerido: true,
        minLength: 2,
        mensajeRequerido: "Centro de estudios es obligatorio",
    },
}

const reglasOtroEstudio = {
    nombre_curso: {
        requerido: true,
        minLength: 2,
        mensajeRequerido: "Nombre del curso es obligatorio",
    },
    centro_estudios: {
        requerido: true,
        minLength: 2,
        mensajeRequerido: "Centro de estudios es obligatorio",
    },
    fecha_inicio: {
        requerido: true,
        mensajeRequerido: "Fecha de inicio es obligatoria",
    },
    fecha_fin: {
        requerido: true,
        mensajeRequerido: "Fecha de fin es obligatoria",
    },
    fecha_emision: {
        requerido: true,
        mensajeRequerido: "Fecha de emisión es obligatoria",
    },
    duracion_horas: {
        requerido: true,
        mensajeRequerido: "Duración en horas es obligatoria",
        validar: (v) => {
            if (!v) return true
            if (parseInt(v) < 1) return "La duración debe ser al menos 1 hora"
            return true
        },
    },
    tipo_constancia: {
        requerido: true,
        mensajeRequerido: "Tipo de constancia es obligatorio",
    },
}

// ══ EBR — Card colapsable inline (sin cambios) ═════════════
function ItemCardEBR({ titulo, subtitulo, children }) {
    const [expandido, setExpandido] = useState(true)
    return (
        <div className="border border-slate-200 rounded-form overflow-hidden
                        hover:border-slate-300 transition-colors">
            <div
                className="flex items-center justify-between px-4 py-3
                           bg-slate-50 cursor-pointer select-none
                           hover:bg-slate-100 transition-colors"
                onClick={() => setExpandido(!expandido)}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center
                                    justify-center shrink-0">
                        <GraduationCap size={13} className="text-primary-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {titulo}
                        </p>
                        {subtitulo && (
                            <p className="text-xs text-slate-400 truncate">{subtitulo}</p>
                        )}
                    </div>
                </div>
                <div className="text-slate-400">
                    {expandido
                        ? <span className="text-xs">▲</span>
                        : <span className="text-xs">▼</span>
                    }
                </div>
            </div>
            {expandido && <div className="p-4">{children}</div>}
        </div>
    )
}

// ══ EBR — Formulario inline ════════════════════════════════
function FormFormacionEBR({ item, onActualizar }) {
    const set = (campo, valor) => onActualizar(campo, valor)

    const tocadosIniciales = Object.fromEntries(
        Object.keys(reglasFormacion).map((k) => [k, !!item[k]])
    )
    const { props: validarProps, validar } = useValidacion(
        reglasFormacion, tocadosIniciales
    )

    const handleChange = (campo, valor) => {
        set(campo, valor)
        validar(campo, valor)
    }

    return (
        <div className="space-y-4">
            <FieldGrid cols={2}>
                <Select
                    label="Estado" required opciones={ESTADO_ESTUDIO}
                    value={item.estado}
                    {...validarProps("estado", item.estado)}
                    onChange={(e) => handleChange("estado", e.target.value)}
                />
                <Input
                    label="Centro de Estudios" required
                    value={item.centro_estudios}
                    {...validarProps("centro_estudios", item.centro_estudios)}
                    onChange={(e) => handleChange("centro_estudios", e.target.value)}
                    placeholder="Ej: I.E. San Francisco"
                />
            </FieldGrid>
        </div>
    )
}

// ══ Superior/Posgrado — Formulario dentro del modal ════════
function FormFormacionModal({ item, onChange }) {
    const tocadosIniciales = Object.fromEntries(
        Object.keys(reglasFormacion).map((k) => [k, !!item[k]])
    )
    const { props: vProps } = useValidacion(reglasFormacion, tocadosIniciales)

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
            <FieldGrid cols={2}>
                <Select
                    label="Estado" required opciones={ESTADO_ESTUDIO}
                    {...campo("estado")}
                />
                <Input
                    label="Centro de Estudios" required
                    placeholder="Ej: UNMSM"
                    {...campo("centro_estudios")}
                />
            </FieldGrid>
            <FieldGrid cols={2}>
                <Input
                    label="Grado Obtenido / Título"
                    placeholder="Ej: Bachiller en Ing. de Sistemas"
                    value={item.grado_obtenido ?? ""}
                    onChange={(e) => onChange("grado_obtenido", e.target.value)}
                    tocado={!!item.grado_obtenido} valido={!!item.grado_obtenido}
                />
                <Input
                    label="Mención"
                    placeholder="Ej: Con mención en Gestión Pública"
                    value={item.mencion ?? ""}
                    onChange={(e) => onChange("mencion", e.target.value)}
                    tocado={!!item.mencion} valido={!!item.mencion}
                />
            </FieldGrid>
            <FieldGrid cols={2}>
                <Input
                    label="Fecha de Inicio" type="date"
                    value={item.fecha_inicio ?? ""}
                    onChange={(e) => onChange("fecha_inicio", e.target.value)}
                    tocado={!!item.fecha_inicio} valido={!!item.fecha_inicio}
                />
                <Input
                    label="Fecha de Conclusión" type="date"
                    value={item.fecha_conclusion ?? ""}
                    onChange={(e) => onChange("fecha_conclusion", e.target.value)}
                    tocado={!!item.fecha_conclusion}
                    valido={!!item.fecha_conclusion &&
                        (!item.fecha_inicio ||
                            item.fecha_conclusion >= item.fecha_inicio)}
                    error={item.fecha_conclusion && item.fecha_inicio &&
                        item.fecha_conclusion < item.fecha_inicio
                        ? "La fecha de conclusión no puede ser anterior a la fecha de inicio"
                        : ""}
                />
            </FieldGrid>
            <Input
                label="Documento que Acredita"
                placeholder="Ej: Diploma de Bachiller, Resolución N°..."
                value={item.documento_acredita ?? ""}
                onChange={(e) => onChange("documento_acredita", e.target.value)}
                tocado={!!item.documento_acredita} valido={!!item.documento_acredita}
            />
        </div>
    )
}

// ══ Otros Estudios — Formulario dentro del modal ═══════════
function FormOtroEstudioModal({ item, onChange }) {
    const tocadosIniciales = Object.fromEntries(
        Object.keys(reglasOtroEstudio).map((k) => [k, !!item[k]])
    )
    const reglasExtendidas = {
        ...reglasOtroEstudio,
        duracion_horas: {
            requerido: false,
            validar: (v) => {
                if (!v) return true
                if (parseInt(v) < 1) return "La duración debe ser al menos 1 hora"
                return true
            },
        },
        fecha_fin: {
            requerido: false,
            validar: (v) => {
                if (!v || !item.fecha_inicio) return true
                if (v < item.fecha_inicio)
                    return "La fecha de fin no puede ser anterior a la fecha de inicio"
                return true
            },
        },
        fecha_conclusion: {
            requerido: false,
            validar: (v) => {
                if (!v || !item.fecha_inicio) return true
                if (v < item.fecha_inicio)
                    return "La fecha de conclusión no puede ser anterior a la fecha de inicio"
                return true
            },
        },
    }
    const tocadosExtendidos = {
        ...tocadosIniciales,
        duracion_horas: !!item.duracion_horas,
        fecha_fin:      !!item.fecha_fin,
        fecha_emision:  !!item.fecha_emision,
    }
    const { props: vProps } = useValidacion(reglasExtendidas, tocadosExtendidos)
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
                label="Nombre del Curso / Programa" required
                placeholder="Ej: Diplomado en Gestión Pública"
                {...campo("nombre_curso")}
            />
            <FieldGrid cols={2}>
                <Input
                    label="Centro de Estudios" required
                    placeholder="Ej: SERVIR, PUCP"
                    {...campo("centro_estudios")}
                />
                <Input
                    label="Duración (horas)" type="number" min={1}
                    placeholder="Ej: 120"
                    {...campo("duracion_horas")}
                    onChange={(e) => {
                        const val = e.target.value
                        vProps("duracion_horas", item.duracion_horas).onChange(e)
                        if (val === "" || parseInt(val) >= 1)
                            onChange("duracion_horas", val)
                    }}
                />
            </FieldGrid>
            <FieldGrid cols={3}>
                <Input
                    label="Fecha de Inicio" type="date"
                    value={item.fecha_inicio ?? ""}
                    onChange={(e) => onChange("fecha_inicio", e.target.value)}
                    tocado={!!item.fecha_inicio} valido={!!item.fecha_inicio}
                />
                <Input
                    label="Fecha de Fin" type="date"
                    {...campo("fecha_fin")}
                />
                <Input
                    label="Fecha de Emisión" type="date"
                    value={item.fecha_emision ?? ""}
                    onChange={(e) => onChange("fecha_emision", e.target.value)}
                    tocado={!!item.fecha_emision} valido={!!item.fecha_emision}
                />
            </FieldGrid>
            <Select
                label="Tipo de Constancia" opciones={TIPO_CONSTANCIA}
                value={item.tipo_constancia ?? ""}
                onChange={(e) => onChange("tipo_constancia", e.target.value)}
                tocado={!!item.tipo_constancia} valido={!!item.tipo_constancia}
            />
        </div>
    )
}

// ══ Card compacta para lista de Superior/Posgrado/Otros ════
function FormacionRow({ item, nivel, onEditar, onEliminar }) {
    return (
        <div className="flex items-center justify-between px-4 py-3
                        border border-slate-200 rounded-xl hover:border-slate-300
                        hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center
                                justify-center shrink-0">
                    <GraduationCap size={14} className="text-primary-600" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                        {item.centro_estudios || item.nombre_curso || nivel}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        {item.grado_obtenido && (
                            <span className="text-xs text-slate-500 truncate">
                                {item.grado_obtenido}
                            </span>
                        )}
                        {item.estado && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0
                                ${item.estado === "Completo"
                                    ? "bg-green-100 text-green-700"
                                    : item.estado === "En curso"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-amber-100 text-amber-700"
                                }`}>
                                {item.estado}
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

// ══ Componente principal ═══════════════════════════════════
export default function Step4Formacion({
    formacion, otrosEstudios,
    onChangeFormacion, onChangeOtros,
}) {
    // ── Estado del modal ───────────────────────────────────
    const [modal, setModal] = useState({
        visible: false,
        tipo: null,   // "formacion" | "otro"
        nivel: null,   // nivel o tipo de otro estudio
        index: null,
        item: null,
    })

    // ── Helpers de agrupación ──────────────────────────────
    const porNivel = (nivel) => formacion
        .map((f, i) => ({ ...f, _index: i }))
        .filter((f) => f.nivel === nivel)

    const porTipo = (tipo) => otrosEstudios
        .map((e, i) => ({ ...e, _index: i }))
        .filter((e) => e.tipo === tipo)

    // ── Actualizar campo dentro del modal ──────────────────
    const handleCampoModal = (campo, valor) => {
        setModal((prev) => ({
            ...prev,
            item: { ...prev.item, [campo]: valor },
        }))
    }

    // ── Abrir modal formación superior/posgrado ────────────
    const abrirAgregarFormacion = (nivel) => {
        const existentes = formacion.filter((f) => f.nivel === nivel)
        if (existentes.length >= LIMITES[nivel]) return
        setModal({
            visible: true,
            tipo: "formacion",
            nivel,
            index: null,
            item: FORMACION_VACIA(nivel, existentes.length + 1),
        })
    }

    const abrirEditarFormacion = (index, nivel) => {
        setModal({
            visible: true,
            tipo: "formacion",
            nivel,
            index,
            item: { ...formacion[index] },
        })
    }

    // ── Abrir modal otros estudios ─────────────────────────
    const abrirAgregarOtro = (tipo) => {
        const existentes = otrosEstudios.filter((e) => e.tipo === tipo)
        if (existentes.length >= 10) return
        setModal({
            visible: true,
            tipo: "otro",
            nivel: tipo,
            index: null,
            item: OTRO_ESTUDIO_VACIO(tipo, existentes.length + 1),
        })
    }

    const abrirEditarOtro = (index, tipo) => {
        setModal({
            visible: true,
            tipo: "otro",
            nivel: tipo,
            index,
            item: { ...otrosEstudios[index] },
        })
    }

    // ── Guardar desde el modal ─────────────────────────────
    const handleGuardar = () => {
        const { tipo, index, item } = modal
        const errores = []

        if (tipo === "formacion") {
            if (!item.estado)
                errores.push("Estado es obligatorio")
            if (!item.centro_estudios?.trim())
                errores.push("Centro de estudios es obligatorio")
            if (item.fecha_inicio && item.fecha_conclusion &&
                item.fecha_conclusion < item.fecha_inicio)
                errores.push("La fecha de conclusión no puede ser anterior a la fecha de inicio")
            if (errores.length > 0) {
                mostrarErroresPaso(errores, modal.nivel)
                return
            }
            if (index !== null) {
                const lista = [...formacion]
                lista[index] = item
                onChangeFormacion(lista)
            } else {
                onChangeFormacion([...formacion, item])
            }
        } else {
            if (!item.nombre_curso?.trim())
                errores.push("Nombre del curso es obligatorio")
            if (!item.centro_estudios?.trim())
                errores.push("Centro de estudios es obligatorio")
            if (!item.fecha_inicio)
                errores.push("Fecha de inicio es obligatoria")
            if (!item.fecha_fin)
                errores.push("Fecha de fin es obligatoria")
            if (!item.fecha_emision)
                errores.push("Fecha de emisión es obligatoria")
            if (!item.duracion_horas)
                errores.push("Duración en horas es obligatoria")
            else if (parseInt(item.duracion_horas) < 1)
                errores.push("La duración debe ser al menos 1 hora")
            if (!item.tipo_constancia)
                errores.push("Tipo de constancia es obligatorio")
            if (item.fecha_inicio && item.fecha_fin &&
                item.fecha_fin < item.fecha_inicio)
                errores.push("La fecha de fin no puede ser anterior a la fecha de inicio")
            if (errores.length > 0) {
                mostrarErroresPaso(errores, modal.nivel)
                return
            }
            if (index !== null) {
                const lista = [...otrosEstudios]
                lista[index] = item
                onChangeOtros(lista)
            } else {
                onChangeOtros([...otrosEstudios, item])
            }
        }
        setModal({ visible: false, tipo: null, nivel: null, index: null, item: null })
    }

    const handleCancelar = () => {
        setModal({ visible: false, tipo: null, nivel: null, index: null, item: null })
    }

    // ── Eliminar ───────────────────────────────────────────
    const eliminarFormacion = (index) => {
        onChangeFormacion(formacion.filter((_, i) => i !== index))
    }

    const eliminarOtro = (index) => {
        onChangeOtros(otrosEstudios.filter((_, i) => i !== index))
    }

    // ── Actualizar EBR inline ──────────────────────────────
    const actualizarFormacion = (index, campo, valor) => {
        const lista = [...formacion]
        lista[index] = { ...lista[index], [campo]: valor }
        onChangeFormacion(lista)
    }

    // ── Grupos ─────────────────────────────────────────────
    const gruposSuperiores = [
        {
            titulo: "Educación Superior",
            icono: GraduationCap,
            niveles: ["Técnico", "Bachiller Universitario",
                "Título Universitario", "Segunda Especialidad"],
        },
        {
            titulo: "Posgrado",
            icono: Award,
            niveles: ["Maestría", "Doctorado"],
        },
    ]

    // ── Título del modal ───────────────────────────────────
    const tituloModal = modal.index !== null
        ? `Editar — ${modal.nivel}`
        : `Agregar — ${modal.nivel}`

    return (
        <div className="space-y-5">

            {/* ══ 1. EDUCACIÓN BÁSICA REGULAR (inline) ══════ */}
            <div className="form-card">
                <SectionTitle icono={BookOpen} titulo="Educación Básica Regular" />
                <div className="space-y-4">
                    {["Primaria", "Secundaria"].map((nivel) => {
                        const items = porNivel(nivel)
                        return (
                            <div key={nivel}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-600
                                                     uppercase tracking-wide">
                                        {nivel}
                                        <span className="text-slate-400 font-normal ml-1">
                                            ({items.length}/1)
                                        </span>
                                    </span>
                                </div>
                                <div className="space-y-2 ml-2">
                                    {items.map((item) => (
                                        <ItemCardEBR
                                            key={item._index}
                                            titulo={item.centro_estudios || nivel}
                                            subtitulo={item.estado || "Estado no definido"}
                                        >
                                            <FormFormacionEBR
                                                item={item}
                                                onActualizar={(campo, valor) =>
                                                    actualizarFormacion(item._index, campo, valor)
                                                }
                                            />
                                        </ItemCardEBR>
                                    ))}
                                </div>
                                {nivel !== "Secundaria" && (
                                    <div className="border-b border-slate-100 mt-3" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ══ 2. EDUCACIÓN SUPERIOR Y POSGRADO (modal) ══ */}
            {gruposSuperiores.map((grupo) => (
                <div key={grupo.titulo} className="form-card">
                    <SectionTitle icono={grupo.icono} titulo={grupo.titulo} />
                    <div className="space-y-4">
                        {grupo.niveles.map((nivel) => {
                            const items = porNivel(nivel)
                            const limite = LIMITES[nivel]
                            return (
                                <div key={nivel}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-600
                                                         uppercase tracking-wide">
                                            {nivel}
                                            <span className="text-slate-400 font-normal ml-1">
                                                ({items.length}/{limite})
                                            </span>
                                        </span>
                                        {items.length < limite && (
                                            <button
                                                type="button"
                                                onClick={() => abrirAgregarFormacion(nivel)}
                                                className="btn-secondary text-xs px-2.5 py-1 gap-1"
                                            >
                                                <Plus size={11} /> Agregar
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2 ml-2">
                                        {items.length === 0 && (
                                            <p className="text-xs text-slate-400 italic py-1">
                                                Sin registros — haga clic en "Agregar"
                                            </p>
                                        )}
                                        {items.map((item) => (
                                            <FormacionRow
                                                key={item._index}
                                                item={item}
                                                nivel={nivel}
                                                onEditar={() =>
                                                    abrirEditarFormacion(item._index, nivel)
                                                }
                                                onEliminar={() =>
                                                    eliminarFormacion(item._index)
                                                }
                                            />
                                        ))}
                                    </div>
                                    {nivel !== grupo.niveles[grupo.niveles.length - 1] && (
                                        <div className="border-b border-slate-100 mt-3" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {/* ══ 3. OTROS ESTUDIOS (modal) ══════════════════ */}
            {["Diplomado", "Especialización", "Otro"].map((tipo) => {
                const items = porTipo(tipo)
                return (
                    <div key={tipo} className="form-card">
                        <div className="flex items-center justify-between mb-4">
                            <SectionTitle
                                icono={BookOpen}
                                titulo={tipo === "Otro" ? "Otros Estudios" : `${tipo}s`}
                                subtitulo={`Máximo 10 · ${items.length}/10 registrados`}
                            />
                            {items.length < 10 && (
                                <button
                                    type="button"
                                    onClick={() => abrirAgregarOtro(tipo)}
                                    className="btn-secondary text-xs px-3 py-1.5 gap-1 shrink-0"
                                >
                                    <Plus size={12} /> Agregar
                                </button>
                            )}
                        </div>

                        {items.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-4">
                                No hay {tipo === "Otro"
                                    ? "otros estudios"
                                    : `${tipo.toLowerCase()}s`} registrados
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <FormacionRow
                                        key={item._index}
                                        item={item}
                                        nivel={tipo}
                                        onEditar={() =>
                                            abrirEditarOtro(item._index, tipo)
                                        }
                                        onEliminar={() =>
                                            eliminarOtro(item._index)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}

            {/* ══ Modal único compartido ═════════════════════ */}
            {modal.item && (
                <ModalFormulario
                    visible={modal.visible}
                    titulo={tituloModal}
                    subtitulo={
                        modal.tipo === "formacion"
                            ? "Complete los datos de formación académica"
                            : "Complete los datos del estudio"
                    }
                    esEdicion={modal.index !== null}
                    onGuardar={handleGuardar}
                    onCancelar={handleCancelar}
                >
                    {modal.tipo === "formacion" ? (
                        <FormFormacionModal
                            item={modal.item}
                            onChange={handleCampoModal}
                        />
                    ) : (
                        <FormOtroEstudioModal
                            item={modal.item}
                            onChange={handleCampoModal}
                        />
                    )}
                </ModalFormulario>
            )}

        </div>
    )
}