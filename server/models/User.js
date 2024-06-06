import mongoose from "mongoose";
import util from "util";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  profileImg: { String },
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  salt: { type: String },
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
  this.salt = salt;
  this.password = (
    await pbkdf2Promise(this.password, salt, 104906, 64, "sha512")
  ).toString("base64");
});

export const verifyPassword = async (password, userSalt, userPassword) => {
  const hashedPassword = (
    await pbkdf2Promise(password, userSalt, 104906, 64, "sha512")
  ).toString("base64");

  if (hashedPassword === userPassword) return true;
  return false;
};

const User = mongoose.model("User", userSchema);
export default User;
