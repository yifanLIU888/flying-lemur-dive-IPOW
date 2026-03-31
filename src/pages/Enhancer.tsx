"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {   Upload, 
  Download,   Image as ImageIcon, 
  Sparkles, 
  ArrowLeft,   Zap,
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
  Scissors // Using Scissors instead of Scissors2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { showSuccess, showError } from "@/utils/toast";

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
  const [step, setStep] = useState<ProcessingStep>("upload");
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOptions>({
    smartEnhance: true,
    backgroundRemove: false,
    upscale: false,
    noiseReduction: false,
    colorCorrection: true,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showError("请选择有效的图片文件");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError("文件大小不能超过 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setStep("enhance");
    };
    reader.readAsDataURL(file);
  };

  const startProcessing = async () => {
    setStep("processing");
    setProgress(0);

    // Simulate processing with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(interval);
    setProgress(100);
    
    // Apply enhancements using canvas
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // Apply filters based on options
          let filter = "";
          if (enhancementOptions.brightness !== 0) {
            filter += `brightness(${100 + enhancementOptions.brightness}%) `;
          }
          if (enhancementOptions.contrast !== 0) {
            filter += `contrast(${100 + enhancementOptions.contrast}%) `;
          }
          if (enhancementOptions.saturation !== 0) {
            filter += `saturate(${100 + enhancementOptions.saturation}%) `;
          }
          
          ctx.filter = filter || "none";
          ctx.drawImage(img, 0, 0);
          
          // Apply smart enhancement simulation
          if (enhancementOptions.smartEnhance) {
            ctx.filter = "contrast(110%) saturate(115%) brightness(105%)";
            ctx.drawImage(img, 0, 0);
          }
          
          setProcessedImage(canvas.toDataURL("image/png"));
          setStep("result");
          showSuccess("图片增强完成！");
        }
      };
      
      img.src = image;
    }
  };

  const resetAll = () => {
    setImage(null);
    setProcessedImage(null);
    setProgress(0);
    setStep("upload");
    setEnhancementOptions({
      smartEnhance: true,
      backgroundRemove: false,
      upscale: false,
      noiseReduction: false,
      colorCorrection: true,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
    });
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = "enhanced-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess("图片已下载");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAll}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                返回首页
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Picsetai
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Step */}
        {step === "upload" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">上传图片</h1>
              <p className="text-gray-600">拖放图片或点击选择文件</p>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                拖放图片到这里              </p>
              <p className="text-sm text-gray-500 mb-4">
                支持 JPG, PNG, WebP 格式，最大 10MB
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full">
                选择图片
              </Button>
            </div>
          </div>
        )}

        {/* Enhance Step */}
        {step === "enhance" && image && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Preview */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt="Uploaded"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhancement Options */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-purple-600" />
                    AI 增强选项
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <Label>智能增强</Label>
                      </div>
                      <Switch
                        checked={enhancementOptions.smartEnhance}
                        onCheckedChange={(checked) =>
                          setEnhancementOptions(prev => ({ ...prev, smartEnhance: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eraser className="w-4 h-4 text-pink-600" />
                        <Label>移除背景</Label>
                      </div>
                      <Switch
                        checked={enhancementOptions.backgroundRemove}
                        onCheckedChange={(checked) =>
                          setEnhancementOptions(prev => ({ ...prev, backgroundRemove: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crop className="w-4 h-4 text-green-600" />
                        <Label>放大图片</Label>
                      </div>
                      <Switch
                        checked={enhancementOptions.upscale}
                        onCheckedChange={(checked) =>
                          setEnhancementOptions(prev => ({ ...prev, upscale: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-indigo-600" />
                        <Label>降噪处理</Label>
                      </div>
                      <Switch
                        checked={enhancementOptions.noiseReduction}
                        onCheckedChange={(checked) =>
                          setEnhancementOptions(prev => ({ ...prev, noiseReduction: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-yellow-600" />
                        <Label>色彩校正</Label>
                      </div>
                      <Switch
                        checked={enhancementOptions.colorCorrection}
                        onCheckedChange={(checked) =>
                          setEnhancementOptions(prev => ({ ...prev, colorCorrection: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    手动调整
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          亮度
                        </Label>
                        <span className="text-sm text-gray-500">{enhancementOptions.brightness}%</span>
                      </div>
                      <Slider
                        value={[enhancementOptions.brightness]}
                        onValueChange={([value]) =>
                          setEnhancementOptions(prev => ({ ...prev, brightness: value }))
                        }
                        min={-50}
                        max={50}
                        step={1}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          <Contrast className="w-4 h-4" />
                          对比度
                        </Label>
                        <span className="text-sm text-gray-500">{enhancementOptions.contrast}%</span>
                      </div>
                      <Slider
                        value={[enhancementOptions.contrast]}
                        onValueChange={([value]) =>
                          setEnhancementOptions(prev => ({ ...prev, contrast: value }))
                        }
                        min={-50}
                        max={50}
                        step={1}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          饱和度
                        </Label>
                        <span className="text-sm text-gray-500">{enhancementOptions.saturation}%</span>
                      </div>
                      <Slider
                        value={[enhancementOptions.saturation]}
                        onValueChange={([value]) =>
                          setEnhancementOptions(prev => ({ ...prev, saturation: value }))
                        }
                        min={-50}
                        max={50}
                        step={1}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          <Scissors className="w-4 h-4" /> {/* Using Scissors instead of Scissors2 */}
                          <span>锐度</span>
                        </Label>
                        <span className="text-sm text-gray-500">{enhancementOptions.sharpness}%</span>
                      </div>
                      <Slider
                        value={[enhancementOptions.sharpness]}
                        onValueChange={([value]) =>
                          setEnhancementOptions(prev => ({ ...prev, sharpness: value }))
                        }
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={startProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full py-6 text-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                开始增强
              </Button>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {step === "processing" && (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-12">
              <CardContent>
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  AI 正在处理您的图片
                </h2>
                <p className="text-gray-600 mb-6">
                  这可能需要几秒钟时间，请耐心等待...
                </p>
                
                <Progress value={progress} className="h-2 mb-4" />
                <p className="text-sm text-gray-500">
                  {Math.round(progress)}% 完成
                </p>
                
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Sparkles className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">智能增强</p>
                  </div>
                  <div className="text-center">
                    <Palette className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">色彩校正</p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">优化输出</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Result Step */}
        {step === "result" && processedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before/After Comparison */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">增强前</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {image && (
                      <img
                        src={image}
                        alt="Before"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">增强后</h3>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      完成
                    </Badge>
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={processedImage}
                      alt="After"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    应用了以下增强
                  </h3>
                  <div className="space-y-3">
                    {enhancementOptions.smartEnhance && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>智能增强</span>
                      </div>
                    )}
                    {enhancementOptions.colorCorrection && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>色彩校正</span>
                      </div>
                    )}
                    {enhancementOptions.brightness !== 0 && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>亮度调整 ({enhancementOptions.brightness > 0 ? "+" : ""}{enhancementOptions.brightness}%)</span>
                      </div>
                    )}
                    {enhancementOptions.contrast !== 0 && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>对比度调整 ({enhancementOptions.contrast > 0 ? "+" : ""}{enhancementOptions.contrast}%)</span>
                      </div>
                    )}
                    {enhancementOptions.saturation !== 0 && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>饱和度调整 ({enhancementOptions.saturation > 0 ? "+" : ""}{enhancementOptions.saturation}%)</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button
                  onClick={downloadImage}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full py-6 text-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  下载增强图片
                </Button>
                
                <Button
                  onClick={resetAll}
                  variant="outline"
                  className="w-full rounded-full py-6 text-lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  处理另一张图片
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Enhancer;