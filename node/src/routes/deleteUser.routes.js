import { verifyID } from "../verifyData.js";
import { verifyToken } from "../auth.js";
import UsersModel from "../dataDB.js";
import express from "express";

const db = new UsersModel();
const userDelete = express.Router();

userDelete.delete("/user/:id", verifyToken, async (req, res) => {
  const userId = req.params.id;

  if (verifyID(userId)) {
    return res.status(500).json({ Error: "Invalid ID" });
  }

  try {
    const userId = req.params.id;
    const user = await db.deleteUser(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in DELETE /user/:id:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

export default userDelete;
