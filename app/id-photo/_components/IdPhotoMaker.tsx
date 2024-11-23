'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PhotoSize {
  id: string;
  label: string;
  size: string;
  description: string;
}

const photoSizes: PhotoSize[] = [
  { id: 'passport', label: 'Passport', size: '35x45mm', description: 'Standard passport photo' },
  { id: 'visa', label: 'Visa', size: '2x2inch', description: 'US visa photo' },
  { id: 'id-card', label: 'ID Card', size: '22x32mm', description: 'National ID card' },
  { id: 'driving', label: 'Driving License', size: '25x35mm', description: 'Driving license photo' },
  { id: 'resume', label: 'Resume', size: '1x1inch', description: 'Professional headshot' },
  { id: 'custom', label: 'Custom', size: 'Custom', description: 'Custom size photo' }
];

const defaultPrompt = "professional ID photo, wearing business clothes in an office, high quality, plain white background, front facing, head and shoulders shot, passport photo style, studio lighting, 4K, ultra HD";

export default function IdPhotoMaker() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<PhotoSize>(photoSizes[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/id-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          prompt: defaultPrompt,
          scale: 0.6,
          num_outputs: 1,
          negative_prompt: "blurry, deformed, distorted, disfigured, low quality, cartoon, anime, illustration",
          num_inference_steps: 30,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Processing failed');
      }

      const outputUrl = Array.isArray(data.output) ? data.output[0] : data.output;
      setProcessedImage(outputUrl);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `id-photo-${selectedSize.id}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download image');
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
              ? "border-rose-500 bg-rose-50" 
              : "border-gray-300 hover:border-rose-500"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-rose-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">
            {isDragging ? 'Drop your photo here' : 'Drag & Drop your photo here'}
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
              <h3 className="text-sm font-medium text-gray-700">Original Photo</h3>
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
                {processedImage ? 'ID Photo' : 'Result Preview'}
              </h3>
              <div className="aspect-square relative border rounded-xl overflow-hidden bg-gray-50">
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

          {/* Photo Size Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Photo Size
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photoSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200",
                    selectedSize.id === size.id 
                      ? "border-rose-500 bg-rose-50" 
                      : "border-gray-200 hover:border-rose-500"
                  )}
                >
                  <div className="text-sm font-medium">{size.label}</div>
                  <div className="text-xs text-gray-500">{size.size}</div>
                  <div className="text-xs text-gray-400 mt-1">{size.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4">
            {/* Process Button */}
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className={cn(
                "w-full max-w-md px-8 py-3 rounded-lg text-white transition-colors",
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-rose-600 hover:bg-rose-700"
              )}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Generate ID Photo'
              )}
            </button>

            {/* Download Button */}
            {processedImage && (
              <button
                onClick={handleDownload}
                className="w-full max-w-md px-8 py-3 rounded-lg border border-rose-600 text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Download Photo
              </button>
            )}

            {/* Reset Button */}
            <button
              onClick={() => {
                setSelectedImage(null);
                setProcessedImage(null);
                setError(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Upload another photo
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