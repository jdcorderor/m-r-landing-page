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
        <div className="relative border border-gray-200 rounded-lg p-8">
            <div className="flex gap-10">
                <div className="flex justify-center mx-auto">
                    <div className="w-55 h-55 rounded-full overflow-hidden">
                        <Image src={dentist.imagen_url} alt={`Foto de ${dentist.nombre} ${dentist.apellido}`} width={250} height={250} className="w-full h-full object-cover object-top"/>
                    </div>
                </div>

                <div className="flex flex-col py-4 gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-3xl text-gray-700 font-bold">{dentist.nombre.split(" ")[0]} {dentist.apellido.split(" ")[0]}</span>
                        <p className="text-gray-600 text-sm">{dentist.especialidad}</p>  
                    </div>
                    <p className="text-sm text-gray-700 text-justify">{dentist.descripcion}</p>
                </div>            
            </div>
            
            {/* Contact information */}
            <div className="flex flex-col text-right gap-1">
                <p className="text-xs md:text-sm text-gray-500"> {dentist.email}</p>
                <p className="text-xs md:text-sm text-gray-500"> +58 {dentist.telefono.slice(0, 4)}-{dentist.telefono.slice(4)}</p>
            </div>
        </div>
    );
};

export default DentistCard;