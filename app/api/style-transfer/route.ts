import { NextResponse } from 'next/server';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

export async function POST(request: Request) {
  try {
    const { image, prompt } = await request.json();

    console.log('Starting style transfer with prompt:', prompt);

    // 创建预测请求
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0",
        input: {
          prompt: prompt,
          cfg_scale: 1.2,
          num_steps: 4,
          image_width: 768,
          num_samples: 1,
          image_height: 768,
          output_format: "png",
          identity_scale: 0.8,
          mix_identities: false,
          output_quality: 80,
          generation_mode: "fidelity",
          main_face_image: image,
          negative_prompt: "flaws in the eyes, flaws in the face, flaws, lowres, non-HDRi, low quality, worst quality, artifacts noise, text, watermark, glitch, deformed, mutated, ugly, disfigured"
        }
      })
    });

    const responseData = await response.json();
    console.log('Initial API response:', responseData);

    if (!response.ok) {
      console.error('API error response:', responseData);
      throw new Error(responseData.detail || 'Failed to start style transfer');
    }

    // 轮询获取结果
    let result = responseData;
    let attempts = 0;
    const maxAttempts = 60; // 最多等待60秒

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}, status: ${result.status}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pollResponse = await fetch(`${REPLICATE_API_URL}/${responseData.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      if (!pollResponse.ok) {
        const pollError = await pollResponse.json();
        console.error('Polling error:', pollError);
        throw new Error('Failed to check processing status');
      }

      result = await pollResponse.json();
      attempts++;
    }

    console.log('Final result:', result);

    if (result.status === 'failed') {
      console.error('Processing failed:', result.error);
      throw new Error(result.error || 'Style transfer processing failed');
    }

    if (attempts >= maxAttempts) {
      throw new Error('Processing timeout');
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
    console.error('Style transfer error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Style transfer failed' 
      },
      { status: 500 }
    );
  }
} 