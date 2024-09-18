import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_jwt";

// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Espera un token en el formato: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guarda la información del usuario en `req.user`
    next(); // Continua al siguiente middleware o ruta
  } catch (err) {
    res.status(403).json({ error: "Invalid token." });
  }
};

// Función para generar un token JWT
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
  };

  // Generar el token firmado
  return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_TIME }); // Token válido por 1 hora
};
