import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="w-full min-h-screen pt-30 md:pt-30 pb-10 flex items-center justify-center">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
            Welcome to Uproute
            <br />
            Your Personal Career Coach
          </h1>
          <p className="mx-auto max-w-[600px] text-green-300 md:text-xl">
            Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.
          </p>
        </div>

        <div>
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
