"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  const [doctor, setDoctor] = useState<string | null>(null);

  return (
    <div className="container-1 booking">
      <div className="header no-lower-space">
        <div className="custom-font">
          <a href="../">Mavarez & Román</a>
        </div>
      </div> 
      <div className="body no-upper-space custom-grid">
        <div className="container-2">
          <h4>Agendar</h4>
          <form action="submit">
            <div className="container-2 custom-grid">
              <div>
                <label htmlFor="">Nombre *</label>
                <input type="text" className="form-control" placeholder="Nombre" />
              </div>
              <div>
                <label htmlFor="">Apellido *</label>
                <input type="text" className="form-control" placeholder="Apellido" />
              </div>
            </div>
            <div className="container-2 custom-grid">
              <div>
                <label htmlFor="">Cédula de Identidad *</label>
                <input type="text" className="form-control" placeholder="Cédula (ej. V-12345678)" />
              </div>
              <div>
                <label htmlFor="">Fecha de nacimiento *</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="container-2 custom-grid">
              <div>
                <label htmlFor="">Correo electrónico *</label>
                <input type="email" className="form-control" placeholder="Correo electrónico" />
              </div>
              <div>
                <label htmlFor="">Teléfono *</label>
                <input type="tel" className="form-control" placeholder="Teléfono (ej. 04240001234)" />
              </div>
            </div>
            <div className="variable container-2 custom-grid">
              <label htmlFor="">Odontólogo *</label>
              <div className="dentist-container">
                <button type="button" className={`dentist ${doctor === "Ramón Mavarez" ? "border-primary" : ""}`} style={{ backgroundColor: doctor === "Ramón Mavarez" ? "#e3e6ea" : "#f1f3f4" }} onClick={() => setDoctor("Ramón Mavarez")}>Od. Ramón Mavarez</button>
                <button type="button" className={`dentist ${doctor === "Patricia Román" ? "border-primary" : ""}`} style={{ backgroundColor: doctor === "Patricia Román" ? "#e3e6ea" : "#f1f3f4" }} onClick={() => setDoctor("Patricia Román")}>Od. Patricia Román</button>
              </div>
            </div>
            <div className="container-2 custom-grid">
              <div>
                <label htmlFor="">Fecha de cita *</label>
                <input type="date" className="form-control" />
              </div>
              <div>
                <label htmlFor="">Hora de cita *</label>
                <input type="time" className="form-control" />
              </div>
            </div>
            <div className="variable container-2 custom-grid">
              <div>
                <label htmlFor="">Motivo *</label>
                <input type="text" placeholder="Motivo" />
              </div>
            </div>
            <div className="variable container-2 custom-grid">
              <div>
                <button type="submit" className="book-button">Agendar</button>
              </div>
            </div>
          </form>
        </div>
        <div>
        </div>
      </div>  
    </div>
  );
}