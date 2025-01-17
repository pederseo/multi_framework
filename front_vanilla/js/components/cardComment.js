import { createComment, getCommentsById, likeButton } from "../controllers/contrllers.js";



export const overlayDetails = async (db, mainElement) => {
  // Crear un overlay que muestre los detalles
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const loadComments = async () => {
    const comments = await getCommentsById(db._id);

    // Generar el HTML de los comentarios
    return comments
      .map(comment => `<p><strong>:</strong> ${comment.content}</p>`)
  };

  // Cargar comentarios iniciales
  const commentsHTML = await loadComments();

  // Contenido del overlay
  overlay.innerHTML = `
    <div class="overlay-comment">
      <button class="close-comment">✖</button>
      <div class="card-container">
        <!-- Columna izquierda: Imagen -->
        <div class="card-image">
          <img src="${db.url}" alt="${db.title}" />
        </div>

        <!-- Columna derecha: Contenido -->
        <div class="card-details">
          <h2>${db.title}</h2>
          <p>${db.description}</p>
          <h2>Comentarios:</h2>
          <div id="comments-list">${commentsHTML}</div>

          <div class="actions">
            <button class="like-button">❤ Likes ${db.votes}</button>
            <div class="comment-section" id="comment-section">
              <input id="comment-input" type="text" placeholder="Escribe un comentario..." />
              <button class="comment-button" id="comment-button">Comentar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Agregar evento para cerrar el overlay
  overlay.querySelector('.close-comment').addEventListener('click', () => {
    overlay.remove();
  });

  // Evento para agregar un nuevo comentario
  overlay.querySelector('#comment-button').addEventListener('click', async () => {
    const commentInput = overlay.querySelector('#comment-input');
    const comment = commentInput.value.trim();

    // Validar el campo de entrada
    if (!comment) {
      alert('Por favor, escribe un comentario antes de enviar.');
      return;
    }

    try {
      // Enviar el nuevo comentario a la API
      await createComment(db._id, comment);

      // Recargar la lista de comentarios desde la API
      const updatedCommentsHTML = await loadComments();
      overlay.querySelector('#comments-list').innerHTML = updatedCommentsHTML;

      // Limpiar el campo de entrada
      commentInput.value = "";
    } catch (error) {
      console.error('Error al publicar el comentario:', error);
      alert('Ocurrió un error al publicar el comentario. Inténtalo nuevamente.');
    }
  });

  // like button
  overlay.querySelector('.like-button').addEventListener('click', async () => {
    try {
      // Llamada a la API para registrar el like
      await likeButton(db._id);
  
      // Incrementar el número de likes localmente
      db.votes += 1;
      overlay.querySelector('.like-button').innerHTML = `❤ Likes ${db.votes}`;
    } catch (error) {
      console.error('Error al darle like:', error);
      alert('Hubo un problema al intentar dar like. Intenta nuevamente.');
    }
  });
  

  // Añadir el overlay al mainElement
  mainElement.appendChild(overlay);

  return mainElement;
};
