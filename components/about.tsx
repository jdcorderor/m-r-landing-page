import React, { useState, useEffect } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrowDark, PrevArrowDark } from "./ui/arrows/carouselArrows";

import { Dentist } from "@/app/types/dentist";
import DentistCard from "./ui/cards/DentistCard";

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

export default function About({ onReady } : { onReady: () => void }) {
  // Carousel settings
  const windowWidth = useWindowWidth();

  const slidesToShow = windowWidth <= 768 ? 1 : 2;
  const arrowsVisibility = windowWidth > 700;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 8000,
    pauseOnHover: true,
    nextArrow: arrowsVisibility ? <NextArrowDark /> : undefined,
    prevArrow: arrowsVisibility ? <PrevArrowDark /> : undefined,
  };

  // ---------------------------------------------------------------------
       
  // State variable for dentists list
  const [dentists, setDentists] = useState<Dentist[]>([]);
      
  // Get dentists from the DB using fetch
  useEffect(() => {
    fetch("/api/odontologos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => setDentists(data))
    .catch(error => {
      console.error("Error en el fetch", error);
    })
    .finally(() => {
      onReady();
    })
  }, [onReady]);

  return (
    <section className="flex flex-col pt-24 md:pt-24 pb-12" id="nosotros">
      <h2 className="text-4xl md:text-5xl text-center font-bold px-10 mb-8 md:mb-14">Conoce a nuestro equipo de especialistas.</h2>

      <div className="w-full px-5 md:px-20">
        {dentists.length > 0 && (
          <Slider {...settings}>
            {dentists.map((dentist) => (
              <div key={dentist.id} className="w-full px-1 md:px-4">
                <DentistCard dentist={dentist} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}