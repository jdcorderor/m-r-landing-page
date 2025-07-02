import React from 'react';

// Define el tipo de datos que espera el componente para un testimonio.
export type Testimonial = {
    comentario: string;
    emisor: string;
    fecha: string;
};

type TestimonialCardProps = {
    testimonial: Testimonial;
    formatDate: (dateString: string) => string;
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, formatDate }) => {
    return (
        <div className="relative border border-gray-200 rounded-lg p-6 flex-1 min-w-[280px] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            {/* Lateral color bar */}
            <div className="absolute left-0 rounded-l-lg top-0 h-full w-12 bg-gray-200" />

            {/* Testimonial's main data */}
            <div>
                <p className="text-gray-700 text-xl font-semibold mb-4 ml-10 line-clamp-4">
                    &quot;{testimonial.comentario}&quot;
                </p>
            </div>

            <div className="pt-2 text-right">
                <p className="font-semibold text-gray-600 mb-1">{testimonial.emisor}</p>
                <p className="text-sm text-gray-500 mb-0">{formatDate(testimonial.fecha)}</p>
            </div>
        </div>
    );
};

export default TestimonialCard;