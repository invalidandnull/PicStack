import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const popularFeatures = [
  {
    title: 'Remove Background',
    description: 'One-click smart removal of image backgrounds',
    icon: '🎨',
    href: '/remove-bg'
  },
  {
    title: 'AI Image Generation',
    description: 'Professional AI image generation',
    icon: '📦',
    href: '/generate'
  },
  {
    title: 'Enhance',
    description: 'Enhance image clarity and quality',
    icon: '✨',
    href: '/enhance'
  },
  {
    title: 'AI Face Swap',
    description: 'Smart AI face swap technology',
    icon: '👤',
    href: '/face-swap'
  },
  {
    title: 'ID Photo Maker',
    description: 'Standard ID photo generation',
    icon: '📷',
    href: '/id-photo'
  },
  {
    title: 'Style Transfer',
    description: 'Multiple artistic styles at your fingertips',
    icon: '🎨',
    href: '/style-transfer'
  }
];

export default function PopularFeatures() {
  return (
    <div className="py-20 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Popular Features
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