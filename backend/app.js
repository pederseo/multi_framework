const express = require("express");
const cors = require('cors');

const {connectDB} = require("./config/db_config");

const commentRoutes = require("./routes/comments_router");
const linkRoutes = require("./routes/links_router");
const tagsRoutes = require("./routes/tags_routes")

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
    "http://127.0.0.1:5500", //front_vanilla y alphine
    "http://localhost:5173",// front_vue
    "http://localhost:8080", // front_svelte
    "http://localhost:4200", // front_angular
    "http://localhost:3000"
  ];
  
// Configurar CORS con múltiples orígenes
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/links", linkRoutes);
app.use("/comments", commentRoutes);
app.use("/tags", tagsRoutes);

const runApp = async () => {
    try {
        await connectDB();
        app.listen("5000", () => {
            console.log(`App running on localhost:5000`);
        });
    } catch (error) {
        console.error("Failed to start app: ", error.message);
        process.exit(1);
    }
};

runApp();