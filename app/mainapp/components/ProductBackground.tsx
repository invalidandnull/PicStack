'use client';

import { useState } from 'react';

interface BackgroundParams {
  pixel: string;
  scale: number;
  prompt: string;
  image_num: number;
  product_size: string;
  guidance_scale: number;
  negative_prompt: string;
  num_inference_steps: number;
}

const defaultParams: BackgroundParams = {
  pixel: "512 * 512",
  scale: 3,
  prompt: "",
  image_num: 1,
  product_size: "0.5 * width",
  guidance_scale: 7.5,
  negative_prompt: "illustration, 3d, sepia, painting, cartoons, sketch, (worst quality:2)",
  num_inference_steps: 20
};

export default function ProductBackground() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [params, setParams] = useState<BackgroundParams>(defaultParams);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImages([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !params.prompt.trim()) {
      setError('请上传产品图片并输入背景描述');
      return;
    }

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 产品图上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          上传产品图片（背景透明）
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full"
        />
      </div>

      {selectedImage && (
        <div className="aspect-square relative border rounded-lg overflow-hidden">
          <img
            src={selectedImage}
            alt="Product"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* 背景描述输入 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          背景描述
        </label>
        <textarea
          value={params.prompt}
          onChange={(e) => setParams({ ...params, prompt: e.target.value })}
          className="w-full h-32 p-2 border rounded-lg resize-none"
          placeholder="描述你想要的背景场景..."
        />
      </div>

      {/* 参数设置 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            生成数量
          </label>
          <select
            value={params.image_num}
            onChange={(e) => setParams({ ...params, image_num: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value={1}>1张</option>
            <option value={2}>2张</option>
            <option value={4}>4张</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            产品大小
          </label>
          <select
            value={params.product_size}
            onChange={(e) => setParams({ ...params, product_size: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="0.3 * width">小</option>
            <option value="0.5 * width">中</option>
            <option value="0.7 * width">大</option>
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
        disabled={isProcessing}
        className={`
          w-full py-2 px-4 rounded-lg
          ${isProcessing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'}
          text-white transition-colors
        `}
      >
        {isProcessing ? '生成中...' : '生成背景'}
      </button>

      {/* 错误提示 */}
      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {/* 生成结果 */}
      {generatedImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generatedImages.map((image, index) => (
            <div key={index} className="aspect-square relative border rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Generated ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 