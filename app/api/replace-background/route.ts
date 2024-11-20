import { NextResponse } from 'next/server';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

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
        version: "b1c17d148455c1fda435ababe9ab1e03bc0d917cc3cf4251916f22c45c83c7df",
        input: {
          pixel: params.pixel,
          scale: params.scale,
          prompt: params.prompt,
          image_num: params.image_num,
          image_path: params.image_path,
          manual_seed: -1,
          product_size: params.product_size,
          guidance_scale: params.guidance_scale,
          negative_prompt: params.negative_prompt,
          num_inference_steps: params.num_inference_steps
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

    // 检查结果格式
    if (!result.output) {
      // 如果结果还在处理中，等待完成
      let prediction = result;
      while (prediction.status === 'processing' || prediction.status === 'starting') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const statusResponse = await fetch(`${REPLICATE_API_URL}/${prediction.id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          },
        });
        prediction = await statusResponse.json();
      }

      if (prediction.status === 'succeeded' && prediction.output) {
        return NextResponse.json({ 
          success: true,
          output: prediction.output
        });
      }
    }

    // 如果直接返回了输出
    if (result.output) {
      return NextResponse.json({ 
        success: true,
        output: result.output
      });
    }

    throw new Error('Failed to get valid output from API');
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Background generation failed' 
      },
      { status: 500 }
    );
  }
} 