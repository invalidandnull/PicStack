'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { decrementCredits } from '@/lib/supabase';
import { useSession } from 'next-auth/react';

interface EnhanceParams {
  scale: number;
  face_enhance: boolean;
}

const defaultParams: EnhanceParams = {
  scale: 2,
  face_enhance: false
};

export default function ImageEnhancer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [params, setParams] = useState<EnhanceParams>(defaultParams);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession()
  const user = session?.user

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
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = async () => {
    if (!selectedImage) return;
    if (!user) return;

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
          style: 'enhance',
          params
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Processing failed');
      }

      setProcessedImage(data.output);
      decrementCredits(user.email)
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
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
              ? "border-orange-500 bg-orange-50" 
              : "border-gray-300 hover:border-orange-500"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-orange-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                {processedImage ? 'Enhanced Image' : 'Result Preview'}
              </h3>
              <div className="aspect-square relative border rounded-xl overflow-hidden">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Preview will appear here
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhancement Options */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Upscale Factor
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[2, 3, 4].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setParams({ ...params, scale })}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-200",
                      params.scale === scale 
                        ? "border-orange-500 bg-orange-50" 
                        : "border-gray-200 hover:border-orange-500"
                    )}
                  >
                    <div className="text-sm font-medium">{scale}x</div>
                    <div className="text-xs text-gray-500">Upscale</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="face-enhance"
                checked={params.face_enhance}
                onChange={(e) => setParams({ ...params, face_enhance: e.target.checked })}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="face-enhance" className="text-sm font-medium text-gray-700">
                Face Enhancement
              </label>
            </div>
          </div>

          {/* Process Button */}
          <div className="flex justify-center">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className={cn(
                "px-8 py-3 rounded-lg text-white transition-colors",
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              )}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Enhance Image'
              )}
            </button>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setSelectedImage(null);
                setProcessedImage(null);
                setParams(defaultParams);
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