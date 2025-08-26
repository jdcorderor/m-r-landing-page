"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Loading from "@/components/loading";
import Header from "@/components/header";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Calendar from "@/components/ui/calendar";
import Image from 'next/image';

import { ConfirmedDate } from "../types/date";
import { Dentist } from "../types/dentist";

export default function Page() {
  // Router
  const router = useRouter();

  // ------------------------------------------------------------------------------

  // State variable for loading view
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  
  // State variable for views management
  const [view, setView] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

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
      setIsLoading(false);
    })
  }, []);

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
  const [errorMessage, setErrorMessage] = useState("");

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

  // ------------------------------------------------------------------------------

  // Datetime select handler
  const handleDatetimeSelect = (date: string | null, hour: string | null) => {
    setAppointmentDate(date);
    setAppointmentTime(hour);
  };

  // ------------------------------------------------------------------------------
  
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

    setLoading(true);

    try {
      const response = await fetch("/api/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDate),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(false);
        setLoading(false);
        setShowSentModal(true);
      } else if (response.status === 401) {
        setLoading(false);
        setErrorMessage(`Estimado usuario, ya existe un paciente registrado con la cédula ${data.message}.\n\nPor favor, inicie sesión.`);
        setShowFailModal(true);
      } else if (response.status === 500) {
        setLoading(false);
        setShowFailModal(true);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setShowFailModal(true);
    }
  };

  return (
    <section>
      {isLoading && (
        <div className="flex justify-center items-center min-h-screen bg-white transition-opacity duration-500">
          <Loading />
        </div>
      )}

      {!isLoading && (
        <div> 
          <Header />

          <div>  
            <div className={`${view === 0 ? "flex flex-col": "hidden"} w-full max-w-2xl bg-gray-100 rounded-2xl px-2 py-12 space-y-8 mx-auto my-24 text-center`}>
              <span className="block text-2xl text-center font-bold">Agendar</span>
                
              <p className="text-center text-sm px-14">
                    En la clínica odontológica <strong>Mavarez & Román</strong>, la experiencia de nuestros usuarios es nuestra prioridad. Para agendar su cita, complete el siguiente formulario. 
                    <br /><br />
                    Se le solicitarán sus datos personales. Una vez finalizado el proceso, se le enviará un correo electrónico con sus credenciales, a la dirección que usted proporcione. 
                    <br /><br />
                    En próximas oportunidades, usted podrá reservar su cita de manera rápida y segura, iniciando sesión en nuestra plataforma en línea. Además, <b>podrá registrar a sus familiares bajo sus credenciales</b>, centralizando toda su información.
              </p>

              <div className="flex justify-center">
                <Button className="bg-gray-100 border-3 border-gray-300 rounded-full px-6 py-2" onClick={() => { setView(1) }}>Comenzar</Button>
              </div>
            </div>

            <div className={`${view === 1 ? "flex flex-col": "hidden"} w-full max-w-4xl bg-gray-100 rounded-2xl p-16 space-y-8 mx-auto my-16`}>
              <form onSubmit={ handleSubmit }>
                <div className={`${page === 0 ? "flex flex-col gap-4 text-sm" : "hidden" }`}>
                  <fieldset className="block space-y-4">
                    <legend className="text-lg font-bold text-gray-800 pb-4">Datos personales</legend>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col flex-1 gap-1">
                        <label htmlFor="nombre" className="font-medium text-gray-700 px-1">Nombre *</label>
                        <Input id="nombre" required placeholder="Nombre" value={name ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
                      </div>
                      <div className="flex flex-col flex-1 gap-1">
                        <label htmlFor="apellido" className="font-medium text-gray-700 px-1">Apellido *</label>
                        <Input id="apellido" required placeholder="Apellido" value={lastName ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}/>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col flex-1 gap-1">
                        <label htmlFor="fecha-nacimiento" className="font-medium text-gray-700 px-1">Fecha de nacimiento *</label>
                        <input id="fecha-nacimiento" required type="date" className={`bg-white text-gray-700 border border-gray-300 rounded-lg outline-none px-3 py-2 ${isApple ? "h-10" : "w-full"}`}
                          value={birthDate ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)} max={new Date().toISOString().split('T')[0]} lang="es" inputMode="numeric" pattern="\d{2}/\d{2}/\d{4}"/>
                      </div>
                      <div className="flex flex-col flex-1 gap-1">
                        <label htmlFor="cedula" className="font-medium text-gray-700 px-1">Cédula de Identidad *</label>
                        <Input id="cedula" type="number" min={1000000} max={99999999} required placeholder="Cédula de identidad" value={id ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)}/>
                      </div>
                    </div>

                    {isUnderage && (
                      <span className="text-red-600 text-xs block text-center mb-4">
                        Si el paciente no dispone de cédula de identidad, por favor proporcionar la de su representante legal.
                      </span>
                    )}

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => { if (name && lastName && birthDate && id) { setPage(page + 1) } }} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                        <span className="text-sm">Continuar</span>
                      </button>
                    </div>
                  </fieldset>
                </div>

                <div className={`${page === 1 ? "block text-sm" : "hidden" }`}>
                  <fieldset className="block space-y-4">
                    <legend className="text-lg font-bold text-gray-800 pb-4">Datos personales</legend>
                  
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col flex-1 gap-1">
                        <label htmlFor="email" className="font-medium text-gray-700 px-1">Correo electrónico *</label>
                        <Input id="email" required type="email" placeholder="nombre@correo.com" value={email ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
                      </div>
                      <div className="flex flex-col flex-1 gap-1">
                        <label htmlFor="telefono" className="font-medium text-gray-700 px-1">Teléfono *</label>
                        <Input id="telefono" required type="number" placeholder="Teléfono (ej. 04241234567)" value={phone ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}/>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col flex-1 gap-1">
                        <label htmlFor="direccion" className="font-medium text-gray-700 px-1">Dirección *</label>
                        <Input id="direccion" required type="text" placeholder="Dirección" value={address ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}/>
                      </div>
                      <div className="flex flex-col flex-1 gap-1">
                        <label className="font-medium text-gray-700 px-1">Género *</label>
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
                      <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
                        <span className="text-sm">Volver</span>
                      </button>
                      <button type="button" onClick={() => { if (email && phone && address && gender) { setPage(page + 1) } }} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                        <span className="text-sm">Continuar</span>
                      </button>
                    </div>
                  </fieldset>
                </div>

                <div className={`${page === 2 ? "block text-sm" : "hidden" }`}>
                  <fieldset className="block space-y-4">
                    <legend className="text-lg font-bold text-gray-800 pb-4">Seleccione el especialista</legend>
                  
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row gap-2">
                        {dentists.map((dentistItem, index) => (
                          <div className="w-full" key={index}>
                            <Button key={index} type="button" className={`${dentist === index ? "border-blue-600" : "border-gray-200"} w-full bg-white border-3 rounded-xl shadow-none py-3 hover:bg-white hover:border-blue-600`} onClick={() => setDentist(index)}>
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
                      <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
                        <span className="text-sm">Volver</span>
                      </button>
                      <button type="button" onClick={() => { if (dentist != null) { setPage(page + 1) } }} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                        <span className="text-sm">Continuar</span>
                      </button>
                    </div>
                  </fieldset>
                </div>

                <div className={`${page === 3 ? "block text-sm" : "hidden" }`}>
                  <fieldset className="block space-y-4">
                    <legend className="text-lg font-bold text-gray-800 pb-4">Seleccione la fecha de la reservación</legend>

                    <div className="block overflow-hidden">
                      <Calendar onHandleChange={ handleDatetimeSelect } confirmedDates={ confirmedDates } dentistID={ (dentist != null) ? dentists[dentist].id : null }/> 
                    </div>

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
                        <span className="text-sm">Volver</span>
                      </button>
                      <button type="button" onClick={() => { if (appointmentDate && appointmentTime) { setPage(page + 1) } }} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                        <span className="text-sm">Continuar</span>
                      </button>
                    </div>
                  </fieldset>
                </div>

                <div className={`${page === 4 ? "block text-sm" : "hidden" }`}>
                  <fieldset className="block space-y-4">
                    <legend className="text-lg font-bold text-gray-800 pb-4">Indique el motivo de la reservación</legend>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col flex-1 gap-1">
                        <label htmlFor="motivo" className="font-medium text-gray-700 px-1">Motivo *</label>
                        <textarea id="motivo" required placeholder="Motivo" value={reason ?? ""} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)} rows={4}
                          className="w-full bg-white text-gray-700 border border-gray-300 rounded-lg outline-none px-3 py-2 transition duration-150"/>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
                        <span className="text-sm">Volver</span>
                      </button>
                      <button type="button" onClick={() => { if (reason) { setPage(page + 1) } }} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                        <span className="text-sm">Continuar</span>
                      </button>
                    </div>
                  </fieldset>
                </div>
                  
                <div className={`${page === 5 ? "block text-sm" : "hidden" }`}>
                  <fieldset className="block space-y-4">
                    <legend className="text-lg font-bold text-gray-800 pb-4">Revisión y envío</legend>

                    <div className="flex flex-col w-full justify-center gap-6">
                      <div>
                        <h3 className="flex pb-2 text-base text-gray-800 font-bold">Datos personales</h3>
                        <div className="grid grid-cols-2">
                          <p><b>Paciente:</b> {name} {lastName}</p>
                          <p><b>Cédula de identidad:</b> {id}</p>
                          <p><b>Fecha de nacimiento:</b> {birthDate?.split("-")[2]}-{birthDate?.split("-")[1]}-{birthDate?.split("-")[0]}</p>
                          <p><b>Correo electrónico:</b> {email}</p>
                          <p><b>Teléfono:</b> {phone}</p>
                          <p><b>Dirección:</b> {address}</p>
                          <p><b>Género:</b> {gender === "M" ? "Masculino" : "Femenino"}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="flex pb-2 text-base text-gray-800 font-bold">Datos de la reservación</h3>                
                        <p>
                          <b>Odontólogo:</b> Od. {(dentist != null) ? dentists[dentist].nombre.split(" ")[0] : ""} {(dentist != null) ? dentists[dentist].apellido.split(" ")[0] : ""} <br />
                          <b>Fecha de la reservación:</b> {appointmentDate?.split("-")[2]}-{appointmentDate?.split("-")[1]}-{appointmentDate?.split("-")[0]} <br />
                          <b>Hora de la reservación:</b> {appointmentTime} <br />
                          <b>Motivo:</b> {reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
                        <span className="text-sm">Volver</span>
                      </button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                        <span className="text-sm font-bold">Agendar</span>
                      </button>
                    </div>
                  
                    {/* Confirm modal */}
                    {showModal && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                        <div className="flex flex-col bg-white rounded-2xl shadow-lg p-8 max-w-sm gap-3">
                          <span className="block text-xl font-semibold text-center py-2">Confirme su cita</span>
                          <p className="block text-center">Estimado paciente, al confirmar su cita se generará un mensaje automático de WhatsApp.</p>
                          <p className="block text-center"><b>Por favor, envíelo.</b> Será atendido a la brevedad posible para culminar su proceso de reservación.</p>
                          <p className="block text-center font-bold">Recibirá un correo electrónico con sus credenciales de acceso a nuestra plataforma.</p>
                          <div className="flex justify-between mt-4 gap-2">
                            <Button className="w-full bg-gray-200 hover:bg-gray-300 rounded-full py-2" onClick={() => setShowModal(false)}>
                              Cancelar
                            </Button>
                            <Button className="w-full bg-gray-600 text-white hover:bg-gray-400 rounded-full py-2"
                            onClick={() => { 
                                setShowModal(false);
                                const telefono = "584120426729";
                                const mensaje = encodeURIComponent(
                                  `¡Hola! Quiero agendar una cita en Mavarez & Román.\n\n` +
                                  `Nombre: ${name}\n` +
                                  `Apellido: ${lastName}\n` +
                                  `Cédula: ${id}\n` +
                                  `Odontólogo: ${dentist !== null && dentists[dentist] ? dentists[dentist].nombre.split(" ")[0] + " " + dentists[dentist].apellido.split(" ")[0] : ""}\n` +
                                  `Fecha de cita: ${appointmentDate}\n` +
                                  `Hora de cita: ${appointmentTime}\n` +
                                  `Motivo: ${reason}\n`
                                );
                                window.open(`https://api.whatsapp.com/send?phone=${telefono} &text=${mensaje}`, "_blank", "noopener,noreferrer");
                                handleBooking();
                              }}>
                              Continuar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success modal */}
                    {showSentModal && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                        <div className="flex flex-col bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-sm items-center gap-3">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-xl font-semibold text-center">¡Su cita ha sido procesada!</span>
                          <span className="text-center text-sm text-gray-600">Estimado paciente, su cita ha sido procesada exitosamente. <strong> Una vez que sea confirmada, le será enviado un correo electrónico. </strong> <br /><br /> Ante cualquier duda, comuníquese con atención al cliente: <strong> 04XX-XXXXXXX </strong></span>
                          <Button className="w-full bg-green-300 hover:bg-green-400 rounded-full py-2 my-2" onClick={() => { setShowSentModal(false); router.push("/login") }}> 
                            Continuar 
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Fail modal */}
                    {showFailModal && (
                      <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/40 backdrop-blur-sm">
                        <div className="flex flex-col bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-sm items-center gap-3">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <span className="text-xl font-semibold text-center">¡Ups, ha ocurrido un error!</span>
                          <span className="text-center text-sm text-gray-600">{errorMessage || "Estimado usuario, ha ocurrido un error inesperado. Por favor, intente nuevamente."} <br /><br />Si el problema persiste, comuníquese con atención al cliente: <strong> 04XX-XXXXXXX </strong></span>
                          <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-full py-2 my-2 transition" onClick={() => { setShowFailModal(false); setView(0); setPage(0); }}> 
                            Continuar 
                          </Button>
                        </div>
                      </div>
                    )}
                  </fieldset>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex fixed top-0 left-0 w-full h-screen bg-white z-50 items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-8">
            <div>
              <Loading />
            </div>
            <span className="text-gray-700 text-sm mb-4">
              Esto puede tardar un tiempo. Por favor, espere...
            </span>
          </div>
        </div>
      )}
    </section>
  );
}