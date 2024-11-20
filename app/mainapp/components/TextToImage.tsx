'use client';

import { useState } from 'react';

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

export default function TextToImage() {
  const [params, setParams] = useState<GenerationParams>(defaultParams);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!params.prompt.trim()) {
      setError('请输入提示词');
      return;
    }

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

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImage(data.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 提示词输入 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          提示词
        </label>
        <textarea
          value={params.prompt}
          onChange={(e) => setParams({ ...params, prompt: e.target.value })}
          className="w-full h-32 p-2 border rounded-lg resize-none"
          placeholder="描述你想要生成的图片..."
        />
      </div>

      {/* 参数设置 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            图片质量
          </label>
          <select
            value={params.megapixels}
            onChange={(e) => setParams({ ...params, megapixels: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="0.5">低质量</option>
            <option value="1">标准</option>
            <option value="2">高质量</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            宽高比
          </label>
          <select
            value={params.aspect_ratio}
            onChange={(e) => setParams({ ...params, aspect_ratio: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="1:1">正方形 (1:1)</option>
            <option value="4:3">横向 (4:3)</option>
            <option value="3:4">纵向 (3:4)</option>
            <option value="16:9">宽屏 (16:9)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            生成步数
          </label>
          <input
            type="number"
            value={params.num_inference_steps}
            onChange={(e) => setParams({ ...params, num_inference_steps: parseInt(e.target.value) })}
            min="1"
            max="50"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`
          w-full py-2 px-4 rounded-lg
          ${isGenerating 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'}
          text-white transition-colors
        `}
      >
        {isGenerating ? '生成中...' : '生成图片'}
      </button>

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