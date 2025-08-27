// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ✅ Allow multiple frontend origins
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://portfolioaayushh.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());

// PostgreSQL setup
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// Contact form route
app.post("/submit-contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    await pool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    res.json({ success: true, message: "Message submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${port}`);
});
