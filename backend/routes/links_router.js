const express = require("express");
const Link = require("../models/link_sch");
const router = express.Router();

//                      get all links
//__________________________________________________________________
router.get("/", async (req, res) => {
  `ruta para obtener todos los links`
    try {
        const links = await Link.find().sort({ createdAt: -1 });
        res.json(links);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//                      get one link
//__________________________________________________________________
router.get("/:id", async (req, res) => {
  `ruta para obtener un link por su id`
    try {
        const link = await Link.findById(req.params.id);
        if (!link) {
          return res.status(404).json({ error: "Link not found" });
        }
        res.json(link);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

//                      create link
//__________________________________________________________________
router.post("/", async (req, res) =>{
  `ruta para crear un nuevo link`
    try {
        const link = await Link.create(req.body);
        res.status(201).json(link);

      } catch (error) {
        res.status(400).json({ error: error.message });
      }
});

//                      update link
//__________________________________________________________________
router.put("/:id", async (req, res) => {
  `ruta para seleccionar un link por su id y actualizar sus datos`
    try {
        const link = await Link.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
        if (!link) {
          return res.status(404).json({ error: "Link not found" });
        }
        res.json(link);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
});

//                      delete link
//__________________________________________________________________
router.delete("/:id", async (req, res) => {
  `ruta para eliminar un link por su id`
    try {
        const link = await Link.findByIdAndDelete(req.params.id);
        if (!link) {
          return res.status(404).json({ error: "Link not found" });
        }
        res.json({ message: "Link deleted successfully" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
});

//                      vote link
//__________________________________________________________________
router.post("/:id/vote", async (req, res) => {
  `ruta para votar un link por su id`
    try {
        const { vote } = req.body;
        const link = await Link.findByIdAndUpdate(
          req.params.id,
          { $inc: { votes: vote } },
          { new: true }
        );
        if (!link) {
          return res.status(404).json({ error: "Link not found" });
        }
        res.json(link);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
});

module.exports = router;