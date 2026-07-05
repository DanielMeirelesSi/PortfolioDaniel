"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}

export default function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setInView(true);
      return;
    }

    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            ob.disconnect();
          }
        });
      },
      { threshold: 0.14 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={`rvl ${inView ? "in" : ""} ${className}`.trim()}
      style={{ transitionDelay: inView ? `${delay}s` : "0s" }}
    >
      {children}
    </Tag>
  );
}
