'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { decrementCredits } from '@/lib/supabase';
import { useSession } from 'next-auth/react';

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
  prompt: "",
  go_fast: true,
  megapixels: "1",
  num_outputs: 1,
  aspect_ratio: "1:1",
  output_format: "webp",
  output_quality: 80,
  num_inference_steps: 4
};

const aspectRatios = [
  { value: "1:1", label: "Square", description: "Perfect for social media posts" },
  { value: "3:2", label: "Landscape", description: "Ideal for scenic photos" },
  { value: "2:3", label: "Portrait", description: "Great for mobile wallpapers" },
  { value: "16:9", label: "Widescreen", description: "Best for desktop wallpapers" }
];

const qualityLevels = [
  { value: "0.5", label: "Draft", description: "Quick generation, lower quality" },
  { value: "1", label: "Standard", description: "Balanced quality and speed" },
  { value: "2", label: "HD", description: "High quality, slower generation" }
];

export default function ImageGenerator() {
  const [params, setParams] = useState<GenerationParams>(defaultParams);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession()
  const user = session?.user

  const handleGenerate = async () => {
    if (!params.prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    if (!user) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImages(Array.isArray(data.output) ? data.output : [data.output]);
      decrementCredits(user.email)
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Prompt Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Image Description
        </label>
        <textarea
          value={params.prompt}
          onChange={(e) => setParams({ ...params, prompt: e.target.value })}
          placeholder="Describe the image you want to generate..."
          className="w-full h-32 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
        {/* Aspect Ratio */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-2 gap-3">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setParams({ ...params, aspect_ratio: ratio.value })}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200 text-left",
                  params.aspect_ratio === ratio.value
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-cyan-500"
                )}
              >
                <div className="text-sm font-medium">{ratio.label}</div>
                <div className="text-xs text-gray-500">{ratio.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Settings */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Quality Level
          </label>
          <div className="grid grid-cols-1 gap-3">
            {qualityLevels.map((quality) => (
              <button
                key={quality.value}
                onClick={() => setParams({ ...params, megapixels: quality.value })}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200 text-left",
                  params.megapixels === quality.value
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-cyan-500"
                )}
              >
                <div className="text-sm font-medium">{quality.label}</div>
                <div className="text-xs text-gray-500">{quality.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="col-span-full space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Generation Steps
            </label>
            <span className="text-sm text-gray-500">{params.num_inference_steps}</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={params.num_inference_steps}
            onChange={(e) => setParams({ ...params, num_inference_steps: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Faster</span>
            <span>Better Quality</span>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !params.prompt.trim()}
          className={cn(
            "px-8 py-3 rounded-lg text-white transition-colors",
            isGenerating || !params.prompt.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cyan-600 hover:bg-cyan-700"
          )}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </div>
          ) : (
            'Generate Image'
          )}
        </button>
      </div>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generatedImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative border rounded-xl overflow-hidden">
                <img
                  src={image}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <a
                href={image}
                download={`generated-${index + 1}.png`}
                className="absolute bottom-4 right-4 p-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
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