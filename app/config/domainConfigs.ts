export interface DomainConfig {
  id: string;
  label: string;
  description: string;
  basePrompt: string;
  aspectRatio: string;
  icon: string;
}

export const domainConfigs: DomainConfig[] = [
  {
    id: 'logo',
    label: 'Logo设计',
    description: '生成专业的品牌标志',
    basePrompt: 'professional logo design, minimalist, scalable, vector style, brand identity, corporate logo, clean design, modern logo',
    aspectRatio: '1:1',
    icon: '🎨'
  },
  {
    id: 'tshirt',
    label: 'T恤图案',
    description: '创意T恤图案设计',
    basePrompt: 't-shirt, apparel graphic, fashion print, wearable art, trendy design, clothing illustration',
    // basePrompt: 'Real T-shirt',
    aspectRatio: '1:1',
    icon: '👕'
  },
  {
    id: 'social',
    label: '社交媒体',
    description: '社交媒体帖子图片',
    basePrompt: 'social media post, engaging content, eye-catching design, instagram style, viral content, social graphics',
    aspectRatio: '1:1',
    icon: '📱'
  },
  {
    id: 'art',
    label: '艺术作品',
    description: '生成艺术风格作品',
    basePrompt: 'digital art, artistic composition, creative artwork, fine art style, artistic expression',
    aspectRatio: '1:1',
    icon: '🎨'
  },
  {
    id: 'poster',
    label: '海报设计',
    description: '创意海报设计',
    basePrompt: 'promotional poster, advertising design, eye-catching poster, marketing material, bold typography',
    aspectRatio: '3:4',
    icon: '📢'
  },
  {
    id: 'wallpaper',
    label: '手机壁纸',
    description: '手机壁纸设计',
    basePrompt: 'mobile wallpaper, phone background, vertical composition, aesthetic design, screen art',
    aspectRatio: '9:16',
    icon: '📱'
  },
  {
    id: 'mockup',
    label: '产品展示',
    description: '产品展示模型',
    basePrompt: 'product mockup, realistic presentation, professional display, marketing visualization, 3D rendering',
    aspectRatio: '4:3',
    icon: '📦'
  },
  {
    id: 'sticker',
    label: '贴纸设计',
    description: '创意贴纸设计',
    basePrompt: 'sticker design, cute illustration, decorative element, adhesive art, fun graphics',
    aspectRatio: '1:1',
    icon: '🏷️'
  },
  {
    id: 'card',
    label: '卡片设计',
    description: '各类卡片设计',
    basePrompt: 'greeting card, invitation design, celebration card, decorative card, festive design',
    aspectRatio: '4:3',
    icon: '💌'
  },
  {
    id: 'pattern',
    label: '无缝图案',
    description: '无缝拼接图案',
    basePrompt: 'seamless pattern, repeating design, textile pattern, wallpaper design, continuous motif',
    aspectRatio: '1:1',
    icon: '🔄'
  },
  {
    id: 'meme',
    label: '表情包',
    description: '有趣的表情包',
    basePrompt: 'meme design, funny illustration, viral content, humorous graphic, internet culture',
    aspectRatio: '1:1',
    icon: '😄'
  },
  {
    id: 'monogram',
    label: '字母组合',
    description: '创意字母组合',
    basePrompt: 'monogram design, letter combination, initial design, typography art, elegant lettering',
    aspectRatio: '1:1',
    icon: '📝'
  },
  {
    id: 'book',
    label: '电子书封面',
    description: '电子书封面设计',
    basePrompt: 'ebook cover, book design, publishing artwork, cover illustration, professional book cover',
    aspectRatio: '2:3',
    icon: '📚'
  },
  {
    id: 'coloring',
    label: '涂色页面',
    description: '涂色书页面',
    basePrompt: 'coloring book page, line art, black and white illustration, detailed drawing, intricate design',
    aspectRatio: '1:1',
    icon: '✏️'
  },
  {
    id: 'mug',
    label: '马克杯图案',
    description: '马克杯装饰图案',
    basePrompt: 'mug design, drinkware decoration, cup artwork, ceramic print, coffee mug graphic',
    aspectRatio: '1:1',
    icon: '☕'
  }
]; 