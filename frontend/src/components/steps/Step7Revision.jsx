import {
    User, Briefcase, Users, GraduationCap,
    Building2, Award, CheckCircle2, AlertCircle,
    ChevronDown, ChevronUp, Camera,
} from "lucide-react"
import { useState } from "react"

// ── Card de sección revisable ──────────────────────────────
function RevisionCard({ icono: Icono, titulo, completo, badge, children, onEditar, paso }) {
    const [expandido, setExpandido] = useState(true)

    return (
        <div className={`border rounded-2xl overflow-hidden transition-all
            ${completo
                ? "border-green-200"
                : "border-amber-200"
            }`}>
            {/* Cabecera */}
            <div
                className={`flex items-center justify-between px-4 py-3
                            cursor-pointer select-none transition-colors
                            ${completo ? "bg-green-50 hover:bg-green-100/50" : "bg-amber-50 hover:bg-amber-100/50"}`}
                onClick={() => setExpandido(!expandido)}
            >
                <div className="flex items-center gap-2.5">
                    {completo
                        ? <CheckCircle2 size={15} className="text-green-500 shrink-0" />
                        : <AlertCircle  size={15} className="text-amber-500 shrink-0" />
                    }
                    <Icono size={14} className="text-slate-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{titulo}</span>
                    {badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold
                                         bg-primary-100 text-primary-700">
                            {badge}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onEditar(paso) }}
                        className="text-xs text-primary-600 font-semibold
                                   hover:text-primary-800 transition-colors px-2.5 py-1
                                   rounded-lg hover:bg-primary-100"
                    >
                        Editar
                    </button>
                    {expandido
                        ? <ChevronUp   size={14} className="text-slate-400" />
                        : <ChevronDown size={14} className="text-slate-400" />
                    }
                </div>
            </div>

            {/* Contenido */}
            {expandido && (
                <div className="px-4 pb-4 pt-3 bg-white space-y-1.5">
                    {children}
                </div>
            )}
        </div>
    )
}

// ── Fila de dato individual ────────────────────────────────
function Dato({ label, valor, destacado = false }) {
    if (valor === null || valor === undefined || valor === "") return null
    return (
        <div className="flex items-start gap-2 text-xs py-0.5">
            <span className="text-slate-400 shrink-0 w-44">{label}</span>
            <span className={`font-medium leading-relaxed
                ${destacado ? "text-primary-700 text-sm" : "text-slate-700"}`}>
                {typeof valor === "boolean" ? (valor ? "Sí" : "No") : valor}
            </span>
        </div>
    )
}

// ── Chip de estado ─────────────────────────────────────────
function ChipEstado({ estado }) {
    const colores = {
        "Completo":   "bg-green-100 text-green-700",
        "Incompleto": "bg-red-100 text-red-700",
        "En curso":   "bg-blue-100 text-blue-700",
    }
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0
            ${colores[estado] || "bg-slate-100 text-slate-600"}`}>
            {estado}
        </span>
    )
}

// ── Separador de subsección ────────────────────────────────
function SubTitulo({ texto }) {
    return (
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide
                      pt-2 pb-1 border-t border-slate-100 mt-2">
            {texto}
        </p>
    )
}

// ── Lista compacta de items ────────────────────────────────
function ListaItems({ items, renderItem, vacio = "Sin registros" }) {
    if (!items || items.length === 0) {
        return (
            <p className="text-xs text-slate-400 italic py-1">{vacio}</p>
        )
    }
    return (
        <div className="space-y-1.5 mt-1">
            {items.map((item, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2
                                        bg-slate-50 rounded-lg border border-slate-100">
                    {renderItem(item, i)}
                </div>
            ))}
        </div>
    )
}

// ── Helper para régimen laboral ────────────────────────────
function resolverRegimen(l) {
    if (l.regimen_dl276)      return `DL 276 — ${l.regimen_dl276}`
    if (l.regimen_cas)        return `CAS — ${l.regimen_cas}`
    if (l.regimen_ordinario)  return `Ordinario — ${l.regimen_ordinario}`
    if (l.regimen_contratado) return `Contratado — ${l.regimen_contratado}`
    if (l.regimen_otros)      return l.regimen_otros
    return null
}

// ══ Componente principal ═══════════════════════════════════
export default function Step7Revision({ ficha, onIrAlPaso }) {

    const {
        personal, datos_laborales, familiares,
        formacion_academica, otros_estudios,
        experiencia_laboral, experiencia_docente,
        otras_instituciones, reconocimientos,
    } = ficha

    // ── Validaciones de completitud ────────────────────────
    const checks = {
        personal: !!(
            personal.apellido_paterno &&
            personal.apellido_materno &&
            personal.nombres &&
            personal.dni &&
            personal.sexo &&
            personal.fecha_nacimiento &&
            personal.estado_civil &&
            personal.celular &&
            personal.email_personal_1 &&
            personal.dom_direccion &&
            personal.banco &&
            personal.cuenta_numero &&
            personal.cuenta_cci
        ),
        laboral: !!(
            datos_laborales.dependencia &&
            datos_laborales.cargo &&
            datos_laborales.fecha_ingreso &&
            datos_laborales.email_institucional &&
            datos_laborales.condicion &&
            datos_laborales.tipo_personal
        ),
        familiares:  true,
        formacion:   formacion_academica.length > 0,
        experiencia: experiencia_laboral.length > 0,
        otros:       true,
    }

    const totalCompletos  = Object.values(checks).filter(Boolean).length
    const totalSecciones  = Object.keys(checks).length
    const listoParaEnviar = checks.personal && checks.laboral

    const nombreCompleto = [
        personal.apellido_paterno,
        personal.apellido_materno + ",",
        personal.nombres,
    ].filter(Boolean).join(" ")

    return (
        <div className="space-y-4">

            {/* ── Banner de estado ───────────────────────────── */}
            <div className={`rounded-2xl p-4 border
                ${listoParaEnviar
                    ? "bg-green-50 border-green-200"
                    : "bg-amber-50 border-amber-200"
                }`}>
                <div className="flex items-center gap-4">

                    {/* Foto o avatar */}
                    <div className="w-14 h-16 rounded-xl overflow-hidden shrink-0
                                    border-2 border-white shadow-sm bg-slate-100
                                    flex items-center justify-center">
                        {personal.foto_url || personal._foto_archivo ? (
                            <img
                                src={personal.foto_url ||
                                    (personal._foto_archivo instanceof File
                                        ? URL.createObjectURL(personal._foto_archivo)
                                        : null)}
                                alt="Foto"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Camera size={20} className="text-slate-300" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate
                            ${listoParaEnviar ? "text-green-800" : "text-amber-800"}`}>
                            {nombreCompleto || "Sin nombre"}
                        </p>
                        <p className={`text-xs mt-0.5
                            ${listoParaEnviar ? "text-green-600" : "text-amber-600"}`}>
                            {datos_laborales.cargo || "Sin cargo"} ·{" "}
                            {datos_laborales.condicion || ""} {datos_laborales.tipo_personal || ""}
                        </p>

                        {/* Barra de completitud */}
                        <div className="mt-2 h-1.5 bg-white/80 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700
                                    ${listoParaEnviar ? "bg-green-500" : "bg-amber-400"}`}
                                style={{ width: `${(totalCompletos / totalSecciones) * 100}%` }}
                            />
                        </div>
                        <p className={`text-xs mt-1 font-medium
                            ${listoParaEnviar ? "text-green-600" : "text-amber-600"}`}>
                            {listoParaEnviar
                                ? "✓ Todo listo para enviar"
                                : `${totalCompletos}/${totalSecciones} secciones completas — revise los campos marcados`
                            }
                        </p>
                    </div>

                    {/* Icono de estado */}
                    <div className="shrink-0">
                        {listoParaEnviar
                            ? <CheckCircle2 size={28} className="text-green-500" />
                            : <AlertCircle  size={28} className="text-amber-500" />
                        }
                    </div>
                </div>
            </div>

            {/* ══ 1. DATOS PERSONALES ════════════════════════ */}
            <RevisionCard
                icono={User} titulo="Datos Personales"
                completo={checks.personal}
                onEditar={onIrAlPaso} paso={1}
            >
                <Dato label="Apellidos y Nombres" valor={nombreCompleto} destacado />
                <Dato label="DNI" valor={personal.dni} />
                <Dato label="Sexo" valor={personal.sexo} />
                <Dato label="Fecha de Nacimiento" valor={personal.fecha_nacimiento} />
                <Dato label="Estado Civil" valor={personal.estado_civil} />
                <Dato label="Lugar de Nacimiento"
                    valor={[personal.nac_distrito, personal.nac_provincia,
                            personal.nac_departamento].filter(Boolean).join(", ")} />

                <SubTitulo texto="Contacto" />
                <Dato label="Celular" valor={personal.celular} />
                <Dato label="Teléfono Fijo" valor={personal.telefono_fijo} />
                <Dato label="Email Personal" valor={personal.email_personal_1} />
                <Dato label="Email Alternativo" valor={personal.email_personal_2} />

                <SubTitulo texto="Domicilio" />
                <Dato label="Dirección" valor={personal.dom_direccion} />
                <Dato label="Referencia" valor={personal.dom_referencia} />
                <Dato label="Tipo de Vivienda"
                    valor={personal.tipo_vivienda === "Otro"
                        ? `Otro — ${personal.tipo_vivienda_otro}`
                        : personal.tipo_vivienda} />

                <SubTitulo texto="Cuenta Bancaria" />
                <Dato label="Banco" valor={personal.banco} />
                <Dato label="N° de Cuenta" valor={personal.cuenta_numero} />
                <Dato label="CCI" valor={personal.cuenta_cci} />

                <SubTitulo texto="Datos Complementarios" />
                <Dato label="Grupo Sanguíneo" valor={personal.grupo_sanguineo} />
                <Dato label="Donador de Órganos" valor={personal.donador_organos} />
                <Dato label="RUC" valor={personal.ruc} />
                <Dato label="Licencia de Conducir" valor={personal.licencia_conducir} />

                <SubTitulo texto="Pensiones" />
                <Dato label="Sistema de Pensión" valor={personal.sistema_pension} />
                {personal.sistema_pension === "AFP" && (
                    <Dato label="AFP" valor={personal.afp_nombre} />
                )}
                <Dato label="Código de Afiliación" valor={personal.codigo_afiliacion} />
                <Dato label="Fecha de Afiliación" valor={personal.fecha_afiliacion} />

                {personal.idiomas_nativos?.length > 0 && (
                    <>
                        <SubTitulo texto="Idiomas Nativos" />
                        {personal.idiomas_nativos.map((id, i) => (
                            <Dato key={i}
                                label={id.idioma}
                                valor={`${id.nivel}${id.documento_acredita ? ` · ${id.documento_acredita}` : ""}`}
                            />
                        ))}
                    </>
                )}

                {personal.ofimatica?.length > 0 && (
                    <>
                        <SubTitulo texto="Ofimática" />
                        {personal.ofimatica.map((of, i) => (
                            <Dato key={i}
                                label={of.programa}
                                valor={`${of.nivel}${of.documento_acredita ? ` · ${of.documento_acredita}` : ""}`}
                            />
                        ))}
                    </>
                )}

                {!checks.personal && (
                    <p className="text-xs text-amber-600 font-medium mt-2 pt-2 border-t border-amber-100">
                        ⚠️ Faltan campos obligatorios — revise nombre, DNI, celular, email, dirección y cuenta bancaria
                    </p>
                )}
            </RevisionCard>

            {/* ══ 2. DATOS LABORALES ═════════════════════════ */}
            <RevisionCard
                icono={Briefcase} titulo="Datos Laborales"
                completo={checks.laboral}
                onEditar={onIrAlPaso} paso={2}
            >
                <Dato label="Dependencia" valor={datos_laborales.dependencia} destacado />
                <Dato label="Cargo" valor={datos_laborales.cargo} />
                <Dato label="Fecha de Ingreso" valor={datos_laborales.fecha_ingreso} />
                <Dato label="Email Institucional" valor={datos_laborales.email_institucional} />

                <SubTitulo texto="Régimen Laboral" />
                <Dato label="Condición" valor={datos_laborales.condicion} />
                <Dato label="Tipo de Personal" valor={datos_laborales.tipo_personal} />
                <Dato label="Régimen" valor={resolverRegimen(datos_laborales)} />
                <Dato label="Nivel Remunerativo" valor={datos_laborales.nivel_remunerativo} />
                <Dato label="Dedicación" valor={datos_laborales.dedicacion} />
                {datos_laborales.dedicacion === "Horas" && (
                    <Dato label="Horas Semanales" valor={datos_laborales.horas_semanales} />
                )}

                {datos_laborales.es_renacyt && (
                    <>
                        <SubTitulo texto="RENACYT" />
                        <Dato label="Código" valor={datos_laborales.renacyt_codigo} />
                        <Dato label="Nivel" valor={datos_laborales.renacyt_nivel} />
                        <Dato label="Estado"
                            valor={datos_laborales.renacyt_activo ? "Activo" : "Inactivo"} />
                    </>
                )}

                {!checks.laboral && (
                    <p className="text-xs text-amber-600 font-medium mt-2 pt-2 border-t border-amber-100">
                        ⚠️ Faltan campos obligatorios en Datos Laborales
                    </p>
                )}
            </RevisionCard>

            {/* ══ 3. FAMILIARES ══════════════════════════════ */}
            <RevisionCard
                icono={Users}
                titulo="Familiares"
                badge={familiares.length > 0 ? `${familiares.length}` : null}
                completo={checks.familiares}
                onEditar={onIrAlPaso} paso={3}
            >
                <ListaItems
                    items={familiares}
                    vacio="No se registraron familiares — campo opcional"
                    renderItem={(f) => (
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-medium text-slate-700">
                                {f.nombres} {f.apellido_paterno}
                                {f.dni && (
                                    <span className="text-slate-400 font-normal ml-1">
                                        · DNI {f.dni}
                                    </span>
                                )}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0
                                ${f.parentesco === "Cónyuge" ? "bg-purple-100 text-purple-700" :
                                  f.parentesco === "Hijo" || f.parentesco === "Hija"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-amber-100 text-amber-700"}`}>
                                {f.parentesco}
                            </span>
                        </div>
                    )}
                />
            </RevisionCard>

            {/* ══ 4. FORMACIÓN ACADÉMICA ═════════════════════ */}
            <RevisionCard
                icono={GraduationCap}
                titulo="Formación Académica"
                badge={`${formacion_academica.length + otros_estudios.length}`}
                completo={checks.formacion}
                onEditar={onIrAlPaso} paso={4}
            >
                <ListaItems
                    items={formacion_academica}
                    vacio="Sin formación académica registrada"
                    renderItem={(f) => (
                        <div className="flex items-start justify-between w-full gap-2">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-700">
                                    {f.nivel}
                                </p>
                                {f.centro_estudios && (
                                    <p className="text-xs text-slate-400 truncate">
                                        {f.centro_estudios}
                                    </p>
                                )}
                                {f.grado_obtenido && (
                                    <p className="text-xs text-slate-500">
                                        {f.grado_obtenido}
                                    </p>
                                )}
                            </div>
                            {f.estado && <ChipEstado estado={f.estado} />}
                        </div>
                    )}
                />

                {otros_estudios.length > 0 && (
                    <>
                        <SubTitulo texto={`Otros Estudios (${otros_estudios.length})`} />
                        <ListaItems
                            items={otros_estudios}
                            renderItem={(e) => (
                                <div className="flex items-start justify-between w-full gap-2">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-700 truncate">
                                            {e.nombre_curso}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {e.tipo} · {e.centro_estudios}
                                        </p>
                                    </div>
                                    {e.duracion_horas && (
                                        <span className="text-xs px-2 py-0.5 rounded-full
                                                         bg-slate-100 text-slate-600 shrink-0">
                                            {e.duracion_horas}h
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                    </>
                )}

                {!checks.formacion && (
                    <p className="text-xs text-amber-600 font-medium mt-2 pt-2 border-t border-amber-100">
                        ⚠️ Se recomienda registrar al menos un nivel de formación
                    </p>
                )}
            </RevisionCard>

            {/* ══ 5. EXPERIENCIA LABORAL ═════════════════════ */}
            <RevisionCard
                icono={Briefcase}
                titulo="Experiencia Laboral"
                badge={`${experiencia_laboral.length + experiencia_docente.length}`}
                completo={checks.experiencia}
                onEditar={onIrAlPaso} paso={5}
            >
                <ListaItems
                    items={experiencia_laboral}
                    vacio="Sin experiencia laboral registrada"
                    renderItem={(e) => (
                        <div className="flex items-start justify-between w-full gap-2">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-700 truncate">
                                    {e.cargo}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {e.nombre_entidad}
                                </p>
                                {e.fecha_inicio && (
                                    <p className="text-xs text-slate-400">
                                        {e.fecha_inicio} →{" "}
                                        {e.fecha_culminacion || "Actualidad"}
                                    </p>
                                )}
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0
                                ${e.tipo_institucion === "Estatal"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-600"}`}>
                                {e.tipo_institucion}
                            </span>
                        </div>
                    )}
                />

                {experiencia_docente.length > 0 && (
                    <>
                        <SubTitulo texto={`Experiencia Docente (${experiencia_docente.length})`} />
                        <ListaItems
                            items={experiencia_docente}
                            renderItem={(e) => (
                                <div className="min-w-0 w-full">
                                    <p className="text-xs font-semibold text-slate-700 truncate">
                                        {e.nombre_entidad}
                                    </p>
                                    {e.categoria && (
                                        <p className="text-xs text-slate-400">{e.categoria}</p>
                                    )}
                                    {e.fecha_inicio && (
                                        <p className="text-xs text-slate-400">
                                            {e.fecha_inicio} →{" "}
                                            {e.fecha_culminacion || "Actualidad"}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </>
                )}

                {!checks.experiencia && (
                    <p className="text-xs text-amber-600 font-medium mt-2 pt-2 border-t border-amber-100">
                        ⚠️ Se recomienda registrar al menos una experiencia laboral
                    </p>
                )}
            </RevisionCard>

            {/* ══ 6. OTRAS INSTITUCIONES Y RECONOCIMIENTOS ══ */}
            <RevisionCard
                icono={Building2}
                titulo="Otras Instituciones y Reconocimientos"
                badge={reconocimientos.length > 0 ? `${reconocimientos.length} reconoc.` : null}
                completo={checks.otros}
                onEditar={onIrAlPaso} paso={6}
            >
                <SubTitulo texto="Otras Instituciones" />
                <Dato
                    label="Labora en otras inst."
                    valor={otras_instituciones.labora_otra_inst ? "Sí" : "No"}
                />
                {otras_instituciones.labora_otra_inst && (
                    <>
                        <Dato label="Entidad" valor={otras_instituciones.nombre_entidad} />
                        <Dato label="Tipo de Personal" valor={otras_instituciones.tipo_personal} />
                        <Dato label="Horas Diarias" valor={otras_instituciones.horas_diarias} />
                    </>
                )}

                {reconocimientos.length > 0 && (
                    <>
                        <SubTitulo texto={`Reconocimientos (${reconocimientos.length})`} />
                        <ListaItems
                            items={reconocimientos}
                            renderItem={(r) => (
                                <div className="min-w-0 w-full">
                                    <p className="text-xs font-semibold text-slate-700 truncate">
                                        {r.tipo_reconocimiento}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {r.nombre_entidad}
                                        {r.fecha_documento && ` · ${r.fecha_documento}`}
                                    </p>
                                </div>
                            )}
                        />
                    </>
                )}
            </RevisionCard>

        </div>
    )
}