import { verifyData } from "../verifyData.js";
import { verifyToken } from "../auth.js";
import UsersModel from "../dataDB.js";
import express from "express";

const db = new UsersModel();
const userPost = express.Router();

userPost.post("/", verifyToken, async (req, res) => {
  const { error, value } = verifyData(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message),
    });
  }

  try {
    const user = await db.addUser(value);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error in POST /:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

export default userPost;
