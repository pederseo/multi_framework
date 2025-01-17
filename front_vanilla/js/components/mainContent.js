import { overlayDetails } from "./cardComment.js";
import { getAllLinks } from "../controllers/contrllers.js";

// Componente principal para renderizar las tarjetas
export const renderMain = async (navContainer, mainContainer, tag) => {
  // Obtener los datos de la API
  const apiData = await getAllLinks();

  mainContainer.innerHTML = '';

  // Si se recibe un tag, filtrar solo los que tienen ese tag
  let filteredData = apiData;
  if (tag) {
    filteredData = apiData.filter(db => {
      // Dividir los tags del link en un array y verificar si contiene el tag buscado
      const tagsArray = db.tags.split(',').map(t => t.trim());
      return tagsArray.includes(tag);
    });
  }

  // Verificar si hay datos para renderizar
  if (filteredData.length === 0) {
    mainContainer.innerHTML = '<p>No se encontraron datos.</p>';
    return mainContainer;
  }

  // Usar los datos obtenidos (o los filtrados) para generar las tarjetas
  filteredData.forEach(db => {
    // Crear la tarjeta del db
    const linkCards = document.createElement('div');
    linkCards.classList.add('link-card');

    // Contenido de la tarjeta
    linkCards.innerHTML = `
      <img src="${db.url}" alt="${db.title}" />
    `;

    // Agregar evento de clic a la tarjeta
    linkCards.addEventListener('click', () => {
      overlayDetails(db, mainContainer); // Llamar al overlayDetails con los detalles del elemento
    });

    // Añadir la tarjeta al elemento principal
    mainContainer.appendChild(linkCards);
  });

  return mainContainer;
};
