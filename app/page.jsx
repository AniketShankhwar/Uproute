import Accordion from "@/components/Accordion";
import GridBackground from "@/components/grid-background";
import HeroSection from "@/components/hero";
import StatisticsSection from "@/components/statistics-section";
import { Button } from "@/components/ui/button";
import Cards from "@/components/ui/cards";
import { faqs } from "@/data/faqs";
import { features } from "@/data/features";
import { howItWorks } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonial";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      <GridBackground />

      <HeroSection />

      <section className="w-full py-12 md:py-24 lg:py32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tigher text-center mb-12 text-[#E5E5E5]">
            Powerful Features for Your Career Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              return (
                <Cards
                  key={index}
                  className="text-center flex flex-col items-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2 text-[#E5E5E5]">
                      {feature.title}
                    </h3>
                    <p className="text-[#8D8D8D]">{feature.description}</p>{" "}
                  </div>
                </Cards>
              );
            })}
          </div>
        </div>
      </section>

      <StatisticsSection />

      <section className="w-full py-12 md:py-24 lg:py32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py32 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tigher text-center mb-12 text-[#E5E5E5]">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => {
              return (
                <Cards key={index} className="bg-background">
                  <div className="flex flex-col space-x-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="test-sm text-primary">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground mt-4 relative">
                        <span className="text-3xl text-primary italic absolute -top-4 -left-2">
                          &quot;
                        </span>
                        {testimonial.quote}
                        <span className="text-3xl text-primary italic absolute -bottom-4">
                          &quot;
                        </span>
                      </p>
                    </blockquote>
                  </div>
                </Cards>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py32 ">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <Accordion />
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto py-24 bg-gradient-to-r from-[#18CB96] to-white rounded-lg shadow-2xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl md:text-5xl">
              Elevate Your Future
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-800/80 md:text-xl">
              Transform your career with AI-powered insights and join a network
              of professionals paving the way to success.
            </p>
            <Link href="/dashboard" passHref>
              <Button size="lg" variant="secondary" className="animate-bounce">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
