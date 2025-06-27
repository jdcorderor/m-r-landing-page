"use client";
import React from 'react';
import Header from "@/components/header";
import HeroSection from "@/components/herosection";
import About from "@/components/about";
import Services from "@/components/services";
import Clinic from "@/components/clinic";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import { useFadeTransition } from '@/hooks/useHomePageEffects';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  // Custom hook for fade-in transition effect
  useFadeTransition();

  return (
    <main className="flex flex-col justify-start pb-[5vh] min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero section */}
      <HeroSection />

      {/* About Us */}
      <About />

      {/* Services */}
      <Services />

      {/* Clinic */}
      <Clinic />

      {/* Testimonials */}
      <Testimonials />
        
      {/* Footer */}
      <Footer />
    </main>
  );
}