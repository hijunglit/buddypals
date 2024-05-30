import "./db.js";
import "./models/Post.js";
import app from "./server.js";

const PORT = process.env.PORT || 5050;

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
