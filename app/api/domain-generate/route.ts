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
        input: params
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Replicate API error:', error);
      throw new Error(error.detail || 'Failed to generate image');
    }

    const prediction = await response.json();
    console.log('Initial prediction:', prediction);

    // 轮询获取结果
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 20; // 60秒超时 (20次 * 3秒)

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 每3秒轮询一次
      
      // 使用相同的 URL 进行轮询
      const pollResponse = await fetch(REPLICATE_API_URL, {
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      if (!pollResponse.ok) {
        console.error('Polling error response:', pollResponse.status);
        break; // 遇到错误就退出轮询
      }

      result = await pollResponse.json();
      console.log('Polling attempt', attempts + 1, 'result:', result);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Generation timeout after 60 seconds');
    }

    if (result.status === 'failed') {
      throw new Error('Image generation failed');
    }

    if (!result.output) {
      throw new Error('No output received from API');
    }

    const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    return NextResponse.json({ 
      success: true,
      output: outputUrl
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