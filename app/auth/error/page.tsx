'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AuthErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // 如果 URL 中有 access_token，说明是 OAuth 重定向，尝试恢复会话
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-6">
            There was a problem with the authentication process. Please try again.
          </p>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
} 