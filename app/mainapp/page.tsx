'use client';

import ImageProcessor from './components/ImageProcessor';
import TextToImage from './components/TextToImage';
import ProductBackground from './components/ProductBackground';

export default function MainApp() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">AI 图片工具</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4">图片处理</h2>
          <ImageProcessor />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">AI 文生图</h2>
          <TextToImage />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">产品背景替换</h2>
          <ProductBackground />
        </section>
      </div>
    </div>
  );
}