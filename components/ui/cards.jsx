// components/CardRevealedPointer.jsx
"use client"; // Next.js 13 App Router

import { useMotionValue, motion, useMotionTemplate } from "motion/react";

export default function cards({ children, className = "" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.15), transparent 80%)`;

  return (
    <div
      onMouseMove={(e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }}
      className={`group relative w-full overflow-hidden rounded-xl bg-neutral-950 ${className}`}
    >
      <div className="absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent" />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative flex flex-col gap-3 rounded-xl border border-white/10 px-4 py-5 h-full">
        {children}
      </div>
    </div>
  );
}
