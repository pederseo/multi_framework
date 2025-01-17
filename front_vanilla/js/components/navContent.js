import { cardBuscar } from "./cardBuscar.js";
import { overlayUpload } from "./cardCrear.js"; // Importar el componente del overlay "Crear"

export const renderNav = (navContainer, mainContainer) => {
    let div = document.createElement('div');
    div.classList.add('nav-container');

    div.innerHTML = `
        <a href="#" class="logo">Instacat</a>
        <a href="#" class="nav-item">
            <i class="fa fa-home"></i> Inicio
        </a>
        <a href="#" class="nav-item buscar">
            <i class="fa fa-search"></i> Filtro
        </a>
        <a href="#" class="nav-item">
            <i class="fa fa-compass"></i> Explorar
        </a>
        <a href="#" class="nav-item">
            <i class="fa fa-film"></i> Reels
        </a>
        <a href="#" class="nav-item">
            <i class="fa fa-envelope"></i> Mensajes
        </a>
        <a href="#" class="nav-item">
            <i class="fa fa-bell"></i> Notificaciones
        </a>
        <a href="#" class="nav-item crear">
            <i class="fa fa-plus"></i> Crear
        </a>
    `;

    // Añadir el contenedor principal al contenedor padre
    navContainer.appendChild(div);

    // Crear el cardBuscar (overlay) y añadirlo al navContainer
    cardBuscar(navContainer, mainContainer);

    // Agregar funcionalidad para mostrar/ocultar el overlay de "Buscar"
    const buscarButton = div.querySelector('.nav-item.buscar');
    buscarButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenir navegación por defecto
        const overlayBuscar = navContainer.querySelector('.overlay-buscar');
        overlayBuscar.classList.toggle('active');
    });

    // Agregar funcionalidad para el botón "Crear"
    const crearButton = div.querySelector('.nav-item.crear');
    crearButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenir navegación por defecto
        // Crear y mostrar el overlay para "Crear"
        overlayUpload(mainContainer, navContainer);
    });

    return navContainer;
};
