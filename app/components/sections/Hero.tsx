import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-6xl font-bold mb-6">
        AI 驱动的图片处理工具
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        一站式图片处理解决方案，提供超过25种专业工具，让创作更简单
      </p>
      <div className="space-x-4">
        <Button size="lg" asChild>
          <Link href="/mainapp">
            开始使用
          </Link>
        </Button>
        <Button size="lg" variant="outline">
          了解更多
        </Button>
      </div>
    </div>
  );
} 