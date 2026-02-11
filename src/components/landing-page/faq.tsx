"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What is DevScope?",
    answer:
      "DevScope is a modern career dashboard for developers. It helps you track job applications, monitor skill growth, manage resumes, and visualize your progress — all in one place.",
  },
  {
    question: "Is DevScope free to use?",
    answer:
      "Yes! DevScope offers a free version with essential features. Premium features may be introduced in the future for advanced insights and analytics.",
  },
  {
    question: "How does the job application tracker work?",
    answer:
      "You can log each job you apply for, track its status (Applied, Interviewing, Offer, Rejected), set follow-up reminders, and organize everything in a centralized dashboard.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. DevScope uses modern authentication and secure infrastructure to ensure your data remains private and protected.",
  },
  {
    question: "Can I track multiple resumes?",
    answer:
      "Yes. You can upload and manage multiple resume versions tailored for different roles or companies.",
  },
];

export const Faq = () => {
  return (
    <section id="faq" className="w-full py-20 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0 }}
        viewport={{ once: true }}
        className="w-full max-w-80 md:max-w-xl lg:max-w-3xl"
      >
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground md:max-w-lg lg:max-w-xl mx-auto">
            Everything you need to know about DevScope and how it helps you grow
            your developer career.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg px-4 transition-colors hover:bg-muted/40"
            >
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
};
