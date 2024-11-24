'use client';

import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out our services',
    features: [
      '5 image generations per day',
      'Basic image processing',
      'Standard quality output',
      'Community support',
      'Basic features access',
      'Web resolution downloads'
    ],
    limitations: [
      'Contains watermark',
      'Limited resolution',
      'No commercial use'
    ],
    cta: 'Start Free',
    href: '/register',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '$19.99',
    description: 'Best for professional creators',
    features: [
      '100 image generations per day',
      'Advanced image processing',
      'HD quality output',
      'Priority support',
      'All features access',
      'Commercial use license',
      'No watermark',
      'Batch processing',
      'API access'
    ],
    limitations: [],
    cta: 'Go Pro',
    href: '/register?plan=pro',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams and businesses',
    features: [
      'Unlimited generations',
      'Custom API solutions',
      'Dedicated support',
      'Custom features',
      'Team management',
      'Advanced analytics',
      'SLA guarantee',
      'Custom integration',
      'Training sessions'
    ],
    limitations: [],
    cta: 'Contact Sales',
    href: '/contact',
    highlighted: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the perfect plan for your needs.
              All plans include core features.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl p-8 shadow-lg",
                  plan.highlighted
                    ? "border-2 border-blue-500 scale-105"
                    : "border border-gray-200"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <div className="text-4xl font-bold mb-2">
                    {typeof plan.price === 'string' ? (
                      plan.price
                    ) : (
                      <>
                        ${plan.price}
                        <span className="text-lg font-normal text-gray-500">/month</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-500">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <div key={limitation} className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={cn(
                    "w-full py-3 px-4 rounded-lg font-medium transition-colors",
                    plan.highlighted
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                What happens when I reach my generation limit?
              </h3>
              <p className="text-gray-600">
                You can purchase additional generations or wait until your limit resets the next day. Enterprise plans have unlimited generations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 