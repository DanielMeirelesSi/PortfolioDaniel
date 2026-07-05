"use client";

import { useEffect, useRef } from "react";

export default function Blob() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bw = wrapRef.current;
    if (!bw) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      bw.style.transform = "translate(-50%, -50%)";
      return;
    }

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let bx = 0;
    let by = 0;
    let px = 0;
    let py = 0;
    let pactive = false;
    let t = 0;
    let raf = 0;

    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX - vw / 2;
      py = e.clientY - vh / 2;
      pactive = true;
    };
    const onLeave = () => {
      pactive = false;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    const frame = () => {
      t += 0.016;
      let gx = Math.sin(t * 0.24) * vw * 0.26 + Math.sin(t * 0.13) * vw * 0.09;
      let gy = Math.cos(t * 0.19) * vh * 0.22 + Math.cos(t * 0.11) * vh * 0.08;
      if (pactive) {
        const dx = px - bx;
        const dy = py - by;
        const dist = Math.hypot(dx, dy);
        const R = 300;
        if (dist < R) {
          const pull = (1 - dist / R) * 0.75;
          gx += dx * pull;
          gy += dy * pull;
        }
      }
      bx += (gx - bx) * 0.05;
      by += (gy - by) * 0.05;
      bw.style.transform = `translate(-50%, -50%) translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px)`;
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="1.2" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="blob-wrap" ref={wrapRef}>
        <div className="blob" />
      </div>
    </>
  );
}
