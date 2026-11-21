## Ejecutar la app web

Requisitos: Docker y Docker Compose.

1. Copia `.env.example` a `.env` y completa las credenciales.
2. Levanta todo:
   ```bash
   docker compose up -d --build
   ```
3. Abre http://localhost:3000
   (Swagger: http://localhost:3000/siger/api/v1/swagger-ui.html)

Para detener: `docker compose down`

Para detener y borrar la base de datos: `docker compose down -v`

### Desarrollo diario (sin dockerizar la app)

Levanta solo la base de datos:
```bash
docker compose up -d db
```
Y corre Spring Boot desde el IDE y React con `npm run dev` (puerto 5173).
    
