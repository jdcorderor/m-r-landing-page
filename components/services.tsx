import React, { useState, useEffect, useMemo } from 'react';
import Carousel from "react-bootstrap/Carousel";

export default function Services() {
  type Service = {
    nombre: string;
    descripcion: string;
    caracteristicas: string[];
  };

  const [services, setServices] = useState<Service[]>([]);
  const [groupSize, setGroupSize] = useState<number>(1); // default: 1 card per slide


  useEffect(() => {
    fetch("/api/servicios", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener servicios desde el backend.");
        return response.json();
      })
      .then((data) => setServices(data))
      .catch((error) => {
        console.warn("Fallo la API, usando datos de prueba:", error.message);
        const mockServicios: Service[] = [
          { nombre: "Prueba 1", descripcion: "Eliminación profesional de placa y sarro.", caracteristicas: ["Ultrasonido", "Pulido", "Aplicación de flúor"] },
          { nombre: "Prueba 2", descripcion: "Corrección de alineación dental.", caracteristicas: ["Brackets metálicos", "Brackets estéticos", "Controles periódicos"] },
          { nombre: "Prueba 3", descripcion: "Mejora estética del color dental.", caracteristicas: ["Gel de peróxido", "Luz LED", "Resultados visibles"] },
          { nombre: "Prueba 4", descripcion: "Solución estética para dientes perdidos.", caracteristicas: ["Coronas", "Puentes", "Zirconio"] },
          { nombre: "Prueba 5", descripcion: "Implantes dentales.", caracteristicas: ["Biocompatible", "Duradero", "Alta estética"] },
          { nombre: "Prueba 6", descripcion: "Tratamiento de encías.", caracteristicas: ["Raspado", "Cirugía periodontal"] },
          { nombre: "Prueba 7", descripcion: "Tratamiento estético complementario.", caracteristicas: ["Limpieza profunda", "Pulido final"] },
        ];
        setServices(mockServicios);
      });
  }, []);

  // Detecta el tamaño de pantalla en montaje y cuando cambia
  useEffect(() => {
    const updateGroupSize = () => {
      const width = window.innerWidth;
      setGroupSize(width >= 768 ? 3 : 1);
    };
    updateGroupSize();
    window.addEventListener("resize", updateGroupSize);
    return () => window.removeEventListener("resize", updateGroupSize);
  }, []);

  const groupedSlides = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < services.length; i += groupSize) {
      chunks.push(services.slice(i, i + groupSize));
    }
    return chunks;
  }, [services, groupSize]);

  return (
    <section className="flex flex-col py-12 md:py-16 px-[5vw]" id="servicios">
      <h2 style={{ fontSize: '3.2rem', fontWeight: 'bold' }}>Servicios</h2>

      <div className="mt-8 w-full">
        <Carousel
          interval={null}
          nextIcon={<span className="text-3xl text-black p-3 ms-20 rounded-full">❯</span>}
          prevIcon={<span className="text-3xl text-black p-3 me-20 rounded-full">❮</span>}
        >
          {groupedSlides.map((group, idx) => (
            <Carousel.Item key={idx}>
              <div className={`flex justify-center gap-6 px-4 ${groupSize === 1 ? 'flex-col items-center' : 'flex-row'}`}>
                {group.map((service, i) => (
                  <div key={i} className="border rounded-lg p-4 bg-white shadow max-w-sm w-full">
                    <p className="text-xl font-bold mb-2">{service.nombre}</p>
                    <p className="mb-3 text-gray-700">{service.descripcion}</p>
                    <ul className="list-disc ml-5 text-sm text-gray-600">
                      {service.caracteristicas.map((caracteristica, j) => (
                        <li key={j}>{caracteristica}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </section>
  );
}