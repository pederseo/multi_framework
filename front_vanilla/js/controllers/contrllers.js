
export const getAllTags = async () => {
    try {
      const response = await fetch('http://localhost:5000/tags');
      if (!response.ok) {
        throw new Error('Error al obtener los tags');
      }
      return await response.json(); // Asumiendo que los tags son un array
    } catch (error) {
      console.error('Error fetching tags:', error);
      return []; // Retornar un array vacío en caso de error
    }
  };
//_______________________________________________________________________________
export const getAllLinks = async () => {
    try {
      const response = await fetch('http://localhost:5000/links'); // URL de la API
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Convertir la respuesta a JSON
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return []; // Retornar un array vacío en caso de error
    }
  }
//_______________________________________________________________________________
export const createLink = async (title, url, description, tags) => {
  const response = await fetch('http://localhost:5000/links', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "title": title,
          "url": url,
          "description": description,
          "tags": tags
      })
  });
  const data = await response.json();
  console.log(data);
}

//_______________________________________________________________________________
export const createComment = async (id, comment) => {
  console.log(id,comment)
  try {
    const response = await fetch('http://localhost:5000/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        linkId: id,
        content: comment,
      }),
    });

    if (!response.ok) {
      // Manejo de errores HTTP
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Comentario creado:', data);
  } catch (error) {
    console.error('Error al crear el comentario:', error.message);
  }
};

//_______________________________________________________________________________
export const getCommentsById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/comments/${id}`); // URL de la API con el ID
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); // Convertir la respuesta a JSON
    return data; // Retornar los comentarios
  } catch (error) {
    console.error('Error fetching comments:', error);
    return []; // Retornar un array vacío en caso de error
  }
};


export const likeButton = async (id) => {
  const response = await fetch(`http://localhost:5000/links/${id}/vote`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "vote": 1
      })
  });
  const data = await response.json();
  console.log(data);
};