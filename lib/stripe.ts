import Stripe from 'stripe';

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export const STRIPE_PRICE_IDS = {
  PRO: 'price_1QPEPWFsDwiWzGvYGNPpTLti', // 替换为您的 Stripe 价格 ID
  ENTERPRISE: 'price_1QPEQ8FsDwiWzGvYG68eTIa8', // 替换为您的 Stripe 价格 ID
};

export async function createCheckoutSession(userId: string, priceId: string) {
  return await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: userId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: {
      userId,
    },
  });
}