"use client";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from "@/components/header";
import HeroSection from "@/components/herosection";
import About from "@/components/about";
import Services from "@/components/services";
import Clinic from "@/components/clinic";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import Loading from '@/components/loading';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
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
    <main className="flex flex-col justify-start pb-[5vh] min-h-screen">
      <div className={isLoading ? "flex justify-center items-center min-h-screen bg-white transition-opacity duration-500" : "d-none"}>
        <Loading />
      </div>
      <div className={!isLoading ? "d-block" : "d-none"}>

        {/* Header */}
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