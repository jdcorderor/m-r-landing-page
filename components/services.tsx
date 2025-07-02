import React, { useState, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { groupItems, useSlidesPerView } from '@/hooks/homePageHooks';
import ServiceCard from './ui/ServiceCard';

export default function Services() {
    // Carousel slides per view (responsive)
    const slidesPerView = useSlidesPerView();
    
    // Define service type
    type Service = {
        nombre: string;
        descripcion: string;
        caracteristicas: string[];
        imagen_url: string;
    }
    
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
    }, []);
      
    // Build service cards, using useMemo for render optimization
    const serviceCards = useMemo(() => services.map((service, index) => (
        <ServiceCard key={index} service={service}></ServiceCard>
    )), [services]);
    
    // Build service carousel items, using useMemo for render optimization
    const serviceSlides = useMemo(() => groupItems(serviceCards, slidesPerView), [serviceCards, slidesPerView]);
    
    return (
        <section className="flex flex-col py-12 md:py-16 px-[5vw]" id="servicios">
            <h2 style={{ fontSize: '3.2rem', fontWeight: 'bold' }}>Servicios</h2>          

            <div className="w-full mt-8">
                <Carousel className="fit-content">
                    {serviceSlides.map((group, idx) => (
                        <Carousel.Item key={idx}>
                            <div className="">
                                <div className="flex gap-4">
                                    {group}
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}