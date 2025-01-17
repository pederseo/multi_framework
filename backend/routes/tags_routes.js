const express = require("express");
const Link = require("../models/link_sch");
const router = express.Router();

//                      get all tags
//__________________________________________________________________
router.get("/", async (req, res) => {
    try {
      // Obtener todos los links de la base de datos
      const links = await Link.find().sort({ createdAt: -1 });
  
      // Extraer y procesar los tags
      let allTags = [];
      links.forEach(link => {
        if (link.tags) {
          // Divide los tags por coma y los agrega al array allTags
          allTags.push(...link.tags.split(',').map(tag => tag.trim()));
        }
      });
  
      // Eliminar duplicados utilizando Set
      const uniqueTags = [...new Set(allTags)];
  
      // Retornar los tags únicos
      res.json(uniqueTags);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  module.exports = router;