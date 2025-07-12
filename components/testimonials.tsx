import React, { useState, useRef, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { useSlidesPerView, groupItems, formatDate } from '@/hooks/homePageHooks';
import { useFormTransition } from '@/hooks/useHomePageEffects'
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import TestimonialCard from './ui/TestimonialCard';

export default function Testimonials({ onReady } : { onReady: () => void }) {
    // State variable for toggling form
    const [showForm, setShowForm] = useState(false);
      
    // Ref for the comments form
    const formRef = useRef<HTMLDivElement>(null);
    
    // Custom hook for form transition effect
    useFormTransition(formRef, showForm);

    // -----------------------------------------------------------------------------

    // State variables for success/fail modals
    const [TestimonialSentModal, setTestimonialSentModal] = useState<boolean>(false);
    const [TestimonialFailedModal, setTestimonialFailedModal] = useState<boolean>(false);

    // -----------------------------------------------------------------------------
    
    // Carousel slides per view (responsive)
    const slidesPerView = useSlidesPerView();
    
    // Define testimonial type and state
    type Testimonial = {
        comentario: string;
        emisor: string;
        fecha: string;
    };
    
    // State variable for testimonials list
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
      
    // Get testimonials from the DB using fetch
    useEffect(() => {
        fetch("/api/comentarios", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => setTestimonials(data))
        .catch((error) => {
          console.error("Error en el fetch:", error);  
        })
        .finally(() => {
            onReady();
        })
    }, [onReady]);
    
    // Build testimonial cards, using useMemo for render optimization
    const testimonialCards = useMemo(() => testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} testimonial={testimonial} formatDate={formatDate}></TestimonialCard>
    )), [testimonials]);
    
    // Build testimonial carousel items, using useMemo for render optimization
    const testimonialSlides = useMemo(() => groupItems(testimonialCards, slidesPerView), [testimonialCards, slidesPerView]);
    
    // -----------------------------------------------------------------------------
    
    // Define states for comment's form fields
    const [ sender, setSender ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ comment, setComment ] = useState("");
    
    // Post new comment to the DB using fetch
    const handleCommentSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        const newComment = {
            emisor: sender,
            email: email,
            comentario: comment
        };
    
        try {
            const response = await fetch("/api/comentarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newComment),
                credentials: "include",
            });
    
            if (response.ok) {
                setSender("");
                setEmail("");
                setComment("");
                setShowForm(false);
                setTestimonialSentModal(true);
            }
        } catch (error) {
            console.error("Error al enviar el comentario:", error);
            setTestimonialFailedModal(true);
        }
    }
    
    return (
        <div>
            <section className="flex flex-col py-12 md:py-16 px-[5vw]" id="testimonios">
                <h2 style={{ fontSize: '3.2rem', fontWeight: 'bold' }}>Testimonios</h2>
                <div className="w-full mt-8">
                    <Carousel className="fit-content">
                        {testimonialSlides.map((group, idx) => (
                            <Carousel.Item key={idx}>
                                <div className="flex gap-5">
                                    {group}
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>            
                </div>
            </section>

            <section className="flex flex-col py-12 md:py-16 px-[5vw] bg-gray-100" id="comments">
                <div className="flex">
                    <div className="flex w-full items-center justify-between mb-2">
                        <span className="items-center text-3xl md:text-5xl font-bold">Comparte tu experiencia</span>
                        <Button
                            className="border-gray-200 w-[50vw] md:w-[20vw] bg-gray-100 rounded-full  text-gray-700"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <span className="text-lg">{showForm ? "Cancelar" : "Agregar comentario"}</span>
                        </Button>
                    </div>
                </div>
                <div id="comments-form" ref={formRef} className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <form onSubmit={ handleCommentSubmit } className="pt-8">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-12">
                            <div className="flex flex-col w-full md:w-[30%]">
                                <label className="mb-2 ml-2" htmlFor="">Nombre y Apellido *</label>
                                <Input type="text" className="" value={ sender } onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSender(e.target.value) } placeholder="Nombre" required />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%]">
                                <label className="mb-2 ml-2" htmlFor="">Correo electrónico *</label>
                                <Input type="email" className="w-full" value={ email } onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) } placeholder="Correo electrónico" required />
                            </div>
                            <div className="flex flex-col  w-full md:w-[30%]">
                                <label className="mb-2 ml-2" htmlFor="">Comentario *</label>
                                <Input type="text" className="" value={ comment } onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value) } placeholder="Escribe tu comentario aquí" required></Input>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center">
                            <Button type="submit" className="w-[50%] my-2 bg-white-100 border border-gray-300 hover:bg-gray-200 rounded-full">Enviar</Button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Success modal */}
            {TestimonialSentModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full flex flex-col items-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold text-center mb-2">¡Tu testimonio ha sido enviado!</span>
                        <span className="text-center text-sm text-gray-600 my-2">Estimado paciente, gracias por compartir tu experiencia con nosotros.</span>
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg py-2 mt-2 transition" onClick={() => setTestimonialSentModal(false)}> Continuar </Button>
                    </div>
                </div>
            )}
            
            {/* Fail modal */}
            {TestimonialFailedModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full flex flex-col items-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold text-center mb-2">¡Ups, ha ocurrido un error!</span>
                        <span className="text-center text-sm text-gray-600 my-2">Estimado paciente, su testimonio no ha sido enviado. Por favor, intente nuevamente.</span>
                        <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg py-2 mt-2 transition" onClick={() => setTestimonialFailedModal(false)}> Continuar </Button>
                    </div>
                </div>
            )}
        </div>
    )
}