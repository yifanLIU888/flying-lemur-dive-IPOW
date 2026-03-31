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
              Upload a person's photo to generate 3D model with front, back, left, and right views
            </p>
          </div>

          <Card 
            className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm"
            onDrop={(e) => handleDrop(e, 'person')}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="p-16 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'person')}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("enhancer.uploadPerson")}
                </h3>
                <p className="text-gray-600 mb-6">
                  Drag & drop or click to select a clear photo of a person
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                >
                  {t("enhancer.uploadPerson")}
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Supports: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else if (activeMode === "tryon") {
      return (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("enhancer.tryon")}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t("enhancer.virtualTryon")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm"
              onDrop={(e) => handleDrop(e, 'person')}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'person')}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t("enhancer.personPhoto")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {uploadedImage ? "✓ Uploaded" : "Drag & drop or click"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-2 border-dashed border-gray-300 hover:border-purple-500 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm"
              onDrop={(e) => handleDrop(e, 'garment')}
              onDragOver={handleDragOver}
              onClick={() => garmentInputRef.current?.click()}
            >
              <CardContent className="p-8 text-center">
                <input
                  ref={garmentInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'garment')}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6">
                    <Shirt className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t("enhancer.garmentPhoto")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {garmentImage ? "✓ Uploaded" : "Drag & drop or click"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    } else if (activeMode === "crossplatform") {
      return (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("enhancer.crossplatform")}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t("enhancer.uploadProduct")}
            </p>
          </div>

          <Card 
            className="border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm"
            onDrop={(e) => handleDrop(e, 'product')}
            onDragOver={handleDragOver}
            onClick={() => productInputRef.current?.click()}
          >
            <CardContent className="p-16 text-center">
              <input
                ref={productInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'product')}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center mb-6">
                  <ShoppingBag className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("enhancer.uploadProduct")}
                </h3>
                <p className="text-gray-600 mb-6">
                  Drag & drop or click to select your product photo
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full"
                >
                  {t("enhancer.uploadProduct")}
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Supports: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  const renderProcessingStep = () => {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeMode === "multiview" ? t("enhancer.generating3d") : 
               activeMode === "tryon" ? t("enhancer.processingTryon") : 
               t("enhancer.generatingContent")}
            </h2>
            <p className="text-gray-600 mb-8">
              Our AI is working its magic. This usually takes a few seconds...
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={processingProgress} className="h-3 mb-4" />
              <p className="text-sm text-gray-500">{processingProgress}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMultiviewResult = () => {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {t("enhancer.results")}
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("enhancer.multiview")}
          </h1>
          <p className="text-xl text-gray-600">
            View your generated 3D model from all angles
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { view: 'front', label: t("enhancer.frontView"), icon: Camera },
            { view: 'back', label: t("enhancer.backView"), icon: Camera },
            { view: 'left', label: t("enhancer.leftView"), icon: Camera },
            { view: 'right', label: t("enhancer.rightView"), icon: Camera }
          ].map(({ view, label, icon: Icon }) => (
            <Card key={view} className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  {processedResults[view as keyof typeof processedResults] ? (
                    <img 
                      src={processedResults[view as keyof typeof processedResults]} 
                      alt={label} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-center text-sm font-medium text-gray-700">{label}</p>
                {processedResults[view as keyof typeof processedResults] && (
                  <Button
                    onClick={() => downloadImage(processedResults[view as keyof typeof processedResults]!, `ipow-3d-${view}-${Date.now()}.png`)}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 rounded-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("enhancer.download")}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={resetEnhancer}
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t("enhancer.uploadNew")}
          </Button>
        </div>
      </div>
    );
  };

  const renderTryonResult = () => {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {t("enhancer.results")}
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("enhancer.virtualTryon")}
          </h1>
          <p className="text-xl text-gray-600">
            See how the garment looks from all angles
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { view: 'tryonFront', label: t("enhancer.frontView"), icon: Shirt },
            { view: 'tryonBack', label: t("enhancer.backView"), icon: Shirt },
            { view: 'tryonLeft', label: t("enhancer.leftView"), icon: Shirt },
            { view: 'tryonRight', label: t("enhancer.rightView"), icon: Shirt }
          ].map(({ view, label, icon: Icon }) => (
            <Card key={view} className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  {processedResults[view as keyof typeof processedResults] ? (
                    <img 
                      src={processedResults[view as keyof typeof processedResults]} 
                      alt={label} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-center text-sm font-medium text-gray-700">{label} View</p>
                {processedResults[view as keyof typeof processedResults] && (
                  <Button
                    onClick={() => downloadImage(processedResults[view as keyof typeof processedResults]!, `ipow-tryon-${view}-${Date.now()}.png`)}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 rounded-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("enhancer.download")}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-purple-600" />
            {t("enhancer.tryDifferent")}
          </h3>
          <p className="text-gray-600 mb-4">
            Want to see how a different clothing item looks? Upload a new garment image.
          </p>
          <Button
            onClick={() => {
              setGarmentImage(null);
              setCurrentStep("upload");
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full"
          >
            {t("enhancer.uploadNew")}
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={resetEnhancer}
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t("enhancer.startOver")}
          </Button>
        </div>
      </div>
    );
  };

  const renderCrossPlatformResult = () => {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {t("enhancer.results")}
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("enhancer.crossplatform")}
          </h1>
          <p className="text-xl text-gray-600">
            Ready-to-use marketing content for multiple platforms
          </p>
        </div>

        <div className="mb-6">
          <Label className="text-lg font-semibold mb-3 block">{t("enhancer.selectPlatform")}:</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "xiaohongshu", name: t("enhancer.xiaohongshu"), icon: "📕" },
              { id: "jd", name: t("enhancer.jd"), icon: "🛒" },
              { id: "pinduoduo", name: t("enhancer.pinduoduo"), icon: "🔪" },
              { id: "amazon", name: t("enhancer.amazon"), icon: "📦" },
              { id: "shopee", name: t("enhancer.shopee"), icon: "🌏" },
              { id: "social", name: t("enhancer.social"), icon: "📱" }
            ].map(platform => (
              <Button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                variant={selectedPlatform === platform.id ? "default" : "outline"}
                className="rounded-full"
              >
                <span className="mr-2">{platform.icon}</span>
                {platform.name}
              </Button>
            ))}
          </div>
        </div>

        {processedResults.platformContents?.map(content => (
          <Card key={content.platform} className={`mb-6 border-0 bg-white/80 backdrop-blur-sm shadow-xl ${selectedPlatform === content.platform ? 'ring-2 ring-blue-500' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 mr-2 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">{content.name} Content</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {t("enhancer.recommendedImage")}
                  </h4>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {content.image && (
                      <img 
                        src={content.image} 
                        alt={`${content.name} product`} 
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <Button
                    onClick={() => downloadImage(content.image!, `ipow-${content.platform}-image-${Date.now()}.png`)}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("enhancer.download")}
                  </Button>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t("enhancer.marketingCopy")}
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-gray-800 mb-3">{content.title}</p>
                    <p className="text-gray-600 text-sm mb-3">{content.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="rounded-full">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(`${content.title}\n\n${content.description}\n\n${content.tags.map(t => `#${t}`).join(' ')}`)}
                      variant="outline"
                      size="sm"
                      className="rounded-full flex-1"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {t("enhancer.copyText")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="text-center mt-8">
          <Button
            onClick={resetEnhancer}
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t("enhancer.generateMore")}
          </Button>
        </div>
      </div>
    );
  };

  const renderResultStep = () => {
    if (activeMode === "multiview") return renderMultiviewResult();
    if (activeMode === "tryon") return renderTryonResult();
    if (activeMode === "crossplatform") return renderCrossPlatformResult();
    return null;
  };

  const getModeDescription = (mode: FeatureMode) => {
    switch (mode) {
      case "multiview":
        return "Generate 3D model with front, back, left, and right views from a single photo";
      case "tryon":
        return "Upload a person photo and garment to see virtual try-on from all angles";
      case "crossplatform":
        return "Generate platform-specific marketing content for Chinese & global e-commerce";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <Logo />
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Feature Mode Tabs */}
        <div className="mb-8">
          <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as FeatureMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-full p-1 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="multiview" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                3D Model Gen
              </TabsTrigger>
              <TabsTrigger value="tryon" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                <Shirt className="w-4 h-4 mr-2" />
                Virtual Try-On
              </TabsTrigger>
              <TabsTrigger value="crossplatform" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                <Globe className="w-4 h-4 mr-2" />
                Cross-Platform
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <p className="text-center text-gray-600 mt-3 text-sm">
            {getModeDescription(activeMode)}
          </p>
        </div>

        {/* Step Content */}
        {currentStep === "upload" && renderUploadStep()}
        {currentStep === "processing" && renderProcessingStep()}
        {currentStep === "result" && renderResultStep()}

        {/* Options Panel (only for upload step) */}
        {currentStep === "upload" && (
          <div className="max-w-3xl mx-auto mt-8">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-blue-600" />
                  Processing Options
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enhanceDetails" className="flex items-center cursor-pointer">
                      <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                      Enhance Details
                    </Label>
                    <Switch
                      id="enhanceDetails"
                      checked={options.enhanceDetails}
                      onCheckedChange={(checked) => updateOption('enhanceDetails', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="smoothEdges" className="flex items-center cursor-pointer">
                      <Contrast className="w-4 h-4 mr-2 text-purple-600" />
                      Smooth Edges
                    </Label>
                    <Switch
                      id="smoothEdges"
                      checked={options.smoothEdges}
                      onCheckedChange={(checked) => updateOption('smoothEdges', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="preserveColors" className="flex items-center cursor-pointer">
                      <Palette className="w-4 h-4 mr-2 text-pink-600" />
                      Preserve Original Colors
                    </Label>
                    <Switch
                      id="preserveColors"
                      checked={options.preserveColors}
                      onCheckedChange={(checked) => updateOption('preserveColors', checked)}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center">
                      <Monitor className="w-4 h-4 mr-2" />
                      Output Quality
                    </Label>
                    <div className="flex gap-2">
                      {(['standard', 'hd', 'ultra'] as const).map(quality => (
                        <Button
                          key={quality}
                          onClick={() => updateOption('quality', quality)}
                          variant={options.quality === quality ? "default" : "outline"}
                          size="sm"
                          className="rounded-full capitalize"
                        >
                          {quality}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 IPOW. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>by Dyad</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Enhancer;