"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const cards = [
  {
    id: "dashboard",
    src: "/devscope-dashboard.png",
    alt: "Dashboard",
  },
  {
    id: "tracker",
    src: "/devscope-job-applications-tracker.png",
    alt: "Job Tracker",
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);
    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}

export default function StackedShowcase() {
  const [front, setFront] = useState(0);
  const isMobile = useIsMobile();

  const back = front === 0 ? 1 : 0;

  function swap() {
    setFront(back);
  }

  // auto cycle every 10 seconds
  useEffect(() => {
    const interval = setInterval(swap, 10000);
    return () => clearInterval(interval);
  }, [front]);

  return (
    <div
      className="relative w-full aspect-video select-none perspective-distant"
      // style={{ perspective: "1200px" }}
    >
      {/* BACK CARD (peeking) */}
      <motion.div
        key={cards[back].id}
        onClick={swap}
        initial={false}
        // ! Update for better view of back card in xl screens
        // ! Need to re-screenshot for the portfolio website
        animate={{
          x: isMobile ? -15 : -55,
          y: isMobile ? -10 : -45,
          scale: isMobile ? 0.95 : 0.9,
          rotateX: 0, // <-- lays backward
          rotateY: 0, // slight side angle
          rotateZ: 0, // natural resting angle
          zIndex: -1,
          filter: "brightness(0.75)",
        }}
        whileHover={{
          x: -55,
          y: -50,
          scale: 0.93,
          // rotateX: 0,
          filter: "brightness(0.9)",
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 22,
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute inset-0 cursor-pointer rounded-xl bg-transparent"
      >
        <Image
          src={cards[back].src}
          alt={cards[back].alt}
          fill
          className="object-fill border"
        />
      </motion.div>

      {/* FRONT CARD */}
      <div className="flex items-center justify-center">
        <motion.div
          key={cards[front].id}
          initial={{
            scale: 0.95,
            y: 50,
            opacity: 0,
            rotateX: 25,
          }}
          animate={{
            scale: 1,
            x: isMobile ? 10 : 50,
            y: isMobile ? 15 : 40,
            opacity: 1,
            rotateX: 0, // slight backward lean
            rotateY: 0,
            rotateZ: 0,
            zIndex: 10,
            filter: "brightness(1)",
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 26,
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute inset-0 rounded-xl bg-transparent"
        >
          {/* Glow Layer */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/40 blur-xl"
            animate={{ opacity: [0.25, 0.35, 0.25] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <Image
            src={cards[front].src}
            alt={cards[front].alt}
            fill
            priority
            className="object-fill"
          />
        </motion.div>
      </div>
    </div>
  );
}
