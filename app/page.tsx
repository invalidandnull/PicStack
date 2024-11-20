'use client';

import ImageProcessor from '@/app/components/features/ImageProcessor';
import { ImageProvider } from '@/app/context/ImageContext';

export default function Home() {
  return (
    <ImageProvider>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI 图片处理工具
            </h1>
            <p className="text-gray-600">
              一站式图片处理解决方案：去除背景、增强画质、老照片修复等
            </p>
          </header>
          
          <ImageProcessor />
        </div>
      </main>
    </ImageProvider>
  );
}
