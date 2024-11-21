'use client';

import ImageProcessor from './components/ImageProcessor';
import TextToImage from './components/TextToImage';
import ProductBackground from './components/ProductBackground';
import BlurBackground from './components/BlurBackground';
import FaceSwap from './components/FaceSwap';
import IdPhoto from './components/IdPhoto';

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

        <section>
          <h2 className="text-xl font-semibold mb-4">背景模糊</h2>
          <BlurBackground />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">AI 换脸</h2>
          <FaceSwap />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">AI 证件照</h2>
          <IdPhoto />
        </section>
      </div>
    </div>
  );
}