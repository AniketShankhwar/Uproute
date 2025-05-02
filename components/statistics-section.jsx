"use client";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const StatisticsSection = () => {
  // Detect when the section comes into view
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  // Statistics Data
  const stats = [
    { value: 50, suffix: "+", label: "Industries Covered", duration: 2 },
    { value: 1000, suffix: "+", label: "Interview Questions", duration: 1.5 },
    { value: 95, suffix: "%", label: "Success Rate", duration: 2 },
    { value: 24, suffix: "/7", label: "AI Support", duration: 2 },
  ];

  return (
    <section ref={ref} className="w-full py-12 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">
                {inView ? <CountUp end={stat.value} duration={stat.duration} /> : "0"}
                {stat.suffix}
              </h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
