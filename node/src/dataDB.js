import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

export default class UsersModel {
  async userByUsername(username) {
    try {
      const res = await pool.query("SELECT * FROM usertoken WHERE username = $1", [
        username,
      ]);
      return res.rows;
    } catch (error) {
      console.error("Error userByUsername:", error);
      return { Error: "Database connection error" };
    }
  }

  async getUsers() {
    try {
      const res = await pool.query("SELECT * FROM users");
      return res.rows;
    } catch (error) {
      console.error("Error getUsers:", error);
      return { Error: "Database connection error" };
    }
  }

  async getUser(id) {
    try {
      const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      return res.rows;
    } catch (error) {
      console.error("Error getUser:", error);
      return { Error: "Database connection error" };
    }
  }

  async addUser({ username, email, password_hash, last_login }) {
    if (await this.#valueExists("username", username))
      return { Error: `Duplicate username: ${username}` };

    if (await this.#valueExists("email", email))
      return { Error: `Duplicate email: ${email}` };

    try {
      const res = await pool.query(
        `INSERT INTO users (username, email, password_hash, last_login) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [username, email, password_hash, last_login || new Date()]
      );
      return { ok: `User added with ID: ${res.rows[0].id}` };
    } catch (error) {
      console.error("Error addUser:", error);
      return { Error: "Database connection error" };
    }
  }

  async modifyUser(id, { username, email, password_hash, last_login }) {
    if (!(await this.#existsUser(id)))
      return { Error: `User ID ${id} not found` };

    try {
      const fields = [];
      const values = [];
      let index = 1;

      if (username) {
        fields.push(`username = $${index++}`);
        values.push(username);
      }
      if (email) {
        fields.push(`email = $${index++}`);
        values.push(email);
      }
      if (password_hash) {
        fields.push(`password_hash = $${index++}`);
        values.push(password_hash);
      }
      if (last_login) {
        fields.push(`last_login = $${index++}`);
        values.push(last_login);
      }

      if (fields.length === 0) {
        return { Error: "No valid fields to update" };
      }

      values.push(id);
      await pool.query(
        `UPDATE users SET ${fields.join(", ")} WHERE id = $${index}`,
        values
      );

      return { ok: `User with ID ${id} has been updated` };
    } catch (error) {
      console.error("Error modifyUser:", error);
      return { Error: "Database connection error" };
    }
  }

  async deleteUser(id) {
    if (!(await this.#existsUser(id)))
      return { Error: `User ID ${id} not found` };

    try {
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      return { ok: `User with ID ${id} has been deleted` };
    } catch (error) {
      console.error("Error deleteUser:", error);
      return { Error: "Database connection error" };
    }
  }

  async #existsUser(id) {
    try {
      const { rows } = await pool.query(
        `SELECT EXISTS (SELECT 1 FROM users WHERE id = $1) AS user_exists`,
        [id]
      );
      return rows[0].user_exists;
    } catch (error) {
      console.error("Error existsUser:", error);
      return false;
    }
  }

  async #valueExists(field, value) {
    const query = `SELECT EXISTS (SELECT 1 FROM users WHERE ${field} = $1) AS exists`;
    try {
      const { rows } = await pool.query(query, [value]);
      return rows[0].exists;
    } catch (error) {
      console.error(`Error checking ${field}:`, error);
      return false;
    }
  }
}
