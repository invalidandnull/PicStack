import { NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: Request) {
  try {
    const { sessionId, plan } = await request.json();

    // 验证支付会话
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // 获取用户邮箱和元数据
    const customerEmail = session.customer_email;
    const userId = session.metadata?.userId;

    if (!customerEmail || !userId) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      );
    }

    // 更新用户信息
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_status: plan === 'Enterprise' ? 'Enterprise' : 'active',
        subscription_id: session.subscription,
        credits: plan === 'Pro' ? 100 : 1000, // 根据计划给予不同的积分
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      customerEmail,
      subscriptionId: session.subscription
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 