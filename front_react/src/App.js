import React, { useState, useEffect } from 'react';
import '../src/App.css';


const App = () => {
  const apiUrl = 'http://localhost:5000';

  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [newLink, setNewLink] = useState({
    title: '',
    description: '',
    url: '',
    tags: '',
  });
  const [filterTag, setFilterTag] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch links on component mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const response = await fetch(`${apiUrl}/links`);
    const data = await response.json();
    setLinks(data);
    setFilteredLinks(data);
  };

  const handleFilter = () => {
    const filtered = links.filter((link) => link.tags.includes(filterTag));
    setFilteredLinks(filtered);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(`${apiUrl}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLink),
    });
    alert('Link creado!');
    setShowCreateForm(false);
    fetchLinks();
  };

  const handleDetails = async (id) => {
    const response = await fetch(`${apiUrl}/links/${id}`);
    const link = await response.json();
    setSelectedLink(link);
    setShowDetails(true);

    // Fetch comments
    const commentsResponse = await fetch(`${apiUrl}/comments/${id}`);
    const commentsData = await commentsResponse.json();
    setComments(commentsData);
  };

  const handleVote = async (id) => {
    await fetch(`${apiUrl}/links/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote: 1 }),
    });
    const updatedLink = await fetch(`${apiUrl}/links/${id}`).then((res) => res.json());
    setSelectedLink(updatedLink);
    fetchLinks();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert('El comentario no puede estar vacío.');
      return;
    }
    await fetch(`${apiUrl}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId: selectedLink._id, content: newComment }),
    });
    setNewComment('');
    handleDetails(selectedLink._id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Instacat</h1>

      <div className="flex items-center justify-between p-4 mb-6">
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowCreateForm(true)} className="btn">
            Crear
          </button>
          <button
            onClick={() => {
              setShowCreateForm(false);
              setShowDetails(false);
            }}
            className="btn"
          >
            Inicio
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ingresa un tag"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="input"
          />
          <button onClick={handleFilter} className="btn">
            Filtrar
          </button>
        </div>
      </div>

      {!showCreateForm && !showDetails && (
        <div id="links" className="space-y-4">
          {filteredLinks.map((link) => (
            <div
              key={link._id}
              className="bg-white p-4 rounded shadow flex items-center space-x-4"
            >
              <img src={link.url} alt="" className="w-16 h-16 object-cover" />
              <div>
                <h3 className="text-lg font-bold">{link.title}</h3>
                <p>{link.description}</p>
                <p className="text-sm text-gray-600">Tags: {link.tags}</p>
                <button
                  onClick={() => handleDetails(link._id)}
                  className="btn"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreate} className="space-y-4 p-4 mb-6">
          <div>
            <label className="block text-sm">Título</label>
            <input
              type="text"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm">Descripción</label>
            <input
              type="text"
              value={newLink.description}
              onChange={(e) =>
                setNewLink({ ...newLink, description: e.target.value })
              }
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm">URL</label>
            <input
              type="text"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm">Tags</label>
            <input
              type="text"
              value={newLink.tags}
              onChange={(e) => setNewLink({ ...newLink, tags: e.target.value })}
              className="input"
            />
          </div>
          <button type="submit" className="btn">
            Crear
          </button>
        </form>
      )}

      {showDetails && selectedLink && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{selectedLink.title}</h2>
          <p className="mb-2">{selectedLink.description}</p>
          <p className="text-sm">Tags: {selectedLink.tags}</p>
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={() => handleVote(selectedLink._id)}
              className="btn"
            >
              Votar
            </button>
            <span>Votos: {selectedLink.votes}</span>
          </div>

          <h3 className="text-lg font-bold mt-4">Comentarios</h3>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                {comment.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border rounded"
              rows="3"
              placeholder="Escribe un comentario..."
            ></textarea>
            <button type="submit" className="btn mt-2">
              Agregar comentario
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
