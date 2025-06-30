import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { groupItems, useSlidesPerView } from '@/hooks/homePageHooks';
import DentistCard from '@/components/ui/DentistCard';

// --- Definición del tipo de datos para el Dentista ---
export type Dentist = {
  id: string; // ¡Crucial para usar como 'key' en las listas!
  nombre: string;
  apellido: string;
  descripcion: string;
  email: string;
  especialidad: string;
  telefono: string;
}


// API URL para Dentistas (aún no implementada)
const API_DENTISTS_URL = "/api/odontologos";

// --- Mock Data para Dentistas --- (TEMPORAL)
const MOCK_DENTISTS: Dentist[] = [
  {
    id: "d1",
    nombre: "Dr. Ramón",
    apellido: "Mavárez",
    descripcion: "Especialista en odontología general y estética, con un enfoque en la atención personalizada y el bienestar del paciente. Más de 15 años de experiencia.",
    email: "ramon.mavarez@example.com",
    especialidad: "Odontología General, Estética Dental",
    telefono: "+58 412-1234567",
  },
  {
    id: "d2",
    nombre: "Dra. Sofía",
    apellido: "Pérez",
    descripcion: "Experta en ortodoncia y ortopedia maxilar, dedicada a crear sonrisas alineadas y saludables para pacientes de todas las edades.",
    email: "sofia.perez@example.com",
    especialidad: "Ortodoncia, Ortopedia Maxilar",
    telefono: "+58 412-7654321",
  },
  {
    id: "d3",
    nombre: "Dr. Alejandro",
    apellido: "Gómez",
    descripcion: "Cirujano bucal con amplia experiencia en extracciones complejas, implantes dentales y procedimientos de regeneración ósea.",
    email: "alejandro.gomez@example.com",
    especialidad: "Cirugía Bucal, Implantología",
    telefono: "+58 412-9876543",
  },
  {
    id: "d4",
    nombre: "Dra. Valeria",
    apellido: "Ruiz",
    descripcion: "Odontopediatra apasionada por la salud bucal infantil, creando un ambiente amigable y divertido para los más pequeños.",
    email: "valeria.ruiz@example.com",
    especialidad: "Odontopediatría",
    telefono: "+58 412-2345678",
  },
  {
    id: "d5",
    nombre: "Dra. Sofía",
    apellido: "Pérez",
    descripcion: "Experta en ortodoncia y ortopedia maxilar, dedicada a crear sonrisas alineadas y saludables para pacientes de todas las edades.",
    email: "sofia.perez@example.com",
    especialidad: "Ortodoncia, Ortopedia Maxilar",
    telefono: "+58 412-7654321",
  },
  {
    id: "d6",
    nombre: "Dr. Alejandro",
    apellido: "Gómez",
    descripcion: "Cirujano bucal con amplia experiencia en extracciones complejas, implantes dentales y procedimientos de regeneración ósea.",
    email: "alejandro.gomez@example.com",
    especialidad: "Cirugía Bucal, Implantología",
    telefono: "+58 412-9876543",
  },
];

export default function About() {
  const slidesPerView = useSlidesPerView();
  const [dentists, setDentists] = useState<Dentist[]>(MOCK_DENTISTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDentists = useCallback(async () => {
    // Para simular un retraso de carga (para ver el estado de "Cargando...")
    setIsLoading(true);
    setError(null);
    try {
      // Simulación de una llamada a la API exitosa
      await new Promise(resolve => setTimeout(resolve, 500));
      setDentists(MOCK_DENTISTS); // Carga los datos de prueba
    } catch (err) {
      console.error("Error al obtener odontólogos (simulado):", err);
      setError("No pudimos cargar la lista de odontólogos (simulado). Por favor, inténtelo de nuevo.");
    } finally {
      setIsLoading(false);
    }

    // --- CÓDIGO PARA LA API REAL (DESCOMENTAR CUANDO ESTÉ LISTA) ---
    // setIsLoading(true);
    // setError(null);
    // try {
    //   const response = await fetch(API_DENTISTS_URL, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include",
    //   });
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || `Error en la respuesta del servidor: ${ response.status } ${ response.statusText } `);
    //   }
    //   const data: Dentist[] = await response.json();
    //   setDentists(data);
    // } catch (err) {
    //   console.error("Error al obtener odontólogos:", err);
    //   setError("No pudimos cargar la lista de odontólogos. Por favor, inténtelo de nuevo más tarde.");
    // } finally {
    //   setIsLoading(false);
    // }
  }, []);

  // Para la API
  // useEffect(() => {
  //   fetchDentists();
  // }, [fetchDentists]);

  // Aqui se usa el componente DentistCard
  const dentistCards = useMemo(() => dentists.map((dentist) => (
    <DentistCard key={dentist.id} dentist={dentist} />
  )), [dentists]);

  const dentistSlides = useMemo(() => groupItems(dentistCards, slidesPerView), [dentistCards, slidesPerView]);

  return (
    <section className="flex flex-col py-12 md:py-16 px-[5vw]" id="nosotros">
      <h2 className="text-5xl font-bold mb-8 text-center md:text-left">Conócenos</h2>
      <div className="w-full mt-8">
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-700 animate-pulse">Cargando información de nuestros odontólogos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-600">{error}</p>
            <button
              onClick={fetchDentists}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : dentists.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-700">No hay odontólogos disponibles en este momento.</p>
          </div>
        ) : (
          <Carousel className="fit-content">
            {dentistSlides.map((group, idx) => (
              <Carousel.Item key={idx}>
                <div className="">
                  <div className="flex gap-4 justify-center items-stretch">
                    {group}
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
