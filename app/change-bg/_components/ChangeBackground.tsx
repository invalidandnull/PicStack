'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { decrementCredits } from '@/lib/supabase';
import { useSession } from 'next-auth/react';

interface BackgroundParams {
  prompt: string;
  image_num: number;
  product_size: string;
  guidance_scale: number;
  negative_prompt: string;
  num_inference_steps: number;
}

const defaultParams: BackgroundParams = {
  prompt: "",
  image_num: 1,
  product_size: "0.5 * width",
  guidance_scale: 7.5,
  negative_prompt: "illustration, 3d, sepia, painting, cartoons, sketch, (worst quality:2)",
  num_inference_steps: 20
};

export default function ChangeBackground() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [params, setParams] = useState<BackgroundParams>(defaultParams);
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
      setGeneratedImages([]);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedImage || !params.prompt.trim()) {
      setError('Please upload an image and enter background description');
      return;
    }
    if (!user) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/replace-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          image_path: selectedImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImages(Array.isArray(data.output) ? data.output : [data.output]);
      decrementCredits(user.email)
    } catch (err) {
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
              ? "border-purple-500 bg-purple-50" 
              : "border-gray-300 hover:border-purple-500"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-purple-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">
            {isDragging ? 'Drop your product image here' : 'Drag & Drop your product image here'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            or click to select file
          </p>
          <p className="text-xs text-gray-400">
            Supports PNG, JPG, JPEG, WEBP (Transparent background recommended)
          </p>
        </div>
      )}

      {/* Main Content */}
      {selectedImage && (
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="aspect-square relative border rounded-xl overflow-hidden bg-[url('/checkered-pattern.png')]">
            <img
              src={selectedImage}
              alt="Product"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Background Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Background Description
            </label>
            <textarea
              value={params.prompt}
              onChange={(e) => setParams({ ...params, prompt: e.target.value })}
              className="w-full h-32 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe the background you want to generate..."
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Number of Variations
              </label>
              <select
                value={params.image_num}
                onChange={(e) => setParams({ ...params, image_num: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={1}>1 Image</option>
                <option value={2}>2 Images</option>
                <option value={4}>4 Images</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Product Size
              </label>
              <select
                value={params.product_size}
                onChange={(e) => setParams({ ...params, product_size: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="0.3 * width">Small</option>
                <option value="0.5 * width">Medium</option>
                <option value="0.7 * width">Large</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quality Steps
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={params.num_inference_steps}
                onChange={(e) => setParams({ ...params, num_inference_steps: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Fast</span>
                <span>{params.num_inference_steps}</span>
                <span>Best</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className={cn(
                "px-8 py-3 rounded-lg text-white transition-colors",
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              )}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                'Generate Backgrounds'
              )}
            </button>
          </div>

          {/* Results Grid */}
          {generatedImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="aspect-square relative border rounded-xl overflow-hidden">
                  <img
                    src={image}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <a
                    href={image}
                    download={`background-${index + 1}.png`}
                    className="absolute bottom-4 right-4 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Reset Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setSelectedImage(null);
                setGeneratedImages([]);
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