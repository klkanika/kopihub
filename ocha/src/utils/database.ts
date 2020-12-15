require("dotenv").config();
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DB_URI || "postgres://root:root@localhost:5432/ocha",
});

module.exports = {
  query: (text, value = []) => pool.query(text, value),
};
