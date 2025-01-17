# Backend de Links y Comentarios

Este proyecto es un backend construido con **Express.js** que permite gestionar enlaces, votar por ellos y añadir comentarios. Proporciona una API REST con las siguientes rutas disponibles:

## 📚 Rutas Disponibles

### Links
1. **Crear un enlace**  
   **POST** `http://localhost:5000/links`  
   - Crea un nuevo enlace.  
   - **Body esperado** (JSON):  
     ```json
     {
       "title": "Título del enlace",
       "url": "https://example.com"
     }
     ```
   
2. **Obtener todos los enlaces**  
   **GET** `http://localhost:5000/links`  
   - Devuelve una lista de todos los enlaces disponibles.  

3. **Obtener un enlace por ID**  
   **GET** `http://localhost:5000/links/:id_link`  
   - Devuelve los detalles de un enlace específico según su ID.  

4. **Actualizar un enlace**  
   **PUT** `http://localhost:5000/links/:id_link`  
   - Actualiza los datos de un enlace específico.  
   - **Body esperado** (JSON):  
     ```json
     {
       "title": "Nuevo título",
       "url": "https://newurl.com"
     }
     ```

5. **Eliminar un enlace**  
   **DELETE** `http://localhost:5000/links/:id_link`  
   - Elimina un enlace por su ID.  

6. **Votar por un enlace**  
   **POST** `http://localhost:5000/links/:id_link/vote`  
   - Incrementa el número de votos de un enlace.  

### Comentarios
1. **Comentar en un enlace**  
   **POST** `http://localhost:5000/comments`  
   - Agrega un comentario a un enlace.  
   - **Body esperado** (JSON):  
     ```json
     {
       "id_link": "ID del enlace",
       "comment": "Texto del comentario"
     }
     ```

2. **Obtener comentarios de un enlace**  
   **GET** `http://localhost:5000/comments/:id_link`  
   - Devuelve una lista de comentarios asociados a un enlace específico.  

## 🚀 Cómo Usar

### Requisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/usuario/backend-links.git
   cd backend-links


Aquí tienes un README básico en formato Markdown para tu backend en Express:

markdown
Copiar
Editar
# Backend de Links y Comentarios

Este proyecto es un backend construido con **Express.js** que permite gestionar enlaces, votar por ellos y añadir comentarios. Proporciona una API REST con las siguientes rutas disponibles:

## 📚 Rutas Disponibles

### Links
1. **Crear un enlace**  
   **POST** `http://localhost:5000/links`  
   - Crea un nuevo enlace.  
   - **Body esperado** (JSON):  
     ```json
     {
       "title": "Título del enlace",
       "url": "https://example.com"
     }
     ```
   
2. **Obtener todos los enlaces**  
   **GET** `http://localhost:5000/links`  
   - Devuelve una lista de todos los enlaces disponibles.  

3. **Obtener un enlace por ID**  
   **GET** `http://localhost:5000/links/:id_link`  
   - Devuelve los detalles de un enlace específico según su ID.  

4. **Actualizar un enlace**  
   **PUT** `http://localhost:5000/links/:id_link`  
   - Actualiza los datos de un enlace específico.  
   - **Body esperado** (JSON):  
     ```json
     {
       "title": "Nuevo título",
       "url": "https://newurl.com"
     }
     ```

5. **Eliminar un enlace**  
   **DELETE** `http://localhost:5000/links/:id_link`  
   - Elimina un enlace por su ID.  

6. **Votar por un enlace**  
   **POST** `http://localhost:5000/links/:id_link/vote`  
   - Incrementa el número de votos de un enlace.  

### Comentarios
1. **Comentar en un enlace**  
   **POST** `http://localhost:5000/comments`  
   - Agrega un comentario a un enlace.  
   - **Body esperado** (JSON):  
     ```json
     {
       "id_link": "ID del enlace",
       "comment": "Texto del comentario"
     }
     ```

2. **Obtener comentarios de un enlace**  
   **GET** `http://localhost:5000/comments/:id_link`  
   - Devuelve una lista de comentarios asociados a un enlace específico.  

## 🚀 Cómo Usar

### Requisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/pederseo/multi_framework/tree/main/backend
   cd backend-links
Instala las dependencias:
bash
Copiar
Editar
npm install
Inicia el servidor:
bash
Copiar
Editar
npm start
El servidor estará disponible en http://localhost:5000.

🛠️ Tecnologías Utilizadas
Node.js
Express.js