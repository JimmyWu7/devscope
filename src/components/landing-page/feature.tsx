"use client";
import {
  Briefcase,
  BarChart3,
  FileText,
  Activity,
  Target,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  ValueAnimationTransition,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "Job Application Tracker",
    description:
      "Track every job you apply to, monitor statuses, deadlines, and follow-ups in one place.",
    icon: Briefcase,
  },
  {
    title: "Developer Activity Insights",
    description:
      "Visualize your coding activity, consistency, and progress over time with clear analytics.",
    icon: BarChart3,
  },
  {
    title: "Smart Resume Management",
    description:
      "Store, update, and tailor your resume versions effortlessly for different roles.",
    icon: FileText,
  },
  {
    title: "Skill Growth Tracking",
    description:
      "Set goals and track the skills you're actively improving as a developer.",
    icon: Target,
  },
  {
    title: "Centralized Career Hub",
    description:
      "Everything related to your developer career, applications, progress, and plans, in one dashboard.",
    icon: Activity,
  },
  {
    title: "Secure & Private",
    description:
      "Built with modern authentication and secure infrastructure to keep your data safe.",
    icon: ShieldCheck,
  },
];

type FeatureCardProps = {
  feature: any;
  isActive: boolean;
};

export function FeatureCard({ feature, isActive }: FeatureCardProps) {
  const tabRef = useRef<HTMLDivElement>(null);

  const xPercentage = useMotionValue(0);
  const yPercentage = useMotionValue(0);

  const maskImage = useMotionTemplate`
    radial-gradient(80px 80px at ${xPercentage}% ${yPercentage}%, black, transparent)
  `;

  useEffect(() => {
    if (!tabRef.current) return;

    const { height, width } = tabRef.current.getBoundingClientRect();
    const circumference = height * 2 + width * 2;

    const times = [
      0,
      width / circumference,
      (width + height) / circumference,
      (width * 2 + height) / circumference,
      1,
    ];

    const options: ValueAnimationTransition = {
      times,
      duration: 5,
      repeat: Infinity,
      ease: "linear",
    };

    const controlsX = animate(xPercentage, [0, 100, 100, 0, 0], options);
    const controlsY = animate(yPercentage, [0, 0, 100, 100, 0], options);

    return () => {
      controlsX.stop();
      controlsY.stop();
    };
  }, [isActive]);

  const Icon = feature.icon;

  return (
    <div ref={tabRef} className="relative">
      <motion.div
        style={{ maskImage }}
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        className="absolute inset-0 -m-px border border-black dark:border-white rounded-xl"
      />

      <Card className="hover:shadow-lg transition-shadow w-full h-full">
        <CardHeader className="space-y-4">
          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Feature() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="features"
      className="w-full flex justify-center items-center py-16"
    >
      <div className="w-full flex flex-col items-center justify-center">
        {/* Section header */}
        <div className="flex flex-col items-center max-w-80 sm:max-w-xl md:max-w-3xl lg:max-w-4xl text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything you need to grow your developer career
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-md md:max-w-lg lg:max-w-xl">
            DevScope brings clarity to your job search, learning progress, and
            career growth — all in one modern dashboard.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-80 sm:max-w-xl md:max-w-3xl lg:max-w-6xl">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              isActive={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
