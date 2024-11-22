'use client';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import Hero from '@/app/components/sections/Hero';
import PopularFeatures from '@/app/components/sections/PopularFeatures';
import Testimonials from '@/app/components/sections/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <PopularFeatures />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
