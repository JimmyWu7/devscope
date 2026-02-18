"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoTicker from "./logo-ticker";
import StackedShowcase from "./stacked-showcase";
import { easeOut, motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, easeOut },
  },
};

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center w-full min-h-header pt-16 pb-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="flex flex-col mx-auto justify-center items-center w-full text-center space-y-4"
      >
        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="max-w-80 sm:max-w-xl md:max-w-3xl lg:max-w-4xl text-balance font-bold leading-tight text-[clamp(2.25rem,6vw,3.75rem)]"
        >
          The ultimate career dashboard built for{" "}
          <span className="bg-linear-to-r from-gray-600 via-gray-500 to-gray-400 bg-clip-text text-transparent">
            developers
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="max-w-80 sm:max-w-xl md:max-w-2xl lg:max-w-3xl text-muted-foreground text-[clamp(0.95rem,2.5vw,1.125rem)]"
        >
          Track your activity, manage job applications, and update your resume
          effortlessly.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp}>
          <Link href="/auth/login">
            <Button
              size="lg"
              className="my-4 px-6 py-6 text-base sm:text-lg cursor-pointer"
            >
              Get started for free
            </Button>
          </Link>
        </motion.div>

        {/* Illustration */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center w-full max-w-5xl px-0 sm:px-6 lg:px-0"
        >
          <StackedShowcase />
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="max-w-80 sm:max-w-lg md:max-w-xl lg:max-w-4xl"
        >
          <LogoTicker />
        </motion.div>
      </motion.div>
    </section>
  );
}
