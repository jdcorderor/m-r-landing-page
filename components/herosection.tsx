import React, { useState, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import Image from 'next/image';

// To do: pensar en usar Storage con supabase o similar par aimagenes dinamicas
export type CarouselImage = {
  id: string;
  src: string;
  alt: string;
};

const MOCK_CAROUSEL_IMAGES: CarouselImage[] = [
  { id: "img1", src: "/images/carousel1.jpg", alt: "Consultorio odontológico moderno y limpio" },
  { id: "img2", src: "/images/carousel1.jpg", alt: "Equipo de odontólogos sonriendo" },
  { id: "img3", src: "/images/carousel1.jpg", alt: "Paciente con una sonrisa feliz después del tratamiento" },
  { id: "img4", src: "/images/carousel1.jpg", alt: "Instrumentos dentales de alta tecnología" },
  { id: "img5", src: "/images/carousel1.jpg", alt: "Área de recepción acogedora" },
];

export default function HeroSection() {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //En caso de API
  useEffect(() => {
    const fetchCarouselImages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        setCarouselImages(MOCK_CAROUSEL_IMAGES);
      } catch (err) {
        console.error("Error al cargar imágenes del carrusel (simulado):", err);
        setError("No pudimos cargar las imágenes del carrusel. Por favor, inténtelo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselImages();
  }, []);

  return (
    <section className="flex flex-col py-12 md:py-16">
      <div className="w-full px-[5vw] flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-bold pb-5">Mavarez & Román</h1>
          <p className="text-lg md:text-xl pb-5 text-gray-700">
            Somos un equipo de odontólogos comprometidos con tu salud bucal. Ofrecemos servicios de alta calidad para cuidar de tu sonrisa.
          </p>
        </div>
      </div>
      <div className="w-full py-[35px]">
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-700 animate-pulse">Cargando imágenes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        ) : carouselImages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-700">No hay imágenes disponibles para el carrusel.</p>
          </div>
        ) : (
          <Carousel className="overflow-hidden shadow-lg w-full md:h-[450px]">
            {carouselImages.map((image) => (
              <Carousel.Item key={image.id}>
                <Image
                  src={image.src}
                  width={1920}
                  height={500}
                  alt={image.alt}
                  className="object-cover w-full md:h-[450px]"
                  priority
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </div>
      <a
        href="/agendar"
        className="inline-block mx-auto px-10 py-3 text-xl md:px-10 md:py-4 md:text-2xl border border-gray-300 rounded-full font-bold shadow-md text-center bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
      >
        Agenda tu cita
      </a>
    </section>
  );
}