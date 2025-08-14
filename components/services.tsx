import React, { useState, useEffect } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./ui/arrows/carouselArrows";

import { Service } from "@/app/types/service";
import ServiceCard from './ui/cards/ServiceCard';

export default function Services({ onReady } : { onReady: () => void }) {
    // Carousel settings
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3, 
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    
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
        <section className="flex flex-col py-12 gap-1" id="nosotros">
            <h2 className="text-5xl font-bold px-24">Servicios</h2>
            <div className="w-full mt-8 px-20">
                <Slider {...settings}>
                {services.map((service, index) => (
                    <div key={index} className="px-4">
                        <ServiceCard key={index} service={service}></ServiceCard>
                    </div>
                ))}
                </Slider>
            </div>
        </section>
    );
}