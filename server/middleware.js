import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadProfileImg = multer({
  storage: avatarStorage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export const uploadPostImg = multer({
  storage: postStorage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
