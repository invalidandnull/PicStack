'use client';

import { useState } from 'react';

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
    label: '日系动画',
    category: '动漫/卡通风格',
    prompt: 'portrait, anime style, Japanese animation, cel shading, vibrant colors, clean lines, expressive eyes'
  },
  {
    id: 'manga',
    label: '漫画',
    category: '动漫/卡通风格',
    prompt: 'portrait, manga style, black and white, strong inks, dynamic shading, speed lines, dramatic composition'
  },
  {
    id: 'pixel',
    label: '像素',
    category: '动漫/卡通风格',
    prompt: 'portrait, pixel art style, 8-bit graphics, limited color palette, blocky shapes, retro gaming aesthetic'
  },
  {
    id: 'handdrawn',
    label: '手绘',
    category: '动漫/卡通风格',
    prompt: 'portrait, hand-drawn animation style, sketchy lines, organic textures, natural imperfections, flowing movement'
  },
  // 绘画风格
  {
    id: 'oil',
    label: '油画',
    category: '绘画风格',
    prompt: 'portrait, oil painting, thick brushstrokes, rich textures, layered colors, canvas texture, classical painting technique'
  },
  {
    id: 'watercolor',
    label: '水彩',
    category: '绘画风格',
    prompt: 'portrait, watercolor painting, soft edges, transparent layers, flowing colors, paper texture, gentle washes'
  },
  {
    id: 'pencil',
    label: '素描',
    category: '绘画风格',
    prompt: 'portrait, pencil sketch, graphite drawing, detailed shading, precise lines, artistic hatching, tonal values'
  },
  {
    id: 'chalk',
    label: '粉笔画',
    category: '绘画风格',
    prompt: 'portrait, chalk drawing, pastel colors, soft textures, dusty effect, blackboard texture, ephemeral quality'
  },
  // 摄影风格
  {
    id: 'vintage',
    label: '复古',
    category: '摄影风格',
    prompt: 'portrait, vintage photography, film grain, faded colors, light leaks, nostalgic atmosphere, analog look'
  },
  {
    id: 'macro',
    label: '微距',
    category: '摄影风格',
    prompt: 'portrait, macro photography, extreme close-up, sharp details, shallow depth of field, textural focus'
  },
  {
    id: 'blackwhite',
    label: '黑白',
    category: '摄影风格',
    prompt: 'portrait, black and white photography, high contrast, rich tonal range, dramatic shadows, timeless quality'
  },
  {
    id: 'highcontrast',
    label: '高对比度',
    category: '摄影风格',
    prompt: 'portrait, high contrast photography, deep blacks, bright highlights, dramatic lighting, bold composition'
  },
  // 材质风格
  {
    id: 'ceramic',
    label: '陶瓷',
    category: '材质风格',
    prompt: 'portrait, clay texture, glazed surface, smooth finish, delicate patterns, porcelain quality, cute'
  },
  {
    id: 'wood',
    label: '木质',
    category: '材质风格',
    prompt: 'portrait, wood texture, natural grain patterns, warm tones, organic texture, rustic finish'
  },
  {
    id: 'metal',
    label: '金属',
    category: '材质风格',
    prompt: 'portrait, metallic surface, reflective finish, industrial texture, chrome effect, sleek appearance'
  },
  {
    id: 'fabric',
    label: '织物',
    category: '材质风格',
    prompt: 'portrait, fabric texture, woven patterns, soft material, textile details, tactile quality'
  },
  // 抽象风格
  {
    id: 'geometric',
    label: '几何',
    category: '抽象风格',
    prompt: 'portrait, geometric abstraction, bold shapes, clean lines, mathematical precision, modern composition'
  },
  {
    id: 'dynamic',
    label: '张力',
    category: '抽象风格',
    prompt: 'portrait, dynamic abstraction, explosive energy, bold movement, intense colors, powerful composition'
  },
  {
    id: 'impressionist',
    label: '印象派',
    category: '抽象风格',
    prompt: 'portrait, impressionist painting, loose brushwork, light effects, atmospheric quality, vibrant colors'
  },
  {
    id: 'surreal',
    label: '超现实',
    category: '抽象风格',
    prompt: 'portrait, surrealist art, dreamlike imagery, impossible combinations, psychological depth, symbolic elements'
  }
];

export default function StyleTransfer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage || !selectedStyle) {
      setError('请上传图片并选择风格');
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

  // 按类别分组样式选项
  const groupedStyles = styleOptions.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = [];
    }
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, StyleOption[]>);

  return (
    <div className="space-y-6">
      {/* 图片上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          上传图片
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full"
        />
      </div>

      {/* 预览原图 */}
      {selectedImage && (
        <div className="aspect-square relative border rounded-lg overflow-hidden">
          <img
            src={selectedImage}
            alt="Original"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* 风格选择 */}
      {selectedImage && (
        <div className="space-y-6">
          <label className="block text-sm font-medium text-gray-700">
            选择目标风格
          </label>
          {Object.entries(groupedStyles).map(([category, styles]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`
                      p-4 rounded-lg border transition-all duration-200
                      ${selectedStyle?.id === style.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-500'}
                    `}
                  >
                    <div className="text-sm font-medium">{style.label}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* 处理按钮 */}
          <button
            onClick={handleProcess}
            disabled={isProcessing || !selectedStyle}
            className={`
              w-full py-2 px-4 rounded-lg
              ${(isProcessing || !selectedStyle)
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'}
              text-white transition-colors
            `}
          >
            {isProcessing ? '处理中...' : '开始转换'}
          </button>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {/* 处理结果 */}
      {processedImage && (
        <div className="aspect-square relative border rounded-lg overflow-hidden">
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