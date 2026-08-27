# Sistema de Registro de Fichas de Escalafón - UNAMBA

Sistema integral para el registro, gestión y administración de fichas de escalafón del personal de la UNAMBA. Incluye portal público para el llenado y validación de fichas, y panel administrativo para revisión, aprobación y exportación a Excel.

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
│   └── vite.config.js        # Configuración de Vite
└── README.md                 # Documentación del proyecto
```

---

## 🚀 Puesta en Marcha Local

### 1. Backend (FastAPI + PostgreSQL)

1. Navegar a la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Crear y activar entorno virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configurar variables de entorno (`.env`):
   ```env
   DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_bd
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ADMIN_USUARIO=admin
   ADMIN_CONTRASENA=tu_password_seguro
   ADMIN_SECRET_KEY=tu_jwt_secret_key
   ADMIN_TOKEN_HOURS=8
   ```

5. Iniciar el servidor de desarrollo:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Documentación Swagger disponible en: `http://localhost:8000/docs`

---

### 2. Frontend (React + Vite)

1. Navegar a la carpeta `frontend`:
   ```bash
   cd frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno si es necesario (`.env.local`):
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL, Cloudinary, OpenPyXL.
- **Frontend:** React 19, Vite, TailwindCSS, React Hook Form, Zod, Axios, Lucide Icons, @react-pdf/renderer.
