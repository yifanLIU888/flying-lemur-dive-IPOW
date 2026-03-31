"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  FileImage
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/logo";

type ProcessingStep = "upload" | "enhance" | "processing" | "result";

interface EnhancementOptions {
  smartEnhance: boolean;
  backgroundRemove: boolean;
  upscale: boolean;
  noiseReduction: boolean;
  colorCorrection: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
}

const Enhancer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState<ProcessingStep>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  
  const [options, setOptions] = useState<EnhancementOptions>({
    smartEnhance: true,
    backgroundRemove: false,
    upscale: false,
    noiseReduction: false,
    colorCorrection: false,
    brightness: 50,
    contrast: 50,
    saturation: 50,
    sharpness: 50
  });

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
      setUploadedImage(e.target?.result as string);
      setCurrentStep("enhance");
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError(t("toast.invalidFileType") || "Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setCurrentStep("enhance");
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const processImage = async () => {
    setIsProcessing(true);
    setCurrentStep("processing");
    setProcessingProgress(0);

    // Simulate processing progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setProcessedImage(uploadedImage);
      setCurrentStep("result");
      setIsProcessing(false);
      showSuccess(t("toast.processingComplete") || "Processing complete!");
    }, 3000);
  };

  const resetEnhancer = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setCurrentStep("upload");
    setProcessingProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `ipow-enhanced-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(t("toast.downloadStarted") || "Download started!");
  };

  const updateOption = <K extends keyof EnhancementOptions>(
    key: K,
    value: EnhancementOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
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
        {currentStep === "upload" && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t("hero.title1")} <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{t("hero.title2")}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t("hero.description")}
              </p>
            </div>

            <Card 
              className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white/80 backdrop-blur-sm"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="p-16 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {t("step.upload.title")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("step.upload.desc")}
                  </p>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                  >
                    {t("hero.startNow")}
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Supports: JPG, PNG, GIF, WebP (Max 10MB)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "enhance" && uploadedImage && (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image Preview */}
              <div className="lg:col-span-2">
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={resetEnhancer}
                        className="rounded-full"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Upload New
                      </Button>
                      <Button
                        onClick={processImage}
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Enhance Image
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhancement Options */}
              <div className="lg:col-span-1">
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Wand2 className="w-5 h-5 mr-2 text-blue-600" />
                      Enhancement Options
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smartEnhance" className="flex items-center cursor-pointer">
                          <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                          Smart Enhancement
                        </Label>
                        <Switch
                          id="smartEnhance"
                          checked={options.smartEnhance}
                          onCheckedChange={(checked) => updateOption('smartEnhance', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="backgroundRemove" className="flex items-center cursor-pointer">
                          <Eraser className="w-4 h-4 mr-2 text-purple-600" />
                          Remove Background
                        </Label>
                        <Switch
                          id="backgroundRemove"
                          checked={options.backgroundRemove}
                          onCheckedChange={(checked) => updateOption('backgroundRemove', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="upscale" className="flex items-center cursor-pointer">
                          <Crop className="w-4 h-4 mr-2 text-green-600" />
                          Upscale 2x
                        </Label>
                        <Switch
                          id="upscale"
                          checked={options.upscale}
                          onCheckedChange={(checked) => updateOption('upscale', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="noiseReduction" className="flex items-center cursor-pointer">
                          <Moon className="w-4 h-4 mr-2 text-indigo-600" />
                          Noise Reduction
                        </Label>
                        <Switch
                          id="noiseReduction"
                          checked={options.noiseReduction}
                          onCheckedChange={(checked) => updateOption('noiseReduction', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="colorCorrection" className="flex items-center cursor-pointer">
                          <Palette className="w-4 h-4 mr-2 text-pink-600" />
                          Color Correction
                        </Label>
                        <Switch
                          id="colorCorrection"
                          checked={options.colorCorrection}
                          onCheckedChange={(checked) => updateOption('colorCorrection', checked)}
                        />
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                          <Sun className="w-4 h-4 mr-2" />
                          Manual Adjustments
                        </h4>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <Label className="text-sm">Brightness</Label>
                              <span className="text-sm text-gray-600">{options.brightness}%</span>
                            </div>
                            <Slider
                              value={[options.brightness]}
                              onValueChange={(value) => updateOption('brightness', value[0])}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <Label className="text-sm">Contrast</Label>
                              <span className="text-sm text-gray-600">{options.contrast}%</span>
                            </div>
                            <Slider
                              value={[options.contrast]}
                              onValueChange={(value) => updateOption('contrast', value[0])}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <Label className="text-sm">Saturation</Label>
                              <span className="text-sm text-gray-600">{options.saturation}%</span>
                            </div>
                            <Slider
                              value={[options.saturation]}
                              onValueChange={(value) => updateOption('saturation', value[0])}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <Label className="text-sm">Sharpness</Label>
                              <span className="text-sm text-gray-600">{options.sharpness}%</span>
                            </div>
                            <Slider
                              value={[options.sharpness]}
                              onValueChange={(value) => updateOption('sharpness', value[0])}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {currentStep === "processing" && (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-16">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Processing Your Image
                </h2>
                <p className="text-gray-600 mb-8">
                  Our AI is working its magic. This usually takes a few seconds...
                </p>
                <div className="max-w-md mx-auto">
                  <Progress value={processingProgress} className="h-3" />
                  <p className="text-sm text-gray-500 mt-2">{processingProgress}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "result" && processedImage && (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Enhancement Complete!
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Enhanced Image
              </h1>
              <p className="text-xl text-gray-600">
                Here's your processed image. You can download it or try different settings.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Original</h3>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={uploadedImage!} 
                      alt="Original" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Enhanced</h3>
                    <Button
                      onClick={downloadImage}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={processedImage} 
                      alt="Enhanced" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button
                onClick={resetEnhancer}
                variant="outline"
                size="lg"
                className="rounded-full px-8"
              >
                <Upload className="w-4 h-4 mr-2" />
                Enhance Another Image
              </Button>
            </div>
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