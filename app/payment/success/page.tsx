'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const plan = searchParams.get('plan');

      if (!sessionId) {
        setError('Invalid session ID');
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId, plan }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify payment');
        }

        // 支付验证成功后等待2秒再跳转
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        {verifying ? (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-gray-500">Please wait while we confirm your payment...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Payment Error</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => router.push('/pricing')}>
              Return to Pricing
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-4">
              Thank you for your purchase. Your account has been upgraded.
            </p>
            <p className="text-gray-500 mb-6">
              You will be redirected to your dashboard shortly...
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
} 