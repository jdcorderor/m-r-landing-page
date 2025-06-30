import React, { useState, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { groupItems, useSlidesPerView } from '@/hooks/homePageHooks';

export default function About() {
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
  }, []);
        
  // Build dentist cards, using useMemo for render optimization
  const dentistCards = useMemo(() => dentists.map((dentist, index) => (
    <div className="border rounded-lg p-4" key={index}>
        <p>{dentist.nombre} {dentist.apellido}</p>
        <p>{dentist.especialidad}</p>
        <p>{dentist.descripcion}</p>
        <p>Email: {dentist.email}</p>
        <p>Teléfono: {dentist.telefono}</p>
    </div>
  )), [dentists]);
      
  // Build dentist carousel items, using useMemo for render optimization
  const dentistSlides = useMemo(() => groupItems(dentistCards, slidesPerView), [dentistCards, slidesPerView]);

  return (
    <section className="flex flex-col py-12 md:py-16 px-[5vw]" id="nosotros">
      <h2 style={{ fontSize: '3.2rem', fontWeight: 'bold' }}>Conócenos</h2>
      <div className="w-full mt-8">
        <Carousel className="fit-content">
          {dentistSlides.map((group, idx) => (
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