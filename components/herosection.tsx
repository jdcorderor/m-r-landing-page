"use client";
import React from 'react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./ui/arrows/carouselArrows";

import Image from 'next/image';

export default function HeroSection() {
    // Carousel settings
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1, 
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };

    // Slides
    const slides = [
      { src: "https://xhhlwhpqpjpkjvvekqbl.supabase.co/storage/v1/object/public/landingpage//carrusel1.jpg", },
      { src: "https://xhhlwhpqpjpkjvvekqbl.supabase.co/storage/v1/object/public/landingpage//carrusel2.jpg", },
      { src: "https://xhhlwhpqpjpkjvvekqbl.supabase.co/storage/v1/object/public/landingpage//carrusel3.jpg", },
      { src: "https://xhhlwhpqpjpkjvvekqbl.supabase.co/storage/v1/object/public/landingpage//carrusel4.jpg", },
    ];

    return (
        <section className="flex flex-col pt-12">
          <div className="flex flex-col items-center gap-6 px-8">
            <h1 className="text-6xl md:text-7xl text-center font-bold">Mavarez & Román.</h1>
            <p className="text-lg md:text-xl text-center">
              Somos un equipo de odontólogos comprometidos con tu salud bucal. Ofrecemos servicios de alta calidad para cuidar de tu sonrisa.
            </p>
          </div>

          <div className="flex flex-col w-full pt-16 pb-4 gap-5">
            <Slider {...settings}>
              {slides.map((slide, index) => (
                <div key={index} className="md:h-150">
                  <Image src={slide.src} width={1080} height={500} alt="" className="object-cover w-full md:-translate-y-1/8" />
                </div>
              ))}
            </Slider>

            <a href="/login" className="w-fit text-xl text-gray-900 font-medium border-2 border-gray-200 rounded-full px-8 py-3 mx-auto">Agenda tu cita</a>
          </div>
        </section>
    );
}