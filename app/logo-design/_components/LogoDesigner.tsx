'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface GenerationParams {
  prompt: string;
  go_fast: boolean;
  megapixels: string;
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
  output_quality: number;
  num_inference_steps: number;
}

const defaultParams: GenerationParams = {
  prompt: '',
  go_fast: true,
  megapixels: "1",
  num_outputs: 1,
  aspect_ratio: "1:1",
  output_format: "png",
  output_quality: 90,
  num_inference_steps: 4
};

const styleOptions = [
  { id: 'minimal', label: 'Minimal', description: 'Clean and simple design', basePrompt: 'minimalist logo design, clean lines, simple shapes, professional, modern, scalable, vector style' },
  { id: 'modern', label: 'Modern', description: 'Contemporary and trendy', basePrompt: 'modern logo design, trendy, dynamic, bold, contemporary, professional branding' },
  { id: 'vintage', label: 'Vintage', description: 'Classic retro style', basePrompt: 'vintage logo design, retro style, classic, timeless, handcrafted feel, traditional' },
  { id: 'geometric', label: 'Geometric', description: 'Based on shapes', basePrompt: 'geometric logo design, abstract shapes, mathematical precision, clean angles, modern minimalism' },
  { id: 'playful', label: 'Playful', description: 'Fun and creative', basePrompt: 'playful logo design, fun, creative, friendly, approachable, colorful branding' },
  { id: 'luxury', label: 'Luxury', description: 'Elegant and premium', basePrompt: 'luxury logo design, elegant, premium, sophisticated, high-end branding, gold accents' },
  { id: 'tech', label: 'Tech', description: 'Technology focused', basePrompt: 'tech logo design, futuristic, innovative, digital, modern technology branding' },
  { id: 'organic', label: 'Organic', description: 'Natural and flowing', basePrompt: 'organic logo design, natural forms, flowing lines, eco-friendly, sustainable branding' }
];

export default function LogoDesigner() {
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<typeof styleOptions[0] | null>(null);
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!brandName.trim()) {
      setError('Please enter your brand name');
      return;
    }

    if (!selectedStyle) {
      setError('Please select a logo style');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 构建完整的提示词
      const fullPrompt = `${selectedStyle.basePrompt}, brand name: "${brandName}"${description ? `, ${description}` : ''}, logo design, branding, high quality, professional, commercial use, white background`;

      const response = await fetch('/api/domain-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...defaultParams,
          prompt: fullPrompt,
          num_outputs: 4 // 生成多个选项
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Logo generation failed');
      }

      setGeneratedLogos(Array.isArray(data.output) ? data.output : [data.output]);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download logo');
    }
  };

  return (
    <div className="space-y-8">
      {/* Brand Info */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Brand Name
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Enter your brand name"
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your brand or any specific requirements..."
            className="w-full h-32 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Style Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Logo Style
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {styleOptions.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style)}
              className={cn(
                "p-4 rounded-lg border transition-all duration-200 text-left",
                selectedStyle?.id === style.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-500"
              )}
            >
              <div className="text-sm font-medium">{style.label}</div>
              <div className="text-xs text-gray-500">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !brandName.trim() || !selectedStyle}
          className={cn(
            "px-8 py-3 rounded-lg text-white transition-colors",
            isGenerating || !brandName.trim() || !selectedStyle
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </div>
          ) : (
            'Generate Logos'
          )}
        </button>
      </div>

      {/* Generated Logos */}
      {generatedLogos.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {generatedLogos.map((logo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative border rounded-xl overflow-hidden bg-white">
                <img
                  src={logo}
                  alt={`${brandName} Logo ${index + 1}`}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <button
                onClick={() => handleDownload(logo, index)}
                className="absolute bottom-4 right-4 p-3 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          ))}
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