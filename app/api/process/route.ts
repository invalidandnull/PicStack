import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 将 base64 转换为可访问的 URL
async function uploadBase64Image(base64String: string): Promise<string> {
  // 如果已经是 URL，直接返回
  if (base64String.startsWith('http')) {
    return base64String;
  }

  try {
    // 上传到临时图片服务或转换为 blob URL
    // 这里我们使用 ImgBB API 作为示例
    const imgbbApiKey = process.env.IMGBB_API_KEY; // 需要在 .env.local 中添加
    const base64Data = base64String.split(',')[1]; // 移除 data:image/... 前缀

    const formData = new FormData();
    formData.append('image', base64Data);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to upload image');
    }

    return data.data.url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to process image');
  }
}

export async function POST(request: Request) {
  try {
    const { imageUrl, style } = await request.json();

    // 将 base64 转换为 URL
    const processableImageUrl = await uploadBase64Image(imageUrl);

    let output;
    switch (style) {
      case 'remove-bg':
        output = await replicate.run(
          "pollinations/modnet:da7d45f3b836795f945f221fc0b01a6d3ab7f5e163f13208948ad436001e2255",
          {
            input: {
              image: processableImageUrl,
            },
          }
        );
        break;

      case 'enhance':
        output = await replicate.run(
          "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
          {
            input: {
              image: processableImageUrl,
              scale: 2,
              face_enhance: false
            }
          }
        );
        break;

      default:
        throw new Error('Unsupported style');
    }

    console.log('Raw output:', output);

    // 处理不同类型的输出
    let outputUrl: string;
    if (typeof output === 'string') {
      outputUrl = output;
    } else if (Array.isArray(output)) {
      outputUrl = output[0];
    } else if (output && typeof output === 'object' && 'output' in output) {
      outputUrl = Array.isArray(output.output) ? output.output[0] : output.output;
    } else {
      throw new Error('Invalid output format from Replicate');
    }

    if (!outputUrl || typeof outputUrl !== 'string') {
      throw new Error('No valid output URL received');
    }

    return NextResponse.json({ 
      success: true,
      output: outputUrl
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed' 
      },
      { status: 500 }
    );
  }
} 