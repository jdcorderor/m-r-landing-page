import React, { useState, useRef, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { useSlidesPerView, groupItems, formatDate } from '@/hooks/homePageHooks';
import { useFormTransition } from '@/hooks/useHomePageEffects'
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import TestimonialCard from './ui/TestimonialCard';

export default function Testimonials({ onReady }: { onReady: () => void }) {
    // State variable for toggling form
    const [showForm, setShowForm] = useState(false);
    const [MessageSentModal, setMessageSentModal] = useState<boolean>(false);
    const [MessageFailedModal, setMessageFailedModal] = useState<boolean>(false);
      
    // Ref for the comments form
    const formRef = useRef<HTMLDivElement>(null);
    
    // Custom hook for form transition effect
    useFormTransition(formRef, showForm);

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
            console.error("Error en el fetch:", error)
        })
        .finally(() => {
            onReady();
        });
    }, []);
    
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
        
        console.log("Enviando comentario...");
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
                setMessageSentModal(true);
                {/*setShowForm(false);*/}
        
            const data = await response.json();
                setTestimonials((prevTestimonials) => [...prevTestimonials, data]);
            }
        } catch (error) {
            console.error("Error al enviar el comentario:", error);
            setMessageFailedModal(true);
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
                    <div className="flex w-full items-center justify-between px-1 md:px-5 mb-2">
                        <span className="items-center text-3xl md:text-5xl font-bold">Comparte tu experiencia</span>
                        <Button
                            className="w-[50vw] md:w-[20vw] bg-white-100 border text-gray-700"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? "Cancelar" : "Agregar comentario"}
                        </Button>
                    </div>
                </div>
                <div id="comments-form" ref={formRef} className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <form onSubmit={ handleCommentSubmit } className="pt-8">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
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
                            <Button type="submit" className="w-[50%] my-2 bg-white-100 border border-gray-300 hover:bg-gray-200 rounded-lg">Enviar</Button>
                        </div>
                        {/* Modal de confirmación */}
                        {MessageSentModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-50 backdrop-blur-sm ">
                                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                                    <h2 className="text-xl font-bold text-center mb-4">✅<br></br>Comentario Guardado</h2>
                                    <p className="text-center mb-6">Su comentario se ha añadido correctamente. Proximamente aparecerá en el Carrusel de comentarios</p>
                                    <div className="flex justify-center">
                                        <Button
                                            className="w-1/2 bg-green-300 hover:bg-green-500 rounded"
                                            onClick={() => {
                                                setMessageSentModal(false);
                                                setShowForm(false);
                                            }}
                                        >
                                            Continuar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Modal de Error */}
                        {MessageFailedModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                                    <h2 className="text-xl font-bold text-center mb-4">😥<br></br>Ha ocurrido un error</h2>
                                    <p className="text-center mb-6">No se pudo añadir su comentario. Por favor, intentelo nuevamente y si el error persiste contecte a soporte</p>
                                    <div className="flex justify-center">
                                        <Button
                                            className="w-1/2 bg-green-300 text-black hover:bg-green-500 text-white rounded"
                                            onClick={() => {
                                                setMessageFailedModal(false);
                                            }}
                                        >
                                            Continuar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    )
}