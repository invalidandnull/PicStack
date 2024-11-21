'use client';

import { useState } from 'react';

const defaultPrompt = "professional ID photo, wearing business clothes in an office, high quality, plain white background, front facing, head and shoulders shot, passport photo style, studio lighting, 4K, ultra HD";

export default function IdPhoto() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(defaultPrompt);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!sourceImage) {
      setError('请上传照片');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/id-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: sourceImage,
          prompt: prompt.trim() || defaultPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'ID photo generation failed');
      }

      setProcessedImage(data.output);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 图片上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          上传照片
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full"
        />
      </div>

      {/* 预览原图 */}
      {sourceImage && (
        <div className="aspect-square relative border rounded-lg overflow-hidden">
          <img
            src={sourceImage}
            alt="Source"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Prompt 输入 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          自定义提示词（可选）
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={defaultPrompt}
          className="w-full h-32 p-2 border rounded-lg resize-none"
        />
        <p className="text-xs text-gray-500">
          如果不填写，将使用默认提示词生成标准证件照
        </p>
      </div>

      {/* 处理按钮 */}
      {sourceImage && (
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className={`
            w-full py-2 px-4 rounded-lg
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'}
            text-white transition-colors
          `}
        >
          {isProcessing ? '处理中...' : '生成证件照'}
        </button>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {/* 处理结果 */}
      {processedImage && (
        <div className="relative aspect-square border rounded-lg overflow-hidden">
          <img
            src={processedImage}
            alt="Processed"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
} 