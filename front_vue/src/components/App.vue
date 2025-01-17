<template>
    <div id="app" class="max-w-4xl mx-auto py-6">
      <!-- Cabecera -->
      <h1 class="text-3xl font-bold text-center mb-6">Instacat</h1>
  
      <!-- Controles de filtro y creación -->
      <div class="flex items-center justify-between bg-white p-4 rounded shadow mb-6">
        <div class="flex items-center space-x-2">
          <button @click="showCreate" class="bg-blue-500 text-white px-4 py-2 rounded">Crear Nuevo</button>
          <button @click="goHome" class="bg-blue-500 text-white px-4 py-2 rounded">Volver al Inicio</button>
        </div>
        <div class="flex items-center space-x-2">
          <input v-model="filterTag" type="text" placeholder="Buscar por tag" class="border p-2 rounded w-60">
          <button @click="filterLinks" class="bg-green-500 text-white px-4 py-2 rounded">Aplicar Filtro</button>
        </div>
      </div>
  
      <!-- Listado de Links -->
      <div id="links" class="space-y-4" v-if="!showCreateForm">
        <div v-for="link in filteredLinks" :key="link._id" class="bg-white p-4 rounded shadow flex items-center space-x-4">
          <img :src="link.url" alt="" class="w-16 h-16 object-cover">
          <div>
            <h3 class="text-lg font-bold">{{ link.title }}</h3>
            <p>{{ link.description }}</p>
            <p class="text-sm text-gray-600">Etiquetas: {{ link.tags }}</p>
            <button @click="showDetails(link._id)" class="text-blue-500">Ver más</button>
          </div>
        </div>
      </div>
  
      <!-- Formulario de Creación de Link (Visible cuando se activa) -->
      <div v-if="showCreateForm" class="bg-white p-4 rounded shadow mb-6">
        <form @submit.prevent="createLink" class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Título</label>
            <input v-model="newLink.title" type="text" class="border p-2 rounded w-full" placeholder="Ingresa el título del link">
          </div>
          <div>
            <label class="block text-sm font-medium">Descripción</label>
            <input v-model="newLink.description" type="text" class="border p-2 rounded w-full" placeholder="Ingresa la descripción del link">
          </div>
          <div>
            <label class="block text-sm font-medium">URL</label>
            <input v-model="newLink.url" type="text" class="border p-2 rounded w-full" placeholder="Ingresa la URL del link">
          </div>
          <div>
            <label class="block text-sm font-medium">Etiquetas</label>
            <input v-model="newLink.tags" type="text" class="border p-2 rounded w-full" placeholder="Ingresa las etiquetas">
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Crear Link</button>
        </form>
      </div>
  
      <!-- Detalles del Link (Visible cuando se activa) -->
      <div v-if="showDetailsView" class="hidden bg-white p-4 rounded shadow">
        <h2 class="text-xl font-bold mb-2">{{ linkDetails.title }}</h2>
        <p class="mb-2">{{ linkDetails.description }}</p>
        <p class="text-sm text-gray-600">Etiquetas: {{ linkDetails.tags }}</p>
        <div class="mt-4 flex items-center space-x-4">
          <button @click="voteLink(linkDetails._id)" class="bg-green-500 text-white px-4 py-2 rounded">Votar</button>
          <span>Votos: {{ linkDetails.votes }}</span>
        </div>
        <h3 class="text-lg font-bold mt-4">Comentarios</h3>
        <div v-for="comment in comments" :key="comment._id" class="bg-gray-100 p-2 rounded">{{ comment.content }}</div>
        <form @submit.prevent="addComment">
          <textarea v-model="commentContent" class="w-full p-2 border rounded" rows="3" placeholder="Escribe un comentario..."></textarea>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">Agregar Comentario</button>
        </form>
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        apiUrl: 'http://localhost:5000',
        showCreateForm: false,
        filterTag: '',
        newLink: {
          title: '',
          description: '',
          url: '',
          tags: ''
        },
        links: [],
        filteredLinks: [],
        showDetailsView: false,
        linkDetails: {},
        comments: [],
        commentContent: ''
      };
    },
    methods: {
      async getLinks() {
        const response = await fetch(`${this.apiUrl}/links`);
        this.links = await response.json();
        this.filteredLinks = this.links;
      },
      async filterLinks() {
        const response = await fetch(`${this.apiUrl}/links`);
        const links = await response.json();
        this.filteredLinks = links.filter(link => link.tags.includes(this.filterTag));
      },
      showCreate() {
        this.showCreateForm = true;
      },
      goHome() {
        this.showCreateForm = false;
        this.showDetailsView = false;
      },
      async createLink() {
        await fetch(`${this.apiUrl}/links`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newLink),
        });
        this.newLink = { title: '', description: '', url: '', tags: '' };
        this.showCreateForm = false;
        this.getLinks();
      },
      async showDetails(id) {
        const response = await fetch(`${this.apiUrl}/links/${id}`);
        this.linkDetails = await response.json();
        this.showDetailsView = true;
        this.loadComments(id);
      },
      async loadComments(linkId) {
        const response = await fetch(`${this.apiUrl}/comments/${linkId}`);
        this.comments = await response.json();
      },
      async addComment() {
        if (!this.commentContent.trim()) return;
        await fetch(`${this.apiUrl}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ linkId: this.linkDetails._id, content: this.commentContent }),
        });
        this.commentContent = '';
        this.loadComments(this.linkDetails._id);
      },
      async voteLink(linkId) {
        await fetch(`${this.apiUrl}/links/${linkId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vote: 1 }),
        });
        const updatedLink = await fetch(`${this.apiUrl}/links/${linkId}`).then(res => res.json());
        this.linkDetails.votes = updatedLink.votes;
      }
    },
    mounted() {
      this.getLinks();
    }
  };
  </script>
  