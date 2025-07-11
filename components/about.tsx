import React, { useState, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { groupItems, useSlidesPerView } from '@/hooks/homePageHooks';
import DentistCard from './ui/DentistCard';

export default function About({ onReady } : { onReady: () => void }) {
  // Carousel slides per view (responsive)
  const slidesPerView = useSlidesPerView();

  // Define dentist type
  type Dentist = {
    id: string;
    nombre: string;
    apellido: string;
    descripcion: string;
    email: string;
    especialidad: string;
    telefono: string;
    imagen_url: string;
  }
      
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
        
  // Build dentist cards, using useMemo for render optimization
  const dentistCards = useMemo(() => dentists.map((dentist) => (
    <DentistCard key={dentist.id} dentist={dentist}></DentistCard>
  )), [dentists]);
      
  // Build dentist carousel items, using useMemo for render optimization
  const dentistSlides = useMemo(() => groupItems(dentistCards, slidesPerView), [dentistCards, slidesPerView]);

  return (
    <section className="flex flex-col py-12 md:py-16 px-[5vw]" id="nosotros">
      <h2 style={{ fontSize: '3.2rem', fontWeight: 'bold' }}>Conócenos</h2>
      <div className="w-full mt-3">
        <Carousel className="fit-content">
          {dentistSlides.map((group, idx) => (
            <Carousel.Item key={idx}>
              <div className="">
                <div className="flex gap-5">
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