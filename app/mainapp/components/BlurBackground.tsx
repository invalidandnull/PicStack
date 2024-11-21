'use client';

import { useState } from 'react';

type BlurLevel = 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type BlurPixels = 4 | 8 | 12 | 16 | 24 | 40 | 64;

interface BlurOption {
  value: BlurLevel;
  label: string;
  pixels: BlurPixels;
}

const blurOptions: BlurOption[] = [
  { value: 'sm', label: '轻微模糊', pixels: 4 },
  { value: 'base', label: '基础模糊', pixels: 8 },
  { value: 'md', label: '中等模糊', pixels: 12 },
  { value: 'lg', label: '较强模糊', pixels: 16 },
  { value: 'xl', label: '强烈模糊', pixels: 24 },
  { value: '2xl', label: '超强模糊', pixels: 40 },
  { value: '3xl', label: '最大模糊', pixels: 64 },
];

export default function BlurBackground() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [blurLevel, setBlurLevel] = useState<BlurPixels>(12);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChangingBlur, setIsChangingBlur] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setProcessedImage(null);
        setForegroundImage(null); // 重置前景图片
      };
      reader.readAsDataURL(file);
    }
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
    <div className="space-y-6">
      {/* 图片上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          上传图片
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full"
        />
      </div>

      {/* 预览原图 */}
      {selectedImage && (
        <div className="aspect-square relative border rounded-lg overflow-hidden">
          <img
            src={selectedImage}
            alt="Original"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* 模糊等级选择 */}
      {selectedImage && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            选择模糊等级
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {blurOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleBlurLevelChange(option.pixels)}
                disabled={isProcessing || isChangingBlur}
                className={`
                  p-4 rounded-lg border transition-all duration-200
                  ${blurLevel === option.pixels 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-500'}
                  ${(isProcessing || isChangingBlur) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''}
                `}
              >
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">{option.pixels}px</div>
              </button>
            ))}
          </div>

          {/* 处理按钮 */}
          {!foregroundImage && (
            <button
              onClick={handleProcess}
              disabled={isProcessing || isChangingBlur}
              className={`
                w-full py-2 px-4 rounded-lg
                ${(isProcessing || isChangingBlur)
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'}
                text-white transition-colors
              `}
            >
              {isProcessing ? '处理中...' : '开始处理'}
            </button>
          )}
        </div>
      )}

      {/* 处理结果 */}
      {processedImage && (
        <div className="relative aspect-square border rounded-lg overflow-hidden">
          <img
            src={processedImage}
            alt="Processed"
            className={`w-full h-full object-contain ${isChangingBlur ? 'opacity-50' : ''}`}
          />
          {/* 加载指示器 */}
          {isChangingBlur && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
} 