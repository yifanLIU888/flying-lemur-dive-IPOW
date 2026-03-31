"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "zh" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("preferred-language");
    return (saved as Language) || "zh";
  });

  useEffect(() => {
    localStorage.setItem("preferred-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.features": { zh: "功能", en: "Features" },
  "nav.howItWorks": { zh: "使用方法", en: "How It Works" },
  "nav.pricing": { zh: "价格", en: "Pricing" },
  "nav.getStarted": { zh: "免费开始", en: "Get Started Free" },

  // Hero Section
  "hero.badge": { zh: "✨ 由先进 AI 驱动", en: "✨ Powered by Advanced AI" },
  "hero.title1": { zh: "用 AI 魔法", en: "Transform Your Photos with" },
  "hero.title2": { zh: "改变你的照片", en: "AI Magic" },
  "hero.description": { zh: "释放您图片的全部潜力，使用我们尖端的 AI 技术。提升质量、移除背景、修复旧照片，只需几秒钟。", en: "Unlock the full potential of your images with our cutting-edge AI technology. Enhance quality, remove backgrounds, and restore old photos in seconds." },
  "hero.startNow": { zh: "开始增强", en: "Start Enhancing Now" },
  "hero.watchDemo": { zh: "观看演示", en: "Watch Demo" },

  // Features Section
  "features.title": { zh: "强大的 AI 功能", en: "Powerful AI Features" },
  "features.subtitle": { zh: "让您的照片看起来专业所需的一切", en: "Everything you need to make your photos look professional" },
  "feature.smartEnhancement.title": { zh: "智能增强", en: "Smart Enhancement" },
  "feature.smartEnhancement.desc": { zh: "AI 自动调整光线、颜色和锐度，获得专业效果", en: "AI automatically adjusts lighting, color, and sharpness for professional results" },
  "feature.backgroundRemover.title": { zh: "背景移除", en: "Background Remover" },
  "feature.backgroundRemover.desc": { zh: "以像素级精度即时移除背景", en: "Instantly remove backgrounds with pixel-perfect accuracy" },
  "feature.photoRestorer.title": { zh: "照片修复", en: "Photo Restorer" },
  "feature.photoRestorer.desc": { zh: "恢复旧照片、损坏照片的昔日光彩", en: "Restore old, damaged photos to their former glory" },
  "feature.upscale.title": { zh: "放大与扩展", en: "Upscale & Enlarge" },
  "feature.upscale.desc": { zh: "在不损失质量的情况下提高图像分辨率", en: "Increase image resolution without losing quality" },
  "feature.colorCorrection.title": { zh: "色彩校正", en: "Color Correction" },
  "feature.colorCorrection.desc": { zh: "自动修复白平衡和色彩问题", en: "Fix white balance and color issues automatically" },
  "feature.noiseReduction.title": { zh: "降噪", en: "Noise Reduction" },
  "feature.noiseReduction.desc": { zh: "去除颗粒和噪点，获得干净、专业的图像", en: "Remove grain and noise for clean, professional images" },

  // Testimonials Section
  "testimonials.title": { zh: "用户评价", en: "What Our Users Say" },
  "testimonials.subtitle": { zh: "来自满意客户的真实反馈", en: "Real feedback from satisfied customers" },
  "testimonial.sarah.name": { zh: "莎拉·约翰逊", en: "Sarah Johnson" },
  "testimonial.sarah.role": { zh: "摄影师", en: "Photographer" },
  "testimonial.sarah.quote": { zh: "IPOW 将我的作品集照片从优秀提升到惊艳。AI 增强功能令人难以置信！", en: "IPOW transformed my portfolio photos from good to stunning. The AI enhancements are incredible!" },
  "testimonial.michael.name": { zh: "迈克尔·陈", en: "Michael Chen" },
  "testimonial.michael.role": { zh: "电商经理", en: "E-commerce Manager" },
  "testimonial.michael.quote": { zh: "背景移除功能为我节省了数小时的编辑时间。强烈推荐！", en: "The background removal feature saved me hours of editing time. Highly recommended!" },
  "testimonial.emily.name": { zh: "艾米丽·戴维斯", en: "Emily Davis" },
  "testimonial.emily.role": { zh: "社交媒体经理", en: "Social Media Manager" },
  "testimonial.emily.quote": { zh: "我喜欢放大 Instagram 照片有多简单。质量太棒了！", en: "I love how easy it is to upscale my Instagram photos. The quality is amazing!" },

  // How It Works Section
  "howItWorks.title": { zh: "使用方法", en: "How It Works" },
  "howItWorks.subtitle": { zh: "三个简单步骤改变您的照片", en: "Three simple steps to transform your photos" },
  "step.upload.title": { zh: "上传", en: "Upload" },
  "step.upload.desc": { zh: "选择或拖放您的图片", en: "Select or drag & drop your image" },
  "step.process.title": { zh: "处理", en: "Process" },
  "step.process.desc": { zh: "AI 自动分析和增强", en: "AI analyzes and enhances automatically" },
  "step.download.title": { zh: "下载", en: "Download" },
  "step.download.desc": { zh: "立即获取增强后的图像", en: "Get your enhanced image instantly" },

  // Before/After Section
  "beforeAfter.title": { zh: "看看区别", en: "See the Difference" },
  "beforeAfter.subtitle": { zh: "来自真实用户的真实效果", en: "Real results from real users" },
  "beforeAfter.before": { zh: "原始图片", en: "Original Image" },
  "beforeAfter.after": { zh: "增强结果", en: "Enhanced Result" },

  // Pricing Section
  "pricing.title": { zh: "简单透明的价格", en: "Simple, Transparent Pricing" },
  "pricing.subtitle": { zh: "选择适合您的计划", en: "Choose the plan that fits your needs" },
  "plan.free.name": { zh: "免费", en: "Free" },
  "plan.free.period": { zh: "永久", en: "forever" },
  "plan.free.feature1": { zh: "每月 10 张图片", en: "10 images per month" },
  "plan.free.feature2": { zh: "基础增强", en: "Basic enhancements" },
  "plan.free.feature3": { zh: "标准质量", en: "Standard quality" },
  "plan.free.feature4": { zh: "邮件支持", en: "Email support" },
  "plan.pro.name": { zh: "专业版", en: "Pro" },
  "plan.pro.period": { zh: "/月", en: "/month" },
  "plan.pro.feature1": { zh: "无限图片", en: "Unlimited images" },
  "plan.pro.feature2": { zh: "所有 AI 功能", en: "All AI features" },
  "plan.pro.feature3": { zh: "高清质量输出", en: "HD quality output" },
  "plan.pro.feature4": { zh: "优先支持", en: "Priority support" },
  "plan.pro.feature5": { zh: "API 访问", en: "API access" },
  "plan.enterprise.name": { zh: "企业版", en: "Enterprise" },
  "plan.enterprise.period": { zh: "", en: "" },
  "plan.enterprise.feature1": { zh: "专业版所有内容", en: "Everything in Pro" },
  "plan.enterprise.feature2": { zh: "自定义 AI 模型", en: "Custom AI models" },
  "plan.enterprise.feature3": { zh: "SLA 保证", en: "SLA guarantee" },
  "plan.enterprise.feature4": { zh: "专属支持", en: "Dedicated support" },
  "plan.enterprise.feature5": { zh: "本地部署选项", en: "On-premise option" },
  "pricing.getStarted": { zh: "开始使用", en: "Get Started" },

  // CTA Section  "cta.title": { zh: "准备好改变您的照片了吗？", en: "Ready to Transform Your Photos?" },
  "cta.description": { zh: "加入 100,000+ 用户，他们已经用我们的 AI 增强了数百万张照片", en: "Join 100,000+ users who have already enhanced millions of photos with our AI" },
  "cta.freeTrial": { zh: "开始免费试用", en: "Start Free Trial" },
  "cta.scheduleDemo": { zh: "预约演示", en: "Schedule Demo" },

  // Newsletter Section
  "newsletter.title": { zh: "订阅我们的新闻通讯", en: "Subscribe to our newsletter" },
  "newsletter.description": { zh: "获取最新更新、功能和特别优惠", en: "Get the latest updates, features, and special offers" },
  "newsletter.placeholder": { zh: "您的邮箱地址", en: "Your email address" },
  "newsletter.subscribe": { zh: "订阅", en: "Subscribe" },
  "newsletter.subscribing": { zh: "订阅中...", en: "Subscribing..." },
  "newsletter.privacy": { zh: "我们尊重您的隐私。随时可以取消订阅。", en: "We respect your privacy. Unsubscribe anytime." },

  // Footer
  "footer.description": { zh: "AI 驱动的图像增强，简单易用。几秒钟内改变您的照片。", en: "AI-powered image enhancement made simple. Transform your photos in seconds." },
  "footer.product": { zh: "产品", en: "Product" },
  "footer.company": { zh: "公司", en: "Company" },
  "footer.legal": { zh: "法律", en: "Legal" },
  "footer.features": { zh: "功能", en: "Features" },
  "footer.pricing": { zh: "价格", en: "Pricing" },
  "footer.api": { zh: "API", en: "API" },
  "footer.integrations": { zh: "集成", en: "Integrations" },
  "footer.about": { zh: "关于", en: "About" },
  "footer.blog": { zh: "博客", en: "Blog" },
  "footer.careers": { zh: "招聘", en: "Careers" },
  "footer.contact": { zh: "联系我们", en: "Contact" },
  "footer.privacy": { zh: "隐私", en: "Privacy" },
  "footer.terms": { zh: "条款", en: "Terms" },
  "footer.cookies": { zh: "Cookie", en: "Cookies" },
  "footer.gdpr": { zh: "GDPR", en: "GDPR" },
  "footer.rights": { zh: "版权所有", en: "All rights reserved" },
  "footer.madeWith": { zh: "用", en: "Made with" },
  "footer.by": { zh: "由 Yifan 制作", en: "by Yifan" },

  // Toast messages  "toast.subscribeSuccess": { zh: "感谢订阅！", en: "Thank you for subscribing!" },
  "toast.subscribeError": { zh: "订阅失败，请重试。", en: "Failed to subscribe. Please try again." },
  "toast.emailRequired": { zh: "请输入邮箱地址", en: "Please enter an email address" },
  "toast.emailInvalid": { zh: "请输入有效的邮箱地址", en: "Please enter a valid email address" },
  "toast.rateLimit": { zh: "提交次数过多，请稍后再试。", en: "Too many submissions. Please try again later." },
  "toast.invalidFileType": { zh: "请上传图片文件", en: "Please upload an image file" },
  "toast.fileTooLarge": { zh: "文件大小必须小于 10MB", en: "File size must be less than 10MB" },
  "toast.processingComplete": { zh: "处理完成！", en: "Processing complete!" },
  "toast.downloadStarted": { zh: "下载已开始！", en: "Download started!" },

  // Enhancer Page
  "enhancer.title": { zh: "AI 图像增强工具", en: "AI Image Enhancer" },
  "enhancer.multiview": { zh: "人物多角度生成", en: "Multi-View Generation" },
  "enhancer.tryon": { zh: "虚拟试穿", en: "Virtual Try-On" },
  "enhancer.crossplatform": { zh: "跨平台内容生成", en: "Cross-Platform Content" },
  "enhancer.uploadPerson": { zh: "上传人物照片", en: "Upload Person Photo" },
  "enhancer.uploadGarment": { zh: "上传服装照片", en: "Upload Garment Photo" },
  "enhancer.uploadProduct": { zh: "上传产品照片", en: "Upload Product Photo" },
  "enhancer.processing": { zh: "处理中...", en: "Processing..." },
  "enhancer.generating3d": { zh: "生成3D模型...", en: "Generating 3D Model..." },
  "enhancer.processingTryon": { zh: "处理虚拟试穿...", en: "Processing Virtual Try-On..." },
  "enhancer.generatingContent": { zh: "生成平台内容...", en: "Generating Platform Content..." },
  "enhancer.results": { zh: "结果", en: "Results" },
  "enhancer.frontView": { zh: "正面视图", en: "Front View" },
  "enhancer.backView": { zh: "背面视图", en: "Back View" },
  "enhancer.leftView": { zh: "左侧视图", en: "Left View" },
  "enhancer.rightView": { zh: "右侧视图", en: "Right View" },
  "enhancer.download": { zh: "下载", en: "Download" },
  "enhancer.copyText": { zh: "复制文本", en: "Copy Text" },
  "enhancer.uploadNew": { zh: "上传新图片", en: "Upload New Image" },
  "enhancer.startOver": { zh: "重新开始", en: "Start Over" },
  "enhancer.processingOptions": { zh: "处理选项", en: "Processing Options" },
  "enhancer.enhanceDetails": { zh: "增强细节", en: "Enhance Details" },
  "enhancer.smoothEdges": { zh: "平滑边缘", en: "Smooth Edges" },
  "enhancer.preserveColors": { zh: "保持原始颜色", en: "Preserve Original Colors" },
  "enhancer.outputQuality": { zh: "输出质量", en: "Output Quality" },
  "enhancer.standard": { zh: "标准", en: "Standard" },
  "enhancer.hd": { zh: "高清", en: "HD" },
  "enhancer.ultra": { zh: "超高清", en: "Ultra" },
  "enhancer.selectPlatform": { zh: "选择平台", en: "Select Platform" },
  "enhancer.marketingCopy": { zh: "营销文案", en: "Marketing Copy" },
  "enhancer.recommendedImage": { zh: "推荐图片", en: "Recommended Image" },
  "enhancer.garmentPhoto": { zh: "服装照片", en: "Garment Photo" },
  "enhancer.personPhoto": { zh: "人物照片", en: "Person Photo" },
  "enhancer.productPhoto": { zh: "产品照片", en: "Product Photo" },
  "enhancer.virtualTryon": { zh: "虚拟试穿结果", en: "Virtual Try-On Results" },
  "enhancer.tryDifferent": { zh: "尝试不同的服装", en: "Try Different Garment" },
  "enhancer.generateMore": { zh: "生成更多内容", en: "Generate More Content" },
  "enhancer.xiaohongshu": { zh: "小红书", en: "Xiaohongshu" },
  "enhancer.jd": { zh: "京东", en: "JD.com" },
  "enhancer.pinduoduo": { zh: "拼多多", en: "Pinduoduo" },
  "enhancer.amazon": { zh: "Amazon", en: "Amazon" },
  "enhancer.shopee": { zh: "Shopee", en: "Shopee" },
  "enhancer.social": { zh: "社交媒体", en: "Social Media" },
  "enhancer.uploadPersonDesc": { zh: "拖放或点击选择清晰的人物照片", en: "Drag & drop or click to select a clear photo of a person" },
  "enhancer.supportsFormat": { zh: "支持格式：JPG, PNG, WebP（最大 10MB）", en: "Supports: JPG, PNG, WebP (Max 10MB)" },
  "enhancer.uploaded": { zh: "✓ 已上传", en: "✓ Uploaded" },
  "enhancer.dragOrClick": { zh: "拖放或点击", en: "Drag & drop or click" },
  "enhancer.backToHome": { zh: "返回首页", en: "Back to Home" },
  "enhancer.3dModelGen": { zh: "3D 模型生成", en: "3D Model Gen" },
  "enhancer.virtualTryOn": { zh: "虚拟试穿", en: "Virtual Try-On" },
  "enhancer.crossPlatform": { zh: "跨平台内容", en: "Cross-Platform" },
  "enhancer.modeDescMultiview": { zh: "从单张照片生成正面、背面、左侧、右侧的 3D 模型", en: "Generate 3D model with front, back, left, and right views from a single photo" },
  "enhancer.modeDescTryon": { zh: "上传人物和服装照片，查看各角度的虚拟试穿效果", en: "Upload a person photo and garment to see virtual try-on from all angles" },
  "enhancer.modeDescCrossplatform": { zh: "为国内外电商平台生成专属营销内容", en: "Generate platform-specific marketing content for Chinese & global e-commerce" },
  "enhancer.aiWorking": { zh: "AI 正在施展魔法，通常只需几秒钟...", en: "Our AI is working its magic. This usually takes a few seconds..." },
  "enhancer.viewAllAngles": { zh: "从各个角度查看生成的 3D 模型", en: "View your generated 3D model from all angles" },
  "enhancer.viewLabel": { zh: "视图", en: "View" },
  "enhancer.tryDifferentGarment": { zh: "想看看其他服装的效果？上传新的服装图片。", en: "Want to see how a different clothing item looks? Upload a new garment image." },
  "enhancer.readyContent": { zh: "适用于多个平台的即用型营销内容", en: "Ready-to-use marketing content for multiple platforms" },
  "enhancer.contentLabel": { zh: "内容", en: "Content" },
  "enhancer.copyright": { zh: "版权所有", en: "All rights reserved" },
  "enhancer.madeWith": { zh: "用 ❤️ 由 Yifan 制作", en: "Made with ❤️ by Yifan" }
};