"use client";
import React, { useState, useRef, useMemo, useEffect } from 'react';
import Carousel from "react-bootstrap/Carousel";
import Image from 'next/image';
import { useSlidesPerView, groupItems, formatDate } from '@/hooks/homePageHooks';
import { useFadeTransition, useFormTransition, useCarouselTransition, useHideMenuOnClickOutside } from '@/hooks/useHomePageEffects';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  // State variables for toggling form, services, and menu
  const [showForm, setShowForm] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Refs (services carousel, comments form)
  const formRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Custom hooks for effects (fade-in transition, deployment, and hide menu on click outside)
  useFadeTransition();
  useFormTransition(formRef, showForm);
  useCarouselTransition(carouselRef, showServices);
  useHideMenuOnClickOutside(menuOpen, setMenuOpen);

  // -----------------------------------------------------------------------------

  // Carousel slides per view (responsive)
  const slidesPerView = useSlidesPerView();

  // Define testimonial type and state
  type Testimonial = {
    comentario: string;
    emisor: string;
    fecha: string;
  };
  
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
    <div className="testimonial-card" key={index}>
      <p className="testimonial">&quot;{testimonial.comentario}&quot;</p>
      <p className="testimonial-name">{testimonial.emisor}</p>
      <p className="testimonial-date">{formatDate(testimonial.fecha)}</p>
    </div>
  )), [testimonials]);

  // Build testimonial carousel items, using useMemo for render optimization
  const testimonialSlides = useMemo(() => groupItems(testimonialCards, slidesPerView), [testimonialCards, slidesPerView]);

  // -----------------------------------------------------------------------------

  // Define service type and state
  type Service = {
    nombre: string;
    descripcion: string;
    url_imagen: string;
  }

  const [services, setServices] = useState<Service[]>([]);

  // Get services from the DB using fetch
  useEffect(() => {
    fetch("/api/servicios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => setServices(data.map((service: Service) => ({ nombre: service.nombre, descripcion: service.descripcion, imagen: service.url_imagen }))))
    .catch(error => {
      console.error("Error en el fetch", error);
    })
  }, []);
  
  // Build service cards, using useMemo for render optimization
  const serviceCards = useMemo(() => services.map((service, index) => (
    // Create a service card.
     <div key={index}></div>
  )), [services]);

  // Build service carousel items, using useMemo for render optimization
  const serviceSlides = useMemo(() => groupItems(serviceCards, slidesPerView), [serviceCards, slidesPerView]);

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
    <div className="container-1">

      {/* Header */}
      <header>
        <div className="header" >
          <div className="custom-font" >
            Mavarez & Román
          </div>
          {/* Navigator */}
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            <span className="bi bi-list"></span>
          </button>
          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#nosotros" onClick={() => setMenuOpen(false)}>Conócenos</a>
            <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
            <a href="#consultorio" onClick={() => setMenuOpen(false)}>Consultorio</a>
            <a href="#testimonios" onClick={() => setMenuOpen(false)}>Testimonios</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
            <a href="./agendar" className="booking-button" onClick={() => setMenuOpen(false)}>Agenda tu cita</a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main>
        {/* Hero section */}
        <div className="body section-fade">
          <div className="container-2">
            <h1>Mavarez & Román</h1>
            <p className="main-description">
              Somos un equipo de odontólogos comprometidos con tu salud bucal. Ofrecemos servicios de alta calidad para cuidar de tu sonrisa.
            </p><br /><br />
            <a href="./agendar" className="big booking-button">Agenda tu cita</a>
            <div className="carousel-container">
              <Carousel>
                <Carousel.Item>
                  <Image src="/images/carousel1.jpg" width={600} height={400} alt="" />
                </Carousel.Item>
                <Carousel.Item>
                  <Image src="/images/carousel1.jpg" width={600} height={400} alt="" />
                </Carousel.Item>
                <Carousel.Item>
                  <Image src="/images/carousel1.jpg" width={600} height={400} alt="" />
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>

        {/* About Us */}
        <div className="body section-fade" id="nosotros">
          <div className="container-2">
            <h2>Conócenos</h2>
            <div className="container-2 custom-grid-4">
              <div className="dentist-card">
                <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "45vh", borderRadius: "10px" }}></div>
                <h3 className="dentist-nombre">Od. Ramón Mavarez</h3>
                <p className="dentist-description">
                  Descripción
                </p>
              </div>
              <div className="dentist-card">
                <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "45vh", borderRadius: "10px" }}></div>
                <h3 className="dentist-nombre">Od. Patricia Román</h3>
                <p className="dentist-description">
                  Descripción
                </p>
              </div>
              <div className="dentist-card">
                <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "45vh", borderRadius: "10px" }}></div>
                <h3 className="dentist-nombre">Dr. José Espinoza</h3>
                <p className="dentist-description">
                  Descripción
                </p>
              </div>
              <div className="dentist-card">
                <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "45vh", borderRadius: "10px" }}></div>
                <h3 className="dentist-nombre">Od. Ramón Mavarez</h3>
                <p className="dentist-description">
                  Descripción
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="body section-fade" id="servicios">
          <div className="container-2">
            <div className="container-2 custom-grid">
              <div>
                <h2>Servicios</h2>                  
                <h4>Servicio 1</h4>
                <p className="description">Descripción del servicio 1</p>
                <h4>Servicio 2</h4>
                <p className="description">Descripción del servicio 2</p>
                <h4>Servicio 3</h4>
                <p className="description">Descripción del servicio 3</p>
                <button className="seemore-button" onClick={() => setShowServices(!showServices)}>{showServices ? "Ver menos" : "Ver más"}</button>
              </div>
              <div className="image" style={{ backgroundColor: "#f3f4f6", width: "100%", height: "100%", borderRadius: "10px" }}></div>
            </div>
          </div>
        </div>

        {/* Services carousel */}
        <div className={`body services-carousel-transition${showServices ? "visible" : ""}`} ref={carouselRef} id="services-carousel">
          <div>
            <Carousel>
              {serviceSlides.map((group, idx) => (
                <Carousel.Item key={idx}>
                  <div className="container-2">
                    <div className={`container-2 custom-grid${(slidesPerView === 2) ? "" : `-${slidesPerView}`}`}>
                      {group}
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Clinic */}
        <div className="body section-fade" id="consultorio">
          <div className="container-2">
            <h2>Consultorio</h2>
            <div className="container-2 custom-grid">
              <div>
                <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "50vh", borderRadius: "10px" }}></div>
                <h4>C.C. El Parral, Piso 1, Oficina 116</h4>
                <p className="description">Horario: 8:00 AM a 2:00 PM</p>
              </div>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000.037798736754!2d-69.28891356138514!3d10.061087597511873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e87670b60fee3ff%3A0x299f395e8a85ba60!2sConsultorio%20dentistol%C3%B3gico%20Dr%20Ram%C3%B3n%20Mavarez!5e0!3m2!1ses!2sve!4v1748920040093!5m2!1ses!2sve" 
              width="100%" height="100%" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="body block section-fade" id="testimonios">
          <h2>Testimonios</h2>
          <div className="container-2">
            <Carousel>
              {testimonialSlides.map((group, idx) => (
                <Carousel.Item key={idx}>
                  <div className={`custom-grid${(slidesPerView === 2) ? "" : `-${slidesPerView}`}`}>
                    {group}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>            
          </div>
        </div>
          
        {/* Comments */}  
        <div id="comments" className="gray-section section-fade">
          <div className="body custom-grid">
            <h3>Comparte tu experiencia</h3>
            <div className="button-container">
              <button className="addcomment-button" onClick={() => setShowForm(!showForm)}>{(showForm) ? "Cancelar" : "Agregar comentario"}</button>
            </div>
          </div>
          <div id="comments-form" ref={formRef} className={`container-4 comments-form-transition${showForm ? "visible" : ""}`}>
            <form onSubmit={ handleCommentSubmit }>
              <div className="container-4 custom-grid-3">
                <div>
                  <label htmlFor="">Nombre y Apellido *</label>
                  <input type="text" className="form-control" value={ sender } onChange={ (e) => setSender(e.target.value) } placeholder="Nombre" required />
                </div>
                <div>
                  <label htmlFor="">Correo electrónico *</label>
                  <input type="email" className="form-control" value={ email } onChange={ (e) => setEmail(e.target.value) } placeholder="Correo electrónico" required />
                </div>
                <div>
                  <label htmlFor="">Comentario *</label>
                  <input type="text" className="form-control" value={ comment } onChange={ (e) => setComment(e.target.value) } placeholder="Escribe tu comentario aquí" required></input>
                </div>
              </div>
              <button type="submit" className="submitcomment-button">Enviar</button>
            </form>
          </div>
        </div>
      </main>
        
      {/* Footer */}
      <footer>
        <div className="footer" id="contacto">
          <div>
            <div className="subtitle">
              Mavarez & Román
            </div>
            <div>
              <i className="bi bi-telephone"></i> 0212-1234567
            </div>
            <div>
              <i className="bi bi-envelope"></i> info@mavarezroman.com
            </div>
            <div>
              <i className="bi bi-instagram"></i> mavarezroman
            </div>
            <p className="copyright">
              Copyright 2025 <i className="bi bi-c-circle"></i>, Mavarez & Román. Todos los derechos reservados.
            </p>
          </div>
          <div className="index">
            <ul>
              <li><a href="#nosotros">Conócenos</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#consultorio">Consultorio</a></li>
              <li><a href="#testimonios">Testimonios</a></li>
              <li><a href="./agendar">Agendar cita</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}