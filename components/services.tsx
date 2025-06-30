import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { groupItems, useSlidesPerView } from '@/hooks/homePageHooks';
import ServiceCard from '@/components/ui/ServiceCard';

// --- Definición del tipo de datos para el Servicio ---
export type Service = {
    id: string;
    nombre: string;
    descripcion: string;
    caracteristicas: string[];
};

// --- Para la API ---
const API_SERVICES_URL = "/api/servicios";

// --- Mock Data para Servicios ---
const MOCK_SERVICES: Service[] = [
    {
        id: "s1",
        nombre: "Limpieza Dental Profesional",
        descripcion: "Una limpieza profunda para remover placa y sarro, previniendo enfermedades periodontales y manteniendo tu aliento fresco.",
        caracteristicas: ["Remoción de sarro", "Pulido dental", "Prevención de caries", "Instrucción de higiene bucal"],
    },
    {
        id: "s2",
        nombre: "Blanqueamiento Dental",
        descripcion: "Aclara el tono de tus dientes con nuestros tratamientos de blanqueamiento seguros y efectivos, para una sonrisa más brillante.",
        caracteristicas: ["Tratamiento en clínica", "Kits para llevar a casa", "Resultados visibles en una sesión", "Supervisado por profesionales"],
    },
    {
        id: "s3",
        nombre: "Ortodoncia (Brackets y Alineadores)",
        descripcion: "Corrección de la posición de tus dientes y mandíbula para mejorar la estética y función de tu mordida.",
        caracteristicas: ["Brackets metálicos", "Brackets estéticos", "Alineadores transparentes (Invisalign)", "Controles periódicos"],
    },
    {
        id: "s4",
        nombre: "Implantes Dentales",
        descripcion: "Soluciones permanentes para reemplazar dientes perdidos, restaurando la función masticatoria y la estética de tu sonrisa.",
        caracteristicas: ["Titanio de alta calidad", "Procedimiento seguro", "Integración ósea", "Restauración de la función completa"],
    },
    {
        id: "s5",
        nombre: "Endodoncia (Tratamiento de Conducto)",
        descripcion: "Tratamiento especializado para salvar dientes con pulpa infectada o dañada, aliviando el dolor y evitando extracciones.",
        caracteristicas: ["Procedimiento indoloro", "Preservación del diente", "Tecnología avanzada", "Seguimiento post-tratamiento"],
    },
    {
        id: "s6",
        nombre: "Odontología Estética",
        descripcion: "Mejora la apariencia de tu sonrisa con carillas, restauraciones estéticas y otros procedimientos que realzan tu belleza natural.",
        caracteristicas: ["Carillas de porcelana", "Coronas dentales", "Diseño de sonrisa", "Rellenos estéticos"],
    },
];

export default function Services() {
    const slidesPerView = useSlidesPerView();
    const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = useCallback(async () => {
        // Para simular un retraso de carga (para ver el estado de "Cargando...")
        setIsLoading(true);
        setError(null);
        try {
            // Simulación de una llamada a la API exitosa
            await new Promise(resolve => setTimeout(resolve, 500)); // Simula 0.5 segundos de carga
            setServices(MOCK_SERVICES); // Carga los datos de prueba
        } catch (err) {
            console.error("Error al obtener servicios (simulado):", err);
            setError("No pudimos cargar la lista de servicios (simulado). Por favor, inténtelo de nuevo.");
        } finally {
            setIsLoading(false);
        }

        // --- CÓDIGO PARA LA API REAL (DESCOMENTAR CUANDO ESTE) ---
        // setIsLoading(true);
        // setError(null);
        // try {
        //   const response = await fetch(API_SERVICES_URL, {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     credentials: "include",
        //   });
        //   if (!response.ok) {
        //     const errorData = await response.json();
        //     throw new Error(errorData.message || `Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
        //   }
        //   const data: Service[] = await response.json();
        //   setServices(data);
        // } catch (err) {
        //   console.error("Error al obtener servicios:", err);
        //   setError("No pudimos cargar la lista de servicios. Por favor, inténtelo de nuevo más tarde.");
        // } finally {
        //   setIsLoading(false);
        // }
    }, []);

    // Para la API
    // useEffect(() => {
    //   fetchServices();
    // }, [fetchServices]);

    const serviceCards = useMemo(() => services.map((service) => (
        <ServiceCard key={service.id} service={service} />
    )), [services]);

    const serviceSlides = useMemo(() => groupItems(serviceCards, slidesPerView), [serviceCards, slidesPerView]);

    return (
        <section className="flex flex-col py-12 md:py-16 px-[5vw]" id="servicios">
            <h2 className="text-5xl font-bold mb-8 text-center md:text-left">Nuestros Servicios</h2>

            <div className="w-full mt-8">
                {isLoading ? (
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-700 animate-pulse">Cargando nuestros servicios...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-lg text-red-600">{error}</p>
                        <button
                            onClick={fetchServices}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-700">No hay servicios disponibles en este momento.</p>
                    </div>
                ) : (
                    <Carousel className="fit-content">
                        {serviceSlides.map((group, idx) => (
                            <Carousel.Item key={idx}>
                                <div className="flex gap-4 justify-center items-stretch">
                                    {group}
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
            </div>
        </section>
    );
}