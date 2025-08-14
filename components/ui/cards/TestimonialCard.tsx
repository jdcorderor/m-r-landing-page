import React from 'react';

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
        <div className="flex flex-col min-h-45 justify-between border border-gray-200 rounded-xl p-6">
            <blockquote className="text-gray-800 text-lg md:text-xl font-medium leading-relaxed line-clamp-4" aria-label="Testimonio">
                “{testimonial.comentario}”
            </blockquote>

            <div className="mt-6 text-right">
                <p className="text-gray-700 font-semibold">{testimonial.emisor}</p>
                <p className="text-sm text-gray-500">{formatDate(testimonial.fecha)}</p>
            </div>
        </div>
    );
};

export default TestimonialCard;