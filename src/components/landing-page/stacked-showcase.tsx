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

export default function StackedShowcase() {
  const [front, setFront] = useState(0);

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
    <div className="relative w-full max-w-5xl aspect-video select-none perspective-distant">
      {/* BACK CARD (peeking) */}
      <motion.div
        key={cards[back].id}
        onClick={swap}
        initial={false}
        animate={{
          x: -10,
          y: -30,
          scale: 0.92,
          rotate: 5,
          rotateX: -4,
          rotateY: -2,
          zIndex: 0,
          filter: "brightness(0.75)",
        }}
        whileHover={{
          x: -18,
          y: -38,
          scale: 0.95,
          filter: "brightness(0.9)",
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 22,
        }}
        className="absolute inset-0 cursor-pointer rounded-xl bg-transparent overflow-hidden"
      >
        <Image
          src={cards[back].src}
          alt={cards[back].alt}
          fill
          className="object-contain"
        />
      </motion.div>

      {/* FRONT CARD */}
      <div className="flex items-center justify-center">
        <motion.div
          key={cards[front].id}
          initial={{
            scale: 0.95,
            y: 40,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            y: 0,
            opacity: 1,
            rotate: 0,
            rotateX: 0,
            rotateY: 0,
            zIndex: 10,
            filter: "brightness(1)",
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 26,
          }}
          className="absolute inset-0 rounded-xl bg-transparent overflow-hidden"
        >
          <Image
            src={cards[front].src}
            alt={cards[front].alt}
            fill
            priority
            className="object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}
