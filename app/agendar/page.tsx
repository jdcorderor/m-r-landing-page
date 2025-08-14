"use client";
import React, { useEffect, useState } from "react";

import Loading from "@/components/loading";
import Header from "@/components/header";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Calendar from "@/components/ui/calendar";
import Image from 'next/image';

import { ConfirmedDate } from "../types/date";
import { Dentist } from "../types/dentist";

export default function Page() {
  // State variables for loading view
  const [dentistsLoaded, setDentistsLoaded] = useState(false);
  const [datesLoaded, setDatesLoaded] = useState(false);

  // ------------------------------------------------------------------------------
        
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
      console.error("Fetch error", error);
    })
    .finally(() => {
      setDentistsLoaded(true);
    })
  }, []);
  
  // ------------------------------------------------------------------------------
  
  // State variable for confirmed dates
  const [confirmedDates, setConfirmedDates] = useState<ConfirmedDate[]>([]);

  // Get confirmed dates from the DB using fetch
  useEffect(() => {
    fetch("/api/citas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => setConfirmedDates(data))
    .catch(error => {
      console.error("Fetch error", error);
    })
    .finally(() => {
      setDatesLoaded(true);
    })
  }, []);

  // ------------------------------------------------------------------------------

  // State variable for views management
  const [view, setView] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  // ------------------------------------------------------------------------------
  
  // State variables for booking form inputs
  const [name, setName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [dentist, setDentist] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  
  // Additional state variables
  const [isUnderage, setIsUnderage] = useState<boolean>(false);
  const [isApple, setIsApple] = useState(false);

  // State variables for modal visibility
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSentModal, setShowSentModal] = useState<boolean>(false);
  const [showFailModal, setShowFailModal] = useState<boolean>(false);

  // ------------------------------------------------------------------------------

  // OS detector
  useEffect(() => {
    const ua = window.navigator.userAgent;
    if (/iPad|iPhone|iPod|Macintosh/.test(ua)) {
      setIsApple(true);
    }
  }, []);

  // Underage detector
  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const birthDateObj = new Date(birthDate);
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const m = today.getMonth() - birthDateObj.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }
      setIsUnderage(age < 18);
    }
  }, [birthDate]);

  // Datetime select handler
  const handleDatetimeSelect = (date: string | null, hour: string | null) => {
    setAppointmentDate(date);
    setAppointmentTime(hour);
  };
  
  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (dentist !== null && appointmentDate && appointmentTime) {
      setShowModal(true);
      return;
    }
  }

  // Booking handler
  const handleBooking = async () => {
    const newDate = {
      paciente: {
        nombre: name,
        apellido: lastName,
        cedula: id,
        fecha_nacimiento: birthDate,
        email: email,
        telefono: phone,
        genero: gender,
        direccion: address
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
        setAddress(null);
        setGender(null);
        setAppointmentDate(null);
        setAppointmentTime(null);
        setReason(null);
        setShowModal(false);
        setShowSentModal(true);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setShowFailModal(true);
    }
  };

  return (
    <section>
      <div className={(!dentistsLoaded && !datesLoaded) ? "flex justify-center items-center min-h-screen bg-white transition-opacity duration-500" : "hidden"}>
        <Loading />
      </div>

      <div className={(dentistsLoaded && datesLoaded) ? "block" : "hidden"}> 
        <Header />

        <div className="flex flex-col max-w-3xl bg-gray-100 rounded-2xl p-16 mx-auto my-16">  
          <div className={`${view === 0 ? "block": "hidden"} w-full justify-center space-y-8`}>
            <span className="block text-4xl text-center font-bold">Agendar</span>

            <p className="text-justify py-2">
              En <strong>Mavarez & Román</strong>, la experiencia de nuestros usuarios es nuestra prioridad. Para agendar su cita, complete el siguiente formulario. 
              <br /><br />
              Si es su primera reservación, se le solicitarán sus datos personales. Una vez finalizado el proceso, se le enviará un correo electrónico automático con
              sus credenciales, a la dirección que usted proporcione. 
              <br /><br />
              En próximas oportunidades, usted podrá reservar su cita de manera rápida y segura, a través de su usuario.
              <br /><br />
              Por favor, <strong>seleccione la opción que corresponda.</strong>
            </p>

            <div className="flex justify-center py-2">
              <Button className="w-50 border-3 border-gray-300" onClick={() => { setView(1) }}>Paciente nuevo</Button>
            </div>
          </div>

          <div className={`${view === 1 ? "block": "hidden"} w-full justify-center space-y-8`}>

            <form onSubmit={ handleSubmit }>

              <div className={`${page === 0 ? "flex flex-col gap-4" : "hidden" }`}>
                <fieldset className="space-y-6">
                  <legend className="text-lg font-bold text-gray-800 pb-4">Datos personales</legend>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label htmlFor="nombre" className="font-medium text-gray-700 px-2">Nombre *</label>
                      <Input id="nombre" required placeholder="Nombre" value={name ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
                    </div>
                    <div className="flex-1 space-y-2">
                      <label htmlFor="apellido" className="font-medium text-gray-700 px-2">Apellido *</label>
                      <Input id="apellido" required placeholder="Apellido" value={lastName ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}/>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label htmlFor="fecha-nacimiento" className="font-medium text-gray-700 px-2">Fecha de nacimiento *</label>
                      <input id="fecha-nacimiento" required type="date" className={`bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm outline-none px-3 py-2 ${isApple ? "h-10" : "w-full"}`}
                        value={birthDate ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)} max={new Date().toISOString().split('T')[0]} lang="es" inputMode="numeric" pattern="\d{2}/\d{2}/\d{4}"/>
                    </div>
                    <div className="flex-1 space-y-2">
                      <label htmlFor="cedula" className="font-medium text-gray-700 px-2">Cédula de Identidad *</label>
                      <Input id="cedula" required type="number" min="100000" max="99999999" placeholder="Cédula (ej. 12345678)" value={id ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)}/>
                    </div>
                  </div>

                  {isUnderage && (
                    <span className="text-red-600 text-xs block text-center mb-4">
                      Si el paciente no dispone de cédula de identidad, por favor proporcionar la de su representante legal.
                    </span>
                  )}

                  <div className="flex float-right pt-4">
                    <button type="button" onClick={() => { if (name && lastName && birthDate && id) { setPage(page + 1) } }} className="px-4 py-2 bg-blue-600 text-white rounded-5 hover:bg-blue-700 transition">
                      <span className="text-sm">Continuar</span>
                    </button>
                  </div>
                </fieldset>
              </div>

              <div className={`${page === 1 ? "block" : "hidden" }`}>
                <fieldset className="space-y-6">
                  <legend className="text-lg font-bold text-gray-800 pb-4">Datos personales</legend>
                
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label htmlFor="email" className="font-medium text-gray-700 px-2">Correo electrónico *</label>
                      <Input id="email" required type="email" placeholder="nombre@correo.com" value={email ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
                    </div>
                    <div className="flex-1 space-y-2">
                      <label htmlFor="telefono" className="font-medium text-gray-700 px-2">Teléfono *</label>
                      <Input id="telefono" required type="number" placeholder="Teléfono (ej. 04241234567)" value={phone ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}/>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label htmlFor="direccion" className="font-medium text-gray-700 px-2">Dirección *</label>
                      <Input id="direccion" required type="text" placeholder="Dirección" value={address ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}/>
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="font-medium text-gray-700 px-2">Género *</label>
                      <div className="flex justify-center m-2 gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="gender" value="M" checked={ gender === "M" } onChange={() => setGender("M")} className="accent-blue-600 w-3 h-3"/>
                          <span className="mx-2">Masculino</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="gender" value="F" checked={ gender === "F" } onChange={() => setGender("F")} className="accent-blue-600 w-3 h-3"/>
                          <span className="mx-2">Femenino</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-5 hover:bg-gray-300 transition">
                      <span className="text-sm">Volver</span>
                    </button>
                    <button type="button" onClick={() => { if (email && phone && address && gender) { setPage(page + 1) } }} className="px-4 py-2 bg-blue-600 text-white rounded-5 hover:bg-blue-700 transition">
                      <span className="text-sm">Continuar</span>
                    </button>
                  </div>
                </fieldset>
              </div>

              <div className={`${page === 2 ? "block" : "hidden" }`}>
                <fieldset className="space-y-6">
                  <legend className="text-lg font-bold text-gray-800 pb-4">Seleccione el especialista</legend>
                
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row gap-2">
                      {dentists.map((dentistItem, index) => (
                        <div className="w-full" key={index}>
                          <Button key={index} type="button" className={`${dentist === index ? "border-primary" : "border-gray-200"} w-full bg-white border-3 shadow-none py-3`} onClick={() => setDentist(index)}>
                            <div className="w-32 h-32 mx-auto mb-4">
                              <Image src={dentistItem.imagen_url} alt={`Foto de ${dentistItem.nombre} ${dentistItem.apellido}`} width={250} height={250} className="w-full h-full object-cover object-top rounded-full"/>
                            </div>
                            
                            {dentistItem.nombre.split(" ")[0]} {dentistItem.apellido.split(" ")[0]}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-5 hover:bg-gray-300 transition">
                      <span className="text-sm">Volver</span>
                    </button>
                    <button type="button" onClick={() => { if (dentist != null) { setPage(page + 1) } }} className="px-4 py-2 bg-blue-600 text-white rounded-5 hover:bg-blue-700 transition">
                      <span className="text-sm">Continuar</span>
                    </button>
                  </div>
                </fieldset>
              </div>

              <div className={`${page === 3 ? "block" : "hidden" }`}>
                <fieldset className="space-y-6">
                  <legend className="text-lg font-bold text-gray-800 pb-4">Seleccione la fecha de la reservación</legend>
                  <div className="flex flex-col">
                    <Calendar onHandleChange={ handleDatetimeSelect } confirmedDates={ confirmedDates } dentistID={ (dentist != null) ? dentists[dentist].id : null }/> 
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-5 hover:bg-gray-300 transition">
                      <span className="text-sm">Volver</span>
                    </button>
                    <button type="button" onClick={() => { if (appointmentDate && appointmentTime) { setPage(page + 1) } }} className="px-4 py-2 bg-blue-600 text-white rounded-5 hover:bg-blue-700 transition">
                      <span className="text-sm">Continuar</span>
                    </button>
                  </div>
                </fieldset>
              </div>

              <div className={`${page === 4 ? "block" : "hidden" }`}>
                <fieldset className="space-y-6">
                  <legend className="text-lg font-bold text-gray-800 pb-4">Indique el motivo de la reservación</legend>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <label htmlFor="motivo" className="font-medium text-gray-700 px-2">Motivo *</label>
                      <textarea id="motivo" required placeholder="Motivo" value={reason ?? ""} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)} rows={4}
                        className="w-full bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm outline-none px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 transition duration-150"/>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-5 hover:bg-gray-300 transition">
                      <span className="text-sm">Volver</span>
                    </button>
                    <button type="button" onClick={() => { if (reason) { setPage(page + 1) } }} className="px-4 py-2 bg-blue-600 text-white rounded-5 hover:bg-blue-700 transition">
                      <span className="text-sm">Continuar</span>
                    </button>
                  </div>
                </fieldset>
              </div>
                
              <div className={`${page === 5 ? "block" : "hidden" }`}>
                <fieldset className="space-y-6">
                  <legend className="text-lg font-bold text-gray-800 pb-4">Revisión y envío</legend>
                  <div className="flex flex-col w-full justify-center">
                    <p>
                      <b>Paciente:</b> {name} {lastName} <br />
                      <b>Cédula de identidad:</b> {id} <br />
                      <b>Fecha de nacimiento:</b> {birthDate?.split("-")[2]}-{birthDate?.split("-")[1]}-{birthDate?.split("-")[0]} <br />
                      <b>Correo electrónico:</b> {email} <br />
                      <b>Teléfono:</b> {phone} <br />
                      <b>Dirección:</b> {address} <br />
                      <b>Género:</b> {gender === "M" ? "Masculino" : "Femenino"} <br />
                    </p>                
                    
                    <p>
                      <b>Odontólogo:</b> Od. {(dentist != null) ? dentists[dentist].nombre.split(" ")[0] : ""} {(dentist != null) ? dentists[dentist].apellido.split(" ")[0] : ""} <br />
                      <b>Fecha de la reservación:</b> {appointmentDate?.split("-")[2]}-{appointmentDate?.split("-")[1]}-{appointmentDate?.split("-")[0]} <br />
                      <b>Hora de la reservación:</b> {appointmentTime} <br />
                      <b>Motivo:</b> {reason}
                    </p>

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-5 hover:bg-gray-300 transition">
                        <span className="text-sm">Volver</span>
                      </button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-5 hover:bg-blue-700 transition">
                        <span className="text-sm font-bold">Agendar</span>
                      </button>
                    </div>
                
                    {/* Confirm modal */}
                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                            <span className="block text-2xl font-bold text-center my-3">Confirme su cita</span>
                            <span className="block text-center text-medium mb-8">Al confirmar su cita, se generará un mensaje automático de WhatsApp.<br></br> <strong>Por favor, envíelo.</strong> Será atendido a la brevedad posible para culminar su proceso de reservación.</span>
                            <div className="flex justify-between mt-4">
                            <Button
                              className="w-[48%] bg-gray-200 hover:bg-gray-300 rounded"
                              onClick={() => setShowModal(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              className="w-[48%] bg-gray-600 text-white hover:bg-gray-400 rounded"
                              onClick={() => { setShowModal(false);
                                const telefono = "584120426729";
                                const mensaje = encodeURIComponent(
                                  `¡Hola! Quiero agendar una cita en Mavarez & Román.\n\n` +
                                  `Nombre: ${name}\n` +
                                  `Apellido: ${lastName}\n` +
                                  `Cédula: ${id}\n` +
                                  `Fecha de nacimiento: ${birthDate}\n` +
                                  `Correo: ${email}\n` +
                                  `Teléfono: ${phone}\n \n` +
                                  `Odontólogo: ${dentist !== null && dentists[dentist] ? dentists[dentist].nombre.split(" ")[0] + " " + dentists[dentist].apellido.split(" ")[0] : ""}\n` +
                                  `Fecha de cita: ${appointmentDate}\n` +
                                  `Hora de cita: ${appointmentTime}\n` +
                                  `Motivo: ${reason}\n`
                                  );
                                window.open(`https://api.whatsapp.com/send?phone=${telefono} &text=${mensaje}`, "_blank", "noopener,noreferrer");
                                handleBooking();
                              }}
                            >
                              Continuar
                            </Button>
                            </div>
                          </div>
                        </div>
                    )}

                    {/* Success modal */}
                    {showSentModal && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full flex flex-col items-center">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold text-center mb-2">¡Su cita ha sido procesada!</span>
                            <span className="text-center text-sm text-gray-600 my-2">Estimado paciente, su cita ha sido procesada exitosamente. <strong> Una vez que sea confirmada, le será enviado un correo electrónico. </strong> <br /><br /> Ante cualquier duda, comuníquese con atención al cliente: <strong> 04XX-XXXXXXX </strong></span>
                            <Button className="w-full bg-green-300 hover:bg-green-500 rounded mt-3" onClick={() => { setShowSentModal(false); }}> Continuar </Button>
                        </div>
                      </div>
                    )}

                    {/* Fail modal */}
                    {showFailModal && (
                      <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full flex flex-col items-center">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold text-center mb-2">¡Ups, ha ocurrido un error!</span>
                            <span className="text-center text-sm text-gray-600 my-2">Estimado paciente, ha ocurrido un error inesperado. Por favor, intente nuevamente. <br /><br /> Si el problema persiste, comuníquese con atención al cliente: <strong> 04XX-XXXXXXX </strong></span>
                            <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg py-2 mt-3 transition" onClick={() => setShowFailModal(false)}> Continuar </Button>
                        </div>
                    </div>
                    )}
                    </div>
                  </fieldset>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}