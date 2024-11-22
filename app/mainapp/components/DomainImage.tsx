'use client';

import { useState } from 'react';
import { domainConfigs, DomainConfig } from '@/app/config/domainConfigs';

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
  megapixels: '1',
  num_outputs: 1,
  aspect_ratio: '1:1',
  output_format: 'webp',
  output_quality: 80,
  num_inference_steps: 4
};

export default function DomainImage() {
  const [selectedDomain, setSelectedDomain] = useState<DomainConfig | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedDomain || !userPrompt.trim()) {
      setError('请选择领域并输入描述');
      return;
    }

    setIsGenerating(true);
    setError(null);

    // 组合提示词
    const fullPrompt = `${selectedDomain.basePrompt}, ${userPrompt}`;

    try {
      const response = await fetch('/api/domain-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...defaultParams,
          prompt: fullPrompt,
          aspect_ratio: selectedDomain.aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImage(data.output);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 领域选择 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {domainConfigs.map((domain) => (
          <button
            key={domain.id}
            onClick={() => setSelectedDomain(domain)}
            className={`
              p-4 rounded-lg border transition-all duration-200
              ${selectedDomain?.id === domain.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-500'}
            `}
          >
            <div className="text-2xl mb-2">{domain.icon}</div>
            <div className="text-sm font-medium">{domain.label}</div>
            <div className="text-xs text-gray-500">{domain.description}</div>
          </button>
        ))}
      </div>

      {/* 提示词输入 */}
      {selectedDomain && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              描述你想要的{selectedDomain.label}
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full h-32 p-2 border rounded-lg resize-none"
              placeholder={`请描述你想要的${selectedDomain.label}内容...`}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !userPrompt.trim()}
            className={`
              w-full py-2 px-4 rounded-lg
              ${isGenerating || !userPrompt.trim()
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'}
              text-white transition-colors
            `}
          >
            {isGenerating ? '生成中...' : '开始生成'}
          </button>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {/* 生成结果 */}
      {generatedImage && (
        <div className="aspect-square relative border rounded-lg overflow-hidden">
          <img
            src={generatedImage}
            alt="Generated"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
} 