import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
});

export const STRIPE_PRICE_IDS = {
  PRO: 'price_1QPEPWFsDwiWzGvYGNPpTLti', // 替换为您的实际 Price ID
  ENTERPRISE: 'price_1QPEQ8FsDwiWzGvYG68eTIa8', // 替换为您的实际 Price ID
};

export async function createCheckoutSession(userEmail: string, priceId: string) {
  const planType = priceId === STRIPE_PRICE_IDS.PRO ? 'pro' : 'enterprise';
  
  return await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: {
      userEmail,
      plan: planType,
    },
  });
} 