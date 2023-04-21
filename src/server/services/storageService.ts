import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = async (image: string): Promise<string> => {
  const uploadResponse = await cloudinary.uploader.upload(image);
  return uploadResponse.public_id;
};

const deleteImage = async (id: string): Promise<void> => {
  await cloudinary.uploader.destroy(id);
};

export const storageService = { upload, deleteImage };
