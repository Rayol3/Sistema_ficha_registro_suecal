# Sistema de Registro de Fichas de Escalafón - UNAMBA

Sistema integral para el registro, gestión y administración de fichas de escalafón del personal de la UNAMBA. Incluye portal público para el llenado y validación de fichas, y panel administrativo para revisión, aprobación y exportación a Excel.

---

## 🔑 Credenciales de Acceso Administrativo (Panel Admin)

Para ingresar al panel de administración en `/admin` o `/admin/login`:

| Campo | Valor |
| :--- | :--- |
| **Usuario:** | `admin` |
| **Contraseña:** | `unamba2026!` |
| **Ruta de Acceso:** | `http://localhost:5173/admin/login` |

> [!IMPORTANT]
> **Para Railway / Producción:** Debes configurar estas mismas variables en la pestaña **Variables** de tu servicio Backend en Railway:
> - `ADMIN_USUARIO` = `admin`
> - `ADMIN_CONTRASENA` = `unamba2026!`
> - `ADMIN_SECRET_KEY` = `unamba_jwt_secret_key_2025_suboficina_escalafon_secure`
> - `ADMIN_TOKEN_HOURS` = `8`

---

## 📁 Estructura del Repositorio

```
Sistema_Fichas_Escalafon/
├── backend/                  # API REST con FastAPI (Python)
│   ├── app/                  # Lógica de la aplicación (routers, models, schemas)
│   ├── Procfile              # Configuración de despliegue (Railway/Heroku)
│   ├── render.yaml           # Configuración de despliegue para Render
│   ├── requirements.txt      # Dependencias de Python
│   └── schema.sql            # Esquema de base de datos PostgreSQL
├── frontend/                 # Aplicación SPA con React 19 + Vite + TailwindCSS
│   ├── src/                  # Componentes, vistas, servicios y hooks
│   ├── public/               # Recursos estáticos
│   ├── package.json          # Dependencias y scripts de Node.js
│   ├── tailwind.config.js    # Configuración de TailwindCSS
│   ├── nixpacks.toml         # Configuración de build para Railway
│   └── vite.config.js        # Configuración de Vite
└── README.md                 # Documentación del proyecto
```

---

## 🚀 Puesta en Marcha Local

### 1. Base de Datos (PostgreSQL en Docker)
Si usas el contenedor local Docker:
* **Host:** `localhost`
* **Puerto:** `5433`
* **Base de Datos:** `ficha_registro_db`
* **Usuario:** `postgres`
* **Contraseña:** `123`

### 2. Backend (FastAPI + PostgreSQL)

1. Navegar a la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Activar entorno virtual e instalar dependencias:
   ```bash
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   ./venv/bin/uvicorn app.main:app --reload --port 8001
   ```
   * API URL: `http://localhost:8001`
   * Swagger Docs: `http://localhost:8001/docs`

---

### 3. Frontend (React + Vite)

1. Navegar a la carpeta `frontend`:
   ```bash
   cd frontend
   ```

2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
   * App URL: `http://localhost:5173`
   * Panel Admin: `http://localhost:5173/admin/login`

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL, Cloudinary, OpenPyXL, Python-Jose (JWT).
- **Frontend:** React 19, Vite, TailwindCSS, React Hook Form, Zod, Axios, Lucide Icons, @react-pdf/renderer.
