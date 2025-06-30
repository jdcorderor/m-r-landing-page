import React from 'react';

// Define el tipo de datos que espera el componente para un dentista.
export type Dentist = {
    id: string;
    nombre: string;
    apellido: string;
    descripcion: string;
    email: string;
    especialidad: string;
    telefono: string;
};

type DentistCardProps = {
    dentist: Dentist; // El objeto de dentista completo.
};


const DentistCard: React.FC<DentistCardProps> = ({ dentist }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-6 flex-1 min-w-[280px] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            {/* Información principal del dentista */}
            <div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">{dentist.nombre} {dentist.apellido}</h3>
                <p className="text-gray-600 mb-1">Especialidad: <span className="font-medium">{dentist.especialidad}</span></p>
                <p className="text-gray-700 text-base mb-3 line-clamp-3">{dentist.descripcion}</p>
            </div>

            {/* Información de contacto, empujado hacia abajo con 'mt-auto' */}
            <div className="mt-auto pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500">Email: {dentist.email}</p>
                <p className="text-sm text-gray-500">Teléfono: {dentist.telefono}</p>
            </div>
        </div>
    );
};

export default DentistCard;