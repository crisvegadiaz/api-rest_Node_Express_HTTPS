import { verifyData } from "../verifyData.js";
import { verifyID } from "../verifyData.js";
import { verifyToken } from "../auth.js";
import UsersModel from "../dataDB.js";
import express from "express";

const db = new UsersModel();
const userPut = express.Router();

userPut.put("/user/:id", verifyToken, async (req, res) => {
  const userId = req.params.id;

  if (verifyID(userId)) {
    res.status(400).json({ Error: "Invalid ID" });
  }

  const { error, value } = verifyData(req.body, true);

  if (error) {
    return res.status(400).json({
      error: error.details.map((detail) => detail.message),
    });
  }

  try {
    const user = await db.modifyUser(userId, value);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in PUT /user/:id:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

export default userPut;
