"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from "@/components/header_agendar";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function Home() {
  // Define dentist type
  type Dentist = {
    id: string;
    nombre: string;
    apellido: string;
    descripcion: string;
    email: string;
    especialidad: string;
    telefono: string;
  }
        
  // State variable for dentists list
  const [dentists, setDentists] = useState<Dentist[]>([]);
        
  // Get dentists from the DB using fetch
  useEffect(() => {
    fetch("/api/odontologos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => setDentists(data))
    .catch(error => {
      console.error("Error en el fetch", error);
    })
  }, []);
  
  // ------------------------------------------------------------------------------
  
  // State variables for alert and modal visibility
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showQuickBooking, setShowQuickBooking] = useState<boolean>(false);
  
  // State variables for form inputs
  const [dentist, setDentist] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dentist === null) {
      setShowAlert(true);
      return;
    } 
    setShowModal(true); 
  };

  // Post new booking request to the DB using fetch
  const handleBooking = async () => {
    const newDate = {
      paciente: {
        nombre: name,
        apellido: lastName,
        cedula: id,
        fecha_nacimiento: birthDate,
        email: email,
        telefono: phone,
        genero: "",
        direccion: ""
      },
      odontologo: dentist !== null && dentists[dentist] ? dentists[dentist] : null,
      detalles: {
        fecha_cita: appointmentDate,
        hora_cita: appointmentTime,
        motivo: reason
      }
    }

    try {
      const response = await fetch("/api/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDate),
        credentials: "include",
      });
      
      if (response.ok) {
        setDentist(null);
        setName(null);
        setLastName(null);
        setId(null);
        setBirthDate(null);
        setEmail(null);
        setPhone(null);
        setAppointmentDate(null);
        setAppointmentTime(null);
        setReason(null);
        setShowModal(false);
        setShowAlert(false);
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };

  return (
    <section>
      {/* Header section */}
      <Header />

      {/* Booking form section */}
      <div className="flex flex-col py-12 md:py-16 px-[5vw] bg-gray-100 rounded-4xl max-w-3xl mx-[5%] md:mx-auto mt-4 mb-5">
        <div className="">
          <div className="text-center mb-5">
            <p className="text-4xl font-bold">Agendar</p>
            <span className="text-sm mt-2">¿Eres un paciente frecuente? Agiliza tu proceso de reservación <a onClick={() => setShowQuickBooking(true)} className="text-black font-bold cursor-pointer" style={{ textDecoration: 'none' }}>aquí</a></span>
          </div>
          <form onSubmit={ handleSubmit }>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1 justify-between">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-2" htmlFor="">Nombre *</label>
                <Input required className="rounded-md" placeholder="Nombre" value={name ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-2" htmlFor="">Apellido *</label>
                <Input required className="rounded-md" placeholder="Apellido" value={lastName ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1 justify-between">
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:mr-1" >
                <label className="mb-2 pl-2" htmlFor="">Fecha de nacimiento *</label>
                <Input required className="rounded-md" type="date" value={birthDate ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:ml-1" >
                <label className="mb-2 pl-2" htmlFor="">Cédula de Identidad *</label>
                <Input required type="number" min="100000" max="99999999" className="rounded-md" placeholder="Cédula (ej. 12345678)" value={id ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)}/>
              </div>
              
            </div>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1 justify-between">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-2" htmlFor="">Correo electrónico *</label>
                <Input required type="email" className="rounded-md" placeholder="nombre@correo.com" value={email ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-2" htmlFor="">Teléfono *</label>
                <Input required type="number" className="rounded-md" placeholder="Teléfono (ej. 04241234567)" value={phone ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-col my-3 justify-between">
              <label className="mb-2 pl-2" htmlFor="">Odontólogo *</label>
              <div className="flex flex-col md:flex-row gap-2">
                {dentists.map((dentistItem, index) => (
                  <div className="w-full" key={index}>
                    <Button key={index} type="button" className={`${dentist === index ? "border-primary" : ""} w-full md:w-[99%] mb-3 md:mb-0 rounded-`} style={{ border: dentist === index ? "2px solid #e3e6ea" : "2px solid #e3e6ea" }} onClick={() => setDentist(index)}>
                      {dentistItem.nombre.split(" ")[0]} {dentistItem.apellido.split(" ")[0]}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1 justify-between">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-2" htmlFor="">Fecha de cita *</label>
                <Input required type="date" className="" value={appointmentDate ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppointmentDate(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-2" htmlFor="">Hora de cita *</label>
                <Input required type="time" className="" value={appointmentTime ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppointmentTime(e.target.value)}/>
              </div>
            </div>
            <div className="mt-3">
              <div>
                <label className="mb-2 pl-2" htmlFor="">Motivo *</label>
                <Input required placeholder="Motivo" value={reason ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}/>
              </div>
            </div>
            <div className="">
              <div className="flex justify-center rounded-lg">
                <Button
                  type="submit"
                  className="w-[70%] mt-5 bg-white-100 border border-gray-300 hover:bg-gray-200 rounded-lg"
                >
                  <span className="book-button">Agendar</span>
                </Button>

                {/* Quick booking modal */}
                {showQuickBooking && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                        <span className="block text-3xl font-bold text-center my-3">Estimado usuario</span>
                        <p className="text-center mb-6">Por favor, ingrese su cédula de identidad. </p>
                        <div className="flex justify-between mt-4">
                          <Button
                            className="w-[48%] bg-gray-200 hover:bg-gray-300 rounded"
                            onClick={() => setShowQuickBooking(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            className="w-[48%] bg-gray-600 text-white hover:bg-gray-400 rounded"
                            onClick={() => {
                              setShowModal(false);
                              const telefono = "584124117850";
                              const mensaje = encodeURIComponent(
                                `¡Hola! Quiero agendar una cita en Mavarez & Román.\n\n` +
                                `Nombre: ${name}\n` +
                                `Apellido: ${lastName}\n` +
                                `Cédula: ${id}\n` +
                                `Fecha de nacimiento: ${birthDate}\n` +
                                `Correo: ${email}\n` +
                                `Teléfono: ${phone}\n` +
                                `Odontólogo: ${dentist !== null && dentists[dentist] ? dentists[dentist].nombre.split(" ")[0] + " " + dentists[dentist].apellido.split(" ")[0] : ""}\n` +
                                `Fecha de cita: ${appointmentDate}\n` +
                                `Hora de cita: ${appointmentTime}\n` +
                                `Motivo: ${reason}\n`
                                );
                              window.open(
                                `https://api.whatsapp.com/send?phone=${telefono} &text=${mensaje}`,
                                "_blank",
                                "noopener,noreferrer"
                              );
                              handleBooking();
                            }}
                          >
                            Continuar
                          </Button>
                        </div>
                      </div>
                    </div>
                )}

                {/* Confirm modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                        <span className="block text-3xl font-bold text-center my-3">Confirme su cita</span>
                        <p className="text-center mb-6">Al confirmar su cita, se generará un mensaje automático de WhatsApp.<br></br>Por favor, envíelo. Será atendido a la brevedad posible para culminar su proceso de reservación.</p>
                        <div className="flex justify-between mt-4">
                        <Button
                          className="w-[48%] bg-gray-200 hover:bg-gray-300 rounded"
                          onClick={() => setShowModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="w-[48%] bg-gray-600 text-white hover:bg-gray-400 rounded"
                          onClick={() => {
                            setShowModal(false);
                            const telefono = "584124117850";
                            const mensaje = encodeURIComponent(
                              `¡Hola! Quiero agendar una cita en Mavarez & Román.\n\n` +
                              `Nombre: ${name}\n` +
                              `Apellido: ${lastName}\n` +
                              `Cédula: ${id}\n` +
                              `Fecha de nacimiento: ${birthDate}\n` +
                              `Correo: ${email}\n` +
                              `Teléfono: ${phone}\n` +
                              `Odontólogo: ${dentist !== null && dentists[dentist] ? dentists[dentist].nombre.split(" ")[0] + " " + dentists[dentist].apellido.split(" ")[0] : ""}\n` +
                              `Fecha de cita: ${appointmentDate}\n` +
                              `Hora de cita: ${appointmentTime}\n` +
                              `Motivo: ${reason}\n`
                              );
                            window.open(
                              `https://api.whatsapp.com/send?phone=${telefono} &text=${mensaje}`,
                              "_blank",
                              "noopener,noreferrer"
                            );
                            handleBooking();
                          }}
                        >
                          Continuar
                        </Button>
                        </div>
                      </div>
                    </div>
                )}

                {/* Alert modal */}
                {showAlert && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm">
                      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                        <p className="text-center text-lg font-medium mt-2 mb-4">Por favor, seleccione un especialista</p>
                        <div className="flex items-center justify-center mt-3">
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