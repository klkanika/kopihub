require("dotenv").config();
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://ochaauth:ochaAuth1234@34.87.187.163/ochaAuth",
});

module.exports = {
  query: (text, value = []) => pool.query(text, value),
};
