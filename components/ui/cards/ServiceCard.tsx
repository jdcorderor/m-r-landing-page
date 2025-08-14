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
        <div className="border border-gray-200 rounded-lg">
            <div className="flex flex-col">
                <div className="flex h-50">
                    <Image src={service.imagen_url} alt={service.nombre} className="w-full object-cover rounded-t-lg" width={320} height={160}/>
                </div>

                <div className="flex flex-col px-12 py-8 gap-4">
                    <span className="text-2xl font-semibold text-gray-700">{service.nombre}</span>
                    <p className="text-gray-700 text-justify">{service.descripcion}</p>                
                    
                    <div>
                        {service.caracteristicas && service.caracteristicas.length > 0 && (
                            <ul className="list-none text-gray-600 text-[0.8rem] md:text-sm">
                                {service.caracteristicas.map((caracteristica, idx) => (
                                <li key={idx}>- {caracteristica}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;