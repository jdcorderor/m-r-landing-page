import React from 'react';

// Define el tipo de datos que espera el componente para un servicio.
export type Service = {
    id: string;
    nombre: string;
    descripcion: string;
    caracteristicas: string[];
};

type ServiceCardProps = {
    service: Service; // El objeto de servicio completo.
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-6 flex-1 min-w-[280px] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            {/* Contenido principal del servicio */}
            <div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-3">{service.nombre}</h3>
                <p className="text-gray-700 mb-4 text-base line-clamp-3">{service.descripcion}</p>
            </div>

            {/* Lista de características, empujada hacia abajo si el contenido superior es dinámico */}
            <div className="mt-auto">
                {/* Renderiza las características solo si existen y hay al menos una */}
                {service.caracteristicas && service.caracteristicas.length > 0 && (
                    <ul className="list-disc list-inside text-gray-600 text-sm">
                        {service.caracteristicas.map((caracteristica, idx) => (
                            // To do: Validar idx
                            <li key={idx} className="mb-1">{caracteristica}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ServiceCard;