'use client';

import { useState } from 'react';

type ProcessingStyle = 'enhance' | 'remove-bg' | 'restore';

export default function ImageProcessor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ProcessingStyle>('enhance');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          style: selectedStyle,
        }),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Processing failed');
      }

      if (!data.output || typeof data.output !== 'string') {
        throw new Error('Invalid response format');
      }

      setProcessedImage(data.output);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const processingOptions = [
    { id: 'enhance' as const, label: '图片增强', description: '提升图片清晰度和质量' },
    { id: 'remove-bg' as const, label: '去除背景', description: '自动移除图片背景' },
    { id: 'restore' as const, label: '老照片修复', description: '修复和增强旧照片' },
  ];

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full"
      />

      {selectedImage && (
        <div className="space-y-4">
          <div className="aspect-square relative border rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {processingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedStyle(option.id)}
                className={`
                  p-4 rounded-lg border transition-all duration-200
                  ${selectedStyle === option.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-500'}
                `}
              >
                <h3 className="font-medium">{option.label}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </button>
            ))}
          </div>

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
            {isProcessing ? '处理中...' : '开始处理'}
          </button>
        </div>
      )}

      {processedImage && (
        <div className="aspect-square relative border rounded-lg overflow-hidden">
          <img
            src={processedImage}
            alt="Processed"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Image load error:', e);
              setError('Failed to load processed image');
            }}
          />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
} 