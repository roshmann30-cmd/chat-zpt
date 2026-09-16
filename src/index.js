import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { BigZ } from "./core/BigZ.js";

dotenv.config();

const app = express();
const z = new BigZ();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    name: "Chat ZPT",
    system: "Big Z",
    version: "0.1.0",
    time: new Date().toISOString()
  });
});

app.get("/api/z/:userId", (req, res) => {
  res.json(z.getLittleZ(req.params.userId));
});

app.post("/api/z/:userId/message", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "message is required"
      });
    }

    const result = await z.receive(
      req.params.userId,
      message
    );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Z encountered an internal error."
    });
  }
});

app.post("/api/z/:userId/permission", (req, res) => {
  const { observation } = req.body;

  const result = z.setObservationPermission(
    req.params.userId,
    Boolean(observation)
  );

  res.json(result);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Z is awake on port ${PORT}`);
});
app.get("/api/memory/health", async (req, res) => {
  try {
    await z.initialize();

    res.json({
      ok: true,
      system: "Big Z Memory",
      database: "connected"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      system: "Big Z Memory",
      database: "error"
    });
  }
});
