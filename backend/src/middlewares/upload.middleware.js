import multer from "multer";
import cloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = cloudinaryStorage({
  cloudinary,
  folder: "encore-web",
  allowedFormats: ["jpg", "jpeg", "png", "webp"],
  transformation: [{ width: 800, height: 800, crop: "limit" }],
});

const upload = multer({ storage });

export default upload;
