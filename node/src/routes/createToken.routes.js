import { generateToken } from "../auth.js";
import UsersModel from "../dataDB.js";
import express from "express";
import bcrypt from "bcryptjs";

const db = new UsersModel();
const createToken = express.Router();

createToken.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [user] = await db.userByUsername(username);

    if (!user)
      return res.status(401).json({ error: "Invalid username or password." });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(401).json({ error: "Invalid username or password." });

    const token = generateToken(user);

    res.json({ token: "Bearer " + token });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default createToken;
