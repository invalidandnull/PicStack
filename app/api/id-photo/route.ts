import { NextResponse } from 'next/server';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

export async function POST(request: Request) {
  try {
    const { image, prompt } = await request.json();

    // 创建预测请求
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "226c6bf67a75a129b0f978e518fed33e1fb13956e15761c1ac53c9d2f898c9af",
        input: {
          prompt: prompt,
          image: image,
          scale: 0.6,
          num_outputs: 1,
          negative_prompt: "blurry, deformed, distorted, disfigured, low quality, cartoon, anime, illustration",
          num_inference_steps: 30,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Replicate API error:', error);
      throw new Error(error.detail || 'Failed to generate ID photo');
    }

    const prediction = await response.json();
    console.log('Initial prediction:', prediction);

    // 轮询获取结果
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pollResponse = await fetch(`${REPLICATE_API_URL}/${prediction.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      });
      result = await pollResponse.json();
      console.log('Polling result:', result);
    }

    if (result.status === 'failed') {
      throw new Error('ID photo generation failed');
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
    console.error('ID photo error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'ID photo generation failed' 
      },
      { status: 500 }
    );
  }
} 