import React, { useState, useRef, useEffect } from 'react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./ui/arrows/carouselArrows";

import { Testimonial } from "@/app/types/testimonial";
import TestimonialCard from './ui/cards/TestimonialCard';

import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { formatDate } from '@/hooks/formatDate';
import { useFormTransition } from '@/hooks/customEffects'

// Hook for calculating window width
function useWindowWidth() {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function Testimonials({ onReady } : { onReady: () => void }) {
    // Carousel settings
    const windowWidth = useWindowWidth();

    const slidesToShow = windowWidth <= 768 ? 1 : 3;
    const arrowsVisibility = windowWidth > 700;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow,
        slidesToScroll: 1,
        adaptiveHeight: true,
        nextArrow: arrowsVisibility ? <NextArrow /> : undefined,
        prevArrow: arrowsVisibility ? <PrevArrow /> : undefined,
    };

    // -----------------------------------------------------------------------------

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
        <section>
            <section className="flex flex-col pt-18 md:pt-24 pb-12" id="testimonios">
                <h2 className="text-4xl md:text-5xl text-center font-bold px-10 mb-8 md:mb-14">Historias reales, sonrisas que inspiran.</h2>
                
                <div className="w-full px-5 md:px-20">
                    <Slider {...settings}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="w-full px-1 md:px-4">
                                <TestimonialCard key={index} testimonial={testimonial} formatDate={formatDate}></TestimonialCard>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            <section className="flex flex-col px-5 md:px-20 py-12 md:py-16 bg-gray-100 mt-8" id="comments">
                <div className="flex flex-col md:flex-row w-full justify-between items-center px-1 md:px-5 py-6 md:py-3 gap-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-center md:text-left text-gray-800">Comparte tu experiencia</h2>
                    <Button className="w-fit bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors duration-200 rounded-full px-20 py-2" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancelar" : "Enviar testimonio"}
                    </Button>
                </div>

                <div id="comments-form" ref={formRef} className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <form onSubmit={handleCommentSubmit} className="flex flex-col pt-8 gap-6 border-t-1 border-gray-200 md:border-t-0">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="sender" className="text-sm font-medium text-gray-700">Nombre y Apellido *</label>
                                <Input id="sender" type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Nombre" required className="text-sm border border-gray-300 rounded-lg "/>
                            </div>

                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo electrónico *</label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required className="text-sm border border-gray-300 rounded-lg"/>
                            </div>

                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="comment" className="text-sm font-medium text-gray-700">Comentario *</label>
                                <Input id="comment" type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Escribe tu comentario aquí" required className="text-sm border border-gray-300 rounded-lg"/>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button type="submit" className="w-fit bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-full transition-colors duration-200 px-20 py-2">
                                Enviar
                            </Button>
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
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-full py-2 mt-2 transition" onClick={() => setTestimonialSentModal(false)}> Continuar </Button>
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
                        <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-full py-2 mt-2 transition" onClick={() => setTestimonialFailedModal(false)}> Continuar </Button>
                    </div>
                </div>
            )}
        </section>
    )
}