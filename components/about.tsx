import React, { useState, useEffect } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrowDark, PrevArrowDark } from "./ui/arrows/carouselArrows";

import { Dentist } from "@/app/types/dentist";
import DentistCard from "./ui/cards/DentistCard";

export default function About({ onReady } : { onReady: () => void }) {
  // Carousel settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2, 
    slidesToScroll: 1,
    nextArrow: <NextArrowDark />,
    prevArrow: <PrevArrowDark />,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
    ]
  };
       
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
    <section className="flex flex-col py-6 md:py-12 gap-1" id="nosotros">
      <h2 className="text-5xl font-bold px-5 md:px-24">Conócenos</h2>
      <div className="w-full mt-8 px-5 md:px-20">
        <Slider {...settings}>
          {dentists.map((dentist, index) => (
            <div key={index} className="md:px-4">
              <DentistCard key={dentist.id} dentist={dentist}></DentistCard>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}