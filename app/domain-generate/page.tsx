'use client';

import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import DomainGenerator from '@/app/domain-generate/_components/DomainGenerator';

export default function DomainGeneratePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-500">
              AI Domain Generator
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Generate professional designs for any domain.
              From logos to social media, all in one place.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors">
                Start Creating
              </button>
              <button className="px-8 py-3 border border-fuchsia-600 text-fuchsia-600 rounded-lg hover:bg-fuchsia-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <DomainGenerator />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Domain Generator
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Domains</h3>
              <p className="text-gray-600">
                Support various design domains and styles
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Generation</h3>
              <p className="text-gray-600">
                Get professional results in seconds
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Download</h3>
              <p className="text-gray-600">
                Download your designs in high quality
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 