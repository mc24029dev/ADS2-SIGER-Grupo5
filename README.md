## Ejecutar la app web

1. Clonar el repositorio de GitHub
   
3. Una vez dentro del proyecto dirigirse al directorio backend
   
   ```
   cd backend
   ```
4. Dentro de backend/, copiar .env.example como .env y agregar una clave
5. Desde backend/ levantar el contenedor ejecutando:
   ```
   docker compose up -d
   ```
6. Comprobar que esté listo (debe decir healthy):
   ```
   docker compose ps
   ```
   
7. Con el contenedor funcionando se debe ejecutar el backend desde backend/:
   ```
   ./mvnw spring-boot:run   
   ```
8. Para ejecutar el frontend, desde la raiz del proyecto dirigirse a frontend/
   ```
   cd frontend
   ```
9. Instalar dependencias
    
    ```
    npm install
    ```
10. Iniciar el servidor de desarrollo local
    ```
    npm run dev
    ```
11. Abrir el navegador desde la ruta
    ```
    http://localhost:5173/
    ```
    
