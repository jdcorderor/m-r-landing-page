import React from 'react';
import Image from 'next/image';

export type Service = {
    nombre: string;
    descripcion: string;
    caracteristicas: string[];
    imagen_url: string;
};

type ServiceCardProps = {
    service: Service;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    return (
        <div className="border border-gray-200 rounded-lg pb-3 flex-1 min-w-[280px] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div className="block">
                {/* Service image */}
                <div className="h-40 mb-4 flex justify-center rounded-t-lg">
                    <Image
                        src={service.imagen_url}
                        alt={service.nombre}
                        className="object-cover w-full max-h-40 rounded-t-lg"
                        width={320}
                        height={160}
                    />
                </div>

                {/* Service's main data */}
                <div className="px-6">
                    <span className="block text-2xl font-semibold text-gray-700 mb-3">{service.nombre}</span>
                    <p className="text-gray-700 mb-4 text-justify line-clamp-3">{service.descripcion}</p>
                </div>

                {/* Details list */}
                <div className="px-6 mt-auto flex-grow flex flex-col justify-end">
                    {service.caracteristicas && service.caracteristicas.length > 0 && (
                        <ul className="list-none text-gray-600 text-sm">
                            {service.caracteristicas.map((caracteristica, idx) => (
                               <li key={idx}><i className="bi bi-check mr-2"></i> {caracteristica}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default ServiceCard;