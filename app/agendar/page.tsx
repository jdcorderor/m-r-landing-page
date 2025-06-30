"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from "@/components/header_agendar";
import Select from "@/components/ui/select";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function Home() {
  const [doctor, setDoctor] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [name, setname] = useState<string | null>(null);
  const [lastName, setlastName] = useState<string | null>(null);
  const [ci, setci] = useState<string | null>(null);
  const [date, setdate] = useState<string | null>(null);
  const [email, setemail] = useState<string | null>(null);
  const [phone, setphone] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const handleSubmit = (e) => {
  e.preventDefault();
  if (doctor === null) {
    setShowAlert(true);
    return;} 
  setShowModal(true);
};


  return (
    <section> 
      <div className="">
        <Header />
      </div> 
      <div className="flex flex-col py-12 md:py-16 px-[5vw] bg-gray-100 rounded-xl max-w-2xl mx-[5%] md:mx-auto mt-2 mb-5">
        <div className="">
          <div className="text-center  mb-5">
            <p className="text-4xl font-bold">Agendar</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-4" htmlFor="">Nombre *</label>
                <Input required className="rounded-md" placeholder="Nombre" value={name ?? ""} onChange={e => setname(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-4" htmlFor="">Apellido *</label>
                <Input required className="rounded-md" placeholder="Apellido" value={lastName ?? ""} onChange={e => setlastName(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1" >
                <label className="mb-2 pl-4" htmlFor="">Cédula de Identidad *</label>
                <Input required type="number" min="100000" max="99999999" className="rounded-md" placeholder="Cédula (ej. 12345678)" value={ci ?? ""} onChange={e => setci(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1" >
                <label className="mb-2 pl-4" htmlFor="">Fecha de nacimiento *</label>
                <Input required className="rounded-md" type="date" value={date ?? ""} onChange={e => setdate(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-4" htmlFor="">Correo electrónico *</label>
                <Input required type="email" className="rounded-md" placeholder="nombre@correo.com" value={email ?? ""} onChange={e => setemail(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-4" htmlFor="">Teléfono *</label>
                <Input required type="number" className="rounded-md" placeholder="Teléfono (ej. 04241234567)" value={phone ?? ""} onChange={e => setphone(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-col my-3">
              <label className="mb-2 pl-4" htmlFor="">Odontólogo *</label>
              <div className="flex flex-col md:flex-row ">
                <div className="w-full">
                  <Button type="button" className={`dentist ${doctor === "Ramón Mavarez" ? "border-primary" : ""} w-full md:w-[99%] mb-3 md:mb-0 rounded-md`} style={{ border: doctor === "Ramón Mavarez" ? "2px solid #e3e6ea" : "2px solid #e3e6ea" }} onClick={() => setDoctor("Ramón Mavarez")}>Od. Ramón Mavarez</Button>
                </div>
                <div className="w-full">
                  <Button type="button" className={`dentist ${doctor === "Patricia Román" ? "border-primary" : ""} w-full md:w-[99%] rounded-md`} style={{ border: doctor === "Patricia Román" ? "2px solid #e3e6ea" : "2px solid #e3e6ea" }} onClick={() => setDoctor("Patricia Román")}>Od. Patricia Román</Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-4" htmlFor="">Fecha de cita *</label>
                <Input required type="date" className="" value={appointmentDate ?? ""} onChange={e => setAppointmentDate(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-4" htmlFor="">Hora de cita *</label>
                <Input required type="time" className="" value={appointmentTime ?? ""} onChange={e => setAppointmentTime(e.target.value)}/>
              </div>
            </div>
            <div className="mt-3">
              <div>
                <label className="mb-2 pl-4" htmlFor="">Motivo *</label>
                <Input required className="w-full" placeholder="Motivo" value={reason ?? ""} onChange={e => setReason(e.target.value)}/>
              </div>
            </div>
            <div className="">
              <div className="flex justify-center rounded-lg">
                <Button
                  type="submit"
                  className="w-[90%] mt-5 bg-white-100 border border-gray-300 hover:bg-gray-600 hover:text-white rounded-lg"
                >
                  <span className="book-button">Agendar</span>
                </Button>

                {/* Modal para continuar con la cita*/}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                      <h2 className="text-xl font-bold text-center mb-4">Confirmar cita</h2>
                      <p className="text-center mb-6">Para confirmar tu cita, Se enviará un mensaje a través de WhatsApp.<br></br>Por favor envia el mensaje para agendar tu cita</p>
                      <div className="flex justify-between">
                      <Button
                        className="w-[48%] bg-gray-200 hover:bg-gray-300 rounded"
                        onClick={() => setShowModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="w-[48%] bg-blue-600 text-white hover:bg-blue-700 rounded"
                        onClick={() => {
                        setShowModal(false);
                        const telefono = "584129152446"//"584167314293"
                        const mensaje = `Confirmación de cita:\n
                                          Nombre: ${name}\n
                                          Apellido: ${lastName}\n
                                          Cédula: ${ci}\n
                                          Fecha de nacimiento: ${date}\n
                                          Correo: ${email}\n
                                          Teléfono: ${phone}\n
                                          Odontólogo: ${doctor}\n
                                          Fecha de cita: ${appointmentDate}\n
                                          Hora de cita: ${appointmentTime}\n
                                          Motivo: ${reason}`;
                        window.open( //4140426759
                          `https://api.whatsapp.com/send?phone=${telefono} &text=${mensaje}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                        }}
                      >
                        Continuar
                      </Button>
                      </div>
                    </div>
                    </div>
                )}

                {/* Modal para alertar que no se ha seleccionado un doctor*/}
                {showAlert && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm">
                      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                        <p className="text-center mb-6 text-lg font-medium">Por favor, selecciona un Odontólogo</p>
                        <div className="flex items-center justify-center">
                          <Button
                          className="w-[50%] bg-gray-200 hover:bg-gray-600 hover:text-white rounded"
                          onClick={() => setShowAlert(false)}
                          >
                          Aceptar
                          </Button>
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}