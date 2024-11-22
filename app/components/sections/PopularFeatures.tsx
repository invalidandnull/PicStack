import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const popularFeatures = [
  {
    title: '去除背景',
    description: '一键智能去除图片背景',
    icon: '🎨',
    href: '/mainapp'
  },
  {
    title: '产品图优化',
    description: '专业电商产品图处理',
    icon: '📦',
    href: '/mainapp'
  },
  {
    title: '高清修复',
    description: '提升图片清晰度和质量',
    icon: '✨',
    href: '/mainapp'
  },
  {
    title: 'AI 换脸',
    description: '智能人物换脸技术',
    icon: '👤',
    href: '/mainapp'
  },
  {
    title: '证件照制作',
    description: '标准证件照快速生成',
    icon: '📷',
    href: '/mainapp'
  },
  {
    title: '风格转换',
    description: '多种艺术风格随心转换',
    icon: '🎨',
    href: '/mainapp'
  }
];

export default function PopularFeatures() {
  return (
    <div className="py-20 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          热门功能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularFeatures.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 