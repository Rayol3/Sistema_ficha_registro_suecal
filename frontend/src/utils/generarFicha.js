// Genera e imprime la ficha completa en formato fiel al Excel original UNAMBA
export function generarFicha(ficha, personalId) {
  const p = ficha.personal
  const l = ficha.datos_laborales
  const familiares = ficha.familiares || []
  const formacion = ficha.formacion_academica || []
  const otrosEstudios = ficha.otros_estudios || []
  const expLaboral = ficha.experiencia_laboral || []
  const expDocente = ficha.experiencia_docente || []
  const otrasInst = ficha.otras_instituciones || {}
  const reconoc = ficha.reconocimientos || []

  const fecha = new Date().toLocaleDateString("es-PE", {
    day: "2-digit", month: "long", year: "numeric"
  })

  // ── Helpers ───────────────────────────────────────────────
  const v = (val) => val ?? ""
  const chk = (val, opcion) => val === opcion ? "☑" : "☐"

  const porNivel = (n) => formacion.filter((f) => f.nivel === n)
  const porTipo = (t) => otrosEstudios.filter((e) => e.tipo === t)
  const porTipoInst = (t) => expLaboral.filter((e) => e.tipo_institucion === t)
  const conyuge = familiares.find((f) => f.parentesco === "Cónyuge")
  const padres = familiares.filter((f) => f.parentesco === "Padre" || f.parentesco === "Madre")
  const hijos = familiares.filter((f) => f.parentesco === "Hijo" || f.parentesco === "Hija")

  // Opción A: muestra solo registros reales; si no hay ninguno, 1 fila vacía
  const filasOpcionA = (items, renderFn, colsVacias) => {
    if (items.length === 0) {
      return `<tr>${Array(colsVacias).fill('<td></td>').join("")}</tr>`
    }
    return items.map((item, i) => renderFn(item, i)).join("")
  }

  // ── Renderizadores de filas ───────────────────────────────

  const filaFamiliar = (f) => `<tr>
    <td>${v(f?.apellido_paterno)} ${v(f?.apellido_materno)}, ${v(f?.nombres)}</td>
    <td class="center">${v(f?.parentesco)}</td>
    <td class="center">${v(f?.dni)}</td>
    <td class="center">${v(f?.fecha_nacimiento)}</td>
    <td>${[v(f?.nac_distrito), v(f?.nac_provincia), v(f?.nac_departamento)].filter(Boolean).join(", ")}</td>
    <td class="center">${f?.sexo === "Masculino" ? "M" : f?.sexo === "Femenino" ? "F" : ""}</td>
    <td class="center"></td>
    <td class="center">${f?.vive_con_trabajador ? "X" : ""}</td>
    <td class="center">${f?.vive_con_trabajador === false && f?.parentesco ? "X" : ""}</td>
  </tr>`

  const filaVaciaFamiliar = () =>
    `<tr style="height:14px"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`

  const filaOtroEstudio = (item, i, tipo) => `<tr>
    <td class="num">${i + 1}</td>
    <td>${v(item.nombre_curso)}</td>
    <td>${v(item.centro_estudios)}</td>
    <td class="center">${v(item.fecha_inicio)}</td>
    <td class="center">${v(item.fecha_fin)}</td>
    <td class="center">${v(item.fecha_emision)}</td>
    <td class="center">${v(item.duracion_horas)}</td>
    <td>${v(item.tipo_constancia)}</td>
  </tr>`

  const filaExpLaboral = (item, i) => `<tr>
    <td class="num">${i + 1}</td>
    <td>${v(item.nombre_entidad)}</td>
    <td>${v(item.cargo)}</td>
    <td>${v(item.documento_acredita)}</td>
    <td class="center">${v(item.fecha_inicio)}</td>
    <td class="center">${v(item.fecha_culminacion)}</td>
    <td></td>
  </tr>`

  const filaExpDocente = (item, i) => `<tr>
    <td class="num">${i + 1}</td>
    <td>${v(item.nombre_entidad)}</td>
    <td>${v(item.categoria)}</td>
    <td>${v(item.documento_acredita)}</td>
    <td class="center">${v(item.fecha_inicio)}</td>
    <td class="center">${v(item.fecha_culminacion)}</td>
    <td></td>
  </tr>`

  const filaReconocimiento = (item, i) => `<tr>
    <td class="num">${i + 1}</td>
    <td>${v(item.nombre_entidad)}</td>
    <td>${v(item.tipo_reconocimiento)}</td>
    <td>${v(item.documento_acredita)}</td>
    <td class="center">${v(item.fecha_documento)}</td>
  </tr>`

  // Tabla de otros estudios con Opción A
  const tablaOtrosEstudios = (tipo, titulo) => {
    const items = porTipo(tipo)
    const filas = items.length === 0
      ? `<tr style="height:14px"><td class="num"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`
      : items.map((item, i) => filaOtroEstudio(item, i, tipo)).join("")
    return `
    <div class="sub-cab">${titulo}</div>
    <table>
      <tr>
        <th class="num">N°</th>
        <th>NOMBRE DEL CURSO Y/O ESTUDIOS DE ESPECIALIZACIÓN / ESPECIALIDAD</th>
        <th>CENTRO DE ESTUDIOS</th>
        <th style="width:7%">FECHA INICIO</th>
        <th style="width:7%">FECHA FIN</th>
        <th style="width:7%">FECHA EMISIÓN</th>
        <th style="width:7%">Duración (horas)</th>
        <th style="width:9%">TIPO DE CONSTANCIA</th>
      </tr>
      ${filas}
    </table>`
  }

  // Tabla de experiencia laboral con Opción A
  const tablaExpLaboral = (tipo, titulo) => {
    const items = porTipoInst(tipo)
    const filas = items.length === 0
      ? `<tr style="height:14px"><td class="num"></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`
      : items.map((item, i) => filaExpLaboral(item, i)).join("")
    return `
    <div class="sub-cab">${titulo}</div>
    <table>
      <tr>
        <th class="num">N°</th>
        <th>Nombre de la Entidad o Empresa</th>
        <th>Cargo desempeñado</th>
        <th>Documento que acredita</th>
        <th style="width:10%">Fecha de Inicio (mes/año)</th>
        <th style="width:10%">Fecha de culminación (mes/año)</th>
        <th style="width:8%">Tiempo en el cargo</th>
      </tr>
      ${filas}
    </table>`
  }

  // Foto: URL persistida o placeholder
  const fotoUrl = p.foto_url || (p._foto_archivo instanceof File
    ? URL.createObjectURL(p._foto_archivo) : "")

  // Filas de idiomas: si no hay registros → 1 fila vacía; si hay → solo los reales
  const filasIdiomas = p.idiomas_nativos?.length > 0
    ? p.idiomas_nativos.map((id) => `<tr>
        <td>${v(id.idioma)}</td>
        <td>${v(id.documento_acredita)}</td>
        <td class="center">${id.nivel ? chk(id.nivel, "Básico") : ""}</td>
        <td class="center">${id.nivel ? chk(id.nivel, "Intermedio") : ""}</td>
        <td class="center">${id.nivel ? chk(id.nivel, "Avanzado") : ""}</td>
        <td></td><td></td>
      </tr>`).join("")
    : `<tr style="height:16px"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`

  // Filas de ofimática: misma lógica
  const filasOfimatica = p.ofimatica?.length > 0
    ? p.ofimatica.map((of) => `<tr>
        <td>${v(of.programa)}</td>
        <td>${v(of.documento_acredita)}</td>
        <td class="center">${of.nivel ? chk(of.nivel, "Básico") : ""}</td>
        <td class="center">${of.nivel ? chk(of.nivel, "Intermedio") : ""}</td>
        <td class="center">${of.nivel ? chk(of.nivel, "Avanzado") : ""}</td>
        <td></td><td></td>
      </tr>`).join("")
    : `<tr style="height:16px"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`

  // Filas de familiares — Opción A
  const filasPadres = padres.length > 0
    ? padres.map(filaFamiliar).join("")
    : filaVaciaFamiliar()

  const filasHijos = hijos.length > 0
    ? hijos.map(filaFamiliar).join("")
    : filaVaciaFamiliar()

  // Filas exp docente — Opción A
  const filasExpDocente = expDocente.length > 0
    ? expDocente.map((item, i) => filaExpDocente(item, i)).join("")
    : `<tr style="height:14px"><td class="num"></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`

  // Filas reconocimientos — Opción A
  const filasReconoc = reconoc.length > 0
    ? reconoc.map((item, i) => filaReconocimiento(item, i)).join("")
    : `<tr style="height:14px"><td class="num"></td><td></td><td></td><td></td><td></td></tr>`

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Ficha de Registro — ${v(p.apellido_paterno)} ${v(p.nombres)}</title>
  <style>
    * {
      margin: 0; padding: 0; box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 8.5pt;
      color: #000;
      background: #fff;
    }
    .pagina {
      width: 210mm;
      margin: 0 auto;
      padding: 10mm 10mm;
    }

    /* ── Encabezado ── */
    .enc {
        display: grid;
        grid-template-columns: 100px 1fr 100px;
        align-items: center;
    }

    .enc img {
        width: 82px;
        height: 82px;
        margin-left: 20px;
    }

    .enc-centro {
        text-align: center;
    }
    .enc-univ {
      font-size: 12pt;
      font-weight: bold;
      font-style: italic;
      color: #1e3a8a;
    }
    .enc-lic {
      font-size: 7pt;
      color: #cc4400;
      font-style: italic;
    }
    .enc-oficina {
      font-size: 10pt;
      font-weight: bold;
      margin-top: 3px;
      text-transform: uppercase;
    }

    .titulo-ficha {
      background-color: #ffff00 !important;
      border: 2px solid #000;
      text-align: center;
      font-weight: bold;
      font-size: 8.5pt;
      padding: 4px 6px;
      margin: 5px 0;
      text-decoration: underline;
      text-transform: uppercase;
    }

    /* ── Tablas ── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 3px;
    }
    td, th {
      border: 1px solid #000;
      padding: 3px 4px;
      vertical-align: top;
      font-size: 8.5pt;
      min-height: 16px;
    }
    td:empty, td:blank {
      min-height: 16px;
      height: 16px;
    }
    th {
      background-color: #ffff00 !important;
      font-weight: bold;
      text-align: center;
      font-size: 6.5pt;
      text-transform: uppercase;
      padding: 2px 2px;
    }
    .th-left { text-align: left; }

    .sec-titulo {
      background-color: #ffff00 !important;
      font-weight: bold;
      font-size: 8pt;
      padding: 2px 5px;
      border:x1 1px solid #000;
      margin: 5px 0 2px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .sec-num { font-size: 10pt; font-weight: 900; }

    .sub-cab {
      background-color: #ffffcc !important;
      font-weight: bold;
      font-size: 7pt;
      border: 1px solid #000;
      padding: 2px 4px;
      margin: 2px 0 1px;
      text-transform: uppercase;
    }

    .label-cel {
      background-color: #ffff00 !important;
      font-weight: bold;
      font-size: 6pt;
      text-transform: uppercase;
      text-align: center;
      border-bottom: 1px solid #000;
    }
    .dato-cel { min-height: 12px; font-size: 7.5pt; }
    .center   { text-align: center; }
    .num      { text-align: center; width: 18px; font-size: 6.5pt; }
    .vacio    { min-height: 11px; }

    /* ── Foto: tamaño fijo, recorte centrado ── */
    .foto-wrapper {
      border: 1px solid #000;
      width: 27mm;
      height: 30mm;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;
      margin: auto;
    }
    .foto-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
    }
    .foto-placeholder {
      font-size: 9pt;
      font-weight: bold;
      color: #666;
      text-align: center;
      line-height: 1.6;
    }

    /* ── Firma ── */
    .firma-sec {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 16px;
    }
    .firma-lugar { font-size: 7.5pt; }
    .firma-box   { text-align: center; }
    .firma-linea {
      width: 170px;
      border-top: 1px solid #000;
      margin: 0 auto 3px;
    }
    .firma-texto { font-size: 6.5pt; line-height: 1.5; }
    .huella-box {
      width: 28mm;
      height: 32mm;
      border: 1px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6.5pt;
      text-align: center;
      color: #555;
    }

    .page-break { page-break-before: always; }

    @media print {
      body { margin: 0; }
      .pagina { padding: 4mm 5mm; width: 100%; }
      @page { size: A4; margin: 1.5cm 1.2cm; }
    }
  </style>
</head>
<body>
<div class="pagina">

<!-- ══ ENCABEZADO ══════════════════════════════════════════════ -->
<div class="enc">
  <img src="/logo-unamba.png" alt="UNAMBA"/>
  <div class="enc-centro">
    <div class="enc-univ">Universidad Licenciada</div>
    <div class="enc-lic">(RESOLUCIÓN N° 021-2020-SUNEDU/CD, del 4 de feberero de 2020)</div>
    <div class="enc-oficina">
      UNIVERSIDAD NACIONAL MICAELA BASTIDAS DE APURÍMAC<br/>
      OFICINA DE RECURSOS HUMANOS — RR.HH.<br/>
      SUB OFICINA DE ESCALAFÓN Y ASUNTOS LABORALES
    </div>
  </div>
</div>

<div class="titulo-ficha">
  FICHA DE REGISTRO DE DATOS DEL PERSONAL DOCENTE - NO DOCENTE, DATOS PERSONALES,
  FAMILIARES, LABORALES, FORMACIÓN ACADÉMICA Y OTROS
</div>

<!-- ══ 1. DATOS PERSONALES ══════════════════════════════════════ -->
<div class="sec-titulo"><span class="sec-num">1</span> DATOS PERSONALES</div>

<table>
  <colgroup>
    <col/><col/><col style="width:28mm"/>
  </colgroup>
  <tr>
    <td>
      <div class="label-cel">APELLIDO PATERNO</div>
      <div class="dato-cel">${v(p.apellido_paterno)}</div>
    </td>
    <td>
      <div class="label-cel">APELLIDO MATERNO</div>
      <div class="dato-cel">${v(p.apellido_materno)}</div>
    </td>
    <td rowspan="4" style="vertical-align:middle; text-align:center; width:28mm">
      <div class="foto-wrapper">
        ${fotoUrl
      ? `<img src="${fotoUrl}" alt="Foto"/>`
      : `<div class="foto-placeholder">FOTO<br/>ACTUAL</div>`}
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <div class="label-cel">NOMBRES</div>
      <div class="dato-cel">${v(p.nombres)}</div>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <div class="label-cel">DOCUMENTO DE IDENTIDAD</div>
      <table style="margin:0;border:none">
        <tr>
          <td style="border:none;width:30%"><strong>DNI:</strong> ${v(p.dni)}</td>
          <td style="border:none"><strong>LM:</strong> ${v(p.libreta_militar)}</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <table style="margin:0;border:none">
        <tr>
          <td style="border:none;width:40px"><strong>SEXO</strong></td>
          <td style="border:none">MASCULINO: ${chk(p.sexo, "Masculino")}</td>
          <td style="border:none;padding-left:12px">FEMENINO: ${chk(p.sexo, "Femenino")}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<table>
  <colgroup>
    <col style="width:26%"/><col style="width:16%"/>
    <col style="width:16%"/><col style="width:42%"/>
  </colgroup>
  <tr>
    <th class="th-left">LUGAR DE NACIMIENTO</th>
    <th>FECHA DE NACIMIENTO</th>
    <th>ESTADO CIVIL</th>
    <th class="th-left">MEDIOS, NÚMERO Y DIRECCIÓN DE CONTACTOS</th>
  </tr>
  <tr>
    <td>
      <table style="margin:0;border:none">
        <tr><td style="border:none;width:82px"><strong>PAIS :</strong></td><td style="border:none">${v(p.nac_pais)}</td></tr>
        <tr><td style="border:none"><strong>DEPARTAMENTO :</strong></td><td style="border:none">${v(p.nac_departamento)}</td></tr>
        <tr><td style="border:none"><strong>PROVINCIA :</strong></td><td style="border:none">${v(p.nac_provincia)}</td></tr>
        <tr><td style="border:none"><strong>DISTRITO :</strong></td><td style="border:none">${v(p.nac_distrito)}</td></tr>
        <tr><td style="border:none"><strong>C.P./ANEXO :</strong></td><td style="border:none"></td></tr>
      </table>
    </td>
    <td>
      <table style="margin:0;border:none">
        <tr><td style="border:none;width:28px"><strong>DIA:</strong></td><td style="border:none">${v(p.fecha_nacimiento).split("-")[2] || ""}</td></tr>
        <tr><td style="border:none"><strong>MES:</strong></td><td style="border:none">${v(p.fecha_nacimiento).split("-")[1] || ""}</td></tr>
        <tr><td style="border:none"><strong>AÑO:</strong></td><td style="border:none">${v(p.fecha_nacimiento).split("-")[0] || ""}</td></tr>
        <tr><td style="border:none" colspan="2">&nbsp;</td></tr>
        <tr><td style="border:none"><strong>EDAD:</strong></td><td style="border:none"></td></tr>
      </table>
    </td>
    <td>
      <table style="margin:0;border:none">
        <tr><td style="border:none;width:72px"><strong>SOLTERO :</strong></td><td style="border:none;width:14px">${chk(p.estado_civil, "Soltero")}</td></tr>
        <tr><td style="border:none"><strong>CASADO :</strong></td><td style="border:none">${chk(p.estado_civil, "Casada")}</td></tr>
        <tr><td style="border:none"><strong>VIUDO :</strong></td><td style="border:none">${chk(p.estado_civil, "Viudo")}</td></tr>
        <tr><td style="border:none"><strong>DIVORCIADO:</strong></td><td style="border:none">${chk(p.estado_civil, "Divorciado")}</td></tr>
        <tr><td style="border:none"><strong>OTRO :</strong></td><td style="border:none">${chk(p.estado_civil, "Otro")}</td></tr>
      </table>
    </td>
    <td>
      <table style="margin:0;border:none">
        <tr><td style="border:none;width:52px"><strong>TELEFONO:</strong></td><td style="border:none">${v(p.telefono_fijo)}</td></tr>
        <tr><td style="border:none"><strong>CELULAR:</strong></td><td style="border:none">${v(p.celular)}</td></tr>
        <tr><td style="border:none"><strong>Email 1:</strong></td><td style="border:none">${v(p.email_personal_1)}</td></tr>
        <tr><td style="border:none"><strong>Email 2:</strong></td><td style="border:none">${v(p.email_personal_2)}</td></tr>
      </table>
    </td>
  </tr>
</table>

<table>
  <colgroup>
    <col style="width:40%"/><col style="width:20%"/><col style="width:40%"/>
  </colgroup>
  <tr>
    <th class="th-left">DIRECCIÓN DE DOMICILIO ACTUAL</th>
    <th>TIPO DE VIVIENDA</th>
    <th class="th-left">OTROS DATOS COMPLEMENTARIOS</th>
  </tr>
  <tr>
    <td>
      <table style="margin:0;border:none">
        <tr><td style="border:none;width:30px"><strong>Psje:</strong></td><td style="border:none">${v(p.dom_tipo_via) === "Psje" ? v(p.dom_direccion) : ""}</td></tr>
        <tr><td style="border:none"><strong>Jr:</strong></td><td style="border:none">${v(p.dom_tipo_via) === "Jr" ? v(p.dom_direccion) : ""}</td></tr>
        <tr><td style="border:none"><strong>Av:</strong></td><td style="border:none">${v(p.dom_tipo_via) === "Av" ? v(p.dom_direccion) : ""}</td></tr>
        <tr><td style="border:none"><strong>Otro:</strong></td><td style="border:none">${v(p.dom_tipo_via) === "Otro" ? v(p.dom_direccion) : ""}</td></tr>
        <tr><td style="border:none"><strong>REF:</strong></td><td style="border:none">${v(p.dom_referencia)}</td></tr>
      </table>
    </td>
    <td>
      <table style="margin:0;border:none">
        <tr><td style="border:none;width:68px"><strong>Propia:</strong></td><td style="border:none">${chk(p.tipo_vivienda, "Propia")}</td></tr>
        <tr><td style="border:none"><strong>Alquilada:</strong></td><td style="border:none">${chk(p.tipo_vivienda, "Alquilada")}</td></tr>
        <tr><td style="border:none"><strong>Departamento:</strong></td><td style="border:none">${chk(p.tipo_vivienda, "Departamento")}</td></tr>
        <tr><td style="border:none"><strong>Quinta:</strong></td><td style="border:none">${chk(p.tipo_vivienda, "Quinta")}</td></tr>
        <tr><td style="border:none"><strong>Otro:</strong></td><td style="border:none">${chk(p.tipo_vivienda, "Otro")}</td></tr>
      </table>
    </td>
    <td>
      <table style="margin:0;border:none">
        <tr><td style="border:none;width:90px"><strong>RUC N°:</strong></td><td style="border:none">${v(p.ruc)}</td></tr>
        <tr><td style="border:none"><strong>Lic. Conducir:</strong></td><td style="border:none">${v(p.licencia_conducir)}</td></tr>
        <tr><td style="border:none"><strong>A. ESSALUD:</strong></td><td style="border:none">${v(p.afiliacion_essalud)}</td></tr>
        <tr><td style="border:none"><strong>G. Sanguíneo:</strong></td><td style="border:none">${v(p.grupo_sanguineo)}</td></tr>
        <tr><td style="border:none"><strong>Donador/a órganos:</strong></td><td style="border:none">${p.donador_organos ? "SÍ" : "NO"}</td></tr>
      </table>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="3" class="th-left">CUENTA BANCARIA DE PAGO DE REMUNERACIONES</th>
  </tr>
  <tr>
    <td style="width:35%"><strong>BANCO:</strong> ${v(p.banco)}</td>
    <td style="width:35%"><strong>Cta. N°:</strong> ${v(p.cuenta_numero)}</td>
    <td><strong>CCI:</strong> ${v(p.cuenta_cci)}</td>
  </tr>
</table>

<table>
  <tr>
    <th class="th-left" style="width:72%">DENOMINACIÓN PROFESIONAL</th>
    <td style="width:28%"><strong>Abreviado:</strong> ${v(p.abreviatura_prof)}</td>
  </tr>
  <tr><td colspan="2">${v(p.denominacion_prof)}&nbsp;</td></tr>
  <tr>
    <td><strong>Colegio profesional:</strong> ${v(p.colegio_prof_nombre)}</td>
    <td><strong>Nº de colegiatura:</strong> ${v(p.colegio_prof_numero)} &nbsp; <strong>Fecha:</strong> ${v(p.colegio_prof_fecha)}</td>
  </tr>
</table>

<table>
  <tr><th colspan="2" class="th-left">SISTEMA Y RÉGIMEN DE PENSIONES</th></tr>
  <tr>
    <td style="width:55%">
      <strong>PÚBLICO — ONP:</strong> ${chk(p.sistema_pension, "ONP")}
      &nbsp;&nbsp; <strong>Código de afiliación:</strong> ${v(p.codigo_afiliacion)}
    </td>
    <td><strong>Fecha de afiliación:</strong> ${v(p.fecha_afiliacion)}</td>
  </tr>
  <tr>
    <td colspan="2">
      <strong>PRIVADO — AFP:</strong> ${chk(p.sistema_pension, "AFP")}
      &nbsp; INTEGRA: ${chk(p.afp_nombre, "Integra")}
      &nbsp; PROFUTURO: ${chk(p.afp_nombre, "Profuturo")}
      &nbsp; HABITAT: ${chk(p.afp_nombre, "Habitat")}
      &nbsp; PRIMA: ${chk(p.afp_nombre, "Prima")}
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <strong style="background:#ffff00;padding:1px 4px">PERSONA CON DISCAPACIDAD</strong>
      &nbsp; SI: ${chk(p.tiene_discapacidad ? "si" : "no", "si")}
      &nbsp; REGISTRO CONADIS: ${v(p.conadis_registro)}
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      NO: ${chk(p.tiene_discapacidad ? "si" : "no", "no")}
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <strong style="background:#ffff00;padding:1px 4px">SERVICIO MILITAR</strong>
      &nbsp; SI: ${chk(p.realizo_serv_militar ? "si" : "no", "si")}
      &nbsp; DEL: ${v(p.serv_militar_fecha_inicio)}
      &nbsp; AL: ${v(p.serv_militar_fecha_fin)}
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      NO: ${chk(p.realizo_serv_militar ? "si" : "no", "no")}
    </td>
  </tr>
  <tr>
    <td>
      Ejército: ${chk(p.serv_militar_rama, "Ejército")}
      &nbsp; Marina: ${chk(p.serv_militar_rama, "Marina")}
      &nbsp; Aviación: ${chk(p.serv_militar_rama, "Aviación")}
      &nbsp; F.Especiales: ${chk(p.serv_militar_rama, "Fuerzas Especiales")}
      &nbsp;&nbsp; <strong>CARGO:</strong> ${v(p.serv_militar_cargo)}
    </td>
  </tr>
</table>

<!-- Idiomas — Opción A: 1 fila vacía si no hay registros -->
<table>
  <colgroup>
    <col style="width:28%"/><col style="width:28%"/>
    <col style="width:11%"/><col style="width:11%"/><col style="width:11%"/>
    <col style="width:5%"/><col style="width:6%"/>
  </colgroup>
  <tr>
    <th colspan="2" class="th-left">CONOCIMIENTO DE IDIOMA NATIVO Y/O DIALECTO</th>
    <th colspan="3"></th>
    <th>SI</th><th>NO</th>
  </tr>
  <tr>
    <th>Detalle</th>
    <th>Documento que acredita</th>
    <th>BÁSICO</th><th>INTERMEDIO</th><th>AVANZADO</th>
    <td class="center">${(p.idiomas_nativos?.length > 0) ? chk("si", "si") : chk("si", "no")}</td>
    <td class="center">${(p.idiomas_nativos?.length > 0) ? chk("no", "no") : chk("no", "no")}</td>
  </tr>
  ${filasIdiomas}
</table>

<!-- Ofimática — Opción A -->
<table>
  <colgroup>
    <col style="width:28%"/><col style="width:28%"/>
    <col style="width:11%"/><col style="width:11%"/><col style="width:11%"/>
    <col style="width:5%"/><col style="width:6%"/>
  </colgroup>
  <tr>
    <th colspan="2" class="th-left">CONOCIMIENTO DE OFIMÁTICA</th>
    <th colspan="3"></th>
    <th>SI</th><th>NO</th>
  </tr>
  <tr>
    <th>Detalle</th>
    <th>Documento que acredita</th>
    <th>BÁSICO</th><th>INTERMEDIO</th><th>AVANZADO</th>
    <td class="center">${(p.ofimatica?.length > 0) ? chk("si", "si") : chk("si", "no")}</td>
    <td class="center">${(p.ofimatica?.length > 0) ? chk("no", "no") : chk("no", "no")}</td>
  </tr>
  ${filasOfimatica}
</table>

<!-- ══ 2. DATOS LABORALES ════════════════════════════════════════ -->
<div class="sec-titulo"><span class="sec-num">2</span> DATOS LABORALES</div>
<table>
  <tr><td><strong>DEPENDENCIA:</strong> ${v(l.dependencia)}</td></tr>
  <tr><td><strong>CARGO:</strong> ${v(l.cargo)}</td></tr>
  <tr>
    <td>
      <strong>FECHA DE INGRESO A LA UNAMBA:</strong> ${v(l.fecha_ingreso)}
      &nbsp;&nbsp;&nbsp;&nbsp;
      <strong>E-mail institucional:</strong> ${v(l.email_institucional)}
    </td>
  </tr>
  <tr>
    <td>
      <strong>CONDICIÓN:</strong>
      NOMBRADO: ${chk(l.condicion, "Nombrado")}
      &nbsp;&nbsp; CONTRATADO: ${chk(l.condicion, "Contratado")}
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      DOCENTE: ${chk(l.tipo_personal, "Docente")}
      &nbsp;&nbsp; ADMINISTRATIVO: ${chk(l.tipo_personal, "Administrativo")}
    </td>
  </tr>
</table>

<table>
  <colgroup><col style="width:50%"/><col style="width:50%"/></colgroup>
  <tr>
    <td>
      <div class="sub-cab">NOMBRADO / CONTRATADO / DESIGNADO &nbsp; D.L. 276</div>
      PROFESIONAL: ${chk(l.regimen_dl276, "Profesional")}
      &nbsp; TÉCNICO: ${chk(l.regimen_dl276, "Técnico")}
      &nbsp; AUXILIAR: ${chk(l.regimen_dl276, "Auxiliar")}
      <br/><br/>
      <strong>NIVEL REMUNERATIVO:</strong><br/>
      A:${chk(l.nivel_remunerativo, "A")}
      B:${chk(l.nivel_remunerativo, "B")}
      C:${chk(l.nivel_remunerativo, "C")}
      D:${chk(l.nivel_remunerativo, "D")}
      E:${chk(l.nivel_remunerativo, "E")}
      F:${chk(l.nivel_remunerativo, "F")}
    </td>
    <td>
      <div class="sub-cab">ORDINARIO</div>
      PRINCIPAL: ${chk(l.regimen_ordinario, "Principal")}
      ASOCIADO: ${chk(l.regimen_ordinario, "Asociado")}
      AUXILIAR: ${chk(l.regimen_ordinario, "Auxiliar")}
      JP: ${chk(l.regimen_ordinario, "JP")}
      <br/><br/>
      <strong>DEDICACIÓN:</strong>
      DE:${chk(l.dedicacion, "DE")}
      TC:${chk(l.dedicacion, "TC")}
      TP:${chk(l.dedicacion, "TP")}
      HORAS:${chk(l.dedicacion, "Horas")} ${v(l.horas_semanales)}
    </td>
  </tr>
  <tr>
    <td>
      <div class="sub-cab">CONTRATADO / DESIGNADO &nbsp; D.L. 1057</div>
      CAS PERMANENTE: ${chk(l.regimen_cas, "CAS Permanente")}
      &nbsp; CAS DETERMINADO: ${chk(l.regimen_cas, "CAS Determinado")}
      <br/>CAS CONFIANZA: ${chk(l.regimen_cas, "CAS Confianza")}
    </td>
    <td>
      <div class="sub-cab">CONTRATADO</div>
      DC-A1:${chk(l.regimen_contratado, "DC-A1")}
      DC-A2:${chk(l.regimen_contratado, "DC-A2")}
      DC-A3:${chk(l.regimen_contratado, "DC-A3")}
      <br/>
      DC-B1:${chk(l.regimen_contratado, "DC-B1")}
      DC-B2:${chk(l.regimen_contratado, "DC-B2")}
      DC-B3:${chk(l.regimen_contratado, "DC-B3")}
    </td>
  </tr>
</table>
<table>
  <tr><td><strong>OTROS ESPECIFIQUE:</strong> ${v(l.regimen_otros)}&nbsp;</td></tr>
</table>

<!-- ══ 3. FAMILIARES ════════════════════════════════════════════ -->
<div class="sec-titulo"><span class="sec-num">3</span> DATOS DE FAMILIARES — DERECHO HABIENTES</div>

<div class="sub-cab">DATOS DEL CÓNYUGE (En caso corresponder)</div>
<table>
  <colgroup><col style="width:33%"/><col style="width:33%"/><col style="width:34%"/></colgroup>
  <tr>
    <th>APELLIDO PATERNO</th><th>APELLIDO MATERNO</th><th>NOMBRES</th>
  </tr>
  <tr>
    <td class="vacio">${v(conyuge?.apellido_paterno)}</td>
    <td class="vacio">${v(conyuge?.apellido_materno)}</td>
    <td class="vacio">${v(conyuge?.nombres)}</td>
  </tr>
  <tr>
    <td><strong>DNI N°:</strong> ${v(conyuge?.dni)}</td>
    <td>
      <strong>SEXO:</strong>
      MASCULINO: ${chk(conyuge?.sexo, "Masculino")}
      FEMENINO: ${chk(conyuge?.sexo, "Femenino")}
    </td>
    <td><strong>FECHA NAC.:</strong> ${v(conyuge?.fecha_nacimiento)}</td>
  </tr>
  <tr>
    <td colspan="3">
      <strong>LUGAR DE NACIMIENTO:</strong>
      PAIS: ${v(conyuge?.nac_pais)}
      &nbsp; DEPARTAMENTO: ${v(conyuge?.nac_departamento)}
      &nbsp; PROVINCIA: ${v(conyuge?.nac_provincia)}
      &nbsp; DISTRITO: ${v(conyuge?.nac_distrito)}
    </td>
  </tr>
</table>

<div class="sub-cab">DATOS DE LOS HIJOS, PADRES E HIJOS</div>
<table>
  <tr>
    <th style="width:28%">APELLIDOS Y NOMBRES</th>
    <th style="width:10%">PARENTESCO</th>
    <th style="width:9%">D.N.I N°</th>
    <th style="width:10%">FECHA NAC.</th>
    <th style="width:20%">LUGAR NAC.</th>
    <th style="width:5%">SEXO</th>
    <th style="width:5%">EDAD</th>
    <th style="width:6%">Viven SI</th>
    <th style="width:7%">con Ud. NO</th>
  </tr>
  <tr><td colspan="9" class="sub-cab" style="background:#fff8cc!important">PADRES</td></tr>
  ${filasPadres}
  <tr><td colspan="9" class="sub-cab" style="background:#fff8cc!important">HIJOS</td></tr>
  ${filasHijos}
</table>
<p style="font-size:6.5pt; margin:2px 0"></p>

<!-- ══ 4. NIVEL EDUCATIVO ════════════════════════════════════════ -->
<div class="sec-titulo"><span class="sec-num">4</span> NIVEL EDUCATIVO</div>
<table>
  <colgroup>
    <col style="width:20%"/><col style="width:25%"/>
    <col style="width:28%"/><col style="width:14%"/><col style="width:13%"/>
  </colgroup>
  <tr>
    <th>Nivel</th>
    <th>Centro de estudios</th>
    <th>Concluido / Grado obtenido / Mención</th>
    <th>Fecha que concluye</th>
    <th>Doc. que acredita</th>
  </tr>
  <tr><td colspan="5" class="sub-cab">EDUCACIÓN BÁSICA REGULAR — EBR</td></tr>
  ${["Primaria", "Secundaria"].map(n => {
        const item = porNivel(n)[0] || {}
        return `<tr>
      <td>${n}</td>
      <td>${v(item.centro_estudios)}</td>
      <td>
        COMPLETO: ${chk(item.estado, "Completo")}
        &nbsp; INCOMPLETO: ${chk(item.estado, "Incompleto")}
      </td>
      <td class="center">${v(item.fecha_conclusion)}</td>
      <td>${v(item.documento_acredita)}</td>
    </tr>`
      }).join("")}

  <tr><td colspan="5" class="sub-cab">SUPERIOR</td></tr>
  ${(() => {
      const item = porNivel("Técnico")[0] || {}
      return `<tr>
      <td>TÉCNICO</td>
      <td>${v(item.centro_estudios)}</td>
      <td>${v(item.grado_obtenido)}</td>
      <td class="center">${v(item.fecha_conclusion)}</td>
      <td>${v(item.documento_acredita)}</td>
    </tr>`
    })()}
  ${["Bachiller Universitario", "Título Universitario", "Segunda Especialidad"].map(n => {
      const items = porNivel(n)
      if (items.length === 0) return `<tr style="height:14px">
      <td>${n} 1</td><td></td><td></td><td></td><td></td>
    </tr>`
      return items.map((item, i) => `<tr>
      <td>${n} ${i + 1}</td>
      <td>${v(item.centro_estudios)}</td>
      <td>${v(item.grado_obtenido)}${item.mencion ? ` / ${item.mencion}` : ""}</td>
      <td class="center">${v(item.fecha_conclusion)}</td>
      <td>${v(item.documento_acredita)}</td>
    </tr>`).join("")
    }).join("")}

  <tr><td colspan="5" class="sub-cab">POSGRADO</td></tr>
  ${["Maestría", "Doctorado"].map(n => {
      const items = porNivel(n)
      if (items.length === 0) return `<tr style="height:14px">
      <td>${n} 1</td><td></td><td></td><td></td><td></td>
    </tr>`
      return items.map((item, i) => `<tr>
      <td>${n} ${i + 1}</td>
      <td>${v(item.centro_estudios)}</td>
      <td>${v(item.grado_obtenido)}${item.mencion ? ` / ${item.mencion}` : ""}</td>
      <td class="center">${v(item.fecha_conclusion)}</td>
      <td>${v(item.documento_acredita)}</td>
    </tr>`).join("")
    }).join("")}
</table>

<div class="sub-cab" style="background:#ffff00!important;border:1px solid #000;margin:4px 0 2px;font-size:8pt">
  OTROS ESTUDIOS DE MAYOR TRASCENDENCIA:
</div>
${tablaOtrosEstudios("Diplomado", "DIPLOMADOS:")}
${tablaOtrosEstudios("Especialización", "ESPECIALIZACIÓN:")}
${tablaOtrosEstudios("Otro", "OTROS ESTUDIOS:")}

<!-- ══ 5. EXPERIENCIA LABORAL ════════════════════════════════════ -->
<div class="sec-titulo">
  <span class="sec-num">5</span>
  EXPERIENCIA LABORAL
  <span style="font-size:6.5pt;font-weight:normal">(Registrar los cargos en orden cronológico)</span>
</div>
${tablaExpLaboral("Estatal", "INSTITUCIÓN ESTATAL:")}
${tablaExpLaboral("Privada", "INSTITUCIÓN PRIVADA:")}

<!-- ══ 6. EXPERIENCIA DOCENTE ════════════════════════════════════ -->
<div class="sec-titulo"><span class="sec-num">6</span> EXPERIENCIA LABORAL — DOCENTE Y OTROS</div>
<table>
  <tr>
    <th class="num">N°</th>
    <th>Nombre de la Entidad</th>
    <th>Categoría</th>
    <th>Documento que acredita</th>
    <th style="width:10%">Fecha de Inicio (mes/año)</th>
    <th style="width:10%">Fecha de culminación (mes/año)</th>
    <th style="width:8%">Tiempo en el cargo</th>
  </tr>
  ${filasExpDocente}
</table>

<!-- ══ 7. OTRAS INSTITUCIONES ════════════════════════════════════ -->
<div class="sec-titulo"><span class="sec-num">7</span> A LA FECHA LABORA EN OTRAS INSTITUCIONES.</div>
<table>
  <tr>
    <td>
      SI: ${chk(otrasInst.labora_otra_inst ? "si" : "no", "si")}
      &nbsp; NO: ${chk(otrasInst.labora_otra_inst ? "si" : "no", "no")}
      &nbsp;&nbsp;&nbsp;&nbsp;
      DOCENTE: ${chk(otrasInst.tipo_personal, "Docente")}
      &nbsp; ADMINISTRATIVO: ${chk(otrasInst.tipo_personal, "Administrativo")}
    </td>
  </tr>
  <tr><td><strong>ENTIDAD:</strong> ${v(otrasInst.nombre_entidad)}&nbsp;</td></tr>
  <tr>
    <td>
      <strong>FRECUENCIA DIARIA DE TRABAJO:</strong>
      &nbsp; Lunes: ${chk(otrasInst.dia_lunes, true)}
      &nbsp; Martes: ${chk(otrasInst.dia_martes, true)}
      &nbsp; Miércoles: ${chk(otrasInst.dia_miercoles, true)}
      &nbsp; Jueves: ${chk(otrasInst.dia_jueves, true)}
      &nbsp; Viernes: ${chk(otrasInst.dia_viernes, true)}
    </td>
  </tr>
  <tr>
    <td>
      <strong>FRECUENCIA HORARIA DE TRABAJO:</strong>
      &nbsp; ${v(otrasInst.horas_diarias)} hora(s) diaria(s)
    </td>
  </tr>
</table>

<!-- ══ 8. RECONOCIMIENTOS ════════════════════════════════════════ -->
<div class="sec-titulo"><span class="sec-num">8</span> RECONOCIMIENTOS Y/O FELICITACIONES DE RELEVANCIA</div>
<table>
  <tr>
    <th class="num">N°</th>
    <th>Nombre de la Entidad</th>
    <th>Tipo de reconocimiento y/o felicitación de relevancia</th>
    <th>Documento que acredita</th>
    <th style="width:12%">Fecha documento</th>
  </tr>
  ${filasReconoc}
</table>

<!-- ══ DECLARACIÓN + FIRMA ═══════════════════════════════════════ -->
<p style="font-size:7.5pt;margin-top:10px;text-align:justify">
  Declaro bajo juramento, que la presente información expresa la verdad de conformidad
  a lo dispuesto por la Ley de Procedimiento Administrativo General Ley N° 27444.
</p>

<div class="firma-sec">
  <div class="firma-lugar">
    <strong>Abancay,</strong> ${fecha}
  </div>
  <div class="firma-box">
    <div class="firma-linea"></div>
    <div class="firma-texto">
      Firma<br/>
      <strong>Nombres: ${v(p.nombres)}</strong><br/>
      <strong>Apellidos: ${v(p.apellido_paterno)} ${v(p.apellido_materno)}</strong><br/>
      D.N.I N° ${v(p.dni)}
    </div>
  </div>
  <div class="huella-box"><br/></div>
</div>

</div>
</body>
</html>`

  const ventana = window.open("", "_blank")
  ventana.document.write(html)
  ventana.document.close()
  ventana.focus()
  setTimeout(() => ventana.print(), 800)
}