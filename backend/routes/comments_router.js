const express = require("express");

const Comment = require("../models/comment_sch")

const router = express.Router();

//                      get comment
//______________________________________________________________
router.get("/:linkId", async (req, res) => {
  `ruta para obtener comentario de un link por su id`
    try {
        const comments = await Comment.find({ 
            linkId: req.params.linkId }).sort({
            createdAt: -1,
        });
        res.json(comments);
      } catch (error) {
        res.status(400).json({ error: error.message });
      } 
});

//                      create comment
//______________________________________________________________
router.post("/", async (req, res) => {
  `ruta para crear un comentario ingresando en el body el id y el comentario`
    try {
        const comment = await Comment.create({
          linkId: req.body.linkId,
          content: req.body.content,
        });
        res.status(201).json(comment);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
});

module.exports = router;