import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { useSlidesPerView, groupItems, formatDate } from '@/hooks/homePageHooks';
import { useFormTransition } from '@/hooks/useHomePageEffects';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import TestimonialCard from './ui/TestimonialCard';

export type Testimonial = {
    id: string;
    comentario: string;
    emisor: string;
    fecha: string;
    email?: string;
};

export type NewCommentPayload = {
    emisor: string;
    email: string;
    comentario: string;
};

const API_COMMENTS_GET_URL = "/api/comentarios";
const API_COMMENTS_POST_URL = "/api/comentarios";

// --- Mock Data para Testimonios ---
const MOCK_TESTIMONIALS: Testimonial[] = [
    {
        id: "1",
        comentario: "Excelente atención y resultados. ¡Mi sonrisa nunca se vio tan bien!",
        emisor: "Ana García",
        fecha: "2024-03-15T10:00:00Z",
    },
    {
        id: "2",
        comentario: "Profesionales muy amables y el consultorio es impecable. Los recomiendo al 100%.",
        emisor: "Carlos Rodríguez",
        fecha: "2024-04-20T14:30:00Z",
    },
    {
        id: "3",
        comentario: "Siempre una experiencia positiva. Explican todo con claridad y te hacen sentir cómodo.",
        emisor: "María Fernanda P.",
        fecha: "2024-05-01T09:00:00Z",
    },
    {
        id: "4",
        comentario: "Mi miedo al dentista desapareció gracias a su paciencia y profesionalismo.",
        emisor: "Juan Pérez",
        fecha: "2024-06-10T11:45:00Z",
    },
    {
        id: "5",
        comentario: "El tratamiento fue indoloro y los resultados superaron mis expectativas. ¡Increíble!",
        emisor: "Laura Martínez",
        fecha: "2024-06-25T16:00:00Z",
    },
];

export default function Testimonials() {
    const [showForm, setShowForm] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    useFormTransition(formRef, showForm);

    const slidesPerView = useSlidesPerView();
    const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);
    const [isLoadingTestimonials, setIsLoadingTestimonials] = useState<boolean>(false);
    const [testimonialsError, setTestimonialsError] = useState<string | null>(null);

    const fetchTestimonials = useCallback(async () => {
        // PARA LA API
        // setIsLoadingTestimonials(true);
        // setTestimonialsError(null);
        // try {
        //   const response = await fetch(API_COMMENTS_GET_URL, {
        //     method: "GET",
        //     headers: { "Content-Type": "application/json" },
        //     credentials: "include",
        //   });
        //   if (!response.ok) {
        //     const errorData = await response.json();
        //     throw new Error(errorData.message || `Error al cargar testimonios: ${response.status} ${response.statusText}`);
        //   }
        //   const data: Testimonial[] = await response.json();
        //   setTestimonials(data);
        // } catch (err) {
        //   console.error("Error al obtener testimonios:", err);
        //   setTestimonialsError("No pudimos cargar los testimonios. Por favor, inténtelo de nuevo más tarde.");
        // } finally {
        //   setIsLoadingTestimonials(false);
        // }

        // Para simular un retraso en la carga de mock data si lo deseas:
        setIsLoadingTestimonials(true);
        setTimeout(() => {
            setTestimonials(MOCK_TESTIMONIALS);
            setIsLoadingTestimonials(false);
        }, 500); // Simula 0.5 segundos de carga
    }, []);

    // Para la API
    // useEffect(() => {
    //   fetchTestimonials();
    // }, [fetchTestimonials]);


    const testimonialCards = useMemo(() => testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} formatDate={formatDate} />
    )), [testimonials, formatDate]);

    const testimonialSlides = useMemo(() => groupItems(testimonialCards, slidesPerView), [testimonialCards, slidesPerView]);

    const [sender, setSender] = useState("");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
    const [submitCommentError, setSubmitCommentError] = useState<string | null>(null);
    const [submitCommentSuccess, setSubmitCommentSuccess] = useState<string | null>(null);

    // Función para manejar el envío del formulario de comentarios
    const handleCommentSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmittingComment(true);
        setSubmitCommentError(null);
        setSubmitCommentSuccess(null);

        const newCommentPayload: NewCommentPayload = {
            emisor: sender,
            email: email,
            comentario: comment,
        };

        try {
            // const response = await fetch(API_COMMENTS_POST_URL, {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify(newCommentPayload),
            //   credentials: "include",
            // });
            // if (!response.ok) {
            //   const errorData = await response.json();
            //   throw new Error(errorData.message || `Error al enviar comentario: ${response.status} ${response.statusText}`);
            // }
            // const addedComment: Testimonial = await response.json();

            // ** SIMULACIÓN DE ENVÍO EXITOSO **
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso de red
            const addedComment: Testimonial = {
                ...newCommentPayload,
                id: (Math.random() * 100000).toFixed(0), // Genera un ID mock
                fecha: new Date().toISOString(), // Fecha actual
            };
            // ** FIN SIMULACIÓN **

            setTestimonials((prevTestimonials) => [...prevTestimonials, addedComment]);
            setSubmitCommentSuccess("¡Gracias por tu comentario! Se ha enviado correctamente.");

            setSender("");
            setEmail("");
            setComment("");
            setTimeout(() => {
                setShowForm(false);
                setSubmitCommentSuccess(null);
            }, 3000);

        } catch (err) {
            console.error("Error al enviar el comentario (simulado):", err);
            setSubmitCommentError("No pudimos enviar tu comentario (simulado). Por favor, inténtelo de nuevo.");
        } finally {
            setIsSubmittingComment(false);
        }
    }, [sender, email, comment]);

    return (
        <div>
            <section className="flex flex-col py-12 md:py-16 px-[5vw]" id="testimonios">
                <h2 className="text-5xl font-bold mb-8 text-center md:text-left">Testimonios</h2>
                <div className="w-full mt-8">
                    {isLoadingTestimonials ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-gray-700 animate-pulse">Cargando testimonios...</p>
                        </div>
                    ) : testimonialsError ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-red-600">{testimonialsError}</p>
                            <button
                                onClick={fetchTestimonials}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-gray-700">Aún no hay testimonios. ¡Sé el primero en dejar uno!</p>
                        </div>
                    ) : (
                        <Carousel className="fit-content">
                            {testimonialSlides.map((group, idx) => (
                                <Carousel.Item key={idx}>
                                    <div className="flex gap-4 justify-center items-stretch">
                                        {group}
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                </div>
            </section>

            <section className="flex flex-col py-12 md:py-16 px-[5vw] bg-gray-100" id="comments">
                <div className="flex">
                    <div className="flex w-full items-center justify-between px-1 md:px-5 mb-2">
                        <span className="items-center text-3xl md:text-5xl font-bold">Comparte tu experiencia</span>
                        <Button
                            className="w-[50vw] md:w-[20vw] bg-white-100 border border-gray-300 hover:bg-gray-200 rounded-lg py-2 px-4"
                            onClick={() => setShowForm(!showForm)}
                            disabled={isSubmittingComment}
                        >
                            {showForm ? "Cancelar" : "Agregar comentario"}
                        </Button>
                    </div>
                </div>

                <div id="comments-form" ref={formRef} className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    {submitCommentSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">¡Éxito!</strong>
                            <span className="block sm:inline"> {submitCommentSuccess}</span>
                        </div>
                    )}
                    {submitCommentError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">¡Error!</strong>
                            <span className="block sm:inline"> {submitCommentError}</span>
                        </div>
                    )}

                    <form onSubmit={handleCommentSubmit} className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
                            <div className="flex flex-col w-full md:w-[30%]">
                                <label className="mb-2 ml-2 text-gray-700" htmlFor="senderName">Nombre y Apellido *</label>
                                <Input
                                    id="senderName"
                                    type="text"
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={sender}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSender(e.target.value)}
                                    placeholder="Nombre"
                                    required
                                    disabled={isSubmittingComment}
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%]">
                                <label className="mb-2 ml-2 text-gray-700" htmlFor="senderEmail">Correo electrónico *</label>
                                <Input
                                    id="senderEmail"
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    placeholder="Correo electrónico"
                                    required 
                                    disabled={isSubmittingComment}
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%]">
                                <label className="mb-2 ml-2 text-gray-700" htmlFor="commentText">Comentario *</label>
                                <Input
                                    id="commentText"
                                    type="text"
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                                    value={comment}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
                                    placeholder="Escribe tu comentario aquí"
                                    required
                                    disabled={isSubmittingComment}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row justify-center">
                            <Button
                                type="submit"
                                className="w-[50%] my-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-2 px-4 transition-colors"
                                disabled={isSubmittingComment}
                            >
                                {isSubmittingComment ? "Enviando..." : "Enviar Comentario"}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}