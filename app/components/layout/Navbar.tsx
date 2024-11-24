'use client';

import Link from 'next/link';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

const features = {
  '图片处理': [
    { title: '去除背景', description: '智能去除图片背景', href: '/remove-bg' },
    { title: '更改背景', description: '为图片添加新背景', href: '/change-bg' },
    { title: '模糊背景', description: '创建景深效果', href: '/blur-bg' },
    { title: '高清图片', description: '提升图片质量', href: '/enhance' },
    { title: '图片修复', description: '修复受损图片', href: '/restore' },
    { title: '证照生成', description: '生成标准证件照', href: '/id-photo' },
  ],
  'AI 创作': [
    { title: '图片生成', description: '文本生成图片', href: '/generate' },
    { title: 'AI换脸', description: '智能换脸技术', href: '/face-swap' },
    { title: '风格转换', description: '改变图片风格', href: '/style-transfer' },
    { title: '脸场景化', description: '人物场景合成', href: '/face-scene' },
    { title: '脸转风格', description: '人物风格转换', href: '/style-transfer' },
  ],
  '设计工具': [
    { title: 'Logo设计', description: '专业logo生成', href: '/logo-design' },
    { title: 'T恤图案', description: '服装图案设计', href: '/t-shirt-design' },
    { title: '社交媒体', description: '社交平台图片', href: '/social-media-design' },
    { title: '艺术作品', description: '艺术创作辅助', href: '/art-creation' },
    { title: '海报设计', description: '海报快速生成', href: '/poster-design' },
    { title: '手机壁纸', description: '壁纸设计制作', href: '/wallpaper-design' },
  ],
  '创意工具': [
    { title: '产品展示', description: '商品展示设计', href: '/product-display' },
    { title: '贴纸设计', description: '创意贴纸制作', href: '/sticker-design' },
    { title: '卡片设计', description: '贺卡邀请函等', href: '/card-design' },
    { title: '无缝图案', description: '循环图案设计', href: '/seamless-pattern' },
    { title: '表情设计', description: '表情包制作', href: '/emoji-design' },
    { title: '字母组合', description: '创意字母设计', href: '/letter-design' },
  ],
  '其他工具': [
    { title: '书籍封面', description: '封面设计制作', href: '/book-cover' },
    { title: '涂色页面', description: '涂色本设计', href: '/coloring-page' },
    { title: '杯子图案', description: '杯子图案设计', href: '/cup-design' },
  ],
};

export default function Navbar() {
  return (
    <div className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-16">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl">
          picstack
        </Link>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-md">Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-5 gap-3 p-6 w-[1200px]">
                  {Object.entries(features).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-medium text-sm text-gray-500 mb-2">{category}</h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="block p-2 hover:bg-gray-100 rounded-md"
                          >
                            <div className="text-sm font-medium">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink className="px-4 py-2">
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
        {/* Auth Buttons */}
        <div className="space-x-4">
          <Button variant="ghost">Login</Button>
          <Button>Register</Button>
        </div>
      </div>
    </div>
  );
} 