"use client";
import React from 'react';
import Carousel from "react-bootstrap/Carousel";
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="flex flex-col py-12 md:py-16">
          <div className="w-full px-[5vw] flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }} className="pb-[20px]">Mavarez & Román</h1>
              <p className="text-lg md:text-xl pb-[20px]">
                Somos un equipo de odontólogos comprometidos con tu salud bucal. Ofrecemos servicios de alta calidad para cuidar de tu sonrisa.
              </p>
            </div>
          </div>
          <div className="w-full py-[35px]">
            <Carousel className="overflow-hidden shadow-lg w-full md:h-[65vh]">
                <Carousel.Item>
                  <Image src="https://xhhlwhpqpjpkjvvekqbl.supabase.co/storage/v1/object/public/landingpage//carrusel1.jpg" width={1080} height={500} alt="" className="object-cover w-full md:-translate-y-1/8" />
                </Carousel.Item>
                <Carousel.Item>
                  <Image src="https://xhhlwhpqpjpkjvvekqbl.supabase.co/storage/v1/object/public/landingpage//carrusel2.jpg" width={1080} height={500} alt="" className="object-cover w-full top-2 md:-translate-y-1/4" />
                </Carousel.Item>
                <Carousel.Item>
                  <Image src="https://xhhlwhpqpjpkjvvekqbl.supabase.co/storage/v1/object/public/landingpage//carrusel3.jpg" width={1080} height={500} alt="" className="object-cover w-full top-2 md:-translate-y-1/4" />
                </Carousel.Item>
                <Carousel.Item>
                  <Image src="https://xhhlwhpqpjpkjvvekqbl.supabase.co/storage/v1/object/public/landingpage//carrusel4.jpg" width={1080} height={500} alt="" className="object-cover w-full top-2 md:-translate-y-1/8" />
                </Carousel.Item>
            </Carousel>
          </div>
          <a href="/agendar" className="inline-block mx-auto px-10 py-3 text-xl md:px-10 md:py-4 md:text-2xl border rounded-[50] font-bold shadow-md text-center" style={{ textDecoration: 'none', color: 'rgb(32, 31, 31)' }}>
            Agenda tu cita
          </a>
        </section>
    );
}