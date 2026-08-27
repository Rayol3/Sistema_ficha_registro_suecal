import { Building2, Calendar, Award, FlaskConical, Info } from "lucide-react"
import { Input, Select, SectionTitle, FieldGrid } from "../ui/FormField"
import {
  CONDICION, TIPO_PERSONAL, DEDICACION,
  CATEGORIA_REGIMEN, NIVEL_REMUNERATIVO, NIVEL_RENACYT,
} from "../../utils/constants"
import { useValidacion } from "../../hooks/useValidacion"

export default function Step2Laboral({ datos, onChange, tocados: tocadosGlobalesRaw = {} }) {
  const set = (campo, valor) => onChange("datos_laborales", campo, valor)

  // ── Limpiar prefijo "datos_laborales." de las keys ────────
  const tocadosGlobales = Object.fromEntries(
    Object.entries(tocadosGlobalesRaw)
      .filter(([k]) => k.startsWith("datos_laborales."))
      .map(([k, v]) => [k.replace("datos_laborales.", ""), v])
  )

  // ── Hook de validación unificado con tocadosGlobales ──────
  const { props: vProps, validar } = useValidacion({
    dependencia: {
      requerido: true,
      minLength: 2,
      mensajeRequerido: "La dependencia es obligatoria",
    },
    cargo: {
      requerido: true,
      minLength: 2,
      mensajeRequerido: "El cargo es obligatorio",
    },
    email_institucional: {
      requerido: true,
      patron: /^[^@]+@[^@]+\.[^@]+$/,
      mensajeRequerido: "El correo institucional es obligatorio",
      mensajePatron: "Ingrese un email válido",
      validar: (v) => v.endsWith("@unamba.edu.pe")
        ? true : "Debe terminar en @unamba.edu.pe",
    },
    fecha_ingreso: {
      requerido: true,
      mensajeRequerido: "La fecha de ingreso es obligatoria",
      validar: (v) => {
        if (!v) return true
        const hoy = new Date().toISOString().split("T")[0]
        if (v > hoy) return "La fecha de ingreso no puede ser una fecha futura"
        return true
      },
    },
    condicion: {
      requerido: true,
      mensajeRequerido: "La condición es obligatoria",
    },
    tipo_personal: {
      requerido: true,
      mensajeRequerido: "El tipo de personal es obligatorio",
    },
    categoria_regimen: {
      requerido: false,
      validar: (v) => {
        if (!datos.condicion || !datos.tipo_personal) return true
        if (!v) return "Seleccione una categoría del régimen laboral"
        return true
      },
    },
    nivel_remunerativo: {
      requerido: false,
      validar: (v) => {
        if (datos.categoria_regimen === "DL 276" && !v)
          return "Nivel remunerativo obligatorio para DL 276"
        return true
      },
    },
    dedicacion: {
      requerido: false,
      validar: (v) => {
        if (datos.tipo_personal === "Docente" && !v)
          return "La dedicación es obligatoria para docentes"
        return true
      },
    },
    horas_semanales: {
      requerido: false,
      validar: (v) => {
        if (datos.dedicacion === "Horas" && (!v || v < 1))
          return "Ingrese las horas semanales"
        return true
      },
    },
    renacyt_codigo: {
      requerido: false,
      validar: (v) => {
        if (datos.es_renacyt && !v?.trim())
          return "El código RENACYT es obligatorio"
        return true
      },
    },
    renacyt_nivel: {
      requerido: false,
      validar: (v) => {
        if (datos.es_renacyt && !v)
          return "El nivel RENACYT es obligatorio"
        return true
      },
    },
    regimen_otros: {
      requerido: false,
    },
  }, tocadosGlobales)

  // ── Helper combinado igual al Paso 1 ─────────────────────
  const campo = (nombre) => ({
    value: datos[nombre] ?? "",
    ...vProps(nombre, datos[nombre]),
    onChange: (e) => {
      const val = e.target.type === "checkbox" ? e.target.checked : e.target.value
      vProps(nombre, datos[nombre]).onChange(e)
      set(nombre, val)
    },
  })

  // ── Régimen dinámico ──────────────────────────────────────
  const claveRegimen = datos.condicion && datos.tipo_personal
    ? `${datos.condicion}-${datos.tipo_personal}`
    : null

  const configRegimen = claveRegimen ? CATEGORIA_REGIMEN[claveRegimen] : null

  const limpiarRegimen = () => {
    onChange("datos_laborales", "categoria_regimen",  "")
    onChange("datos_laborales", "regimen_dl276",       "")
    onChange("datos_laborales", "regimen_cas",         "")
    onChange("datos_laborales", "regimen_ordinario",   "")
    onChange("datos_laborales", "regimen_contratado",  "")
    onChange("datos_laborales", "nivel_remunerativo",  "")
    onChange("datos_laborales", "dedicacion",          "")
    onChange("datos_laborales", "horas_semanales",     null)
  }

  const handleCondicion = (valor) => {
    set("condicion", valor)
    limpiarRegimen()
    validar("condicion", valor)
  }

  const handleTipoPersonal = (valor) => {
    set("tipo_personal", valor)
    limpiarRegimen()
    validar("tipo_personal", valor)
    if (valor === "Administrativo") {
      set("es_renacyt",    false)
      set("renacyt_codigo", "")
      set("renacyt_nivel",  "")
    }
  }

  const valorSubRegimen = configRegimen
    ? datos[configRegimen.campo] || ""
    : ""

  const handleSubRegimen = (valor) => {
    if (!configRegimen) return
    onChange("datos_laborales", "regimen_dl276",      "")
    onChange("datos_laborales", "regimen_cas",         "")
    onChange("datos_laborales", "regimen_ordinario",   "")
    onChange("datos_laborales", "regimen_contratado",  "")
    onChange("datos_laborales", configRegimen.campo,   valor)
    onChange("datos_laborales", "categoria_regimen",   configRegimen.value)
    validar("categoria_regimen", configRegimen.value)
  }

  const esDocente = datos.tipo_personal === "Docente"

  return (
    <div className="space-y-5">

      {/* ══ 1. UBICACIÓN INSTITUCIONAL ════════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Building2}
          titulo="Ubicación Institucional"
          subtitulo="Dependencia y cargo actual en la UNAMBA"
        />
        <FieldGrid cols={2}>
          <div className="sm:col-span-2">
            <Input
              label="Dependencia / Unidad Orgánica" required
              placeholder="Ej: Facultad de Ingeniería, Dirección de RR.HH., Escuela de Sistemas"
              {...campo("dependencia")}
            />
          </div>
          <Input
            label="Cargo que Desempeña" required
            placeholder="Ej: Docente Ordinario, Técnico Administrativo, Auxiliar"
            {...campo("cargo")}
          />
          <Input
            label="Correo Institucional" required type="email"
            placeholder="usuario@unamba.edu.pe"
            {...campo("email_institucional")}
          />
        </FieldGrid>
      </div>

      {/* ══ 2. CONDICIÓN Y TIPO ════════════════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Award}
          titulo="Condición y Tipo de Personal"
          subtitulo="La combinación determina el régimen laboral aplicable"
        />
        <FieldGrid cols={2}>
          <Select
            label="Condición" required opciones={CONDICION}
            {...vProps("condicion", datos.condicion)}
            value={datos.condicion ?? ""}
            onChange={(e) => {
              vProps("condicion", datos.condicion).onChange(e)
              handleCondicion(e.target.value)
            }}
          />
          <Select
            label="Tipo de Personal" required opciones={TIPO_PERSONAL}
            {...vProps("tipo_personal", datos.tipo_personal)}
            value={datos.tipo_personal ?? ""}
            onChange={(e) => {
              vProps("tipo_personal", datos.tipo_personal).onChange(e)
              handleTipoPersonal(e.target.value)
            }}
          />
        </FieldGrid>

        {configRegimen && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2
                          bg-primary-50 border border-primary-200 rounded-lg">
            <Info size={13} className="text-primary-500 shrink-0" />
            <p className="text-xs text-primary-700">
              Régimen aplicable:{" "}
              <strong>{configRegimen.label}</strong>
            </p>
          </div>
        )}

        {datos.condicion && !datos.tipo_personal && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2
                          bg-amber-50 border border-amber-200 rounded-lg">
            <Info size={13} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700">
              Seleccione el tipo de personal para ver el régimen aplicable.
            </p>
          </div>
        )}
      </div>

      {/* ══ 3. RÉGIMEN LABORAL (dinámico) ═════════════════ */}
      {configRegimen && (
        <div className="form-card">
          <SectionTitle
            icono={Award}
            titulo={configRegimen.label}
            subtitulo={`Aplica para personal ${datos.condicion?.toLowerCase()} ${datos.tipo_personal?.toLowerCase()}`}
          />
          <FieldGrid cols={2}>
            <Select
              label="Categoría / Nivel" required
              opciones={configRegimen.opciones}
              {...vProps("categoria_regimen", datos.categoria_regimen)}
              value={valorSubRegimen}
              onChange={(e) => {
                vProps("categoria_regimen", datos.categoria_regimen).onChange(e)
                handleSubRegimen(e.target.value)
              }}
            />

            {configRegimen.mostrarNivel && (
              <Select
                label="Nivel Remunerativo" required
                opciones={NIVEL_REMUNERATIVO}
                {...campo("nivel_remunerativo")}
              />
            )}

            {configRegimen.mostrarDedicacion && (
              <Select
                label="Dedicación" required
                opciones={DEDICACION}
                {...vProps("dedicacion", datos.dedicacion)}
                value={datos.dedicacion ?? ""}
                onChange={(e) => {
                  vProps("dedicacion", datos.dedicacion).onChange(e)
                  set("dedicacion", e.target.value)
                  validar("dedicacion", e.target.value)
                  if (e.target.value !== "Horas") set("horas_semanales", null)
                }}
              />
            )}

            {configRegimen.mostrarDedicacion &&
             datos.dedicacion === "Horas" && (
              <Input
                label="Horas Semanales" required type="number"
                min={1} max={40}
                placeholder="Ej: 20"
                {...vProps("horas_semanales", datos.horas_semanales)}
                value={datos.horas_semanales ?? ""}
                onChange={(e) => {
                  const valor = parseInt(e.target.value) || null
                  vProps("horas_semanales", datos.horas_semanales).onChange(e)
                  set("horas_semanales", valor)
                  validar("horas_semanales", valor)
                }}
              />
            )}

            <div className="sm:col-span-2">
              <Input
                label="Otro Régimen (especificar si aplica)"
                placeholder="Solo si no aplica ninguna categoría anterior"
                {...campo("regimen_otros")}
              />
            </div>
          </FieldGrid>
        </div>
      )}

      {/* ══ 4. RENACYT — solo docentes ════════════════════ */}
      {esDocente && (
        <div className="form-card">
          <SectionTitle
            icono={FlaskConical}
            titulo="Investigador RENACYT"
            subtitulo="Registro Nacional Científico, Tecnológico y de Innovación Tecnológica"
          />

          <div className="flex items-center gap-4 p-4 bg-slate-50
                          rounded-lg border border-slate-200 mb-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">
                ¿Es investigador RENACYT?
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Registrado en CONCYTEC
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  set("es_renacyt",     false)
                  set("renacyt_codigo", "")
                  set("renacyt_nivel",  "")
                  set("renacyt_activo", true)
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold
                            transition-all duration-150 border
                  ${!datos.es_renacyt
                    ? "bg-slate-700 text-white border-slate-700"
                    : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
                  }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => set("es_renacyt", true)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold
                            transition-all duration-150 border
                  ${datos.es_renacyt
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Sí
              </button>
            </div>
          </div>

          {datos.es_renacyt && (
            <div className="space-y-4">
              <FieldGrid cols={2}>
                <Input
                  label="Código RENACYT" required
                  placeholder="Ej: P0012345"
                  {...campo("renacyt_codigo")}
                />
                <Select
                  label="Nivel RENACYT" required
                  opciones={NIVEL_RENACYT}
                  {...campo("renacyt_nivel")}
                />
              </FieldGrid>

              <div className="flex items-center gap-4 px-3 py-2.5
                              bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700">
                    Estado en RENACYT
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => set("renacyt_activo", false)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                                transition-all duration-150 border
                      ${!datos.renacyt_activo
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white text-slate-500 border-slate-300"
                      }`}
                  >
                    Inactivo
                  </button>
                  <button
                    type="button"
                    onClick={() => set("renacyt_activo", true)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                                transition-all duration-150 border
                      ${datos.renacyt_activo
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-slate-500 border-slate-300"
                      }`}
                  >
                    Activo
                  </button>
                </div>
              </div>
            </div>
          )}

          {!datos.es_renacyt && (
            <div className="flex items-start gap-2 px-3 py-2.5
                            bg-slate-50 border border-slate-200 rounded-lg">
              <Info size={13} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500">
                Si no está registrado en RENACYT, este campo no es obligatorio.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══ 5. FECHA DE INGRESO ════════════════════════════ */}
      <div className="form-card">
        <SectionTitle
          icono={Calendar}
          titulo="Ingreso a la UNAMBA"
        />
        <FieldGrid cols={2}>
          <Input
            label="Fecha de Ingreso" required type="date"
            max={new Date().toISOString().split("T")[0]}
            {...campo("fecha_ingreso")}
          />
        </FieldGrid>
      </div>

    </div>
  )
}