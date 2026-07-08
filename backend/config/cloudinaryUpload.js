import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (file, folder = "uploads") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: file.originalname.split(".")[0],
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer); // 🔥 IMPORTANT
  });
