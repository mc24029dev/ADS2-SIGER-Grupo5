# SIGER - Sistema Inteligente de Gestión de Eventos y Reservaciones - GRUPO 5

SIGER es una aplicación web desarrollada para automatizar la organización de eventos académicos, empresariales y culturales. Permite gestionar eventos, reservar cupos, generar comprobantes con código QR, registrar asistencias en tiempo real y generar reportes estadísticos.

**Universidad de El Salvador** - Facultad Multidisciplinaria de Occidente  
*Asignatura:* Análisis y Diseño de Software II  
*Ciclo:* II / 2026

---

## Tecnologías Utilizadas

*   **Frontend:** React 19, Vite, Tailwind CSS, Axios, Recharts (gráficos), Lucide Icons.
*   **Backend:** Java, Spring Boot, Spring Security (Basic Auth), Spring Data JPA, OpenPDF (generación de PDFs), ZXing (generación de QR).
*   **Base de Datos:** PostgreSQL.
*   **Infraestructura:** Docker, Docker Compose, Nginx.

---

## Funcionalidades Principales

*   **Vistas Públicas:** Landing page, catálogo de eventos público, formulario de contacto (integrado con Mailtrap) y sección "Nosotros".
*   **Rol Administrador:** Dashboard analítico, gestión de usuarios (activar/desactivar/crear), gestión global de eventos, control de asistencias y generación de reportes PDF.
*   **Rol Organizador:** Gestión exclusiva de sus propios eventos, control de asistencia y descarga de reportes filtrados.
*   **Rol Participante:** Catálogo de eventos privado, reserva en línea, descarga de comprobante con código QR, cancelación de reservas y edición de perfil/contraseña.

---

## Ejecución del Proyecto (Recomendado con Docker)

**Requisitos:** Tener instalado [Docker](https://docs.docker.com/get-docker/) y Docker Compose.

1. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto y define las credenciales de la base de datos:
   ```env
   DB_NAME=siger
   DB_USER=siger_user
   DB_PASSWORD=aqui_la_password_que_definas
   ```

2. **Levantar la aplicación:**
   Desde la raíz del proyecto, ejecuta el siguiente comando para construir y levantar los 3 contenedores (Base de datos, Backend y Frontend):
   ```bash
   docker compose up -d --build
   ```

3. **Acceder al sistema:**
   *   **Aplicación Web:** Abre [http://localhost:3000](http://localhost:3000)
   *   **Documentación API (Swagger):** Abre [http://localhost:3000/siger/api/v1/swagger-ui.html](http://localhost:3000/siger/api/v1/swagger-ui.html)

**Comandos útiles de Docker:**
*   Para detener los 3 contenedores sin borrar nada: `docker compose stop`
*   Levantar los contenedores que se pararon: `docker compose start`
*   Para detener y borrar la base de datos (reinicio limpio): `docker compose down -v`

---

## Desarrollo Diario (Sin Dockerizar la App)

Si deseas realizar modificaciones al código y ver los cambios en tiempo real:

1. Levanta **solo la base de datos** con Docker:
   ```bash
   docker compose up -d db
   ```
2. Ejecuta el **Backend** (Spring Boot) desde tu IDE (IntelliJ, VS Code, etc.) en el puerto `8080`.
3. Ejecuta el **Frontend** desde la terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *El frontend en desarrollo estará disponible en [http://localhost:5173](http://localhost:5173)*

---

##  Equipo de Desarrollo
*   Jose Gerardo Pleites Campos
*   Rodrigo Alexis Mercado Calidonio
*   Cindy Ariana Reyes Molina
*   Irene Guadalupe Leon Madrid
*   Maria Ines Cruz Henriquez
*   Carlos Elias Sanchez Villalobos
