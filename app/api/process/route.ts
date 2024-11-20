import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { imageUrl, style } = await request.json();

    let output;
    switch (style) {
      case 'remove-bg':
        output = await replicate.run(
          "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
          {
            input: {
              image: imageUrl,
            },
          }
        );
        break;
      case 'enhance':
        output = await replicate.run(
          "tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
          {
            input: {
              image: imageUrl,
              scale: 2,
              face_enhance: true,
            },
          }
        );
        break;
      // 添加其他处理方法...
      default:
        throw new Error('Unsupported style');
    }

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    );
  }
} 