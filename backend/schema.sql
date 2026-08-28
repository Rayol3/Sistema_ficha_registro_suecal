-- ══════════════════════════════════════════════════════════════
-- SCHEMA UNAMBA 2025 — Script para Railway PostgreSQL
-- Generado para migración desde Supabase
-- ══════════════════════════════════════════════════════════════

-- ── ENUMs ──────────────────────────────────────────────────────

CREATE TYPE sexo_tipo AS ENUM ('Masculino', 'Femenino');

CREATE TYPE estado_civil_tipo AS ENUM (
  'Soltero', 'Casado', 'Casada', 'Viudo', 'Divorciado', 'Otro'
);

CREATE TYPE tipo_vivienda_tipo AS ENUM (
  'Propia', 'Alquilada', 'Departamento', 'Quinta', 'Otro'
);

CREATE TYPE sistema_pension_tipo AS ENUM ('ONP', 'AFP');

CREATE TYPE afp_tipo AS ENUM (
  'Integra', 'Profuturo', 'Habitat', 'Prima'
);

CREATE TYPE rama_militar_tipo AS ENUM (
  'Ejército', 'Marina', 'Aviación', 'Fuerzas Especiales'
);

CREATE TYPE condicion_tipo AS ENUM ('Nombrado', 'Contratado');

CREATE TYPE tipo_personal_tipo AS ENUM ('Docente', 'Administrativo');

CREATE TYPE categoria_regimen_tipo AS ENUM (
  'DL 276', 'CAS', 'Ordinario', 'Contratado'
);

CREATE TYPE regimen_dl276_tipo AS ENUM (
  'Profesional', 'Técnico', 'Auxiliar'
);

CREATE TYPE regimen_cas_tipo AS ENUM (
  'CAS Permanente', 'CAS Determinado', 'CAS Confianza'
);

CREATE TYPE regimen_ordinario_tipo AS ENUM (
  'Principal', 'Asociado', 'Auxiliar', 'JP'
);

CREATE TYPE regimen_contratado_tipo AS ENUM (
  'DC-A1', 'DC-A2', 'DC-A3',
  'DC-B1', 'DC-B2', 'DC-B3'
);

CREATE TYPE nivel_remunerativo_tipo AS ENUM (
  'A', 'B', 'C', 'D', 'E', 'F'
);

CREATE TYPE dedicacion_tipo AS ENUM ('DE', 'TC', 'TP', 'Horas');

CREATE TYPE nivel_renacyt_tipo AS ENUM (
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'Investigador Distinguido'
);

CREATE TYPE parentesco_tipo AS ENUM (
  'Cónyuge', 'Hijo', 'Hija', 'Padre', 'Madre', 'Otro'
);

CREATE TYPE nivel_educativo_tipo AS ENUM (
  'Primaria', 'Secundaria', 'Técnico',
  'Bachiller Universitario', 'Título Universitario',
  'Segunda Especialidad', 'Maestría', 'Doctorado'
);

CREATE TYPE estado_estudio_tipo AS ENUM (
  'Completo', 'Incompleto', 'En curso'
);

CREATE TYPE tipo_otro_estudio_tipo AS ENUM (
  'Diplomado', 'Especialización', 'Otro'
);

CREATE TYPE tipo_constancia_tipo AS ENUM (
  'Certificado', 'Diploma', 'Resolución', 'Otro'
);

CREATE TYPE tipo_institucion_tipo AS ENUM ('Estatal', 'Privada');

-- ── TABLAS ─────────────────────────────────────────────────────

-- 1. Personal (tabla principal)
CREATE TABLE personal (
  id                      SERIAL PRIMARY KEY,
  foto_url                TEXT,
  apellido_paterno        VARCHAR NOT NULL,
  apellido_materno        VARCHAR NOT NULL,
  nombres                 VARCHAR NOT NULL,
  dni                     CHAR(8) NOT NULL UNIQUE
                            CHECK (dni ~ '^\d{8}$'),
  libreta_militar         VARCHAR,
  sexo                    sexo_tipo NOT NULL,
  fecha_nacimiento        DATE NOT NULL,
  estado_civil            estado_civil_tipo NOT NULL,
  nac_pais                VARCHAR NOT NULL DEFAULT 'Perú',
  nac_departamento        VARCHAR NOT NULL,
  nac_provincia           VARCHAR NOT NULL,
  nac_distrito            VARCHAR NOT NULL,
  telefono_fijo           VARCHAR,
  celular                 VARCHAR NOT NULL,
  email_personal_1        VARCHAR NOT NULL
                            CHECK (email_personal_1 ~* '^[^@]+@[^@]+\.[^@]+$'),
  email_personal_2        VARCHAR,
  dom_tipo_via            VARCHAR,
  dom_direccion           VARCHAR NOT NULL,
  dom_referencia          VARCHAR,
  tipo_vivienda           tipo_vivienda_tipo,
  tipo_vivienda_otro      VARCHAR,
  ruc                     CHAR(11) CHECK (ruc IS NULL OR ruc ~ '^\d{11}$'),
  licencia_conducir       VARCHAR,
  afiliacion_essalud      VARCHAR,
  grupo_sanguineo         VARCHAR,
  donador_organos         BOOLEAN DEFAULT false,
  banco                   VARCHAR,
  cuenta_numero           VARCHAR,
  cuenta_cci              VARCHAR,
  denominacion_prof       VARCHAR,
  abreviatura_prof        VARCHAR,
  colegio_prof_nombre     VARCHAR,
  colegio_prof_numero     VARCHAR,
  colegio_prof_fecha      DATE,
  sistema_pension         sistema_pension_tipo,
  afp_nombre              afp_tipo,
  codigo_afiliacion       VARCHAR,
  fecha_afiliacion        DATE,
  tiene_discapacidad      BOOLEAN DEFAULT false,
  conadis_registro        VARCHAR,
  realizo_serv_militar    BOOLEAN DEFAULT false,
  serv_militar_rama       rama_militar_tipo,
  serv_militar_cargo      VARCHAR,
  serv_militar_fecha_inicio DATE,
  serv_militar_fecha_fin    DATE,
  idiomas_nativos         JSONB DEFAULT '[]'::jsonb,
  ofimatica               JSONB DEFAULT '[]'::jsonb,
  creado_en               TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice único para DNI
CREATE UNIQUE INDEX idx_personal_dni ON personal(dni);

-- 2. Datos Laborales
CREATE TABLE datos_laborales (
  id                  SERIAL PRIMARY KEY,
  personal_id         INTEGER NOT NULL UNIQUE
                        REFERENCES personal(id) ON DELETE CASCADE,
  dependencia         VARCHAR NOT NULL,
  cargo               VARCHAR NOT NULL,
  fecha_ingreso       DATE NOT NULL,
  email_institucional VARCHAR NOT NULL
                        CHECK (email_institucional ~* '^[^@]+@unamba\.edu\.pe$'),
  condicion           condicion_tipo NOT NULL,
  tipo_personal       tipo_personal_tipo NOT NULL,
  categoria_regimen   categoria_regimen_tipo,
  regimen_dl276       regimen_dl276_tipo,
  regimen_cas         regimen_cas_tipo,
  regimen_ordinario   regimen_ordinario_tipo,
  regimen_contratado  regimen_contratado_tipo,
  regimen_otros       VARCHAR,
  nivel_remunerativo  nivel_remunerativo_tipo,
  dedicacion          dedicacion_tipo,
  horas_semanales     SMALLINT,
  es_renacyt          BOOLEAN DEFAULT false,
  renacyt_codigo      VARCHAR,
  renacyt_nivel       nivel_renacyt_tipo,
  renacyt_activo      BOOLEAN DEFAULT true,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Familiares
CREATE TABLE familiares (
  id                  SERIAL PRIMARY KEY,
  personal_id         INTEGER NOT NULL
                        REFERENCES personal(id) ON DELETE CASCADE,
  apellido_paterno    VARCHAR NOT NULL,
  apellido_materno    VARCHAR NOT NULL,
  nombres             VARCHAR NOT NULL,
  parentesco          parentesco_tipo NOT NULL,
  dni                 CHAR(8) CHECK (dni IS NULL OR dni ~ '^\d{8}$'),
  fecha_nacimiento    DATE,
  sexo                sexo_tipo,
  nac_pais            VARCHAR DEFAULT 'Perú',
  nac_departamento    VARCHAR,
  nac_provincia       VARCHAR,
  nac_distrito        VARCHAR,
  nac_anexo           VARCHAR,
  vive_con_trabajador BOOLEAN DEFAULT false,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Constraint: solo un cónyuge por trabajador
CREATE UNIQUE INDEX chk_un_conyuge
  ON familiares(personal_id)
  WHERE parentesco = 'Cónyuge';

-- 4. Formación Académica
CREATE TABLE formacion_academica (
  id                  SERIAL PRIMARY KEY,
  personal_id         INTEGER NOT NULL
                        REFERENCES personal(id) ON DELETE CASCADE,
  nivel               nivel_educativo_tipo NOT NULL,
  estado              estado_estudio_tipo NOT NULL,
  centro_estudios     VARCHAR,
  grado_obtenido      VARCHAR,
  mencion             VARCHAR,
  fecha_inicio        DATE,
  fecha_conclusion    DATE,
  documento_acredita  VARCHAR,
  orden               SMALLINT NOT NULL DEFAULT 1 CHECK (orden >= 1),
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Otros Estudios
CREATE TABLE otros_estudios (
  id                  SERIAL PRIMARY KEY,
  personal_id         INTEGER NOT NULL
                        REFERENCES personal(id) ON DELETE CASCADE,
  tipo                tipo_otro_estudio_tipo NOT NULL,
  nombre_curso        VARCHAR NOT NULL,
  centro_estudios     VARCHAR NOT NULL,
  fecha_inicio        DATE,
  fecha_fin           DATE,
  fecha_emision       DATE,
  duracion_horas      SMALLINT CHECK (duracion_horas IS NULL OR duracion_horas > 0),
  tipo_constancia     tipo_constancia_tipo,
  orden               SMALLINT NOT NULL DEFAULT 1
                        CHECK (orden >= 1 AND orden <= 10),
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Experiencia Laboral
CREATE TABLE experiencia_laboral (
  id                  SERIAL PRIMARY KEY,
  personal_id         INTEGER NOT NULL
                        REFERENCES personal(id) ON DELETE CASCADE,
  tipo_institucion    tipo_institucion_tipo NOT NULL,
  nombre_entidad      VARCHAR NOT NULL,
  cargo               VARCHAR NOT NULL,
  documento_acredita  VARCHAR,
  fecha_inicio        DATE NOT NULL,
  fecha_culminacion   DATE,
  tiempo_cargo        VARCHAR,
  orden               SMALLINT NOT NULL DEFAULT 1
                        CHECK (orden >= 1 AND orden <= 10),
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Experiencia Docente
CREATE TABLE experiencia_docente (
  id                  SERIAL PRIMARY KEY,
  personal_id         INTEGER NOT NULL
                        REFERENCES personal(id) ON DELETE CASCADE,
  nombre_entidad      VARCHAR NOT NULL,
  categoria           VARCHAR,
  documento_acredita  VARCHAR,
  fecha_inicio        DATE NOT NULL,
  fecha_culminacion   DATE,
  tiempo_cargo        VARCHAR,
  orden               SMALLINT NOT NULL DEFAULT 1
                        CHECK (orden >= 1 AND orden <= 15),
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Otras Instituciones
CREATE TABLE otras_instituciones (
  id                  SERIAL PRIMARY KEY,
  personal_id         INTEGER NOT NULL UNIQUE
                        REFERENCES personal(id) ON DELETE CASCADE,
  labora_otra_inst    BOOLEAN NOT NULL DEFAULT false,
  tipo_personal       tipo_personal_tipo,
  nombre_entidad      VARCHAR,
  dia_lunes           BOOLEAN DEFAULT false,
  dia_martes          BOOLEAN DEFAULT false,
  dia_miercoles       BOOLEAN DEFAULT false,
  dia_jueves          BOOLEAN DEFAULT false,
  dia_viernes         BOOLEAN DEFAULT false,
  horas_diarias       SMALLINT
                        CHECK (horas_diarias IS NULL OR
                               (horas_diarias > 0 AND horas_diarias <= 12)),
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Reconocimientos
CREATE TABLE reconocimientos (
  id                  SERIAL PRIMARY KEY,
  personal_id         INTEGER NOT NULL
                        REFERENCES personal(id) ON DELETE CASCADE,
  nombre_entidad      VARCHAR NOT NULL,
  tipo_reconocimiento VARCHAR NOT NULL,
  documento_acredita  VARCHAR,
  fecha_documento     DATE,
  orden               SMALLINT NOT NULL DEFAULT 1
                        CHECK (orden >= 1 AND orden <= 6),
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Solicitudes de Actualización
CREATE TABLE solicitudes_actualizacion (
  id          SERIAL PRIMARY KEY,
  personal_id INTEGER REFERENCES personal(id) ON DELETE CASCADE,
  estado      VARCHAR(20) DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente','aprobada','rechazada','resuelta')),
  motivo      TEXT,
  creado_en   TIMESTAMPTZ DEFAULT now(),
  resuelto_en TIMESTAMPTZ
);

-- Índices para solicitudes
CREATE INDEX idx_solicitudes_personal
  ON solicitudes_actualizacion(personal_id);
CREATE INDEX idx_solicitudes_estado
  ON solicitudes_actualizacion(estado);

-- ── Índice único para otras_instituciones ──────────────────────
CREATE UNIQUE INDEX idx_otras_inst_personal
  ON otras_instituciones(personal_id);
