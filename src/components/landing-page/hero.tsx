import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Shadcn Button
import Link from "next/link";
import LogoTicker from "./logo-ticker";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center w-full min-h-header pt-16 pb-12">
      <div className="flex flex-col justify-center items-center w-full text-center space-y-4">
        {/* Headline */}
        <h1 className="max-w-3xl md:max-w-4xl text-4xl md:text-6xl font-bold md:leading-16">
          The ultimate career dashboard built for{" "}
          <span className="bg-linear-to-r from-gray-600 via-gray-500 to-gray-400 bg-clip-text text-transparent">
            developers
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm text-center md:text-lg text-gray-500 max-w-xl lg:max-w-3xl">
          Track your activity, manage job applications, and update your resume
          effortlessly—so you can focus on growing your skills and advancing
          your developer career.
        </p>

        {/* CTA Buttons */}
        <Link href="/auth/login">
          <Button size="lg" className="text-md cursor-pointer">
            Get started for free
          </Button>
        </Link>

        {/* Illustration */}
        <div className="w-full max-w-5xl flex justify-center">
          <Image
            src="/dashboard-ui-sample.png"
            alt="Dashboard Illustration"
            width={1200}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>
        <LogoTicker />
      </div>
    </section>
  );
}
