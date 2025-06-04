"use client";
import React, { useState } from 'react';
import Carousel from "react-bootstrap/Carousel";
import Image from 'next/image';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
            <a href="#nosotros">Conócenos</a>
            <a href="#servicios">Servicios</a>
            <a href="#consultorio">Consultorio</a>
            <a href="#testimonios">Testimonios</a>
            <a href="#contacto">Contacto</a>
            <a href="./agendar" className="booking-button">Agenda tu cita</a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main>
        {/* Hero section */}
        <div className="body">
          <div className="container-2">
            <h1>Mavarez & Román</h1>
            <p className="main-description">
              Somos un equipo de odontólogos comprometidos con tu salud bucal. Ofrecemos servicios de alta calidad para cuidar de tu sonrisa.
            </p>
            <br/>
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
        <div className="body" id="nosotros">
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
        <div className="body" id="servicios">
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
                <button className="seemore-button" onClick={() => setShowServices(!showServices)}>Ver más</button>
              </div>
              <div className="image" style={{ backgroundColor: "#f3f4f6", width: "100%", height: "100%", borderRadius: "10px" }}></div>
            </div>
          </div>
        </div>

        <div className="body" id="services-carousel" style={{ display: showServices ? "block" : "none" }}>
          <div className="gray-section">
            <Carousel>
              <Carousel.Item>
                <div className="container-2">
                  <div className="container-2 custom-grid-3">
                    <div className="service-card">
                      
                    </div>
                    <div className="service-card">

                    </div>
                    <div className="service-card">

                    </div>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="container-2">
                  <div className="container-2 custom-grid-3">
                    <div className="service-card">

                    </div>
                    <div className="service-card">

                    </div>
                    <div className="service-card">

                    </div>
                  </div>
                </div>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>

        {/* Clinic */}
        <div className="body" id="consultorio">
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
        <div className="body block" id="testimonios">
          <h2>Testimonios</h2>
          <div className="container-2">
            <Carousel>
              <Carousel.Item>
                <div>
                  <div className="custom-grid-3">
                    <div className="testimonial-card">
                      <p className="testimonial">&quot;Excelente servicio&quot;</p>
                      <p className="testimonial-name">Nombre del paciente</p>
                      <p className="testimonial-date">Fecha</p>
                    </div>
                    <div className="testimonial-card">
                      <p className="testimonial">&quot;Excelente servicio&quot;</p>
                      <p className="testimonial-name">Nombre del paciente</p>
                      <p className="testimonial-date">Fecha</p>
                    </div>
                    <div className="testimonial-card">
                      <p className="testimonial">&quot;Excelente servicio&quot;</p>
                      <p className="testimonial-name">Nombre del paciente</p>
                      <p className="testimonial-date">Fecha</p>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="container-2">
                  <div className="container-2 custom-grid-3">
                    <div className="testimonial-card">
                      <p className="testimonial">&quot;Excelente servicio&quot;</p>
                      <p className="testimonial-name">Nombre del paciente</p>
                      <p className="testimonial-date">Fecha</p>
                    </div>
                    <div className="testimonial-card">
                      <p className="testimonial">&quot;Excelente servicio&quot;</p>
                      <p className="testimonial-name">Nombre del paciente</p>
                      <p className="testimonial-date">Fecha</p>
                    </div>
                    <div className="testimonial-card">
                      <p className="testimonial">&quot;Excelente servicio&quot;</p>
                      <p className="testimonial-name">Nombre del paciente</p>
                      <p className="testimonial-date">Fecha</p>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            </Carousel>            
          </div>
        </div>
          
        {/* Comments */}  
        <div id="comments" className="gray-section">
          <div className="body custom-grid">
            <h3>Comparte tu experiencia</h3>
            <div className="button-container">
              <button className="addcomment-button" onClick={() => setShowForm(!showForm)}>Agregar comentario</button>
            </div>
          </div>
          <hr />
          <div id="comments-form" className="container-4" style={{ display: showForm ? "block" : "none" }}>
            <form action="submit">
              <div className="container-4 custom-grid-3">
                <div>
                  <label htmlFor="">Nombre y Apellido *</label>
                  <input type="text" className="form-control" placeholder="Nombre" />
                </div>
                <div>
                  <label htmlFor="">Correo electrónico *</label>
                  <input type="email" className="form-control" placeholder="Correo electrónico" />
                </div>
                <div>
                  <label htmlFor="">Comentario *</label>
                  <input type="text" className="form-control" placeholder="Escribe tu comentario aquí"></input>
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