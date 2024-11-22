'use client';

import { useState } from 'react';

interface FaceSceneParams {
  prompt: string;
  num_steps: number;
  style_name: string;
  num_outputs: number;
  guidance_scale: number;
  style_strength_ratio: number;
}

const defaultParams: FaceSceneParams = {
  prompt: '',
  num_steps: 50,
  style_name: 'Photographic (Default)',
  num_outputs: 1,
  guidance_scale: 5,
  style_strength_ratio: 20
};

const NEGATIVE_PROMPT = "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry";

export default function FaceScene() {
  const [faceImages, setFaceImages] = useState<string[]>([]);
  const [params, setParams] = useState<FaceSceneParams>(defaultParams);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      setError('最多只能上传3张图片');
      return;
    }

    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      setFaceImages(results);
      setProcessedImage(null);
    });
  };

  const handleProcess = async () => {
    if (faceImages.length === 0) {
      setError('请至少上传一张人脸图片');
      return;
    }

    if (!params.prompt.trim()) {
      setError('请输入场景描述');
      return;
    }

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
          negative_prompt: NEGATIVE_PROMPT,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setProcessedImage(data.output);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 图片上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          上传人脸图片（最多3张）
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="block w-full"
        />
        <p className="mt-1 text-sm text-gray-500">
          上传的图片越多，生成的效果越好
        </p>
      </div>

      {/* 预览上传的图片 */}
      {faceImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {faceImages.map((image, index) => (
            <div key={index} className="aspect-square relative border rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Face ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* 场景描述输入 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          场景描述
        </label>
        <textarea
          value={params.prompt}
          onChange={(e) => setParams({ ...params, prompt: e.target.value })}
          className="w-full h-32 p-2 border rounded-lg resize-none"
          placeholder="描述你想要生成的场景，例如：A photo of a scientist receiving the Nobel Prize"
        />
      </div>

      {/* 参数设置 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            生成步数
          </label>
          <input
            type="number"
            value={params.num_steps}
            onChange={(e) => setParams({ ...params, num_steps: parseInt(e.target.value) })}
            min="1"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            引导系数
          </label>
          <input
            type="number"
            value={params.guidance_scale}
            onChange={(e) => setParams({ ...params, guidance_scale: parseFloat(e.target.value) })}
            min="1"
            max="20"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            风格强度
          </label>
          <input
            type="number"
            value={params.style_strength_ratio}
            onChange={(e) => setParams({ ...params, style_strength_ratio: parseInt(e.target.value) })}
            min="1"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleProcess}
        disabled={isProcessing || faceImages.length === 0}
        className={`
          w-full py-2 px-4 rounded-lg
          ${isProcessing || faceImages.length === 0
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'}
          text-white transition-colors
        `}
      >
        {isProcessing ? '生成中...' : '开始生成'}
      </button>

      {/* 错误提示 */}
      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {/* 生成结果 */}
      {processedImage && (
        <div className="aspect-square relative border rounded-lg overflow-hidden">
          <img
            src={processedImage}
            alt="Generated Scene"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
} 