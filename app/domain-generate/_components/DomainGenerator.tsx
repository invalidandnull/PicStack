'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { domainConfigs } from '@/app/config/domainConfigs';

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

// 按类别分组配置
const groupedDomains = domainConfigs.reduce((acc, domain) => {
  const category = domain.id.includes('logo') ? 'Logo Design' :
                  domain.id.includes('social') ? 'Social Media' :
                  domain.id.includes('art') ? 'Art & Illustration' :
                  domain.id.includes('pattern') ? 'Patterns & Textures' :
                  'Other Designs';
  
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(domain);
  return acc;
}, {} as Record<string, typeof domainConfigs>);

export default function DomainGenerator() {
  const [selectedDomain, setSelectedDomain] = useState(domainConfigs[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!customPrompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 构建完整的提示词
      const fullPrompt = `${selectedDomain.basePrompt}, ${customPrompt}`;

      const response = await fetch('/api/domain-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...defaultParams,
          prompt: fullPrompt,
          aspect_ratio: selectedDomain.aspectRatio,
          num_outputs: 4 // 生成多个选项
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImages(Array.isArray(data.output) ? data.output : [data.output]);
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
      a.download = `${selectedDomain.id}-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  return (
    <div className="space-y-8">
      {/* Domain Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Design Domain
        </label>
        <div className="space-y-6">
          {Object.entries(groupedDomains).map(([category, domains]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain)}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-200 text-left",
                      selectedDomain.id === domain.id
                        ? "border-fuchsia-500 bg-fuchsia-50"
                        : "border-gray-200 hover:border-fuchsia-500"
                    )}
                  >
                    <div className="text-2xl mb-2">{domain.icon}</div>
                    <div className="text-sm font-medium">{domain.label}</div>
                    <div className="text-xs text-gray-500">{domain.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder={`Describe your ${selectedDomain.label.toLowerCase()}...`}
          className="w-full h-32 p-4 border rounded-xl resize-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
        />
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !customPrompt.trim()}
          className={cn(
            "px-8 py-3 rounded-lg text-white transition-colors",
            isGenerating || !customPrompt.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-fuchsia-600 hover:bg-fuchsia-700"
          )}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </div>
          ) : (
            'Generate Designs'
          )}
        </button>
      </div>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {generatedImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative border rounded-xl overflow-hidden bg-white">
                <img
                  src={image}
                  alt={`Generated ${selectedDomain.label} ${index + 1}`}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <button
                onClick={() => handleDownload(image, index)}
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