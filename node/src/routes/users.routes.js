import { verifyToken } from "../auth.js";
import UsersModel from "../dataDB.js";
import express from "express";

const db = new UsersModel();
const usersGet = express.Router();


usersGet.get("/", verifyToken, async (_, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    console.error("Error in GET /:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default usersGet;
