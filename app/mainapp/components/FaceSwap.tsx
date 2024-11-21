'use client';

import { useState } from 'react';

export default function FaceSwap() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (type: 'source' | 'face') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'source') {
          setSourceImage(reader.result as string);
        } else {
          setFaceImage(reader.result as string);
        }
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!sourceImage || !faceImage) {
      setError('请上传两张图片');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/face-swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_image: sourceImage,
          face_image: faceImage
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Face swap failed');
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 源图片上传 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上传要被换脸的图片
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload('source')}
              className="block w-full"
            />
          </div>
          {sourceImage && (
            <div className="aspect-square relative border rounded-lg overflow-hidden">
              <img
                src={sourceImage}
                alt="Source"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* 脸部图片上传 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上传新的脸部图片
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload('face')}
              className="block w-full"
            />
          </div>
          {faceImage && (
            <div className="aspect-square relative border rounded-lg overflow-hidden">
              <img
                src={faceImage}
                alt="Face"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* 处理按钮 */}
      {sourceImage && faceImage && (
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className={`
            w-full py-2 px-4 rounded-lg
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'}
            text-white transition-colors
          `}
        >
          {isProcessing ? '处理中...' : '开始换脸'}
        </button>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {/* 处理结果 */}
      {processedImage && (
        <div className="relative aspect-square border rounded-lg overflow-hidden">
          <img
            src={processedImage}
            alt="Processed"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
} 