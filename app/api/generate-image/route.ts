import { NextResponse } from 'next/server';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions';

export async function POST(request: Request) {
  try {
    const params = await request.json();

    // 创建预测请求
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        input: {
          prompt: params.prompt,
          go_fast: true,
          megapixels: params.megapixels || "1",
          num_outputs: 1,
          aspect_ratio: params.aspect_ratio || "1:1",
          output_format: "png",
          output_quality: params.output_quality || 80,
          num_inference_steps: params.num_inference_steps || 4
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Replicate API error:', error);
      throw new Error(error.detail || 'Failed to generate image');
    }

    const result = await response.json();
    console.log('Generation result:', result);

    // 获取输出 URL
    if (!result.output || !Array.isArray(result.output) || !result.output[0]) {
      throw new Error('Invalid output from API');
    }

    return NextResponse.json({ 
      success: true,
      output: result.output[0]
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Image generation failed' 
      },
      { status: 500 }
    );
  }
} 