// Genera e imprime la constancia oficial de registro
export function generarConstancia(ficha, personalId) {
  const p = ficha.personal
  const l = ficha.datos_laborales
  const fecha = new Date().toLocaleDateString("es-PE", {
    day: "2-digit", month: "long", year: "numeric"
  })
  const nombreCompleto = `${p.apellido_paterno} ${p.apellido_materno}, ${p.nombres}`
  const nroRegistro = `#${String(personalId).padStart(5, "0")}`

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Constancia de Registro — UNAMBA</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      color: #1a1a1a;
      background: #fff;
      padding: 40px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      border-bottom: 3px solid #1e3a8a;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .header img { width: 70px; height: 70px; object-fit: contain; }
    .header-text { flex: 1; }
    .header-text h1 {
      font-size: 11pt;
      font-weight: bold;
      color: #1e3a8a;
      text-transform: uppercase;
      line-height: 1.4;
    }
    .header-text p {
      font-size: 9pt;
      color: #444;
      margin-top: 2px;
    }
    .nro-registro {
      text-align: right;
      font-size: 9pt;
      color: #666;
    }
    .nro-registro strong {
      display: block;
      font-size: 22pt;
      color: #1e3a8a;
      font-weight: 900;
      line-height: 1;
    }

    .titulo {
      text-align: center;
      font-size: 13pt;
      font-weight: bold;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 24px 0 8px;
    }
    .subtitulo {
      text-align: center;
      font-size: 9pt;
      color: #666;
      margin-bottom: 28px;
    }

    .cuerpo {
      border: 2px solid #1e3a8a;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .cuerpo-header {
      background: #1e3a8a;
      color: white;
      font-weight: bold;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 16px;
    }
    .cuerpo-body { padding: 16px; }

    .fila {
      display: flex;
      border-bottom: 1px solid #e5e7eb;
      padding: 7px 0;
      font-size: 10pt;
    }
    .fila:last-child { border-bottom: none; }
    .fila-label {
      width: 200px;
      color: #6b7280;
      font-size: 9pt;
      flex-shrink: 0;
    }
    .fila-valor {
      flex: 1;
      font-weight: 600;
      color: #111;
    }

    .declaracion {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 9pt;
      color: #444;
      line-height: 1.6;
      background: #f9fafb;
      margin-bottom: 32px;
      text-align: justify;
    }

    .firma-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
    }
    .firma-lugar {
      font-size: 9pt;
      color: #444;
    }
    .firma-lugar strong { display: block; margin-bottom: 4px; }
    .firma-box {
      text-align: center;
    }
    .firma-linea {
      width: 200px;
      border-top: 1px solid #333;
      margin: 0 auto 4px;
    }
    .firma-nombre {
      font-size: 8pt;
      color: #444;
      text-align: center;
    }
    .firma-nombre strong { display: block; font-size: 9pt; color: #111; }

    .sello {
      width: 90px;
      height: 90px;
      border: 2px dashed #1e3a8a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 7pt;
      color: #1e3a8a;
      font-weight: bold;
    }

    .pie {
      margin-top: 24px;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #9ca3af;
    }

    @media print {
      body { padding: 20px; }
      @page { size: A4; margin: 1.5cm; }
    }
  </style>
</head>
<body>

  <!-- Encabezado -->
  <div class="header">
    <img src="/logo-unamba.png" alt="UNAMBA" />
    <div class="header-text">
      <h1>Universidad Nacional Micaela Bastidas de Apurímac</h1>
      <p>Oficina de Recursos Humanos — Sub Oficina de Escalafón y Asuntos Laborales</p>
      <p>Resolución N° 021-2020-SUNEDU/CD, del 4 de febrero de 2020</p>
    </div>
    <div class="nro-registro">
      <span>N° de Registro</span>
      <strong>${nroRegistro}</strong>
    </div>
  </div>

  <div class="titulo">Constancia de Registro de Personal</div>
  <div class="subtitulo">
    Ficha de Registro de Datos del Personal Docente y No Docente — 2025
  </div>

  <!-- Datos del trabajador -->
  <div class="cuerpo">
    <div class="cuerpo-header">Datos del Trabajador</div>
    <div class="cuerpo-body">
      <div class="fila">
        <span class="fila-label">Apellidos y Nombres</span>
        <span class="fila-valor">${nombreCompleto}</span>
      </div>
      <div class="fila">
        <span class="fila-label">DNI</span>
        <span class="fila-valor">${p.dni || "—"}</span>
      </div>
      <div class="fila">
        <span class="fila-label">Fecha de Nacimiento</span>
        <span class="fila-valor">${p.fecha_nacimiento || "—"}</span>
      </div>
      <div class="fila">
        <span class="fila-label">Email Personal</span>
        <span class="fila-valor">${p.email_personal_1 || "—"}</span>
      </div>
      <div class="fila">
        <span class="fila-label">Celular</span>
        <span class="fila-valor">${p.celular || "—"}</span>
      </div>
    </div>
  </div>

  <!-- Datos laborales -->
  <div class="cuerpo">
    <div class="cuerpo-header">Datos Laborales en la UNAMBA</div>
    <div class="cuerpo-body">
      <div class="fila">
        <span class="fila-label">Dependencia</span>
        <span class="fila-valor">${l.dependencia || "—"}</span>
      </div>
      <div class="fila">
        <span class="fila-label">Cargo</span>
        <span class="fila-valor">${l.cargo || "—"}</span>
      </div>
      <div class="fila">
        <span class="fila-label">Condición</span>
        <span class="fila-valor">${l.condicion || "—"}</span>
      </div>
      <div class="fila">
        <span class="fila-label">Tipo de Personal</span>
        <span class="fila-valor">${l.tipo_personal || "—"}</span>
      </div>
      <div class="fila">
        <span class="fila-label">Fecha de Ingreso</span>
        <span class="fila-valor">${l.fecha_ingreso || "—"}</span>
      </div>
      <div class="fila">
        <span class="fila-label">Email Institucional</span>
        <span class="fila-valor">${l.email_institucional || "—"}</span>
      </div>
    </div>
  </div>

  <!-- Declaración jurada -->
  <div class="declaracion">
    <strong>Declaración Jurada:</strong> El trabajador declara bajo juramento que la
    presente información expresa la verdad, de conformidad con lo dispuesto por la
    <strong>Ley N° 27444 — Ley de Procedimiento Administrativo General</strong>.
    La falsedad en los datos consignados acarrea responsabilidad administrativa,
    civil y penal conforme a ley.
  </div>

  <!-- Firma -->
  <div class="firma-section">
    <div class="firma-lugar">
      <strong>Lugar y Fecha de Registro:</strong>
      Abancay, ${fecha}
    </div>
    <div class="firma-box">
      <div class="firma-linea"></div>
      <div class="firma-nombre">
        <strong>${nombreCompleto}</strong>
        DNI N° ${p.dni || "—"}
        <br/>Firma del Declarante
      </div>
    </div>
    <div class="sello">SELLO<br/>RR.HH.<br/>UNAMBA</div>
  </div>

  <!-- Pie -->
  <div class="pie">
    <span>Ficha Digital UNAMBA 2025 — Sistema de Registro de Personal</span>
    <span>Generado el ${fecha} · Registro ${nroRegistro}</span>
  </div>

</body>
</html>`

  const ventana = window.open("", "_blank")
  ventana.document.write(html)
  ventana.document.close()
  ventana.focus()
  setTimeout(() => ventana.print(), 500)
}