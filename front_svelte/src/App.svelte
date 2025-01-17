<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
  
	const apiUrl = 'http://localhost:5000';
  
	let links = [];
	let showCreateForm = false;
	let showDetails = false;
	let currentLink = null;
	let comments = [];
	let filterTag = '';
  
	onMount(async () => {
	  await getLinks();
	});
  
	async function getLinks() {
	  const response = await fetch(`${apiUrl}/links`);
	  links = await response.json();
	}
  
	async function filterLinks() {
	  const response = await fetch(`${apiUrl}/links`);
	  const allLinks = await response.json();
	  links = allLinks.filter(link => link.tags.includes(filterTag));
	}
  
	async function createLink(newLink) {
	  await fetch(`${apiUrl}/links`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(newLink),
	  });
	  showCreateForm = false;
	  await getLinks();
	}
  
	async function loadDetails(id) {
	  const response = await fetch(`${apiUrl}/links/${id}`);
	  currentLink = await response.json();
	  comments = await fetch(`${apiUrl}/comments/${id}`).then(res => res.json());
	  showDetails = true;
	}
  
	async function addComment(content) {
	  await fetch(`${apiUrl}/comments`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ linkId: currentLink._id, content }),
	  });
	  comments = await fetch(`${apiUrl}/comments/${currentLink._id}`).then(res => res.json());
	}
  
	async function voteLink() {
	  await fetch(`${apiUrl}/links/${currentLink._id}/vote`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ vote: 1 }),
	  });
	  currentLink = await fetch(`${apiUrl}/links/${currentLink._id}`).then(res => res.json());
	}
  </script>
  
  <style>
	body {
	  font-family: 'Arial', sans-serif;
	  background-color: #f9fafb;
	  color: #333;
	  margin: 0;
	  padding: 0;
	}
  
	#logo {
	  color: #4CAF50;
	  text-align: center;
	  margin-bottom: 1.5rem;
	}
  
	.btn {
	  background-color: #4CAF50;
	  color: white;
	  padding: 0.5rem 1rem;
	  border: none;
	  border-radius: 5px;
	  cursor: pointer;
	  transition: background-color 0.3s ease;
	}
  
	.btn:hover {
	  background-color: #45a049;
	}
  
	.input {
	  padding: 0.5rem;
	  border: 1px solid #ddd;
	  border-radius: 5px;
	  width: 200px;
	  margin-right: 1rem;
	}
  
	#filter-create {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding: 1rem;
	  background-color: #fff;
	  border-radius: 8px;
	  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	  margin-bottom: 1.5rem;
	}
  
	.space-x-2 {
	  gap: 10px;
	}
  
	#createForm, #details {
	  background-color: #fff;
	  padding: 1.5rem;
	  border-radius: 8px;
	  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	  margin-bottom: 1.5rem;
	}
  
	#createForm input, #createForm button {
	  width: 100%;
	  margin-bottom: 1rem;
	}
  
	#createForm input {
	  padding: 0.75rem;
	  border-radius: 5px;
	  border: 1px solid #ddd;
	}
  
	#createForm button {
	  padding: 0.75rem;
	  background-color: #4CAF50;
	  border: none;
	  color: white;
	  border-radius: 5px;
	  cursor: pointer;
	  transition: background-color 0.3s ease;
	}
  
	#createForm button:hover {
	  background-color: #45a049;
	}
  
	#links {
	  display: grid;
	  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	  gap: 1.5rem;
	  padding: 1.5rem;
	}
  
	#links .link-card {
	  background-color: #fff;
	  padding: 1.5rem;
	  border-radius: 8px;
	  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	  display: flex;
	  align-items: center;
	  gap: 1rem;
	}
  
	#links img {
	  width: 80px;
	  height: 80px;
	  object-fit: cover;
	  border-radius: 5px;
	}
  
	#comments {
	  margin-top: 1rem;
	}
  
	.comment {
	  background-color: #f1f1f1;
	  padding: 1rem;
	  border-radius: 8px;
	  margin-bottom: 1rem;
	}
  
	textarea {
	  width: 100%;
	  padding: 1rem;
	  border: 1px solid #ddd;
	  border-radius: 5px;
	  resize: none;
	}
  </style>
  
  <main>
	<h1 id="logo" class="text-3xl font-bold">Instacat</h1>
  
	<div id="filter-create">
	  <div class="flex items-center space-x-2">
		<button class="btn" on:click={() => showCreateForm = !showCreateForm}>Crear</button>
		<button class="btn" on:click={() => { showCreateForm = false; showDetails = false; }}>Inicio</button>
	  </div>
	  <div class="flex items-center space-x-2">
		<input type="text" bind:value={filterTag} placeholder="Ingresa un tag" class="input">
		<button class="btn" on:click={filterLinks}>Filtrar</button>
	  </div>
	</div>
  
	{#if showCreateForm}
	  <div id="createForm">
		<form on:submit|preventDefault={(e) => createLink({
		  title: e.target.title.value,
		  description: e.target.description.value,
		  url: e.target.url.value,
		  tags: e.target.tags.value
		})}>
		  <div><label>Título</label><input name="title" type="text" class="input"></div>
		  <div><label>Descripción</label><input name="description" type="text" class="input"></div>
		  <div><label>URL</label><input name="url" type="text" class="input"></div>
		  <div><label>Tags</label><input name="tags" type="text" class="input"></div>
		  <button type="submit" class="btn">Crear</button>
		</form>
	  </div>
	{/if}
  
	{#if showDetails && currentLink}
	  <div id="details">
		<h2>{currentLink.title}</h2>
		<p>{currentLink.description}</p>
		<p>Tags: {currentLink.tags}</p>
		<div class="mt-4">
		  <button class="btn" on:click={voteLink}>Votar</button>
		  <span>Votos: {currentLink.votes}</span>
		</div>
		<h3>Comentarios</h3>
		<div id="comments">
		  {#each comments as comment}
			<div class="comment">{comment.content}</div>
		  {/each}
		</div>
		<form on:submit|preventDefault={(e) => addComment(e.target.commentContent.value)}>
		  <textarea name="commentContent" rows="3" placeholder="Escribe un comentario..."></textarea>
		  <button type="submit" class="btn mt-2">Agregar comentario</button>
		</form>
	  </div>
	{/if}
  
	{#if !showCreateForm && !showDetails}
	  <div id="links">
		{#each links as link}
		  <div class="link-card">
			<img src={link.url} alt="">
			<div>
			  <h3>{link.title}</h3>
			  <p>{link.description}</p>
			  <p class="text-sm text-gray-600">Tags: {link.tags}</p>
			  <button class="text-blue-500" on:click={() => loadDetails(link._id)}>Ver detalles</button>
			</div>
		  </div>
		{/each}
	  </div>
	{/if}
  </main>
  