import React, { useState, useEffect } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./ui/arrows/carouselArrows";

import { Service } from "@/app/types/service";
import ServiceCard from './ui/cards/ServiceCard';

// Hook for calculating window width
function useWindowWidth() {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function Services({ onReady } : { onReady: () => void }) {
    // Carousel settings
    const windowWidth = useWindowWidth();

    const slidesToShow = windowWidth <= 768 ? 1 : 3;
    const arrowsVisibility = windowWidth > 700;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow,
        slidesToScroll: 1,
        adaptiveHeight: true,
        nextArrow: arrowsVisibility ? <NextArrow /> : undefined,
        prevArrow: arrowsVisibility ? <PrevArrow /> : undefined,
    };

  // ---------------------------------------------------------------------
    
    // State variable for services list
    const [services, setServices] = useState<Service[]>([]);
    
    // Get services from the DB using fetch
    useEffect(() => {
        fetch("/api/servicios", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => setServices(data))
        .catch(error => {
            console.error("Error en el fetch", error);
        })
        .finally(() => {
            onReady();
        })
    }, [onReady]);
    
    return (
        <section className="flex flex-col pt-18 md:pt-24 pb-12" id="servicios">
            <h2 className="text-4xl md:text-5xl text-center font-bold px-8 mb-8 md:mb-14">Descubre nuestros servicios y tratamientos.</h2>
            <div className="w-full px-5 md:px-20">
                <Slider {...settings}>
                    {services.map((service, index) => (
                        <div key={index} className="px-1 md:px-4">
                            <ServiceCard key={index} service={service}></ServiceCard>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}