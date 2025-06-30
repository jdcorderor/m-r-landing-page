import React from 'react';

// Define el tipo de datos que espera el componente para un testimonio.
export type Testimonial = {
    id: string;
    comentario: string;
    emisor: string;
    fecha: string;
    email?: string;
};

type TestimonialCardProps = {
    testimonial: Testimonial;
    formatDate: (dateString: string) => string;
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, formatDate }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-6 flex-1 min-w-[280px] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            {/* Contenido principal del testimonio */}
            <div>
                <p className="text-gray-800 text-lg italic mb-4 line-clamp-4">
                    &quot;{testimonial.comentario}&quot;
                </p>
            </div>

            <div className="mt-auto pt-2 border-t border-gray-100">
                <p className="font-semibold text-blue-600">{testimonial.emisor}</p>
                <p className="text-sm text-gray-500">{formatDate(testimonial.fecha)}</p>
            </div>
        </div>
    );
};

export default TestimonialCard;