import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-6xl font-bold mb-6">
        AI-powered image processing tool
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        One-stop image processing solution, providing over 25 professional tools to make creation easier
      </p>
      <div className="space-x-4">
        <Button size="lg" asChild>
          <Link href="/">
            Start Now
          </Link>
        </Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
    </div>
  );
} 