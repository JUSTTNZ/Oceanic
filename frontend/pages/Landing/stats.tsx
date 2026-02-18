"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  decimals: number;
}

const stats: StatItem[] = [
  { label: "Trading Volume", value: 2, suffix: "B+", prefix: "$", decimals: 0 },
  { label: "Active Traders", value: 150, suffix: "K+", prefix: "", decimals: 0 },
  { label: "Cryptocurrencies", value: 100, suffix: "+", prefix: "", decimals: 0 },
  { label: "Platform Uptime", value: 99.9, suffix: "%", prefix: "", decimals: 1 },
  { label: "Support Available", value: 24, suffix: "/7", prefix: "", decimals: 0 },
];

function useCountUp(target: number, decimals: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const hasRun = useRef(false);

  const animate = useCallback(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [target, decimals, duration]);

  useEffect(() => {
    if (inView) animate();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, animate]);

  return count;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(stat.value, stat.decimals, 2000, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 md:p-8 hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300 group"
    >
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1.5 tracking-tight">
        {stat.prefix}
        {stat.decimals > 0 ? count.toFixed(stat.decimals) : Math.round(count)}
        {stat.suffix}
      </div>
      <div className="text-gray-500 text-xs sm:text-sm md:text-base">{stat.label}</div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-14 sm:py-16 md:py-20 font-grotesk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-2">
            Numbers that speak to our commitment to excellence
          </p>
        </motion.div>

        {/* Bento: row 1 = 3 cards, row 2 = 2 cards that stretch */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {/* First row: 3 equal cards */}
          {stats.slice(0, 3).map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
          {/* Second row: 2 cards spanning 3 cols */}
          <div className="col-span-2 sm:col-span-3 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            {stats.slice(3).map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
