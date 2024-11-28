import { NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { planName, priceId, email } =  await request.json();
    
    // 添加调试信息
    console.log('Received request with:', { planName, priceId, email });

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, subscription_status, credits')
      .eq('email', email)
      .single();

    // 添加调试信息
    console.log('Supabase query result:', { user, userError });

    if (userError) {
      console.error('Supabase error:', userError);
      return NextResponse.json(
        { error: 'Database error: ' + userError.message },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }
    const toSubscription = planName == 'Pro' ? 'active' : planName == 'Enterprise' ? 'Enterprise' : '';
    // 如果用户已经是订阅用户，返回错误
    if (user.subscription_status === toSubscription) {
      return NextResponse.json(
        { error: `User already has an ${planName} subscription` },
        { status: 400 }
      );
    }

    // 创建 Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=${planName}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      customer_email: email,
      metadata: {
        userId: user.id,
        plan: planName,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 