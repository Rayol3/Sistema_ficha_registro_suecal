// Opciones fijas para todos los selects del formulario
export const SEXO = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino",  label: "Femenino"  },
]

export const ESTADO_CIVIL = [
  { value: "Soltero",    label: "Soltero/a"   },
  { value: "Casada",     label: "Casado/a"    },
  { value: "Viudo",      label: "Viudo/a"     },
  { value: "Divorciado", label: "Divorciado/a"},
  { value: "Otro",       label: "Otro"        },
]

export const TIPO_VIVIENDA = [
  { value: "Propia",       label: "Propia"       },
  { value: "Alquilada",    label: "Alquilada"    },
  { value: "Departamento", label: "Departamento" },
  { value: "Quinta",       label: "Quinta"       },
  { value: "Otro",         label: "Otro"         },
]

export const GRUPO_SANGUINEO = [
  { value: "A+",  label: "A+"  },
  { value: "A-",  label: "A-"  },
  { value: "B+",  label: "B+"  },
  { value: "B-",  label: "B-"  },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+",  label: "O+"  },
  { value: "O-",  label: "O-"  },
]

export const SISTEMA_PENSION = [
  { value: "ONP", label: "ONP — Sistema Nacional de Pensiones" },
  { value: "AFP", label: "AFP — Sistema Privado de Pensiones"  },
]

export const AFP = [
  { value: "Integra",   label: "Integra"   },
  { value: "Profuturo", label: "Profuturo" },
  { value: "Habitat",   label: "Habitat"   },
  { value: "Prima",     label: "Prima"     },
]

export const RAMA_MILITAR = [
  { value: "Ejército",          label: "Ejército"          },
  { value: "Marina",            label: "Marina"            },
  { value: "Aviación",          label: "Aviación"          },
  { value: "Fuerzas Especiales",label: "Fuerzas Especiales"},
]

export const NIVEL_IDIOMA = [
  { value: "Básico",     label: "Básico"     },
  { value: "Intermedio", label: "Intermedio" },
  { value: "Avanzado",   label: "Avanzado"   },
]

export const CONDICION = [
  { value: "Nombrado",   label: "Nombrado"   },
  { value: "Contratado", label: "Contratado" },
]

export const TIPO_PERSONAL = [
  { value: "Docente",        label: "Docente"        },
  { value: "Administrativo", label: "Administrativo" },
]

// ── Régimen reestructurado ─────────────────────────────────

export const CATEGORIA_REGIMEN = {
  // Administrativo nombrado → DL 276
  "Nombrado-Administrativo": {
    label:   "Régimen D.L. 276",
    value:   "DL 276",
    opciones: [
      { value: "Profesional", label: "Profesional" },
      { value: "Técnico",     label: "Técnico"     },
      { value: "Auxiliar",    label: "Auxiliar"    },
    ],
    campo: "regimen_dl276",
    mostrarNivel:      true,
    mostrarDedicacion: false,
  },
  // Administrativo contratado → CAS
  "Contratado-Administrativo": {
    label:   "Régimen D.L. 1057 (CAS)",
    value:   "CAS",
    opciones: [
      { value: "CAS Permanente",  label: "CAS Permanente"  },
      { value: "CAS Determinado", label: "CAS Determinado" },
      { value: "CAS Confianza",   label: "CAS Confianza"   },
    ],
    campo: "regimen_cas",
    mostrarNivel:      false,
    mostrarDedicacion: false,
  },
  // Docente nombrado → Ordinario
  "Nombrado-Docente": {
    label:   "Régimen Ordinario",
    value:   "Ordinario",
    opciones: [
      { value: "Principal", label: "Principal" },
      { value: "Asociado",  label: "Asociado"  },
      { value: "Auxiliar",  label: "Auxiliar"  },
      { value: "JP",        label: "JP"        },
    ],
    campo: "regimen_ordinario",
    mostrarNivel:      false,
    mostrarDedicacion: true,
  },
  // Docente contratado → Contratado
  "Contratado-Docente": {
    label:   "Régimen Contratado",
    value:   "Contratado",
    opciones: [
      { value: "DC-A1", label: "DC-A1" },
      { value: "DC-A2", label: "DC-A2" },
      { value: "DC-A3", label: "DC-A3" },
      { value: "DC-B1", label: "DC-B1" },
      { value: "DC-B2", label: "DC-B2" },
      { value: "DC-B3", label: "DC-B3" },
    ],
    campo: "regimen_contratado",
    mostrarNivel:      false,
    mostrarDedicacion: true,
  },
}

export const NIVEL_REMUNERATIVO = [
  { value: "A", label: "Nivel A" },
  { value: "B", label: "Nivel B" },
  { value: "C", label: "Nivel C" },
  { value: "D", label: "Nivel D" },
  { value: "E", label: "Nivel E" },
  { value: "F", label: "Nivel F" },
]

export const NIVEL_RENACYT = [
  { value: "I",                       label: "Nivel I"                       },
  { value: "II",                      label: "Nivel II"                      },
  { value: "III",                     label: "Nivel III"                     },
  { value: "IV",                      label: "Nivel IV"                      },
  { value: "V",                       label: "Nivel V"                       },
  { value: "VI",                      label: "Nivel VI"                      },
  { value: "VII",                     label: "Nivel VII"                     },
  { value: "Investigador Distinguido", label: "Investigador Distinguido"      },
]

export const DEDICACION = [
  { value: "DE",    label: "DE — Dedicación Exclusiva" },
  { value: "TC",    label: "TC — Tiempo Completo"      },
  { value: "TP",    label: "TP — Tiempo Parcial"       },
  { value: "Horas", label: "Por Horas"                 },
]

export const PARENTESCO = [
  { value: "Cónyuge", label: "Cónyuge" },
  { value: "Hijo",    label: "Hijo"    },
  { value: "Hija",    label: "Hija"    },
  { value: "Padre",   label: "Padre"   },
  { value: "Madre",   label: "Madre"   },
]

export const NIVEL_EDUCATIVO = [
  { value: "Primaria",              label: "Primaria"              },
  { value: "Secundaria",            label: "Secundaria"            },
  { value: "Técnico",               label: "Técnico"               },
  { value: "Bachiller Universitario", label: "Bachiller Universitario" },
  { value: "Título Universitario",  label: "Título Universitario"  },
  { value: "Segunda Especialidad",  label: "Segunda Especialidad"  },
  { value: "Maestría",              label: "Maestría"              },
  { value: "Doctorado",             label: "Doctorado"             },
]

export const ESTADO_ESTUDIO = [
  { value: "Completo",   label: "Completo"   },
  { value: "Incompleto", label: "Incompleto" },
  { value: "En curso",   label: "En curso"   },
]

export const TIPO_OTRO_ESTUDIO = [
  { value: "Diplomado",       label: "Diplomado"       },
  { value: "Especialización", label: "Especialización" },
  { value: "Otro",            label: "Otro"            },
]

export const TIPO_CONSTANCIA = [
  { value: "Certificado", label: "Certificado" },
  { value: "Diploma",     label: "Diploma"     },
  { value: "Constancia",  label: "Constancia"  },
  { value: "Resolución",  label: "Resolución"  },
  { value: "Otro",        label: "Otro"        },
]

export const TIPO_INSTITUCION = [
  { value: "Estatal",  label: "Estatal"  },
  { value: "Privada",  label: "Privada"  },
]

// ── Pasos del Stepper Wizard ───────────────────────────────
export const PASOS_FICHA = [
  { id: 1, label: "Datos Personales",  shortLabel: "Personal"  },
  { id: 2, label: "Datos Laborales",   shortLabel: "Laboral"   },
  { id: 3, label: "Familiares",        shortLabel: "Familia"   },
  { id: 4, label: "Formación",         shortLabel: "Formación" },
  { id: 5, label: "Experiencia",       shortLabel: "Experiencia"},
  { id: 6, label: "Otros & Reconoc.",  shortLabel: "Otros"     },
  { id: 7, label: "Revisión Final",    shortLabel: "Revisión"  },
]