"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const logos = [
  {
    name: "Next.js",
    light: "/logos/nextdotjs.png",
    dark: "/logos/nextdotjs-dark.png",
  },
  {
    name: "Prisma",
    light: "/logos/prisma.png",
    dark: "/logos/prisma-dark.png",
  },
  {
    name: "TailwindCSS",
    light: "/logos/tailwindcss.png",
    dark: "/logos/tailwindcss-dark.png",
  },
  {
    name: "shadcn/ui",
    light: "/logos/shadcnui.png",
    dark: "/logos/shadcnui-dark.png",
  },
  {
    name: "GitHub",
    light: "/logos/github.png",
    dark: "/logos/github-dark.png",
  },
  {
    name: "Vercel",
    light: "/logos/vercel.png",
    dark: "/logos/vercel-dark.png",
  },
  {
    name: "Better Auth",
    light: "/logos/betterauth.png",
    dark: "/logos/betterauth-dark.png",
  },
  {
    name: "Neon",
    light: "/logos/neon.png",
    dark: "/logos/neon-dark.png",
  },
];

export default function LogoTicker() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-6xl px-4">
      {/* label */}
      <p className="text-sm md:text-lg text-muted-foreground/80 tracking-wide text-center">
        Built with modern developer tools
      </p>
      <div className="container">
        <div className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,black,transparent)]">
          <div className="flex">
            <motion.div
              className="flex py-2 w-max"
              initial={{ x: "0%" }}
              animate={{ x: "-50%" }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[...logos, ...logos].map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 mx-4 lg:mx-8 opacity-70 hover:opacity-100 transition shrink-0"
                >
                  <Image
                    src={resolvedTheme === "dark" ? logo.dark : logo.light}
                    alt={logo.name}
                    priority={i < logos.length}
                    width={30}
                    height={30}
                    className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                  />
                  <span className="text-sm md:text-lg font-medium text-muted-foreground">
                    {logo.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
