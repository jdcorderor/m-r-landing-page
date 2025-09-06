import React from 'react';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

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
        <div className="relative border border-gray-200 rounded-lg p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex justify-center mx-auto">
                    <div className="w-55 h-55 rounded-full overflow-hidden">
                        <Image src={dentist.imagen_url} alt={`Foto de ${dentist.nombre} ${dentist.apellido}`} width={250} height={250} className="w-full h-full object-cover object-top"/>
                    </div>
                </div>

                <div className="flex flex-col py-4 gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-3xl text-gray-700 font-bold">{dentist.nombre.split(" ")[0]} {dentist.apellido.split(" ")[0]}</span>
                        <p className="text-gray-600 text-sm font-medium">{dentist.especialidad}</p>  
                    </div>
                    <p className="text-sm text-gray-700 text-justify font-light">{dentist.descripcion}</p>
                </div>            
            </div>
            
            {/* Contact information */}
            <div className="flex flex-col text-left md:text-right font-medium gap-2 mt-2 md:mt-0">
                <div className="flex flex-row gap-2 mr-auto md:mr-0 md:ml-auto"><Mail className="w-4 md:w-5 h-4 md:h-5 text-gray-500"></Mail><p className="text-xs md:text-sm text-gray-500"> {dentist.email}</p></div>
                <div className="flex flex-row gap-1 md:gap-2 mr-auto md:mr-0 md:ml-auto"><Phone className="w-4 md:w-5 h-4 md:h-5 text-gray-500"></Phone><p className="text-xs md:text-sm text-gray-500"> +58 {dentist.telefono.slice(0, 4)}-{dentist.telefono.slice(4)}</p></div>
            </div>
        </div>
    );
};

export default DentistCard;