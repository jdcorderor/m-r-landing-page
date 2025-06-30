import React, { useState, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { groupItems, useSlidesPerView } from '@/hooks/homePageHooks';
import Image from 'next/image';

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
    .then((response) => {
      if (!response.ok) {throw new Error("Falla en la API de odontólogos");}
      return response.json();
    })
    .then((data) => setDentists(data))
    .catch((error) => {
      console.warn("Usando datos falsos por:", error.message);
      const mockDentists: Dentist[] = [
        {
          id: "1",
          nombre: "Ramón",
          apellido: "Mavarez",
          descripcion: "Especialista en odontología general y estética.",
          email: "ramon.mavarez@clinica.com",
          especialidad: "Odontología General",
          telefono: "0414-1234567",
        },
        {
          id: "2",
          nombre: "Patricia",
          apellido: "Román",
          descripcion: "Apasionada por la ortodoncia moderna.",
          email: "patricia.roman@clinica.com",
          especialidad: "Ortodoncia",
          telefono: "0416-9876543",
        },
        {
          id: "3",
          nombre: "Carla",
          apellido: "Silva",
          descripcion: "Especialista en endodoncia y rehabilitación oral.",
          email: "carla.silva@clinica.com",
          especialidad: "Endodoncia",
          telefono: "0412-4567890",
        },
      ];
      setDentists(mockDentists);
    });
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
        <Carousel nextIcon={<span className="text-3xl text-black p-3 rounded-full"> ❯ </span>}
                  prevIcon={<span className="text-3xl text-black p-3 rounded-full"> ❮ </span>}
                  className="fit-content">
          {dentists.map((dentist, idx) => (
            <Carousel.Item key={idx}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 border rounded-xl p-6 max-w-4xl mx-auto">
                <div className="relative w-[250px] aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="/images/doc1.jpg"
                    alt="Dentist"
                    fill
                    className="object-contain rounded-2xl"
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold">
                    {dentist.nombre} {dentist.apellido}
                  </p>
                  <p className="text-lg">{dentist.especialidad}</p>
                  <p className="text-gray-700 mb-2">{dentist.descripcion}</p>
                  <p className="text-sm text-gray-500">Email: {dentist.email}</p>
                  <p className="text-sm text-gray-500">Teléfono: {dentist.telefono}</p>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </section>
  );
}