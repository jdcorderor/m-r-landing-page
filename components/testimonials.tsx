import React, { useState, useRef, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import { useSlidesPerView, groupItems, formatDate } from '@/hooks/homePageHooks';
import { useFormTransition } from '@/hooks/useHomePageEffects'
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

export default function Testimonials() {
    // State variable for toggling form
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(true);
};
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
    .then((response) => {
        if (!response.ok) {throw new Error(`API Error: ${response.status}`);}
        return response.json();
    })
    .then((data) => setTestimonials(data))
    .catch((error) => {
        console.warn("Fallo al obtener testimonios. Usando datos mock:", error.message);
        const mockTestimonials: Testimonial[] = [
        {
            emisor: "Prueba 1",
            comentario: "¡Excelente atención y profesionales de primera!",
            fecha: "2024-10-10",
        },
        {
            emisor: "Prueba 2",
            comentario: "Me encantó el trato personalizado. Recomendado al 100%.",
            fecha: "2025-01-15",
        },
        {
            emisor: "Prueba 3",
            comentario: "Todo el proceso fue rápido y cómodo. Gracias por su dedicación.",
            fecha: "2025-03-08",
        },
        {
            emisor: "Prueba 4",
            comentario: "¡Excelente atención y profesionales de primera!",
            fecha: "2024-10-10",
        },
        {
            emisor: "Prueba 5",
            comentario: "¡Excelente atención y profesionales de primera!",
            fecha: "2024-10-10",
        },
        ];
        setTestimonials(mockTestimonials);
        });
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
            </section>

            <section className="flex flex-col py-12 md:py-16 px-[5vw] bg-gray-100" id="comments">
                <div className="flex">
                    <div className="flex w-full items-center justify-between px-1 md:px-5 mb-2">
                        <span className="items-center text-3xl md:text-5xl font-bold">Comparte tu experiencia</span>
                        <Button
                            className="w-[50vw] md:w-[20vw] bg-white-100 border"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? "Cancelar" : "Agregar comentario"}
                        </Button>
                    </div>
                </div>
                <div id="comments-form" ref={formRef} className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <form onSubmit={ handleSubmit } className="pt-6">
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
                        
                        {showModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                                    <h2 className="text-xl font-bold text-center mb-4">✅<br></br>Comentario Guardado</h2>
                                    <p className="text-center mb-6">Su comentario se ha añadido correctamente. Proximamente aparecerá en el Carrusel de comentarios</p>
                                    <div className="flex justify-center">
                                        <Button
                                            className="w-1/2 bg-green-300 hover:bg-green-500 rounded"
                                            onClick={() => {
                                                setShowModal(false);
                                                setSender("");
                                                setEmail("");
                                                setComment("");
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
            <div className="w-full mt-8">
                <Carousel className="fit-content" 
                    interval={null}
                    nextIcon={<span className="text-3xl text-black p-3 ms-20 rounded-full">❯</span>}
                    prevIcon={<span className="text-3xl text-black p-3 me-20 rounded-full">❮</span>}
                    >
                    {testimonialSlides.map((group, idx) => (
                        <Carousel.Item key={idx}>
                            <div className="flex gap-4 mx-24 justify-center">
                                    {group}                                </div>
                        </Carousel.Item>
                    ))}
                </Carousel>            
            </div>
        </div>
    )
}