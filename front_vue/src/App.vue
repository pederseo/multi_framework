<template>
  <div class="max-w-4xl mx-auto py-6">
    <!-- Logo -->
    <h1 class="text-3xl font-bold text-center mb-6">Instacat</h1>

    <!-- Filtrar y Crear -->
    <div class="flex items-center justify-between bg-white p-4 rounded shadow mb-6">
      <div class="flex items-center space-x-2">
        <button @click="showCreate" class="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
        <button @click="goHome" class="bg-blue-500 text-white px-4 py-2 rounded">Inicio</button>
      </div>
      <div class="flex items-center space-x-2">
        <input v-model="filterTag" type="text" placeholder="Ingresa un tag" class="border p-2 rounded w-60">
        <button @click="filterLinks" class="bg-green-500 text-white px-4 py-2 rounded">Filtrar</button>
      </div>
    </div>

    <!-- Mostrar Links -->
    <div id="links" class="space-y-4" v-if="!showCreateForm && !showDetailsView">
      <div v-for="link in filteredLinks" :key="link._id" class="bg-white p-4 rounded shadow flex items-center space-x-4">
        <img :src="link.url" alt="" class="w-16 h-16 object-cover">
        <div>
          <h3 class="text-lg font-bold">{{ link.title }}</h3>
          <p>{{ link.description }}</p>
          <p class="text-sm text-gray-600">Tags: {{ link.tags }}</p>
          <button @click="showDetails(link._id)" class="bg-blue-500 text-white px-4 py-2 rounded">Ver detalles</button>
        </div>
      </div>
    </div>

    <!-- Crear Link (Oculto por defecto) -->
    <div v-if="showCreateForm" class="bg-white p-4 rounded shadow mb-6">
      <form @submit.prevent="createLink" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Título</label>
          <input v-model="newLink.title" type="text" class="border p-2 rounded w-full">
        </div>
        <div>
          <label class="block text-sm font-medium">Descripción</label>
          <input v-model="newLink.description" type="text" class="border p-2 rounded w-full">
        </div>
        <div>
          <label class="block text-sm font-medium">URL</label>
          <input v-model="newLink.url" type="text" class="border p-2 rounded w-full">
        </div>
        <div>
          <label class="block text-sm font-medium">Tags</label>
          <input v-model="newLink.tags" type="text" class="border p-2 rounded w-full">
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
      </form>
    </div>

    <!-- Detalles (Oculto por defecto) -->
    <div v-if="showDetailsView" class="bg-white p-4 rounded shadow mb-6">
      <h2 class="text-xl font-bold mb-2">{{ linkDetails.title }}</h2>
      <p class="mb-2">{{ linkDetails.description }}</p>
      <p class="text-sm text-gray-600">Tags: {{ linkDetails.tags }}</p>
      <div class="mt-4 flex items-center space-x-4">
        <button @click="voteLink(linkDetails._id)" class="bg-green-500 text-white px-4 py-2 rounded">Votar</button>
        <span>Votos: {{ linkDetails.votes }}</span>
      </div>
      <h3 class="text-lg font-bold mt-4">Comentarios</h3>
      <div v-for="comment in comments" :key="comment._id" class="bg-gray-100 p-2 rounded">{{ comment.content }}</div>
      <form @submit.prevent="addComment">
        <textarea v-model="commentContent" class="w-full p-2 border rounded" rows="3" placeholder="Escribe un comentario..."></textarea>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">Agregar comentario</button>
      </form>
      <button @click="goHome" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">Volver</button>
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
      this.showDetailsView = false; // Ocultar detalles al mostrar el formulario de creación
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
      this.showCreateForm = false; // Ocultar el formulario de creación al mostrar los detalles
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
