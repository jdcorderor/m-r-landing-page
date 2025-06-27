import React, { useState, useRef, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { useSlidesPerView, groupItems, formatDate } from '@/hooks/homePageHooks';
import { useFormTransition } from '@/hooks/useHomePageEffects'

export default function Testimonials() {
    // State variable for toggling form
    const [showForm, setShowForm] = useState(false);
      
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
        .catch((error) => console.error("Error en el fetch:", error));
    }, []);
    
    // Build testimonial cards, using useMemo for render optimization
    const testimonialCards = useMemo(() => testimonials.map((testimonial, index) => (
        <div className="border rounded-lg p-4" key={index}>
            <p className="">&quot;{testimonial.comentario}&quot;</p>
            <p className="">{testimonial.emisor}</p>
            <p className="">{formatDate(testimonial.fecha)}</p>
        </div>
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
        
                const data = await response.json();
                setTestimonials((prevTestimonials) => [...prevTestimonials, data]);
            }
        } catch (error) {
            console.error("Error al enviar el comentario:", error);
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
                                <div className="flex gap-4">
                                    {group}
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>            
                </div>
            </section>

            <section className="flex flex-col py-12 md:py-16 px-[5vw] bg-gray-100" id="comments">
                <div className="flex items-center">
                    <h3 style={{ fontSize: "2.5rem", fontWeight: "bold" }} className="mx-auto">Comparte tu experiencia</h3>
                    <div className="mx-auto bg-white border rounded-[20px] font-medium py-2 px-4 ">
                        <button className="" onClick={() => setShowForm(!showForm)}>{(showForm) ? "Cancelar" : "Agregar comentario"}</button>
                    </div>
                </div>
                <div className={`${showForm ? "" : "hidden"}`} id="comments-form" ref={formRef}>
                    <form onSubmit={ handleCommentSubmit }>
                        <div className="">
                            <div>
                                <label htmlFor="">Nombre y Apellido *</label>
                                <input type="text" className="" value={ sender } onChange={ (e) => setSender(e.target.value) } placeholder="Nombre" required />
                            </div>
                            <div>
                                <label htmlFor="">Correo electrónico *</label>
                                <input type="email" className="" value={ email } onChange={ (e) => setEmail(e.target.value) } placeholder="Correo electrónico" required />
                            </div>
                            <div>
                                <label htmlFor="">Comentario *</label>
                                <input type="text" className="" value={ comment } onChange={ (e) => setComment(e.target.value) } placeholder="Escribe tu comentario aquí" required></input>
                            </div>
                        </div>
                        <button type="submit" className="">Enviar</button>
                    </form>
                </div>
            </section>
        </div>
    )
}