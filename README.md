






<body>
  <div>

    <!-- Logo -->
    <h1 id="logo" class="text-3xl font-bold text-center mb-6">Instacat</h1>

    <!-- Filtrar y Crear -->
    <div id="filter-create" class="flex items-center justify-between p-4 mb-6">
      <div class="flex items-center space-x-2">
        <button id="showCreate" class="btn">Crear</button>
        <button id="goHome" class="btn">Inicio</button>
      </div>
      <div class="flex items-center space-x-2">
        <input id="filterTag" type="text" placeholder="Ingresa un tag" class="input">
        <button id="filter" class="btn">Filtrar</button>
      </div>
    </div>

    <!-- Mostrar Links -->
    <div id="links" class="space-y-4">
      <!-- Los datos se llenan dinámicamente aquí -->
    </div>

    <!-- Crear Link (Oculto por defecto) -->
    <div id="createForm" class="hidden p-4 mb-6">
      <form id="createLinkForm" class="space-y-4">
        <div>
          <label class="block text-sm">Título</label>
          <input id="createTitle" type="text" class="input">
        </div>
        <div>
          <label class="block text-sm">Descripción</label>
          <input id="createDescription" type="text" class="input">
        </div>
        <div>
          <label class="block text-sm">URL</label>
          <input id="createUrl" type="text" class="input">
        </div>
        <div>
          <label class="block text-sm">Tags</label>
          <input id="createTags" type="text" class="input">
        </div>
        <button type="submit" class="btn">Crear</button>
      </form>
    </div>

    <!-- Detalles (Oculto por defecto) -->
    <div id="details" class="hidden p-4">
      <h2 id="detailsTitle" class="text-xl font-bold mb-2">Título</h2>
      <p id="detailsDescription" class="mb-2">Descripción</p>
      <p id="detailsTags" class="text-sm">Tags</p>
      <div class="mt-4 flex items-center space-x-4">
        <button id="vote" class="btn">Votar</button>
        <span id="votes">Votos: 0</span>
      </div>
      <!-- Comentarios -->
      <h3 class="text-lg font-bold mt-4">Comentarios</h3>
      <div id="comments" class="space-y-4"></div>
      <form id="addCommentForm" class="mt-4">
        <textarea id="commentContent" class="w-full border rounded" rows="3" placeholder="Escribe un comentario..."></textarea>
        <button type="submit" class="btn mt-2">Agregar comentario</button>
      </form>
    </div>

  </div>
    <script>
const apiUrl = 'http://localhost:5000';

// Mostrar formulario de creación y ocultar otros elementos
document.getElementById('showCreate').addEventListener('click', () => {
  document.getElementById('createForm').classList.remove('hidden');
  document.getElementById('links').classList.add('hidden');
  document.getElementById('details').classList.add('hidden');
});

// Volver al estado inicial (mostrar links y ocultar el formulario y detalles)
document.getElementById('goHome').addEventListener('click', () => {
  document.getElementById('createForm').classList.add('hidden');
  document.getElementById('links').classList.remove('hidden');
  document.getElementById('details').classList.add('hidden');
});

// Filtrar links
document.getElementById('filter').addEventListener('click', async () => {
  const tag = document.getElementById('filterTag').value;
  const response = await fetch(`${apiUrl}/links`);
  const links = await response.json();
  const filteredLinks = links.filter(link => link.tags.includes(tag));
  renderLinks(filteredLinks);
});

// Crear nuevo link
document.getElementById('createLinkForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const newLink = {
    title: document.getElementById('createTitle').value,
    description: document.getElementById('createDescription').value,
    url: document.getElementById('createUrl').value,
    tags: document.getElementById('createTags').value,
  };
  await fetch(`${apiUrl}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newLink),
  });
  alert('Link creado!');
  document.getElementById('createForm').classList.add('hidden');
  document.getElementById('links').classList.remove('hidden'); // Mostrar nuevamente los links
  getLinks(); // Actualizar la lista de links
});

// Renderizar links
function renderLinks(links) {
  const linksDiv = document.getElementById('links');
  linksDiv.innerHTML = '';
  links.forEach(link => {
    const linkElement = document.createElement('div');
    linkElement.classList.add('bg-white', 'p-4', 'rounded', 'shadow', 'flex', 'items-center', 'space-x-4');
    linkElement.innerHTML = `
      <img src="${link.url}" alt="" class="w-16 h-16 object-cover">
      <div>
        <h3 class="text-lg font-bold">${link.title}</h3>
        <p>${link.description}</p>
        <p class="text-sm text-gray-600">Tags: ${link.tags}</p>
        <button onclick="showDetails('${link._id}')" class="text-blue-500">Ver detalles</button>
      </div>
    `;
    linksDiv.appendChild(linkElement);
  });
}

// Mostrar detalles de un link
async function showDetails(id) {
  const response = await fetch(`${apiUrl}/links/${id}`);
  const link = await response.json();
  document.getElementById('detailsTitle').textContent = link.title;
  document.getElementById('detailsDescription').textContent = link.description;
  document.getElementById('detailsTags').textContent = `Tags: ${link.tags}`;
  document.getElementById('votes').textContent = `Votos: ${link.votes}`;
  document.getElementById('details').classList.remove('hidden');
  document.getElementById('links').classList.add('hidden'); // Ocultar links
  document.getElementById('createForm').classList.add('hidden'); // Ocultar formulario

  // Cargar comentarios para este link
  loadComments(id);

  // Asignar evento al formulario para agregar comentarios
  document.getElementById('addCommentForm').onsubmit = async (e) => {
    e.preventDefault();
    const content = document.getElementById('commentContent').value;
    if (content.trim() === '') {
      alert('El comentario no puede estar vacío.');
      return;
    }
    await addComment(id, content);
    document.getElementById('commentContent').value = ''; // Limpiar textarea
    loadComments(id); // Actualizar la lista de comentarios
  };

  // Asignar evento al botón de votar
  document.getElementById('vote').onclick = async () => {
    await voteLink(id);
    const updatedLink = await fetch(`${apiUrl}/links/${id}`).then(res => res.json());
    document.getElementById('votes').textContent = `Votos: ${updatedLink.votes}`;
  };
}

// Cargar comentarios
async function loadComments(linkId) {
  const response = await fetch(`${apiUrl}/comments/${linkId}`);
  const comments = await response.json();
  const commentsDiv = document.getElementById('comments');
  commentsDiv.innerHTML = ''; // Limpiar comentarios anteriores
  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.classList.add('bg-gray-100', 'p-2', 'rounded');
    commentElement.textContent = comment.content;
    commentsDiv.appendChild(commentElement);
  });
}

// Agregar un comentario
async function addComment(linkId, content) {
  await fetch(`${apiUrl}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linkId, content }),
  });
}

// Función para votar por un link
async function voteLink(linkId) {
  await fetch(`${apiUrl}/links/${linkId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vote: 1 }),
  });
}

// Obtener y mostrar todos los links al cargar la página
async function getLinks() {
  const response = await fetch(`${apiUrl}/links`);
  const links = await response.json();
  renderLinks(links); // Renderiza todos los links al inicio
}

// Cargar todos los links al cargar la página
document.addEventListener('DOMContentLoaded', getLinks);

  </script>
</body>
</html>

