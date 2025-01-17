import { createLink } from "../controllers/contrllers.js";

export const overlayUpload = (mainContainer, navContainer) => {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay-upload');

  overlay.innerHTML = `
    <div class="overlay-content">
      <button class="close-overlay">✖</button>
      <div class="upload-container">
        <h2>Publicar Contenido</h2>
        <div class="input-section">
          <input type="text" id="title-input" placeholder="Título" />
          <input type="text" id="link-input" placeholder="Enlace (URL)" />
          <textarea id="description-input" placeholder="Descripción"></textarea>
          <input type="text" id="tags-input" placeholder="Etiquetas (separadas por comas)" />
          <button id="publish-button">Publicar</button>
        </div>
      </div>
    </div>
  `;

  // Cerrar el overlay
  overlay.querySelector('.close-overlay').addEventListener('click', () => {
    overlay.remove();
  });

  // Manejar el evento de publicación
  overlay.querySelector('#publish-button').addEventListener('click', async () => {
    const title = overlay.querySelector('#title-input').value.trim();
    const link = overlay.querySelector('#link-input').value.trim();
    const description = overlay.querySelector('#description-input').value.trim();
    const tags = overlay.querySelector('#tags-input').value.trim();

    // Validar campos
    if (!title || !link || !description || !tags) {
      alert('Por favor, completa todos los campos antes de publicar.');
      return;
    }

    try {
      // Enviar datos a la API
      await createLink(title, link, description, tags);
      alert('¡Contenido publicado con éxito!');
      overlay.remove(); // Cerrar el overlay después de una publicación exitosa
    } catch (error) {
      console.error('Error al publicar el contenido:', error);
      alert('Ocurrió un error al publicar. Por favor, intenta nuevamente.');
    }
  });

  // Añadir el overlay al mainContainer
  mainContainer.appendChild(overlay);
  

  return mainContainer;
};
