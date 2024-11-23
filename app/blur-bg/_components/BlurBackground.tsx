'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

type BlurLevel = 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type BlurPixels = 4 | 8 | 12 | 16 | 24 | 40 | 64;

interface BlurOption {
  value: BlurLevel;
  label: string;
  pixels: BlurPixels;
}

const blurOptions: BlurOption[] = [
  { value: 'sm', label: 'Light', pixels: 4 },
  { value: 'base', label: 'Basic', pixels: 8 },
  { value: 'md', label: 'Medium', pixels: 12 },
  { value: 'lg', label: 'Strong', pixels: 16 },
  { value: 'xl', label: 'Extra', pixels: 24 },
  { value: '2xl', label: 'Super', pixels: 40 },
  { value: '3xl', label: 'Maximum', pixels: 64 },
];

export default function BlurBackground() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [blurLevel, setBlurLevel] = useState<BlurPixels>(12);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isChangingBlur, setIsChangingBlur] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 拖拽上传相关处理函数
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFile(imageFile);
    } else {
      setError('Please upload an image file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setProcessedImage(null);
      setForegroundImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // 去除背景的函数
  const removeBackground = async (image: string): Promise<string> => {
    const response = await fetch('/api/process-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: image,
        style: 'remove-bg',
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to remove background');
    }

    return data.output;
  };

  // 模糊背景的函数
  const blurAndComposite = async (originalImage: string, foregroundImage: string, blurPixels: number): Promise<string> => {
    setIsChangingBlur(true);
    try {
      const response = await fetch('/api/blur-composite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalImage,
          foregroundImage,
          blurPixels,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to composite image');
      }

      return data.output;
    } finally {
      setIsChangingBlur(false);
    }
  };

  // 处理图片的主函数
  const handleProcess = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 如果还没有前景图片，先去除背景
      if (!foregroundImage) {
        const removedBg = await removeBackground(selectedImage);
        setForegroundImage(removedBg);
        
        // 使用新的前景图片进行模糊合成
        const blurred = await blurAndComposite(selectedImage, removedBg, blurLevel);
        setProcessedImage(blurred);
      } else {
        // 如果已有前景图片，直接进行模糊合成
        const blurred = await blurAndComposite(selectedImage, foregroundImage, blurLevel);
        setProcessedImage(blurred);
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  // 当选择新的模糊等级时
  const handleBlurLevelChange = async (pixels: BlurPixels) => {
    if (isProcessing || isChangingBlur) return;
    
    setBlurLevel(pixels);
    if (selectedImage && foregroundImage) {
      try {
        setIsChangingBlur(true);
        const blurred = await blurAndComposite(selectedImage, foregroundImage, pixels);
        setProcessedImage(blurred);
      } catch (err) {
        console.error('Blur change error:', err);
        setError(err instanceof Error ? err.message : 'Failed to change blur level');
      } finally {
        setIsChangingBlur(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      {!selectedImage && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 transition-colors duration-200 cursor-pointer",
            "flex flex-col items-center justify-center text-center min-h-[300px]",
            isDragging 
              ? "border-green-500 bg-green-50" 
              : "border-gray-300 hover:border-green-500"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-green-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">
            {isDragging ? 'Drop your image here' : 'Drag & Drop your image here'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            or click to select file
          </p>
          <p className="text-xs text-gray-400">
            Supports PNG, JPG, JPEG, WEBP
          </p>
        </div>
      )}

      {/* Main Content */}
      {selectedImage && (
        <div className="space-y-6">
          {/* Image Comparison */}
          <div className="grid grid-cols-2 gap-8">
            {/* Original Image */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Original Image</h3>
              <div className="aspect-square relative border rounded-xl overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Processed Image */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                {processedImage ? 'Blurred Image' : 'Result Preview'}
              </h3>
              <div className="aspect-square relative border rounded-xl overflow-hidden">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed"
                    className={`w-full h-full object-contain ${isChangingBlur ? 'opacity-50' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Preview will appear here
                  </div>
                )}
                {isChangingBlur && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Blur Level Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Blur Intensity
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {blurOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleBlurLevelChange(option.pixels)}
                  disabled={isProcessing || isChangingBlur}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200",
                    blurLevel === option.pixels 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 hover:border-green-500",
                    (isProcessing || isChangingBlur) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.pixels}px</div>
                </button>
              ))}
            </div>
          </div>

          {/* Process Button */}
          {!foregroundImage && (
            <div className="flex justify-center">
              <button
                onClick={handleProcess}
                disabled={isProcessing || isChangingBlur}
                className={cn(
                  "px-8 py-3 rounded-lg text-white transition-colors",
                  (isProcessing || isChangingBlur)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                )}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Apply Blur Effect'
                )}
              </button>
            </div>
          )}

          {/* Reset Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setSelectedImage(null);
                setProcessedImage(null);
                setForegroundImage(null);
                setError(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Upload another image
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 