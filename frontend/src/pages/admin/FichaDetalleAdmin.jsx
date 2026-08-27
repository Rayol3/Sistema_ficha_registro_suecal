import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, FileText, User, Briefcase, Users,
  GraduationCap, Building2, Award, RefreshCw,
  AlertCircle, Phone, Mail, MapPin, CreditCard,
  Calendar, Shield,
} from "lucide-react"
import { adminService }  from "../../services/adminApi"
import { generarFicha }  from "../../utils/generarFicha"
import PantallaEstado    from "../../components/ui/PantallaEstado"

// ── Helpers ───────────────────────────────────────────────
function Dato({ label, valor }) {
  if (!valor && valor !== false) return null
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-400 w-40 shrink-0">{label}</span>
      <span className="text-xs font-medium text-slate-700 flex-1">
        {typeof valor === "boolean" ? (valor ? "Sí" : "No") : valor}
      </span>
    </div>
  )
}

function SeccionCard({ icono: Icono, titulo, children, color = "text-primary-600" }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3
                      border-b border-slate-100 bg-slate-50">
        <Icono size={15} className={color} />
        <h3 className="text-sm font-semibold text-slate-700">{titulo}</h3>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

function SubTitulo({ texto }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide
                  pt-2 pb-1 mt-1 border-t border-slate-100 first:border-0 first:pt-0">
      {texto}
    </p>
  )
}

function ListaItems({ items, vacio, renderItem }) {
  if (!items || items.length === 0) {
    return <p className="text-xs text-slate-400 italic py-1">{vacio}</p>
  }
  return (
    <div className="space-y-2 mt-1">
      {items.map((item, i) => (
        <div key={i} className="px-3 py-2 bg-slate-50 rounded-lg
                                border border-slate-100 text-xs">
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  )
}

function resolverRegimen(l) {
  if (!l) return null
  if (l.regimen_dl276)      return `DL 276 — ${l.regimen_dl276}`
  if (l.regimen_cas)        return `CAS — ${l.regimen_cas}`
  if (l.regimen_ordinario)  return `Ordinario — ${l.regimen_ordinario}`
  if (l.regimen_contratado) return `Contratado — ${l.regimen_contratado}`
  if (l.regimen_otros)      return l.regimen_otros
  return null
}

// ── Componente principal ───────────────────────────────────
export default function FichaDetalleAdmin() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [ficha,    setFicha]    = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error,    setError]    = useState("")
  const [pantalla, setPantalla] = useState({ visible: false })

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      setError("")
      try {
        const res = await adminService.obtenerFicha(id)
        setFicha(res.data)
      } catch {
        setError("No se pudo cargar la ficha del trabajador")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  const handleGenerarFicha = async () => {
    if (!ficha) return
    setPantalla({
      visible: true, tipo: "cargando",
      titulo: "Generando ficha...",
      subtitulo: `${ficha.personal?.apellido_paterno} ${ficha.personal?.nombres}`
    })
    // Pequeña pausa para que la pantalla aparezca antes de bloquear el hilo
    await new Promise((r) => setTimeout(r, 200))
    try {
      generarFicha({
        personal:            ficha.personal,
        datos_laborales:     ficha.datos_laborales     || {},
        familiares:          ficha.familiares           || [],
        formacion_academica: ficha.formacion_academica || [],
        otros_estudios:      ficha.otros_estudios      || [],
        experiencia_laboral: ficha.experiencia_laboral || [],
        experiencia_docente: ficha.experiencia_docente || [],
        otras_instituciones: ficha.otras_instituciones || {},
        reconocimientos:     ficha.reconocimientos     || [],
      }, parseInt(id))
      setTimeout(() => setPantalla({ visible: false }), 800)
    } catch {
      setPantalla({ visible: false })
    }
  }

  // ── Estados de carga ───────────────────────────────────
  if (cargando) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center text-slate-400">
        <RefreshCw size={28} className="animate-spin mx-auto mb-2" />
        <p className="text-sm">Cargando ficha...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-red-200 p-6
                      max-w-sm w-full text-center space-y-4">
        <AlertCircle size={32} className="text-red-400 mx-auto" />
        <p className="text-sm text-red-600 font-medium">{error}</p>
        <button onClick={() => navigate("/admin")}
          className="btn-secondary w-full justify-center">
          <ArrowLeft size={14} /> Volver al dashboard
        </button>
      </div>
    </div>
  )

  const p  = ficha.personal        || {}
  const l  = ficha.datos_laborales || {}
  const fa = ficha.familiares           || []
  const fo = ficha.formacion_academica  || []
  const oe = ficha.otros_estudios       || []
  const el = ficha.experiencia_laboral  || []
  const ed = ficha.experiencia_docente  || []
  const oi = ficha.otras_instituciones  || {}
  const re = ficha.reconocimientos      || []

  const nombreCompleto = `${p.apellido_paterno} ${p.apellido_materno}, ${p.nombres}`
  const conyuge = fa.find((f) => f.parentesco === "Cónyuge")
  const otrosFam = fa.filter((f) => f.parentesco !== "Cónyuge")

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-unamba-blue to-primary-600
                      shadow-lg sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3
                        flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate("/admin")}
              className="text-white/70 hover:text-white transition-colors
                         p-1.5 rounded-lg hover:bg-white/10 shrink-0">
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate leading-tight">
                {nombreCompleto}
              </p>
              <p className="text-blue-200 text-xs">
                DNI: {p.dni} · Registro #{String(id).padStart(5,"0")}
              </p>
            </div>
          </div>
          <button onClick={handleGenerarFicha}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/15
                       hover:bg-white/25 text-white text-xs font-semibold
                       rounded-lg transition-colors shrink-0">
            <FileText size={14} />
            Generar ficha
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

        {/* ── Banner del trabajador ──────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200
                        shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-4">
            <div className="w-16 h-20 rounded-xl overflow-hidden
                            border-2 border-slate-200 shrink-0 bg-slate-100
                            flex items-center justify-center">
              {p.foto_url
                ? <img src={p.foto_url} alt="Foto"
                    className="w-full h-full object-cover" />
                : <User size={24} className="text-slate-300" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-slate-800 leading-tight">
                {nombreCompleto}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {l.cargo || "Sin cargo"} · {l.dependencia || "Sin dependencia"}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {l.condicion && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium
                                   bg-primary-100 text-primary-700">
                    {l.condicion}
                  </span>
                )}
                {l.tipo_personal && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${l.tipo_personal === "Docente"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"}`}>
                    {l.tipo_personal}
                  </span>
                )}
                {resolverRegimen(l) && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium
                                   bg-slate-100 text-slate-600">
                    {resolverRegimen(l)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── 1. Datos Personales ────────────────────────── */}
        <SeccionCard icono={User} titulo="Datos Personales">
          <SubTitulo texto="Identificación" />
          <Dato label="DNI"              valor={p.dni} />
          <Dato label="Libreta Militar"  valor={p.libreta_militar} />
          <Dato label="Sexo"             valor={p.sexo} />
          <Dato label="Fecha Nacimiento" valor={p.fecha_nacimiento} />
          <Dato label="Estado Civil"     valor={p.estado_civil} />
          <Dato label="Lugar Nacimiento"
            valor={[p.nac_distrito, p.nac_provincia, p.nac_departamento, p.nac_pais]
              .filter(Boolean).join(", ")} />

          <SubTitulo texto="Contacto" />
          <Dato label="Celular"      valor={p.celular} />
          <Dato label="Teléfono"     valor={p.telefono_fijo} />
          <Dato label="Email 1"      valor={p.email_personal_1} />
          <Dato label="Email 2"      valor={p.email_personal_2} />

          <SubTitulo texto="Domicilio" />
          <Dato label="Dirección"      valor={p.dom_direccion} />
          <Dato label="Referencia"     valor={p.dom_referencia} />
          <Dato label="Tipo Vivienda"
            valor={p.tipo_vivienda === "Otro"
              ? `Otro — ${p.tipo_vivienda_otro}`
              : p.tipo_vivienda} />

          <SubTitulo texto="Cuenta Bancaria" />
          <Dato label="Banco"      valor={p.banco} />
          <Dato label="N° Cuenta"  valor={p.cuenta_numero} />
          <Dato label="CCI"        valor={p.cuenta_cci} />

          <SubTitulo texto="Complementarios" />
          <Dato label="Grupo Sanguíneo"   valor={p.grupo_sanguineo} />
          <Dato label="RUC"               valor={p.ruc} />
          <Dato label="Lic. Conducir"     valor={p.licencia_conducir} />
          <Dato label="Afil. ESSALUD"     valor={p.afiliacion_essalud} />
          <Dato label="Donador órganos"   valor={p.donador_organos} />
          <Dato label="Discapacidad"      valor={p.tiene_discapacidad} />
          {p.tiene_discapacidad && (
            <Dato label="Reg. CONADIS" valor={p.conadis_registro} />
          )}

          <SubTitulo texto="Pensiones" />
          <Dato label="Sistema"         valor={p.sistema_pension} />
          {p.sistema_pension === "AFP" && (
            <Dato label="AFP" valor={p.afp_nombre} />
          )}
          <Dato label="Cód. Afiliación" valor={p.codigo_afiliacion} />
          <Dato label="Fecha Afiliación" valor={p.fecha_afiliacion} />

          <SubTitulo texto="Denominación Profesional" />
          <Dato label="Profesión"      valor={p.denominacion_prof} />
          <Dato label="Abreviatura"    valor={p.abreviatura_prof} />
          <Dato label="Colegio Prof."  valor={p.colegio_prof_nombre} />
          <Dato label="N° Colegiatura" valor={p.colegio_prof_numero} />
          <Dato label="Fecha Coleg."   valor={p.colegio_prof_fecha} />

          {p.idiomas_nativos?.length > 0 && (
            <>
              <SubTitulo texto="Idiomas Nativos" />
              {p.idiomas_nativos.map((id, i) => (
                <Dato key={i} label={id.idioma}
                  valor={`${id.nivel}${id.documento_acredita ? ` · ${id.documento_acredita}` : ""}`} />
              ))}
            </>
          )}

          {p.ofimatica?.length > 0 && (
            <>
              <SubTitulo texto="Ofimática" />
              {p.ofimatica.map((of, i) => (
                <Dato key={i} label={of.programa}
                  valor={`${of.nivel}${of.documento_acredita ? ` · ${of.documento_acredita}` : ""}`} />
              ))}
            </>
          )}
        </SeccionCard>

        {/* ── 2. Datos Laborales ────────────────────────── */}
        <SeccionCard icono={Briefcase} titulo="Datos Laborales"
          color="text-green-600">
          <Dato label="Dependencia"        valor={l.dependencia} />
          <Dato label="Cargo"              valor={l.cargo} />
          <Dato label="Fecha de Ingreso"   valor={l.fecha_ingreso} />
          <Dato label="Email Institucional" valor={l.email_institucional} />
          <Dato label="Condición"          valor={l.condicion} />
          <Dato label="Tipo de Personal"   valor={l.tipo_personal} />

          <SubTitulo texto="Régimen Laboral" />
          <Dato label="Régimen"            valor={resolverRegimen(l)} />
          <Dato label="Nivel Remunerativo" valor={l.nivel_remunerativo} />
          <Dato label="Dedicación"         valor={l.dedicacion} />
          {l.dedicacion === "Horas" && (
            <Dato label="Horas Semanales"  valor={l.horas_semanales} />
          )}

          {l.es_renacyt && (
            <>
              <SubTitulo texto="RENACYT" />
              <Dato label="Código"  valor={l.renacyt_codigo} />
              <Dato label="Nivel"   valor={l.renacyt_nivel} />
              <Dato label="Estado"  valor={l.renacyt_activo ? "Activo" : "Inactivo"} />
            </>
          )}
        </SeccionCard>

        {/* ── 3. Familiares ─────────────────────────────── */}
        <SeccionCard icono={Users} titulo={`Familiares (${fa.length})`}
          color="text-purple-600">
          {conyuge && (
            <>
              <SubTitulo texto="Cónyuge" />
              <Dato label="Nombre completo"
                valor={`${conyuge.apellido_paterno} ${conyuge.apellido_materno}, ${conyuge.nombres}`} />
              <Dato label="DNI"              valor={conyuge.dni} />
              <Dato label="Fecha Nacimiento" valor={conyuge.fecha_nacimiento} />
            </>
          )}
          {otrosFam.length > 0 && (
            <>
              <SubTitulo texto="Otros familiares" />
              <ListaItems
                items={otrosFam}
                vacio="Sin familiares registrados"
                renderItem={(f) => (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-700">
                        {f.apellido_paterno} {f.apellido_materno}, {f.nombres}
                      </p>
                      <p className="text-slate-400 mt-0.5">
                        DNI: {f.dni || "—"} · Nac: {f.fecha_nacimiento || "—"}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-semibold shrink-0
                      ${f.parentesco === "Hijo" || f.parentesco === "Hija"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"}`}>
                      {f.parentesco}
                    </span>
                  </div>
                )}
              />
            </>
          )}
          {fa.length === 0 && (
            <p className="text-xs text-slate-400 italic">
              Sin familiares registrados
            </p>
          )}
        </SeccionCard>

        {/* ── 4. Formación Académica ────────────────────── */}
        <SeccionCard icono={GraduationCap}
          titulo={`Formación Académica (${fo.length + oe.length})`}
          color="text-blue-600">
          <ListaItems
            items={fo}
            vacio="Sin formación académica registrada"
            renderItem={(f) => (
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-700">{f.nivel}</p>
                  {f.centro_estudios && (
                    <p className="text-slate-500 truncate">{f.centro_estudios}</p>
                  )}
                  {f.grado_obtenido && (
                    <p className="text-slate-400">{f.grado_obtenido}</p>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded-full font-medium shrink-0
                  ${f.estado === "Completo"
                    ? "bg-green-100 text-green-700"
                    : f.estado === "En curso"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"}`}>
                  {f.estado}
                </span>
              </div>
            )}
          />

          {oe.length > 0 && (
            <>
              <SubTitulo texto={`Otros Estudios (${oe.length})`} />
              <ListaItems
                items={oe}
                vacio=""
                renderItem={(e) => (
                  <div>
                    <p className="font-semibold text-slate-700">{e.nombre_curso}</p>
                    <p className="text-slate-400">
                      {e.tipo} · {e.centro_estudios}
                      {e.duracion_horas ? ` · ${e.duracion_horas}h` : ""}
                    </p>
                  </div>
                )}
              />
            </>
          )}
        </SeccionCard>

        {/* ── 5. Experiencia Laboral ────────────────────── */}
        <SeccionCard icono={Briefcase}
          titulo={`Experiencia Laboral (${el.length + ed.length})`}
          color="text-amber-600">
          <ListaItems
            items={el}
            vacio="Sin experiencia laboral registrada"
            renderItem={(e) => (
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-700 truncate">{e.cargo}</p>
                  <p className="text-slate-500 truncate">{e.nombre_entidad}</p>
                  <p className="text-slate-400">
                    {e.fecha_inicio} → {e.fecha_culminacion || "Actualidad"}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-medium shrink-0
                  ${e.tipo_institucion === "Estatal"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"}`}>
                  {e.tipo_institucion}
                </span>
              </div>
            )}
          />

          {ed.length > 0 && (
            <>
              <SubTitulo texto={`Experiencia Docente (${ed.length})`} />
              <ListaItems
                items={ed}
                vacio=""
                renderItem={(e) => (
                  <div>
                    <p className="font-semibold text-slate-700">{e.nombre_entidad}</p>
                    {e.categoria && (
                      <p className="text-slate-500">{e.categoria}</p>
                    )}
                    <p className="text-slate-400">
                      {e.fecha_inicio} → {e.fecha_culminacion || "Actualidad"}
                    </p>
                  </div>
                )}
              />
            </>
          )}
        </SeccionCard>

        {/* ── 6. Otras Instituciones ────────────────────── */}
        <SeccionCard icono={Building2} titulo="Otras Instituciones"
          color="text-slate-600">
          <Dato label="Labora en otra inst."
            valor={oi.labora_otra_inst ? "Sí" : "No"} />
          {oi.labora_otra_inst && (
            <>
              <Dato label="Entidad"        valor={oi.nombre_entidad} />
              <Dato label="Tipo Personal"  valor={oi.tipo_personal} />
              <Dato label="Horas Diarias"  valor={oi.horas_diarias} />
              <Dato label="Días"
                valor={[
                  oi.dia_lunes     && "Lun",
                  oi.dia_martes    && "Mar",
                  oi.dia_miercoles && "Mié",
                  oi.dia_jueves    && "Jue",
                  oi.dia_viernes   && "Vie",
                ].filter(Boolean).join(", ")} />
            </>
          )}
        </SeccionCard>

        {/* ── 7. Reconocimientos ───────────────────────── */}
        {re.length > 0 && (
          <SeccionCard icono={Award}
            titulo={`Reconocimientos (${re.length})`}
            color="text-yellow-600">
            <ListaItems
              items={re}
              vacio=""
              renderItem={(r) => (
                <div>
                  <p className="font-semibold text-slate-700">
                    {r.tipo_reconocimiento}
                  </p>
                  <p className="text-slate-500">{r.nombre_entidad}</p>
                  {r.fecha_documento && (
                    <p className="text-slate-400">{r.fecha_documento}</p>
                  )}
                </div>
              )}
            />
          </SeccionCard>
        )}

        {/* Botón volver al final */}
        <button onClick={() => navigate("/admin")}
          className="btn-secondary w-full justify-center">
          <ArrowLeft size={14} />
          Volver al dashboard
        </button>

      </div>
      <PantallaEstado
        tipo={pantalla.tipo}
        titulo={pantalla.titulo}
        subtitulo={pantalla.subtitulo}
        visible={pantalla.visible}
        onTerminar={() => setPantalla({ visible: false })}
      />
    </div>
  )
}
