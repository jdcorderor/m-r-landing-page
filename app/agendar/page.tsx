"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  const [doctor, setDoctor] = useState<string | null>(null);

  return (
    <section>
      <div className="">
        <div className="">
          <a href="../">Mavarez & Román</a>
        </div>
      </div> 
      <div className="">
        <div className="">
          <h4>Agendar</h4>
          <form action="submit">
            <div className="">
              <div>
                <label htmlFor="">Nombre *</label>
                <input type="text" className="" placeholder="Nombre" />
              </div>
              <div>
                <label htmlFor="">Apellido *</label>
                <input type="text" className="" placeholder="Apellido" />
              </div>
            </div>
            <div className="">
              <div>
                <label htmlFor="">Cédula de Identidad *</label>
                <input type="text" className="" placeholder="Cédula (ej. V-12345678)" />
              </div>
              <div>
                <label htmlFor="">Fecha de nacimiento *</label>
                <input type="date" className="" />
              </div>
            </div>
            <div className="">
              <div>
                <label htmlFor="">Correo electrónico *</label>
                <input type="email" className="" placeholder="Correo electrónico" />
              </div>
              <div>
                <label htmlFor="">Teléfono *</label>
                <input type="tel" className="" placeholder="Teléfono (ej. 04240001234)" />
              </div>
            </div>
            <div className="">
              <label htmlFor="">Odontólogo *</label>
              <div className="">
                <button type="button" className={`dentist ${doctor === "Ramón Mavarez" ? "border-primary" : ""}`} style={{ backgroundColor: doctor === "Ramón Mavarez" ? "#e3e6ea" : "#f1f3f4" }} onClick={() => setDoctor("Ramón Mavarez")}>Od. Ramón Mavarez</button>
                <button type="button" className={`dentist ${doctor === "Patricia Román" ? "border-primary" : ""}`} style={{ backgroundColor: doctor === "Patricia Román" ? "#e3e6ea" : "#f1f3f4" }} onClick={() => setDoctor("Patricia Román")}>Od. Patricia Román</button>
              </div>
            </div>
            <div className="">
              <div>
                <label htmlFor="">Fecha de cita *</label>
                <input type="date" className="" />
              </div>
              <div>
                <label htmlFor="">Hora de cita *</label>
                <input type="time" className="" />
              </div>
            </div>
            <div className="">
              <div>
                <label htmlFor="">Motivo *</label>
                <input type="text" placeholder="Motivo" />
              </div>
            </div>
            <div className="">
              <div>
                <a href="https://api.whatsapp.com/send?phone=584140426759&text=Quiero agendar una cita" className="book-button">Agendar</a>
              </div>
            </div>
          </form>
        </div>
        <div>
        </div>
      </div>  
    </section>
  );
}