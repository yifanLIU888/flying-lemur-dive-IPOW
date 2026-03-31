"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Download, 
  Sparkles, 
  ArrowLeft, 
  Zap,
  Wand2,
  Crop,
  Palette,
  Sun,
  Moon,
  Contrast,
  Eraser,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  FileImage,
  User,
  Shirt,
  Globe,
  Camera,
  RefreshCw,
  ShoppingBag,
  MessageSquare,
  Share2,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/logo";

type ProcessingStep = "upload" | "processing" | "result";
type FeatureMode = "multiview" | "tryon" | "crossplatform";

interface ProcessingOptions {
  quality: "standard" | "hd" | "ultra";
  enhanceDetails: boolean;
  smoothEdges: boolean;
  preserveColors: boolean;
}

const Enhancer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);
  
  const [activeMode, setActiveMode] = useState<FeatureMode>("multiview");
  const [currentStep, setCurrentStep] = useState<ProcessingStep>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResults, setProcessedResults] = useState<{
    front?: string;
    back?: string;
    left?: string;
    right?: string;
    tryonFront?: string;
    tryonBack?: string;
    tryonLeft?: string;
    tryonRight?: string;
    platformContents?: Array<{
      platform: string;
      image?: string;
      title: string;
      description: string;
      tags: string[];
    }>;
  }>({});
  const [selectedPlatform, setSelectedPlatform] = useState<string>("xiaohongshu");
  
  const [options, setOptions] = useState<ProcessingOptions>({
    quality: "hd",
    enhanceDetails: true,
    smoothEdges: true,
    preserveColors: false
  });

  // Reset state when switching modes
  useEffect(() => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setGarmentImage(null);
    setProductImage(null);
    setProcessedResults({});
    setProcessingProgress(0);
    setIsProcessing(false);
  }, [activeMode]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'person' | 'garment' | 'product') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError(t("toast.invalidFileType") || "Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError(t("toast.fileTooLarge") || "File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'person') {
        setUploadedImage(result);
        if (activeMode === "multiview") setCurrentStep("processing");
      } else if (type === 'garment') {
        setGarmentImage(result);
        if (activeMode === "tryon" && uploadedImage) setCurrentStep("processing");
      } else if (type === 'product') {
        setProductImage(result);
        if (activeMode === "crossplatform") setCurrentStep("processing");
      }
    };
    reader.readAsDataURL(file);
  }, [activeMode, uploadedImage, t]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>, type: 'person' | 'garment' | 'product') => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError(t("toast.invalidFileType") || "Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'person') {
        setUploadedImage(result);
        if (activeMode === "multiview") setCurrentStep("processing");
      } else if (type === 'garment') {
        setGarmentImage(result);
        if (activeMode === "tryon" && uploadedImage) setCurrentStep("processing");
      } else if (type === 'product') {
        setProductImage(result);
        if (activeMode === "crossplatform") setCurrentStep("processing");
      }
    };
    reader.readAsDataURL(file);
  }, [activeMode, uploadedImage, t]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const processMultiview = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    setCurrentStep("processing");
    setProcessingProgress(0);

    // Simulate AI processing with progress updates
    const steps = [
      { progress: 20, delay: 500, message: "Extracting person model..." },
      { progress: 40, delay: 1000, message: "Generating 3D mesh..." },
      { progress: 60, delay: 1500, message: "Rendering front view..." },
      { progress: 80, delay: 2000, message: "Rendering side views..." },
      { progress: 100, delay: 2500, message: "Finalizing..." }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProcessingProgress(step.progress);
    }

    // Simulate results (in real app, these would be generated by AI)
    setProcessedResults({
      front: uploadedImage,
      back: uploadedImage,
      left: uploadedImage,
      right: uploadedImage
    });

    setCurrentStep("result");
    setIsProcessing(false);
    showSuccess(t("toast.processingComplete") || "Processing complete!");
  };

  const processTryon = async () => {
    if (!uploadedImage || !garmentImage) return;
    
    setIsProcessing(true);
    setCurrentStep("processing");
    setProcessingProgress(0);

    const steps = [
      { progress: 20, delay: 500, message: "Analyzing person model..." },
      { progress: 35, delay: 800, message: "Analyzing garment..." },
      { progress: 50, delay: 1200, message: "Fitting garment to model..." },
      { progress: 70, delay: 1800, message: "Rendering try-on views..." },
      { progress: 90, delay: 2200, message: "Applying textures..." },
      { progress: 100, delay: 2600, message: "Finalizing..." }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProcessingProgress(step.progress);
    }

    setProcessedResults({
      tryonFront: uploadedImage,
      tryonBack: uploadedImage,
      tryonLeft: uploadedImage,
      tryonRight: uploadedImage
    });

    setCurrentStep("result");
    setIsProcessing(false);
    showSuccess(t("toast.processingComplete") || "Processing complete!");
  };

  const processCrossPlatform = async () => {
    if (!productImage) return;
    
    setIsProcessing(true);
    setCurrentStep("processing");
    setProcessingProgress(0);

    const steps = [
      { progress: 15, delay: 400, message: "Analyzing product..." },
      { progress: 30, delay: 700, message: "Generating platform-specific visuals..." },
      { progress: 50, delay: 1200, message: "Creating marketing copy..." },
      { progress: 70, delay: 1600, message: "Optimizing for each platform..." },
      { progress: 90, delay: 2000, message: "Finalizing content..." },
      { progress: 100, delay: 2400, message: "Done!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProcessingProgress(step.progress);
    }

    // Simulate platform-specific content
    const platforms = [
      {
        platform: "xiaohongshu",
        name: "小红书",
        title: "这款好物让我爱不释手！✨",
        description: "今天给大家推荐一款超赞的产品，质量非常好，性价比超高！用了之后真的感觉生活品质提升了一个档次～",
        tags: ["好物推荐", "必买清单", "生活好物", "性价比之王"]
      },
      {
        platform: "jd",
        name: "京东",
        title: "高品质商品，值得信赖",
        description: "正品保障，极速配送。本产品采用优质材料制作，经过严格质量检测，为您提供卓越的使用体验。",
        tags: ["正品保障", "极速配送", "品质之选"]
      },
      {
        platform: "pinduoduo",
        name: "拼多多",
        title: "超值好货，拼团更优惠！",
        description: "工厂直供，价格实惠！多人拼团享受更低价格，品质不减，实惠到家！",
        tags: ["工厂直供", "拼团优惠", "实惠好货"]
      },
      {
        platform: "amazon",
        name: "Amazon",
        title: "Premium Quality Product",
        description: "High-quality materials, excellent craftsmanship. Perfect for everyday use with durable construction and stylish design.",
        tags: ["Premium", "High Quality", "Best Seller"]
      },
      {
        platform: "shopee",
        name: "Shopee",
        title: "Barang Berkualitas Premium",
        description: "Produk berkualitas tinggi dengan harga terjangkau. Pengiriman cepat dan pelayanan terbaik!",
        tags: ["Premium Quality", "Fast Shipping", "Best Deals"]
      },
      {
        platform: "social",
        name: "Social Media",
        title: "This product is absolutely amazing! 🤩",
        description: "Just got my hands on this incredible product and I'm already in love! Perfect for anyone looking to upgrade their daily essentials.",
        tags: ["MustHave", "ProductReview", "Lifestyle", "Trending"]
      }
    ];

    setProcessedResults({
      platformContents: platforms.map(p => ({
        ...p,
        image: productImage
      }))
    });

    setCurrentStep("result");
    setIsProcessing(false);
    showSuccess(t("toast.processingComplete") || "Processing complete!");
  };

  const processImage = async () => {
    if (activeMode === "multiview") {
      await processMultiview();
    } else if (activeMode === "tryon") {
      await processTryon();
    } else if (activeMode === "crossplatform") {
      await processCrossPlatform();
    }
  };

  const resetEnhancer = () => {
    setUploadedImage(null);
    setGarmentImage(null);
    setProductImage(null);
    setProcessedResults({});
    setCurrentStep("upload");
    setProcessingProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (garmentInputRef.current) garmentInputRef.current.value = "";
    if (productInputRef.current) productInputRef.current.value = "";
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(t("toast.downloadStarted") || "Download started!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess("Copied to clipboard!");
    });
  };

  const updateOption = <K extends keyof ProcessingOptions>(
    key: K,
    value: ProcessingOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const renderUploadStep = () => {
    if (activeMode === "multiview") {
      return (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("hero.title1")} <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{t("hero.title2")}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              上传人物照片，生成正面、背面、左侧、右侧的3D模型
            </p>
          </div>

          <Card 
            className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm"
            onDrop

<dyad-write path="src/contexts/LanguageContext.tsx" description="Adding missing translations for Enhancer page features and correcting existing Chinese translations">
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

  // CTA Section
  "cta.title": { zh: "准备好改变您的照片了吗？", en: "Ready to Transform Your Photos?" },
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
  "footer.by": { zh: "由 Dyad 制作", en: "by Dyad" },

  // Toast messages
  "toast.subscribeSuccess": { zh: "感谢订阅！", en: "Thank you for subscribing!" },
  "toast.subscribeError": { zh: "订阅失败，请重试。", en: "Failed to subscribe. Please try again." },
  "toast.emailRequired": { zh: "请输入邮箱地址", en: "Please enter an email address" },
  "toast.emailInvalid": { zh: "请输入有效的邮箱地址", en: "Please enter a valid email address" },
  "toast.rateLimit": { zh: "提交次数过多，请稍后再试。", en: "Too many submissions. Please try again later." },
  "toast.invalidFileType": { zh: "请上传图片文件", en: "Please upload an image file" },
  "toast.fileTooLarge": { zh: "文件大小必须小于 10MB", en: "File size must be less than 10MB" },
  "toast.processingComplete": { zh: "处理完成！", en: "Processing complete!" },
  "toast.downloadStarted": { zh: "下载已开始！", en: "Download started!" },

  // Enhancer Page - New Translations
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
  "enhancer.virtualTryon": { zh: "虚拟试穿", en: "Virtual Try-On" },
  "enhancer.tryDifferent": { zh: "尝试不同的服装", en: "Try Different Garment" },
  "enhancer.generateMore": { zh: "生成更多内容", en: "Generate More Content" },
  "enhancer.xiaohongshu": { zh: "小红书", en: "Xiaohongshu" },
  "enhancer.jd": { zh: "京东", en: "JD.com" },
  "enhancer.pinduoduo": { zh: "拼多多", en: "Pinduoduo" },
  "enhancer.amazon": { zh: "Amazon", en: "Amazon" },
  "enhancer.shopee": { zh: "Shopee", en: "Shopee" },
  "enhancer.social": { zh: "社交媒体", en: "Social Media" }
};