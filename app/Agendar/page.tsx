"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  const [doctor, setDoctor] = useState<string | null>(null);

  return (
    <div>
      <div className="header d-flex w-100 h-30" style={{ alignItems: "center" }}>
        <div className="p-20" style={{ fontSize: "1.2rem" }}>
          <a href="../">Mavarez & Román</a>
        </div>
      </div> 
      <div className="body w-100 custom-grid">
        <div className="w-100 pl-20 pr-5">
          <h1 className="mb-2" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Agendar</h1>
          <form action="submit">
            <div className="w-100 custom-grid">
              <div>
                <label htmlFor="">Nombre *</label>
                <input type="text" className="form-control" placeholder="Nombre" />
              </div>
              <div>
                <label htmlFor="">Apellido *</label>
                <input type="text" className="form-control" placeholder="Apellido" />
              </div>
            </div>
            <div className="w-100 custom-grid">
              <div>
                <label htmlFor="">Cédula de Identidad *</label>
                <input type="text" className="form-control" placeholder="Cédula (ej. V-12345678)" />
              </div>
              <div>
                <label htmlFor="">Fecha de nacimiento *</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <div className="w-100 custom-grid">
              <div>
                <label htmlFor="">Correo electrónico *</label>
                <input type="email" className="form-control" placeholder="Correo electrónico" />
              </div>
              <div>
                <label htmlFor="">Teléfono *</label>
                <input type="tel" className="form-control" placeholder="Teléfono (ej. 04240001234)" />
              </div>
            </div>
            <label htmlFor="">Odontólogo *</label>
            <div className="mt-2 mb-1 d-flex gap-3">
              <button type="button" className={`btn w-100 ${doctor === "Ramón Mavarez" ? "border-primary" : ""}`} style={{ backgroundColor: doctor === "Ramón Mavarez" ? "#e3e6ea" : "#f1f3f4", fontWeight: "bold", border: "2px solid #dee2e6", color: "#333" }} onClick={() => setDoctor("Ramón Mavarez")}>Od. Ramón Mavarez</button>
              <button type="button" className={`btn w-100 ${doctor === "Patricia Román" ? "border-primary" : ""}`} style={{ backgroundColor: doctor === "Patricia Román" ? "#e3e6ea" : "#f1f3f4", fontWeight: "bold", border: "2px solid #dee2e6", color: "#333" }} onClick={() => setDoctor("Patricia Román")}>Od. Patricia Román</button>
            </div>
            <div className="w-100 custom-grid">
              <div>
                <label htmlFor="">Fecha de cita *</label>
                <input type="date" className="form-control" />
              </div>
              <div>
                <label htmlFor="">Hora de cita *</label>
                <input type="time" className="form-control" />
              </div>
            </div>
            <label htmlFor="">Motivo *</label>
            <input type="text" placeholder="Motivo" />
            <button type="submit" className="btn mt-3 w-100" style={{ fontWeight: "bold", backgroundColor: "#f1f3f4", fontSize: "1.1rem" }}>Agendar</button>
          </form>
        </div>
        <div>
          <h1 className="mb-2" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Pago</h1>
        </div>
      </div>  
    </div>
  );
}