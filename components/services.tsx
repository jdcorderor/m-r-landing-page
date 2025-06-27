import React, { useState, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { groupItems, useSlidesPerView } from '@/hooks/homePageHooks';

export default function Services() {
    // Carousel slides per view (responsive)
    const slidesPerView = useSlidesPerView();
    
    // Define service type and state
    type Service = {
        nombre: string;
        descripcion: string;
        caracteristicas: string[];
        duracion: number; // Minutes
        precio: number; // USD
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
        // Create a service card.
        <div key={index}></div>
    )), [services]);
    
    // Build service carousel items, using useMemo for render optimization
    const serviceSlides = useMemo(() => groupItems(serviceCards, slidesPerView), [serviceCards, slidesPerView]);
    
    return (
        <section className="flex py-12 md:py-16 px-[5vw]" id="servicios">
            <h2 style={{ fontSize: '3.2rem', fontWeight: 'bold' }}>Servicios</h2>          

            <div>
                <div>
                    <Carousel>
                        {serviceSlides.map((group, idx) => (
                            <Carousel.Item key={idx}>
                                <div className="">
                                    <div className={`${(slidesPerView === 2) ? "" : `-${slidesPerView}`}`}>
                                        {group}
                                    </div>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
}