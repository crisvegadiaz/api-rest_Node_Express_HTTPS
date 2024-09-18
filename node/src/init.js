import createToken from "./routes/createToken.routes.js";
import userDelete from "./routes/deleteUser.routes.js";
import usersPost from "./routes/createUser.routes.js";
import userPut from "./routes/updateUser.routes.js";
import errorRoutes from "./routes/error.routes.js";
import userIdGet from "./routes/userId.routes.js";
import usersGet from "./routes/users.routes.js";

import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json());

// Rutas Login Token 
app.use(createToken);

// Rutas protegidas (requieren autenticación)
app.use(usersGet);
app.use(userIdGet);
app.use(usersPost);
app.use(userPut);
app.use(userDelete);

// Middleware para manejar rutas no encontradas
app.use(errorRoutes);

// Cargar certificados SSL
const sslOptions = {
  key: readFileSync(join(__dirname, "key", "key.pem")), // Clave privada
  cert: readFileSync(join(__dirname, "key", "cert.pem")), // Certificado
};

// Crear servidor HTTPS
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:${port}`);
});
