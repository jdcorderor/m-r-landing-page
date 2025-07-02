import React from 'react';
import Image from 'next/image';

export type Dentist = {
    id: string;
    nombre: string;
    apellido: string;
    descripcion: string;
    email: string;
    especialidad: string;
    telefono: string;
    imagen_url: string;
};

type DentistCardProps = {
    dentist: Dentist;
};


const DentistCard: React.FC<DentistCardProps> = ({ dentist }) => {
    return (
        <div className="relative border border-gray.100 rounded-lg p-6 flex-1 min-w-[280px] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div className="block md:flex">
                {/* Dentist's image */}
                <div className="flex justify-center mx-auto md:block md:pr-5 md:pl-3 pb-2 md:pb-0">
                    <div className="w-40 h-40 rounded-full overflow-hidden shadow relative" style={{ transform: 'translateY(-10px)' }}>
                        <Image
                            src={dentist.imagen_url}
                            alt={`Foto de ${dentist.nombre} ${dentist.apellido}`}
                            width={250}
                            height={250}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                </div>

                {/* Dentist's main data */}
                <div className="flex-1 pl-4 pt-4 md:pt-3">
                    <span className="block text-3xl font-bold text-gray-700 mb-2">{dentist.nombre.split(" ")[0]} {dentist.apellido.split(" ")[0]}</span>
                    <p className="text-gray-600 text-sm mb-4 md:mb-5">{dentist.especialidad}</p>
                    <p className="text-gray-700 mb-3 md:mb-5 line-clamp-4 text-[0.7rem] md:text-sm text-justify mr-8">{dentist.descripcion}</p>
                </div>            
            </div>
            
            {/* Contact information */}
            <div className="md:ml-48 pt-2 pl-4">
                <p className="text-sm text-gray-500 my-1"><i className="bi bi-envelope mr-1"></i> {dentist.email}</p>
                <p className="text-sm text-gray-500 my-1"><i className="bi bi-phone mr-1"></i> +58 {dentist.telefono.slice(0, 4)}-{dentist.telefono.slice(4)}</p>
            </div>
            
            {/* Lateral color bar */}
            <div className="absolute right-0 rounded-r-lg top-0 h-full w-10 bg-gray-200" />
        </div>
    );
};

export default DentistCard;