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
    label: 'Logo Design',
    description: 'Generate professional brand logos',
    basePrompt: 'professional logo design, minimalist, scalable, vector style, brand identity, corporate logo, clean design, modern logo',
    aspectRatio: '1:1',
    icon: '🎨'
  },
  {
    id: 'tshirt',
    label: 'T-shirt Design',
    description: 'Creative T-shirt design',
    basePrompt: 't-shirt, apparel graphic, fashion print, wearable art, trendy design, clothing illustration',
    // basePrompt: 'Real T-shirt',
    aspectRatio: '1:1',
    icon: '👕'
  },
  {
    id: 'social',
    label: 'Social Media',
    description: 'Social media post images',
    basePrompt: 'social media post, engaging content, eye-catching design, instagram style, viral content, social graphics',
    aspectRatio: '1:1',
    icon: '📱'
  },
  {
    id: 'art',
    label: 'Artwork',
    description: 'Generate artistic style works',
    basePrompt: 'digital art, artistic composition, creative artwork, fine art style, artistic expression',
    aspectRatio: '1:1',
    icon: '🎨'
  },
  {
    id: 'poster',
    label: 'Poster Design',
    description: 'Creative poster design',
    basePrompt: 'promotional poster, advertising design, eye-catching poster, marketing material, bold typography',
    aspectRatio: '3:4',
    icon: '📢'
  },
  {
    id: 'wallpaper',
    label: 'Wallpaper',
    description: 'Mobile wallpaper design',
    basePrompt: 'mobile wallpaper, phone background, vertical composition, aesthetic design, screen art',
    aspectRatio: '9:16',
    icon: '📱'
  },
  {
    id: 'mockup',
    label: 'Product Display',
    description: 'Product display model',
    basePrompt: 'product mockup, realistic presentation, professional display, marketing visualization, 3D rendering',
    aspectRatio: '4:3',
    icon: '📦'
  },
  {
    id: 'sticker',
    label: 'Sticker Design',
    description: 'Creative sticker design',
    basePrompt: 'sticker design, cute illustration, decorative element, adhesive art, fun graphics',
    aspectRatio: '1:1',
    icon: '🏷️'
  },
  {
    id: 'card',
    label: 'Card Design',
    description: 'Various card designs',
    basePrompt: 'greeting card, invitation design, celebration card, decorative card, festive design',
    aspectRatio: '4:3',
    icon: '💌'
  },
  {
    id: 'pattern',
    label: 'Pattern',
    description: 'Seamless pattern',
    basePrompt: 'seamless pattern, repeating design, textile pattern, wallpaper design, continuous motif',
    aspectRatio: '1:1',
    icon: '🔄'
  },
  {
    id: 'meme',
    label: 'Meme',
    description: 'Funny memes',
    basePrompt: 'meme design, funny illustration, viral content, humorous graphic, internet culture',
    aspectRatio: '1:1',
    icon: '😄'
  },
  {
    id: 'monogram',
    label: 'Monogram',
    description: 'Creative monogram',
    basePrompt: 'monogram design, letter combination, initial design, typography art, elegant lettering',
    aspectRatio: '1:1',
    icon: '📝'
  },
  {
    id: 'book',
    label: 'Ebook Cover',
    description: 'Ebook cover design',
    basePrompt: 'ebook cover, book design, publishing artwork, cover illustration, professional book cover',
    aspectRatio: '2:3',
    icon: '📚'
  },
  {
    id: 'coloring',
    label: 'Coloring Page',
    description: 'Coloring book page',
    basePrompt: 'coloring book page, line art, black and white illustration, detailed drawing, intricate design',
    aspectRatio: '1:1',
    icon: '✏️'
  },
  {
    id: 'mug',
    label: 'Mug Design',
    description: 'Mug decoration',
    basePrompt: 'mug design, drinkware decoration, cup artwork, ceramic print, coffee mug graphic',
    aspectRatio: '1:1',
    icon: '☕'
  }
]; 