"use client";
import React, { useState, useMemo, useCallback, useEffect } from 'react';

import Loading from '@/components/loading';
import Header from '@/components/header';
import HeroSection from "@/components/herosection";
import About from "@/components/about";
import Services from "@/components/services";
import Clinic from "@/components/clinic";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";

export default function Page() {
  // State variables for loading view
  const [isLoading, setIsLoading] = useState(true);
  const [loadedSections, setloadedSections] = useState<Set<string>>(new Set());

  // Update loaded sections
  const markReady = useCallback((section: string) => {
    setloadedSections((prev) => {
      if (prev.has(section)) return prev;
      const updated = new Set(prev);
      updated.add(section);
      return updated;
    });
  }, []);

  // Memoize required sections
  const memoizedRequiredSections = useMemo(() => ["about", "services", "testimonials"], []);

  useEffect(() => {
    if (loadedSections.size === memoizedRequiredSections.length) {
      setIsLoading(false);
    }
  }, [loadedSections, memoizedRequiredSections.length]);

  return (
    <main className="flex flex-col justify-start">
      <div className={isLoading ? "flex min-h-screen bg-white justify-center items-center transition-opacity duration-500" : "hidden"}>
        <Loading />
      </div>

      <div className={!isLoading ? "" : "hidden"}>
        <Header />

        {/* Hero section */}
        <HeroSection />

        {/* About Us */}
        <About onReady = {() => markReady("about")} />

        {/* Services */}
        <Services onReady = {() => markReady("services") }/>

        {/* Clinic */}
        <Clinic />

        {/* Testimonials */}
        <Testimonials onReady = {() => markReady("testimonials")} />
          
        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}