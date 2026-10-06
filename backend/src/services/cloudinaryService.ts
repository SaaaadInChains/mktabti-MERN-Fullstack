import cloudinary from "../config/cloudinaryConfig.js";

type UploadResult = {
  secure_url: string;
  public_id: string;
  format?: string;
};

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = "avatars",
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Upload failed"));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        });
      },
    );
    stream.end(buffer);
  });
};
