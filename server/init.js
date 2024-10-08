import "dotenv/config";
import "./db.js";
import "./models/Post.js";
import "./models/User.js";
import "./models/Comment.js";
import app from "./server.js";

const PORT = process.env.PORT || 3000;

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
