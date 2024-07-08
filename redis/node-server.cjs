"use server";
const express = require("express");
const redis = require("redis");
const cors = require("cors");

require('dotenv').config()

const app = express();
const port = 5000;

const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await client.connect();
    console.log("Connected to local Redis");
  } catch (err) {
    console.error("Failed to connect to local Redis:", err);
  }
})();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hello from Redis Server");
});

app.get("/cache/:key", async (req, res) => {
  const { key } = req.params;
  try {
    const value = await client.get(key);
    res.json({ value });
  } catch (err) {
    res.status(500).send("Error fetching data from Redis");
  }
});

app.post("/cache", async (req, res) => {
  const { key, value, ttl } = req.body;
  try {
    await client.set(key, value, { EX: ttl });
    res.status(200).send("Data cached successfully");
  } catch (err) {
    res.status(500).send("Error setting data in Redis");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
