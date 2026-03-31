/**
 * Cloudinary 图像处理工具
 * IMPORTANT: Users must provide their own Cloudinary credentials via environment variables
 *
 * Security Notes:
 * - NEVER commit real API credentials to source control
 * - Use environment variables for all sensitive configuration
 * - For Vercel deployment, set environment variables in the dashboard
 *
 * Setup Instructions:
 * 1. Create a Cloudinary account at https://cloudinary.com
 * 2. Get your Cloud Name from Dashboard
 * 3. Create an Unsigned Upload Preset in Settings → Upload
 * 4. Set environment variables:
 *    - VITE_CLOUDINARY_CLOUD_NAME
 *    - VITE_CLOUDINARY_UPLOAD_PRESET
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

/**
 * Get Cloudinary configuration from environment variables
 * Throws error if not configured
 */
export const getCloudinaryConfig = (): CloudinaryConfig => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary credentials not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET environment variables. ' +
      'See src/utils/cloudinary.ts for setup instructions.'
    );
  }

  return {
    cloudName,
    uploadPreset
  };
};

/**
 * Upload image to Cloudinary
 * Uses unsigned upload with user-provided preset
 */
export const uploadToCloudinary = async (
  file: File,
  config: CloudinaryConfig
): Promise<string> => {
  // Client-side validation
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only images are allowed.');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit.');
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", config.uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Upload failed");
  }

  const data = await response.json();
  return data.secure_url;
};

/**
 * Generate Cloudinary transformation URL
 */
export const generateTransformedUrl = (
  publicId: string,
  transformations: string[],
  config: CloudinaryConfig
): string => {
  const transformString = transformations.join(",");
  return `https://res.cloudinary.com/${config.cloudName}/image/upload/${transformString}/${publicId}`;
};

/**
 * Extract public_id from Cloudinary URL
 */
export const extractPublicId = (url: string): string => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/);
  return match ? match[1] : url;
};

/**
 * Preset transformation configurations
 */
export const TRANSFORMATIONS = {
  highQuality: ["q_auto:best", "f_auto", "c_fill"],
  standard: ["q_auto:good", "f_auto", "c_fill"],
  thumbnail: (width: number, height: number) => [
    `w_${width}`,
    `h_${height}`,
    "c_fill",
    "q_auto",
    "f_auto",
  ],
  removeBackground: ["e_background_removal"],
  smartCrop: (width: number, height: number) => [
    `w_${width}`,
    `h_${height}`,
    "c_fill",
    "g_auto",
    "q_auto",
    "f_auto",
  ],
};