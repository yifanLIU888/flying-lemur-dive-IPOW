/**
 * Cloudinary 图像处理工具
 * 使用 Unsigned Upload Preset 实现安全的前端上传
 */

interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

// 默认配置（请替换为你自己的 Cloudinary 配置）
const DEFAULT_CONFIG: CloudinaryConfig = {
  cloudName: "demo", // 替换为你的 Cloud Name
  uploadPreset: "ml_default" // 替换为你的 Unsigned Upload Preset
};

/**
 * 上传图片到 Cloudinary
 */
export const uploadToCloudinary = async (
  file: File,
  config: CloudinaryConfig = DEFAULT_CONFIG
): Promise<string> => {
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