import { NextResponse } from 'next/server';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

export async function POST(request: Request) {
  try {
    const { source_image, face_image } = await request.json();

    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
        input: {
          user_image: face_image,
          template_image: source_image
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Replicate API error:', error);
      throw new Error(error.detail || 'Failed to swap face');
    }

    const prediction = await response.json();
    console.log('Initial prediction:', prediction);

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
      throw new Error('Face swap processing failed');
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
    console.error('Face swap error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Face swap failed' 
      },
      { status: 500 }
    );
  }
} 