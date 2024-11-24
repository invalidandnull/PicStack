'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface StyleOption {
  id: string;
  label: string;
  category: string;
  prompt: string;
}

const styleOptions: StyleOption[] = [
  // 动漫/卡通风格
  {
    id: 'anime',
    label: 'Anime',
    category: 'Animation',
    prompt: 'portrait, anime style, Japanese animation, cel shading, vibrant colors, clean lines, expressive eyes'
  },
  {
    id: 'manga',
    label: 'Manga',
    category: 'Animation',
    prompt: 'portrait, manga style, black and white, strong inks, dynamic shading, speed lines, dramatic composition'
  },
  {
    id: 'pixel',
    label: 'Pixel Art',
    category: 'Animation',
    prompt: 'portrait, pixel art style, 8-bit graphics, limited color palette, blocky shapes, retro gaming aesthetic'
  },
  // 绘画风格
  {
    id: 'oil',
    label: 'Oil Painting',
    category: 'Painting',
    prompt: 'portrait, oil painting, thick brushstrokes, rich textures, layered colors, canvas texture, classical painting technique'
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    category: 'Painting',
    prompt: 'portrait, watercolor painting, soft edges, transparent layers, flowing colors, paper texture, gentle washes'
  },
  {
    id: 'pencil',
    label: 'Pencil Sketch',
    category: 'Painting',
    prompt: 'portrait, pencil sketch, graphite drawing, detailed shading, precise lines, artistic hatching, tonal values'
  },
  // 摄影风格
  {
    id: 'vintage',
    label: 'Vintage',
    category: 'Photography',
    prompt: 'portrait, vintage photography, film grain, faded colors, light leaks, nostalgic atmosphere, analog look'
  },
  {
    id: 'blackwhite',
    label: 'Black & White',
    category: 'Photography',
    prompt: 'portrait, black and white photography, high contrast, rich tonal range, dramatic shadows, timeless quality'
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    category: 'Photography',
    prompt: 'portrait, cinematic photography, dramatic lighting, movie still, professional color grading, widescreen composition'
  },
  // 艺术风格
  {
    id: 'impressionist',
    label: 'Impressionist',
    category: 'Art',
    prompt: 'portrait, impressionist painting, loose brushwork, light effects, atmospheric quality, vibrant colors'
  },
  {
    id: 'surreal',
    label: 'Surrealist',
    category: 'Art',
    prompt: 'portrait, surrealist art, dreamlike imagery, impossible combinations, psychological depth, symbolic elements'
  },
  {
    id: 'popart',
    label: 'Pop Art',
    category: 'Art',
    prompt: 'portrait, pop art style, bold colors, halftone dots, comic book aesthetic, Andy Warhol inspired'
  }
];

export default function StyleTransfer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
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

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File handling error:', err);
      setError('Failed to load image');
    }
  };

  const handleProcess = async () => {
    if (!selectedImage || !selectedStyle) {
      setError('Please select an image and style');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/style-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          prompt: selectedStyle.prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Style transfer failed');
      }

      setProcessedImage(data.output);
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
      a.download = `styled-${selectedStyle?.id}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  // 按类别分组样式选项
  const groupedStyles = styleOptions.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = [];
    }
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, StyleOption[]>);

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
              ? "border-pink-500 bg-pink-50" 
              : "border-gray-300 hover:border-pink-500"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-pink-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          {/* Image Preview */}
          <div className="aspect-square relative border rounded-xl overflow-hidden">
            <img
              src={selectedImage}
              alt="Original"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                setProcessedImage(null);
                setSelectedStyle(null);
              }}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Style Selection */}
          <div className="space-y-6">
            {Object.entries(groupedStyles).map(([category, styles]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-medium">{category} Styles</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-200 text-left",
                        selectedStyle?.id === style.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-500"
                      )}
                    >
                      <div className="text-sm font-medium">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Process Button */}
          <div className="flex justify-center">
            <button
              onClick={handleProcess}
              disabled={isProcessing || !selectedStyle}
              className={cn(
                "px-8 py-3 rounded-lg text-white transition-colors",
                isProcessing || !selectedStyle
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700"
              )}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Apply Style'
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
                    alt="Styled"
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