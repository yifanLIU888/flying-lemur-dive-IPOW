/**
 * Cloudinary 图像处理工具
 * 使用 Unsigned Upload Preset 实现安全的前端上传
 *
 * SECURITY NOTE:
 * - This is a CLIENT-SIDE ONLY configuration
 * - Users provide their own Cloudinary credentials
 * - No API keys are stored in the codebase
 * - For production, users should create their own Cloudinary account
 *
 * If you need to use a backend service:
 * 1. Create a server endpoint that handles uploads
 * 2. Store Cloudinary credentials in server environment variables
 * 3. Never expose API keys in client-side code
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

// 默认配置（示例用途 only）
// 生产环境：用户应提供自己的 Cloudinary 配置
const DEFAULT_CONFIG: CloudinaryConfig = {
  cloudName: "demo", // 替换为你的 Cloud Name
  uploadPreset: "ml_default" // 替换为你的 Unsigned Upload Preset
};

/**
 * 上传图片到 Cloudinary
 * IMPORTANT: In production, this should be done through a backend proxy
 * to protect against abuse and to implement proper rate limiting
 */
export const uploadToCloudinary = async (
  file: File,
  config: CloudinaryConfig = DEFAULT_CONFIG
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
 * 生成 Cloudinary 转换 URL
 * 支持多种图像处理操作
 */
export const generateTransformedUrl = (
  publicId: string,
  transformations: string[],
  config: CloudinaryConfig = DEFAULT_CONFIG
): string => {
  const transformString = transformations.join(",");
  return `https://res.cloudinary.com/${config.cloudName}/image/upload/${transformString}/${publicId}`;
};

/**
 * 提取 Cloudinary URL 中的 public_id
 */
export const extractPublicId = (url: string): string => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/);
  return match ? match[1] : url;
};

/**
 * 预设转换配置
 */
export const TRANSFORMATIONS = {
  // 高质量优化
  highQuality: ["q_auto:best", "f_auto", "c_fill"],
  // 标准优化
  standard: ["q_auto:good", "f_auto", "c_fill"],
  // 缩略图
  thumbnail: (width: number, height: number) => [
    `w_${width}`,
    `h_${height}`,
    "c_fill",
    "q_auto",
    "f_auto",
  ],
  // 背景移除（需要 Cloudinary AI 插件）
  removeBackground: ["e_background_removal"],
  // 智能裁剪
  smartCrop: (width: number, height: number) => [
    `w_${width}`,
    `h_${height}`,
    "c_fill",
    "g_auto",
    "q_auto",
    "f_auto",
  ],
};