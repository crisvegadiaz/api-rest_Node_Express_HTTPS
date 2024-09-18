import { verifyID } from "../verifyData.js";
import { verifyToken } from "../auth.js";
import UsersModel from "../dataDB.js";
import express from "express";

const db = new UsersModel();
const userGet = express.Router();

userGet.get("/user/:id", verifyToken, async (req, res) => {
  const userId = req.params.id;

  if (verifyID(userId)) {
    return res.status(500).json({ Error: "Invalid ID" });
  }

  try {
    const [user] = await db.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error("Error in GET /user/:id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default userGet;
