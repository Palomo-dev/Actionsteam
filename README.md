# CourseHub Connect

Plataforma de cursos en línea construida con React + Vite y Supabase.

## Configuración del Proyecto

1. Clona el repositorio:
```bash
git clone https://github.com/Palomo-dev/actionsteams-133097e1.git
cd actionsteams-133097e1
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
- Copia `.env.example` a `.env`
- Actualiza las variables con tus credenciales

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

- `/src`: Código fuente de la aplicación
  - `/components`: Componentes React reutilizables
  - `/pages`: Páginas de la aplicación
  - `/hooks`: Custom hooks
  - `/services`: Servicios y APIs
  - `/utils`: Utilidades y helpers

- `/scripts`: Scripts SQL y de migración
- `/supabase`: Configuración de Supabase
  - `/functions`: Edge Functions
  - `/migrations`: Migraciones SQL

## Base de Datos

La aplicación utiliza Supabase como backend y base de datos. La estructura incluye:

- Autenticación de usuarios
- Gestión de cursos y contenido
- Sistema de progreso y evaluaciones
- Métricas de video
- Sistema de pagos
- Gamificación
- Chat y comentarios

## Tecnologías Principales

- React + Vite
- TypeScript
- Supabase
- TailwindCSS
- Stripe (pagos)
- OpenAI (chat)
