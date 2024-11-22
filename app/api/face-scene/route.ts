import { NextResponse } from 'next/server';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

export async function POST(request: Request) {
  try {
    const {
      prompt,
      num_steps,
      style_name,
      input_image,
      input_image2,
      input_image3,
      num_outputs,
      guidance_scale,
      negative_prompt,
      style_strength_ratio
    } = await request.json();

    // 创建请求体
    const requestBody: any = {
      version: "ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
      input: {
        prompt,
        num_steps,
        style_name,
        input_image,
        num_outputs,
        guidance_scale,
        negative_prompt,
        style_strength_ratio
      }
    };

    // 如果有额外的人脸图片，添加到请求中
    if (input_image2) {
      requestBody.input.input_image2 = input_image2;
    }
    if (input_image3) {
      requestBody.input.input_image3 = input_image3;
    }

    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Replicate API error:', error);
      throw new Error(error.detail || 'Failed to generate scene');
    }

    const prediction = await response.json();
    console.log('Initial prediction:', prediction);

    // 轮询获取结果
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 每3秒轮询一次
      const pollResponse = await fetch(`${REPLICATE_API_URL}/${prediction.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      });
      result = await pollResponse.json();
      console.log('Polling result:', result);
    }

    if (result.status === 'failed') {
      throw new Error('Scene generation failed');
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
    console.error('Scene generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Scene generation failed' 
      },
      { status: 500 }
    );
  }
} 