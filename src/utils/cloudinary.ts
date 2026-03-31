/**
 * Cloudinary 图像处理工具
 * IMPORTANT: Users must provide their own Cloudinary credentials.
 * Credentials are stored only in browser's localStorage and never exposed in the build.
 *
 * Security Notes:
 * - NEVER store API credentials in client-side code or environment variables
 * - Users provide their own credentials via the UI
 * - Credentials are stored in localStorage (session-only, not sent to server)
 * - For production, consider implementing a backend proxy for better security
 *
 * Setup Instructions for Users:
 * 1. Create a Cloudinary account at https://cloudinary.com
 * 2. Get Cloud Name from Dashboard
 * 3. Create an Unsigned Upload Preset in Settings → Upload
 * 4. Enter credentials in the app's settings panel
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

/**
 * Get Cloudinary configuration from localStorage
 * Throws error if not configured
 */
export const getCloudinaryConfig = (): CloudinaryConfig => {
  const stored = localStorage.getItem('cloudinary_config');
  if (!stored) {
    throw new Error(
      'Cloudinary credentials not configured. Please enter your Cloudinary credentials in the settings panel.'
    );
  }
  try {
    const config = JSON.parse(stored) as CloudinaryConfig;
    if (!config.cloudName || !config.uploadPreset) {
      throw new Error('Incomplete Cloudinary configuration');
    }
    return config;
  } catch (error) {
    throw new Error('Invalid Cloudinary configuration. Please reconfigure.');
  }
};

/**
 * Save Cloudinary configuration to localStorage
 */
export const saveCloudinaryConfig = (config: CloudinaryConfig) => {
  if (!config.cloudName || !config.uploadPreset) {
    throw new Error('Both cloudName and uploadPreset are required');
  }
  localStorage.setItem('cloudinary_config', JSON.stringify(config));
};

/**
 * Clear Cloudinary configuration from localStorage
 */
export const clearCloudinaryConfig = () => {
  localStorage.removeItem('cloudinary_config');
};

/**
 * Check if Cloudinary configuration exists
 */
export const hasCloudinaryConfig = (): boolean => {
  const stored = localStorage.getItem('cloudinary_config');
  if (!stored) return false;
  try {
    const config = JSON.parse(stored);
    return !!config.cloudName && !!config.uploadPreset;
  } catch {
    return false;
  }
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