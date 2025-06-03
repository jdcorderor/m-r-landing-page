"use client";
import React, { useState } from 'react';
import Carousel from "react-bootstrap/Carousel";
import Image from 'next/image';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div onClick={() => showForm ? setShowForm(!showForm) : null} className="w-100 h-100" style={{ overflowX: "hidden", overflowY: "auto", position: "relative" }}>
        <div className="header d-flex w-100 h-30 align-items-center justify-between" >
          <div className="p-20 custom-font" >
            Mavarez & Román
          </div>
          <div className="d-flex  p-20 align-items-center custom-gap" >
            <a href="#conocenos">Conócenos</a>
            <a href="#servicios">Servicios</a>
            <a href="#consultorio">Consultorio</a>
            <a href="#testimonios">Testimonios</a>
            <a href="#contacto">Contacto</a>
            <a href="./Agendar" className="bg-black p-2.5" style={{ color: "white", fontSize: "1.1rem", fontWeight: "500", borderRadius: "7px", textDecoration: "none" }}>Agenda tu cita</a>
          </div>
        </div> 
        <div className="body d-flex p-20">
            <div className="w-100">
                <h1 style={{ fontSize: "7.5vh", fontWeight: "bold" }}>Mavarez & Román</h1>
                <p className="mt-4 mb-4" style={{ fontSize: "2.5vh", color: "#6b7280" }}>
                  Clínica odontológica con 24 años.
                </p>
                <br/>
                <a href="./Agendar" className="bg-black p-3" style={{ color: "white", fontSize: "1.3rem", fontWeight: "500", borderRadius: "7px", textDecoration: "none" }}>Agenda tu cita</a>
                <div style={{ marginTop: "10vh", width: "100%", height: "70vh" }}>
                  <Carousel>
                    <Carousel.Item>
                      <Image className="d-block w-100" src="/images/carousel1.jpg" width={600} height={400} alt="" style={{ objectFit: "cover", width: "100%", height: "70vh" }} />
                    </Carousel.Item>
                    <Carousel.Item>
                      <Image className="d-block w-100" src="/images/carousel1.jpg" width={600} height={400} alt="" style={{ objectFit: "cover", width: "100%", height: "70vh" }} />
                    </Carousel.Item>
                    <Carousel.Item>
                      <Image className="d-block w-100" src="/images/carousel1.jpg" width={600} height={400} alt="" style={{ objectFit: "cover", width: "100%", height: "70vh" }} />
                    </Carousel.Item>
                  </Carousel>
                </div>
            </div>
        </div>
        <div className="body d-flex p-20" id="conocenos">
            <div className="w-100">
                <h2>Conócenos</h2>
                <div className="custom-grid w-100" style={{ marginTop: "8vh" }}>
                  <div className="odont-card">
                    <div style={{ backgroundColor: "#f3f4f6", width: "50%", height: "45vh", borderRadius: "10px" }}></div>
                    <h3 className="odont-nombre">Od. Ramón Mavarez</h3>
                    <p className="odont-desc">
                      Descripción
                    </p>
                  </div>
                  <div className="odont-card">
                    <div style={{ backgroundColor: "#f3f4f6", width: "50%", height: "45vh", borderRadius: "10px" }}></div>
                    <h3 className="odont-nombre">Od. Patricia Román</h3>
                    <p className="odont-desc">
                      Descripción
                    </p>
                  </div>
                </div>
            </div>
        </div>
        <div className="body d-flex p-20" id="servicios">
            <div className="w-100">
                <div className="custom-grid w-100" style={{ marginTop: "3vh" }}>
                  <div>
                    <h2 className="mb-5">Servicios</h2>
                    <h4>Servicio 1</h4>
                    <p className="description mb-4">Descripción del servicio 1</p>
                    <h4>Servicio 2</h4>
                    <p className="description mb-4">Descripción del servicio 2</p>
                    <h4>Servicio 3</h4>
                    <p className="description mb-4">Descripción del servicio 3</p>
                    <button className="bg-black mt-3 p-2.5" style={{ color: "white", fontSize: "1.2rem", fontWeight: "500", borderRadius: "7px" }}>Ver más</button>
                  </div>
                  <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "100%", borderRadius: "10px" }}></div>
                </div>
            </div>
        </div>
        <div className="body d-flex p-20" id="consultorio">
            <div className="w-100">
                <h2 className="mb-5">Consultorio</h2>
                <div className="custom-grid w-100" style={{ marginTop: "8vh" }}>
                  <div>
                    <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "40vh", borderRadius: "10px" }}></div>
                    <h4>C.C. El Parral, Piso 1, Oficina 116</h4>
                    <p className="description mb-4">Horario: 8:00 AM a 2:00 PM</p>
                  </div>
                  <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "100%", borderRadius: "10px" }}>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000.037798736754!2d-69.28891356138514!3d10.061087597511873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e87670b60fee3ff%3A0x299f395e8a85ba60!2sConsultorio%20Odontol%C3%B3gico%20Dr%20Ram%C3%B3n%20Mavarez!5e0!3m2!1ses!2sve!4v1748920040093!5m2!1ses!2sve" 
                    width="100%" height="100%" style={{ borderRadius: "10px" }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                  </div>
                </div>
            </div>
        </div>
        <div className="body p-20" id="testimonios">
          <h2 className="mb-3">Testimonios</h2>
          <Carousel>
            <Carousel.Item>
              <div className="w-100">
                <div className="custom-grid-3 w-100" style={{ marginTop: "8vh" }}>
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
              <div className="w-100">
                <div className="custom-grid-3 w-100" style={{ marginTop: "8vh" }}>
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
        <div style={{ backgroundColor: "#f3f4f6", alignItems: "center" }}>
          <div className="body custom-grid p-20">
            <h2>Comparte tu experiencia</h2>
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <button className="bg-black p-3" style={{ color: "white", fontSize: "1.3rem", fontWeight: "500", width: "15vw", borderRadius: "7px" }} onClick={() => setShowForm(!showForm)}>Agregar comentario</button>
            </div>
          </div>
          <div id="comments-form" className="body pt-0 pb-5" style={{ width: "100%", maxWidth: "800px", margin: "0 auto", display: showForm ? "block" : "none" }}>
            <form action="submit">
              <div className="w-100 custom-grid">
                <div>
                  <label htmlFor="">Nombre *</label>
                  <input type="text" className="form-control" placeholder="Nombre" />
                </div>
                <div>
                  <label htmlFor="">Correo electrónico *</label>
                  <input type="email" className="form-control" placeholder="Correo electrónico" />
                </div>
              </div>
              <label htmlFor="">Comentario *</label>
              <input type="text" className="form-control mb-3" placeholder="Escribe tu comentario aquí"></input>
              <button type="submit" className="btn w-100" style={{ fontWeight: "bold", backgroundColor: "#f1f3f4", fontSize: "1.1rem" }}>Enviar</button>
            </form>
          </div>
        </div>
        <div className="footer p-20" id="contacto" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="mb-5" style={{ fontSize: "1.2rem" }}>
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
            <div className="mt-5" style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              Copyright 2025 <i className="bi bi-c-circle"></i>, Mavarez & Román. Todos los derechos reservados.
            </div>
          </div>
          <div style={{ minWidth: "180px", marginLeft: "40px" }}>
            <ul className="p-0 m-0" style={{ listStyle: "none" }}>
              <li><a href="#conocenos">Conócenos</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#consultorio">Consultorio</a></li>
              <li><a href="#testimonios">Testimonios</a></li>
              <li><a href="./Agendar">Agendar cita</a></li>
            </ul>
          </div>
        </div>
    </div>
  );
}