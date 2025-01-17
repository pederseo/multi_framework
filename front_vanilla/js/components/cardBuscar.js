import { getAllTags } from "../controllers/contrllers.js";
import { renderMain } from "./mainContent.js";

export const cardBuscar = async (navContainer, mainContainer) => {
  // Crear el overlay principal
  let overlay = document.createElement('div');
  overlay.classList.add('overlay-buscar');

  // Usar innerHTML para crear el contenido inicial de la tarjeta
  overlay.innerHTML = `
    <div class="card-buscar">
        <button class="close-button">&times;</button>
        <h3 class="card-title">Buscar</h3>
        <div class="search-container">
            <input type="text" id="search-input" class="search-input" placeholder="buscar..." />
            <button id="search-button" class="search-button">Buscar</button>
        </div>
        <hr class="divider" />
        <div class="tags-container">
            <!-- Los tags se cargarán dinámicamente -->
        </div>
    </div>
  `;

  // Agregar funcionalidad del botón de cerrar
  const closeButton = overlay.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    overlay.classList.remove('active'); // Oculta el overlay al eliminar la clase "active"
  });

  // Obtener los tags desde la API
  const tagsContainer = overlay.querySelector('.tags-container');
  const tags = await getAllTags();

  // Generar dinámicamente los tags
  tags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.classList.add('tag');
    tagElement.textContent = tag;
    tagsContainer.appendChild(tagElement);

    // Agregar funcionalidad al seleccionar un tag
    const input = overlay.querySelector('#search-input');
    tagElement.addEventListener('click', () => {
      input.value = tag; // Asignar el valor del tag seleccionado al input
    });
  });

  // Funcionalidad del botón de búsqueda
  const searchButton = overlay.querySelector('#search-button');
  searchButton.addEventListener('click', () => {
    const selectTag = overlay.querySelector('#search-input').value.trim();

    // Verificar si el tag no está vacío antes de llamar a renderMain
    if (selectTag) {
      renderMain(navContainer, mainContainer, selectTag); // Llamar a la función renderMain con el tag seleccionado
      overlay.classList.remove('active'); // Cerrar el overlay al buscar
    } else {
      alert("Por favor, ingresa un tag válido.");
    }
  });

  // Añadir el overlay al contenedor principal
  navContainer.appendChild(overlay);

  return navContainer;
};
