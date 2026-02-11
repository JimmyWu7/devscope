import { Faq } from "@/components/landing-page/faq";
import Feature from "@/components/landing-page/feature";
import Footer from "@/components/landing-page/footer";
import Hero from "@/components/landing-page/hero";
import Navbar from "@/components/landing-page/navbar";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Navbar />
      <main>
        <section>
          <Hero />
        </section>
        <section>
          <Feature />
        </section>
        <section>
          <Faq />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
