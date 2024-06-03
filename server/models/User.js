import mongoose from "mongoose";
import util from "util";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});
const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);
const createSalt = async () => {
  const buf = await randomBytesPromise(64);
  return buf.toString("base64");
};
userSchema.pre("save", async function () {
  const salt = await createSalt();
  this.password = (
    await pbkdf2Promise(this.password, salt, 104906, 64, "sha512")
  ).toString("base64");
});

const User = mongoose.model("User", userSchema);
export default User;
