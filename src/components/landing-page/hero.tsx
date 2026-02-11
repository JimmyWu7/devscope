import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Shadcn Button
import Link from "next/link";
import LogoTicker from "./logo-ticker";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center w-full min-h-header pt-16 pb-12">
      <div className="flex flex-col mx-auto justify-center items-center w-full text-center space-y-4">
        {/* Headline */}
        <h1 className="max-w-80 sm:max-w-xl md:max-w-3xl lg:max-w-4xl text-balance font-bold leading-tight text-[clamp(2.25rem,6vw,3.75rem)]">
          The ultimate career dashboard built for{" "}
          <span className="bg-linear-to-r from-gray-600 via-gray-500 to-gray-400 bg-clip-text text-transparent">
            developers
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-80 sm:max-w-xl md:max-w-2xl lg:max-w-3xl text-muted-foreground text-[clamp(0.95rem,2.5vw,1.125rem)]">
          Track your activity, manage job applications, and update your resume
          effortlessly—so you can focus on growing your skills and advancing
          your developer career.
        </p>

        {/* CTA Buttons */}
        <Link href="/auth/login">
          <Button
            size="lg"
            className="mt-4 px-6 py-6 text-base sm:text-lg cursor-pointer"
          >
            Get started for free
          </Button>
        </Link>

        {/* Illustration */}
        <div className="flex items-center justify-center w-full max-w-5xl px-4 sm:px-6 lg:px-0">
          <Image
            src="/dashboard-ui-sample.png"
            alt="Dashboard Illustration"
            width={1200}
            height={600}
            className="w-80 sm:w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="max-w-80 sm:max-w-lg md:max-w-xl lg:max-w-4xl">
          <LogoTicker />
        </div>
      </div>
    </section>
  );
}
