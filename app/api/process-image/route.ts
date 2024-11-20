import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const MODELS = {
  enhance: {
    version: "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
    options: {
      scale: 2,
      face_enhance: false
    }
  },
  'remove-bg': {
    version: "da7d45f3b836795f945f221fc0b01a6d3ab7f5e163f13208948ad436001e2255",
    options: {}
  },
  restore: {
    version: "0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
    options: {
      scale: 2,
      face_enhance: true
    }
  }
};

export async function POST(request: Request) {
  try {
    const { image, style } = await request.json();

    if (!MODELS[style as keyof typeof MODELS]) {
      throw new Error('Unsupported processing style');
    }

    const model = MODELS[style as keyof typeof MODELS];

    // 创建预测任务
    const prediction = await replicate.predictions.create({
      version: model.version,
      input: {
        image: image,
        img: image,
        ...model.options
      }
    });

    // 等待处理完成
    let result = await replicate.predictions.get(prediction.id);
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    console.log('Replicate result:', result);

    if (result.status === 'failed' || !result.output) {
      throw new Error('Processing failed');
    }

    // 获取输出 URL
    const outputUrl = result.output;

    return NextResponse.json({ 
      success: true,
      output: outputUrl 
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Image processing failed' 
      },
      { status: 500 }
    );
  }
} 