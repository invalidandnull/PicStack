'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { decrementCredits } from '@/lib/supabase';
import { useSession } from 'next-auth/react';

interface SceneParams {
  prompt: string;
  num_steps: number;
  style_name: string;
  num_outputs: number;
  guidance_scale: number;
  style_strength_ratio: number;
}

const defaultParams: SceneParams = {
  prompt: '',
  num_steps: 50,
  style_name: 'Photographic',
  num_outputs: 1,
  guidance_scale: 5,
  style_strength_ratio: 20
};

const styleOptions = [
  { id: 'photographic', label: 'Photographic', description: 'Realistic photo style' },
  { id: 'cinematic', label: 'Cinematic', description: 'Movie scene style' },
  { id: 'anime', label: 'Anime', description: 'Japanese animation style' },
  { id: 'fantasy', label: 'Fantasy', description: 'Magical and dreamy style' }
];

export default function FaceSceneComposer() {
  const [faceImages, setFaceImages] = useState<string[]>([]);
  const [params, setParams] = useState<SceneParams>(defaultParams);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
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
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      handleFiles(imageFiles.slice(0, 3)); // 最多处理3张图片
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files.slice(0, 3));
    }
  };

  const handleFiles = async (files: File[]) => {
    try {
      const imagePromises = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const images = await Promise.all(imagePromises);
      setFaceImages(images);
      setProcessedImage(null);
      setError(null);
    } catch (err) {
      console.error('File handling error:', err);
      setError('Failed to load images');
    }
  };

  const handleProcess = async () => {
    if (faceImages.length === 0) {
      setError('Please upload at least one face image');
      return;
    }

    if (!params.prompt.trim()) {
      setError('Please enter a scene description');
      return;
    }

    if (!user) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/face-scene', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          input_image: faceImages[0],
          input_image2: faceImages[1] || undefined,
          input_image3: faceImages[2] || undefined,
          negative_prompt: "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry"
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Scene generation failed');
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

  const handleDownload = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scene-${Date.now()}.png`;
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
      {faceImages.length === 0 && (
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
              ? "border-amber-500 bg-amber-50" 
              : "border-gray-300 hover:border-amber-500"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-amber-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">
            {isDragging ? 'Drop your face images here' : 'Drag & Drop your face images here'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            or click to select files (up to 3 images)
          </p>
          <p className="text-xs text-gray-400">
            Supports PNG, JPG, JPEG, WEBP
          </p>
        </div>
      )}

      {/* Main Content */}
      {faceImages.length > 0 && (
        <div className="space-y-6">
          {/* Face Images Preview */}
          <div className="grid grid-cols-3 gap-4">
            {faceImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative border rounded-xl overflow-hidden">
                  <img
                    src={image}
                    alt={`Face ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => {
                    const newImages = [...faceImages];
                    newImages.splice(index, 1);
                    setFaceImages(newImages);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {faceImages.length < 3 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center hover:border-amber-500 hover:bg-amber-50 transition-colors"
              >
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>

          {/* Scene Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Scene Description
            </label>
            <textarea
              value={params.prompt}
              onChange={(e) => setParams({ ...params, prompt: e.target.value })}
              placeholder="Describe the scene you want to generate..."
              className="w-full h-32 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Style Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Scene Style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {styleOptions.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setParams({ ...params, style_name: style.label })}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200 text-left",
                    params.style_name === style.label
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-amber-500"
                  )}
                >
                  <div className="text-sm font-medium">{style.label}</div>
                  <div className="text-xs text-gray-500">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Generation Steps ({params.num_steps})
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={params.num_steps}
                onChange={(e) => setParams({ ...params, num_steps: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Style Strength ({params.style_strength_ratio}%)
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={params.style_strength_ratio}
                onChange={(e) => setParams({ ...params, style_strength_ratio: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Process Button */}
          <div className="flex justify-center">
            <button
              onClick={handleProcess}
              disabled={isProcessing || !params.prompt.trim()}
              className={cn(
                "px-8 py-3 rounded-lg text-white transition-colors",
                isProcessing || !params.prompt.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700"
              )}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Generate Scene'
              )}
            </button>
          </div>

          {/* Result */}
          {processedImage && (
            <div className="space-y-4">
              <div className="relative group">
                <div className="aspect-square relative border rounded-xl overflow-hidden">
                  <img
                    src={processedImage}
                    alt="Generated Scene"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="absolute bottom-4 right-4 p-3 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          )}
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