import "./db.js";
import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
