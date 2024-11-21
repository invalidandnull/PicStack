import { NextResponse } from 'next/server';
import sharp from 'sharp';

// 将特定的模糊像素值映射到 sharp 的 sigma 值范围 (0.3-1000)
function calculateSigma(blurPixels: number): number {
  // 定义映射关系
  const blurMap: Record<number, number> = {
    4: 0.3,    // 最小模糊
    8: 1,      // 轻微模糊
    12: 10,    // 中等模糊
    16: 50,    // 较强模糊
    24: 200,   // 强烈模糊
    40: 500,   // 超强模糊
    64: 1000   // 最大模糊
  };

  const sigma = blurMap[blurPixels] || 10; // 默认使用中等模糊
  console.log('Converting blur pixels', blurPixels, 'to sigma:', sigma);
  return sigma;
}

export async function POST(request: Request) {
  try {
    const { originalImage, foregroundImage, blurPixels } = await request.json();

    console.log('Received blur pixels:', blurPixels);
    const sigma = calculateSigma(blurPixels);

    // 下载图片
    const [originalResponse, foregroundResponse] = await Promise.all([
      fetch(originalImage),
      fetch(foregroundImage)
    ]);

    const [originalArrayBuffer, foregroundArrayBuffer] = await Promise.all([
      originalResponse.arrayBuffer(),
      foregroundResponse.arrayBuffer()
    ]);

    // 转换为 Buffer
    const originalBuffer = Buffer.from(originalArrayBuffer);
    const foregroundBuffer = Buffer.from(foregroundArrayBuffer);

    // 获取图片尺寸
    const originalMetadata = await sharp(originalBuffer).metadata();
    console.log('Original image size:', originalMetadata.width, 'x', originalMetadata.height);

    // 处理背景图片（模糊）
    const blurredBackground = await sharp(originalBuffer)
      .blur(sigma)  // 使用映射后的 sigma 值
      .png()
      .toBuffer();

    // 调整前景图片大小以匹配背景
    const resizedForeground = await sharp(foregroundBuffer)
      .resize(originalMetadata.width, originalMetadata.height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    // 合成图片
    const result = await sharp(blurredBackground)
      .composite([
        {
          input: resizedForeground,
          blend: 'over',
          gravity: 'center'
        },
      ])
      .png()
      .toBuffer();

    // 将结果转换为 base64
    const outputBase64 = `data:image/png;base64,${result.toString('base64')}`;

    return NextResponse.json({ 
      success: true,
      output: outputBase64
    });
  } catch (error) {
    console.error('Composite error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to composite image' 
      },
      { status: 500 }
    );
  }
} 