const mongoose = require("mongoose");

const DB_URI = "mongodb://localhost:27017/multi_framework";

const connectDB = async () => {
    try {
      await mongoose.connect(DB_URI); // Sin opciones adicionales
      console.log("Conectado a MongoDB");
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error.message);
      process.exit(1);
    }
  };

module.exports = { connectDB };

