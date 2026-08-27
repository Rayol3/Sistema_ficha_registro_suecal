import React, { useState } from "react";
import { 
  User, Briefcase, Users, GraduationCap, 
  Building2, Award, CheckCircle2, AlertCircle,
  ChevronDown, ChevronUp, Printer
} from "lucide-react";

// ── Componente de Campo Individual (Simula celda de formulario) ──
function Field({ label, value, colSpan = 1, isBoolean = false }) {
  const displayValue = isBoolean 
    ? (value ? "SÍ" : "NO") 
    : (value || "-");

  return (
    <div className={`border border-slate-300 p-2 bg-white ${colSpan > 1 ? `col-span-${colSpan}` : ''}`}>
      <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">
        {label}
      </div>
      <div className="text-sm text-slate-800 font-medium min-h-[1.25rem] break-words">
        {displayValue}
      </div>
    </div>
  );
}

// ── Componente de Tabla para Listados ──
function DataTable({ headers, rows, emptyMessage = "Sin registros" }) {
  if (!rows || rows.length === 0) {
    return <div className="border border-slate-300 p-4 text-center text-sm text-slate-400 italic bg-white">{emptyMessage}</div>;
  }

  return (
    <div className="border border-slate-300 bg-white overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="border-b border-r border-slate-300 p-2 text-left last:border-r-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              {Object.values(row).map((val, j) => (
                <td key={j} className="border-b border-r border-slate-200 p-2 text-slate-700 last:border-r-0">
                  {val || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Tarjeta de Sección Colapsable ──
function SectionCard({ icon: Icon, title, number, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm print:shadow-none print:border-black">
      <div 
        className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer select-none hover:bg-slate-100 transition-colors print:bg-white print:cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold print:bg-black print:text-white">
            {number}
          </div>
          <Icon size={16} className="text-slate-600 print:text-black" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wide print:text-black">{title}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 print:hidden ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="p-4 space-y-4 print:p-0 print:space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

// ══ Componente Principal ═══════════════════════════════════
export default function FichaRegistroPreview({ ficha, onEditar }) {
  const { 
    personal, datos_laborales, familiares,
    formacion_academica, otros_estudios,
    experiencia_laboral, experiencia_docente,
    otras_instituciones, reconocimientos 
  } = ficha || {};

  const handlePrint = () => {
    window.print();
  };

  if (!ficha) return <div className="p-8 text-center text-slate-500">Cargando ficha...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 print:p-0 print:max-w-none">
      
      {/* Botón de Imprimir (Oculto en impresión) */}
      <div className="flex justify-end gap-3 print:hidden">
        {onEditar && (
          <button 
            onClick={() => onEditar(1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <AlertCircle size={16} />
            Editar Datos
          </button>
        )}
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Printer size={16} />
          Imprimir / Guardar PDF
        </button>
      </div>

      {/* ── ENCABEZADO OFICIAL ─────────────────────────────── */}
      <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6 print:border-b-2 print:border-black">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest print:text-black">
          Universidad Licenciada
        </p>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase leading-tight print:text-black">
          Universidad Nacional Micaela Bastidas de Apurímac
        </h1>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800 print:text-black">OFICINA DE RECURSOS HUMANOS - RR.HH.</p>
          <p className="text-xs font-semibold text-slate-600 print:text-black">SUB OFICINA DE ESCALAFÓN Y ASUNTOS LABORALES</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-300">
          <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-wide print:text-black">
            Ficha de Registro de Datos del Personal Docente - No Docente
          </h2>
          <p className="text-xs text-slate-500 mt-1 print:text-black">
            Datos Personales, Familiares, Laborales, Formación Académica y Otros
          </p>
        </div>
      </div>

      {/* ── 1. DATOS PERSONALES ────────────────────────────── */}
      <SectionCard icon={User} title="Datos Personales" number="1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          <Field label="Apellido Paterno" value={personal?.apellido_paterno} colSpan={1} />
          <Field label="Apellido Materno" value={personal?.apellido_materno} colSpan={1} />
          <Field label="Nombres" value={personal?.nombres} colSpan={2} />
          
          <Field label="DNI" value={personal?.dni} />
          <Field label="Libreta Militar" value={personal?.libreta_militar} />
          <Field label="Sexo" value={personal?.sexo} />
          <Field label="Fecha de Nacimiento" value={personal?.fecha_nacimiento} />
          
          <Field label="País de Nacimiento" value={personal?.nac_pais} />
          <Field label="Departamento" value={personal?.nac_departamento} />
          <Field label="Provincia" value={personal?.nac_provincia} />
          <Field label="Distrito" value={personal?.nac_distrito} />
          
          <Field label="Estado Civil" value={personal?.estado_civil} />
          <Field label="Teléfono Fijo" value={personal?.telefono_fijo} />
          <Field label="Celular" value={personal?.celular} />
          <Field label="Email Personal 1" value={personal?.email_personal_1} colSpan={1} />
          
          <Field label="Tipo de Vía" value={personal?.dom_tipo_via} />
          <Field label="Dirección Actual" value={personal?.dom_direccion} colSpan={2} />
          <Field label="Referencia" value={personal?.dom_referencia} />
          
          <Field label="Tipo de Vivienda" value={personal?.tipo_vivienda} />
          <Field label="RUC" value={personal?.ruc} />
          <Field label="Licencia de Conducir" value={personal?.licencia_conducir} />
          <Field label="Afiliación ESSALUD" value={personal?.afiliacion_essalud} />
          
          <Field label="Grupo Sanguíneo" value={personal?.grupo_sanguineo} />
          <Field label="Donador de Órganos" value={personal?.donador_organos} isBoolean />
          <Field label="Banco" value={personal?.banco} />
          <Field label="N° de Cuenta" value={personal?.cuenta_numero} />
          
          <Field label="CCI" value={personal?.cuenta_cci} colSpan={2} />
          <Field label="Denominación Profesional" value={personal?.denominacion_prof} />
          <Field label="Abreviatura" value={personal?.abreviatura_prof} />
          
          <Field label="Colegio Profesional" value={personal?.colegio_prof_nombre} colSpan={2} />
          <Field label="N° Colegiatura" value={personal?.colegio_prof_numero} />
          <Field label="Fecha Colegiatura" value={personal?.colegio_prof_fecha} />
          
          <Field label="Sistema de Pensiones" value={personal?.sistema_pension} />
          <Field label="Nombre AFP" value={personal?.afp_nombre} />
          <Field label="Tiene Discapacidad" value={personal?.tiene_discapacidad} isBoolean />
          <Field label="Registro CONADIS" value={personal?.conadis_registro} />
          
          <Field label="Realizó Servicio Militar" value={personal?.realizo_serv_militar} isBoolean />
          <Field label="Rama" value={personal?.serv_militar_rama} />
          <Field label="Cargo" value={personal?.serv_militar_cargo} />
          <Field label="Fechas (Inicio - Fin)" value={`${personal?.serv_militar_fecha_inicio || ''} - ${personal?.serv_militar_fecha_fin || ''}`} />
        </div>

        {/* Idiomas y Ofimática */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Idiomas Nativos / Dialectos</h4>
            {personal?.idiomas_nativos?.length > 0 ? (
              <DataTable 
                headers={["Idioma", "Nivel", "Documento"]}
                rows={personal.idiomas_nativos.map(i => ({ "Idioma": i.idioma, "Nivel": i.nivel, "Documento": i.documento || "-" }))}
              />
            ) : (
              <div className="border border-slate-300 p-3 text-xs text-slate-400 italic bg-white">No registrado</div>
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Conocimiento de Ofimática</h4>
            {personal?.ofimatica?.length > 0 ? (
              <DataTable 
                headers={["Programa", "Nivel", "Documento"]}
                rows={personal.ofimatica.map(o => ({ "Programa": o.programa, "Nivel": o.nivel, "Documento": o.documento || "-" }))}
              />
            ) : (
              <div className="border border-slate-300 p-3 text-xs text-slate-400 italic bg-white">No registrado</div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── 2. DATOS LABORALES ─────────────────────────────── */}
      <SectionCard icon={Briefcase} title="Datos Laborales" number="2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          <Field label="Dependencia" value={datos_laborales?.dependencia} colSpan={2} />
          <Field label="Cargo" value={datos_laborales?.cargo} colSpan={2} />
          
          <Field label="Fecha de Ingreso" value={datos_laborales?.fecha_ingreso} />
          <Field label="Email Institucional" value={datos_laborales?.email_institucional} colSpan={3} />
          
          <Field label="Condición" value={datos_laborales?.condicion} />
          <Field label="Tipo de Personal" value={datos_laborales?.tipo_personal} />
          <Field label="Categoría / Régimen" value={datos_laborales?.categoria_regimen} />
          <Field label="Nivel Remunerativo" value={datos_laborales?.nivel_remunerativo} />
          
          <Field label="Régimen D.L. 276" value={datos_laborales?.regimen_dl276} />
          <Field label="Régimen CAS" value={datos_laborales?.regimen_cas} />
          <Field label="Régimen Ordinario" value={datos_laborales?.regimen_ordinario} />
          <Field label="Régimen Contratado" value={datos_laborales?.regimen_contratado} />
          
          <Field label="Dedicación" value={datos_laborales?.dedicacion} />
          <Field label="Horas Semanales" value={datos_laborales?.horas_semanales} />
          <Field label="Es RENACYT" value={datos_laborales?.es_renacyt} isBoolean />
          <Field label="Código RENACYT" value={datos_laborales?.renacyt_codigo} />
        </div>
      </SectionCard>

      {/* ── 3. FAMILIARES ──────────────────────────────────── */}
      <SectionCard icon={Users} title="Familiares y Derechohabientes" number="3">
        <DataTable 
          headers={["Apellidos y Nombres", "Parentesco", "DNI", "Fecha Nac.", "Vive con Usted"]}
          rows={familiares?.map(f => ({
            "Apellidos y Nombres": `${f.apellido_paterno} ${f.apellido_materno}, ${f.nombres}`,
            "Parentesco": f.parentesco,
            "DNI": f.dni,
            "Fecha Nac.": f.fecha_nacimiento,
            "Vive con Usted": f.vive_con_usted ? "SÍ" : "NO"
          })) || []}
          emptyMessage="No se registraron familiares"
        />
      </SectionCard>

      {/* ── 4. FORMACIÓN ACADÉMICA ─────────────────────────── */}
      <SectionCard icon={GraduationCap} title="Formación Académica y Otros Estudios" number="4">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Nivel Educativo</h4>
        <DataTable 
          headers={["Nivel", "Estado", "Centro de Estudios", "Grado/Mención", "Fecha Conclusión", "Doc. Acredita"]}
          rows={formacion_academica?.map(f => ({
            "Nivel": f.nivel,
            "Estado": f.estado,
            "Centro de Estudios": f.centro_estudios,
            "Grado/Mención": `${f.grado_obtenido || ''} ${f.mencion ? `- ${f.mencion}` : ''}`.trim() || "-",
            "Fecha Conclusión": f.fecha_conclusion,
            "Doc. Acredita": f.documento_acredita
          })) || []}
          emptyMessage="No se registró formación académica"
        />

        {otros_estudios?.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Otros Estudios (Diplomados, Especializaciones, etc.)</h4>
            <DataTable 
              headers={["Tipo", "Nombre del Curso", "Centro de Estudios", "Inicio", "Fin", "Duración (hrs)"]}
              rows={otros_estudios.map(e => ({
                "Tipo": e.tipo,
                "Nombre del Curso": e.nombre_curso,
                "Centro de Estudios": e.centro_estudios,
                "Inicio": e.fecha_inicio,
                "Fin": e.fecha_fin,
                "Duración (hrs)": e.duracion_horas || "-"
              }))}
            />
          </div>
        )}
      </SectionCard>

      {/* ── 5. EXPERIENCIA LABORAL ─────────────────────────── */}
      <SectionCard icon={Briefcase} title="Experiencia Laboral" number="5">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Instituciones Estatales y Privadas</h4>
        <DataTable 
          headers={["N°", "Entidad / Empresa", "Cargo Desempeñado", "Tipo", "Inicio", "Culminación", "Tiempo"]}
          rows={experiencia_laboral?.map((e, i) => ({
            "N°": i + 1,
            "Entidad / Empresa": e.nombre_entidad,
            "Cargo Desempeñado": e.cargo,
            "Tipo": e.tipo_institucion,
            "Inicio": e.fecha_inicio,
            "Culminación": e.fecha_culminacion,
            "Tiempo": e.tiempo_cargo || "-"
          })) || []}
          emptyMessage="No se registró experiencia laboral"
        />
      </SectionCard>

      {/* ── 6. EXPERIENCIA DOCENTE ─────────────────────────── */}
      <SectionCard icon={GraduationCap} title="Experiencia Laboral Docente" number="6">
        <DataTable 
          headers={["N°", "Entidad", "Categoría", "Inicio", "Culminación", "Tiempo"]}
          rows={experiencia_docente?.map((e, i) => ({
            "N°": i + 1,
            "Entidad": e.nombre_entidad,
            "Categoría": e.categoria || "-",
            "Inicio": e.fecha_inicio,
            "Culminación": e.fecha_culminacion,
            "Tiempo": e.tiempo_cargo || "-"
          })) || []}
          emptyMessage="No se registró experiencia docente"
        />
      </SectionCard>

      {/* ── 7. OTRAS INSTITUCIONES ─────────────────────────── */}
      <SectionCard icon={Building2} title="Labora en Otras Instituciones" number="7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          <Field label="¿Labora en otra institución?" value={otras_instituciones?.labora_otra_inst} isBoolean />
          {otras_instituciones?.labora_otra_inst && (
            <>
              <Field label="Nombre de la Entidad" value={otras_instituciones.nombre_entidad} colSpan={2} />
              <Field label="Tipo de Personal" value={otras_instituciones.tipo_personal} />
              <Field label="Horas Diarias" value={otras_instituciones.horas_diarias} />
              <Field label="Lunes" value={otras_instituciones.dia_lunes} isBoolean />
              <Field label="Martes" value={otras_instituciones.dia_martes} isBoolean />
              <Field label="Miércoles" value={otras_instituciones.dia_miercoles} isBoolean />
              <Field label="Jueves" value={otras_instituciones.dia_jueves} isBoolean />
              <Field label="Viernes" value={otras_instituciones.dia_viernes} isBoolean />
            </>
          )}
        </div>
      </SectionCard>

      {/* ── 8. RECONOCIMIENTOS ─────────────────────────────── */}
      <SectionCard icon={Award} title="Reconocimientos y Felicitaciones" number="8">
        <DataTable 
          headers={["N°", "Entidad", "Tipo de Reconocimiento", "Fecha Documento"]}
          rows={reconocimientos?.map((r, i) => ({
            "N°": i + 1,
            "Entidad": r.nombre_entidad,
            "Tipo de Reconocimiento": r.tipo_reconocimiento,
            "Fecha Documento": r.fecha_documento || "-"
          })) || []}
          emptyMessage="No se registraron reconocimientos"
        />
      </SectionCard>

      {/* ── DECLARACIÓN JURADA Y FIRMA ─────────────────────── */}
      <div className="mt-8 border-t-2 border-slate-800 pt-6 print:border-t-2 print:border-black print:mt-12">
        <div className="flex items-start gap-3 mb-8">
          <CheckCircle2 size={20} className="text-slate-700 shrink-0 mt-1 print:text-black" />
          <p className="text-xs text-slate-700 leading-relaxed text-justify print:text-black">
            Declaro bajo juramento que la presente información expresa la verdad, de conformidad a lo dispuesto 
            por la Ley de Procedimiento Administrativo General — Ley N° 27444. Asumo las responsabilidades 
            legales en caso de falsedad de la información declarada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 print:mt-16">
          <div className="text-center">
            <div className="border-b border-slate-800 w-3/4 mx-auto mb-2 print:border-black"></div>
            <p className="text-xs font-bold text-slate-800 uppercase print:text-black">Firma del Solicitante</p>
          </div>
          <div className="text-center">
            <div className="border-b border-slate-800 w-3/4 mx-auto mb-2 print:border-black"></div>
            <p className="text-xs font-bold text-slate-800 uppercase print:text-black">Huella Digital</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-xs print:text-black">
          <Field label="Nombres Completos" value={`${personal?.nombres || ''}`} colSpan={2} />
          <Field label="Apellidos Completos" value={`${personal?.apellido_paterno || ''} ${personal?.apellido_materno || ''}`} colSpan={2} />
          <Field label="D.N.I. N°" value={personal?.dni} />
          <Field label="Lugar y Fecha" value={`Abancay, ${new Date().toLocaleDateString('es-PE')}`} colSpan={3} />
        </div>
      </div>

    </div>
  );
}