import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

const s3Client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3AvatarStorage = multerS3({
  s3: s3Client,
  bucket: "buddypals",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `avatars/${Date.now().toString()}`);
  },
});
const s3PostStorage = multerS3({
  s3: s3Client,
  bucket: "buddypals",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `posts/${Date.now().toString()}`);
  },
});

try {
  fs.readdirSync("uploads/avatars");
  fs.readdirSync("uploads/posts");
} catch (err) {
  console.error("upload 폴더가 없습니다. 폴더를 생성합니다.");
  fs.mkdirSync("uploads/avatars");
  fs.mkdirSync("uploads/posts");
}

// const s3AvatarStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/avatars");
//   },
//   filename: (req, file, cb) => {
//     cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
//   },
// });
// const s3PostStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/posts");
//   },
//   filename: (req, file, cb) => {
//     cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
//   },
// });
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadProfileImg = multer({
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  storage: s3AvatarStorage,
});

export const uploadPostImg = multer({
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  storage: s3PostStorage,
});
