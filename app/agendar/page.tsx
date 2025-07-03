"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from "@/components/booking_header";
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

  // State variable for confirmed dates
  type ConfirmedDate = {
    fecha: string;
    fin_tentativo: string;
    odontologo_id: string;
  }
  
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
      console.error("Error en el fetch", error);
    })
  }, []);

  // ------------------------------------------------------------------------------
  
  // State variables for alert and modal visibility
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showFailed, setShowFailed] = useState<boolean>(false);
  
  // State variables for form inputs
  const [dentist, setDentist] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [isUnderage, setIsUnderage] = useState<boolean>(false);
  const [isApple, setIsApple] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    if (/iPad|iPhone|iPod|Macintosh/.test(ua)) {
      setIsApple(true);
    }
  }, []);

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
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dentist === null) {
      setShowAlert(true);
      return;
    }
    
    if (dentist !== null && appointmentDate && appointmentTime) {
      const overlap = confirmedDates.some((c) => {
        if (c.odontologo_id !== dentists[dentist]?.id) return false;
        const start = new Date(`${c.fecha}`).toISOString();
        const end = new Date(`${c.fin_tentativo}`).toISOString();
        const selected = new Date(`${appointmentDate}T${appointmentTime}`).toISOString();
        return selected >= start && selected < end;
      });
      
      if (!overlap) {
        setShowModal(true);
        return;
      }
    }
  }

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
        setShowAlert(false);
        setShowConfirm(true);
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
      setShowFailed(true);
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
          </div>
          <form onSubmit={ handleSubmit }>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1 justify-between">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-2" htmlFor="">Nombre *</label>
                <Input required placeholder="Nombre" value={name ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-2" htmlFor="">Apellido *</label>
                <Input required placeholder="Apellido" value={lastName ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-col md:flex-row my-1 mx-0 md:mx-1 justify-between">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 mx-0 md:mx-1 md:mr-1" >
                <label className="mb-2 pl-2" htmlFor="">Fecha de nacimiento *</label>
                <input required className={`px-3 py-2 bg-white text-gray-500 outline-none border shadow-sm rounded-lg duration-150 mb-2 ${isApple ? "w-[94%] h-10" : "w-full"}`} type="date" value={birthDate ?? ""} lang="es" inputMode="numeric" pattern="\d{4}-\d{2}-\d{2}" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)} max={new Date().toISOString().split('T')[0]}/>
              </div>
              <div className="w-full md:w-[49%] md:ml-1" >
                <label className="mb-2 pl-2" htmlFor="">Cédula de Identidad *</label>
                <Input required type="number" min="100000" max="99999999" placeholder="Cédula (ej. 12345678)" value={id ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)}/>
              </div>
            </div>                
            
            {isUnderage && (
              <span className="text-red-600 text-xs block text-center mb-4">
                Si el paciente no dispone de cédula de identidad, por favor proporcionar la de su representante legal.
              </span>
            )}
            
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1 justify-between">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-2" htmlFor="">Correo electrónico *</label>
                <Input required type="email" placeholder="nombre@correo.com" value={email ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-2" htmlFor="">Teléfono *</label>
                <Input required type="number" placeholder="Teléfono (ej. 04241234567)" value={phone ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-col md:flex-row my-3 mx-0 md:mx-1 justify-between">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-2" htmlFor="">Dirección *</label>
                <Input required type="text" placeholder="Dirección" value={address ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}/>
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-2" htmlFor="">Género *</label>
                <div className="flex justify-center gap-4 mt-2 ml-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="gender" value="M" checked={gender === "M"} onChange={() => setGender("M")} className="accent-blue-600 w-3 h-3" required/>
                    <span className="ml-2">Masculino</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="gender" value="F" checked={gender === "F"} onChange={() => setGender("F")} className="accent-blue-600 w-3 h-3"/>
                    <span className="ml-2">Femenino</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-[4vh] md:mt-3 justify-between">
              <label className="mb-2 pl-2" htmlFor="">Odontólogo *</label>
              <div className="flex flex-col md:flex-row gap-2 mb-3">
                {dentists.map((dentistItem, index) => (
                  <div className="w-full" key={index}>
                    <Button key={index} type="button" className={`${dentist === index ? "border-primary" : ""} w-full md:w-[99%] mb-1 rounded-`} style={{ border: dentist === index ? "2px solid #e3e6ea" : "2px solid #e3e6ea" }} onClick={() => setDentist(index)}>
                      {dentistItem.nombre.split(" ")[0]} {dentistItem.apellido.split(" ")[0]}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row mt-3 mx-0 md:mx-1 justify-between">
              <div className="w-full md:w-[49%] mb-3 md:mb-0 md:mr-1">
                <label className="mb-2 pl-2" htmlFor="">Fecha de cita *</label>
                <input required type="date" className={`px-3 py-2 bg-white text-gray-500 outline-none border shadow-sm rounded-lg duration-150 mb-2 ${isApple ? "w-[94%] h-10" : "w-full"}`} value={appointmentDate ?? ""} lang="es" inputMode="numeric" pattern="\d{4}-\d{2}-\d{2}" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppointmentDate(e.target.value)}
                  min={(() => {
                    const now = new Date();
                    
                    if (now.getHours() > 14 || (now.getHours() === 14 && now.getMinutes() > 0)) {
                      const tomorrow = new Date(now);
                      tomorrow.setDate(now.getDate() + 1);
                      return tomorrow.toISOString().split('T')[0];
                    }

                    return now.toISOString().split('T')[0];
                  })()}
                />
              </div>
              <div className="w-full md:w-[49%] mx-0 md:mx-1 md:ml-1">
                <label className="mb-2 pl-2" htmlFor="">Hora de cita *</label>
                <input required type="time" className={`px-3 py-2 bg-white text-gray-500 outline-none border shadow-sm rounded-lg duration-150 mb-2 ${isApple ? "w-[94%] h-10" : "w-full"}`} value={appointmentTime ?? ""} lang="es" inputMode="numeric" pattern="[0-9]{2}:[0-9]{2}" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppointmentTime(e.target.value)}
                  min={ appointmentDate === new Date().toISOString().split('T')[0] ? (() => {
                    const now = new Date();
                    const maxHour = 14;
                    if (now.getHours() > maxHour || (now.getHours() === maxHour && now.getMinutes() > 0)) {
                      return "14:00";
                    }
                      return now.toTimeString().slice(0, 5);
                    })() : "08:00"
                  }
                  max="14:00"
                />
              </div>
            </div>
            
            {dentist !== null && appointmentDate && appointmentTime && new Date(`${appointmentDate}T${appointmentTime}`).toISOString() > new Date().toISOString() && confirmedDates.some((c) => {
              if (c.odontologo_id !== dentists[dentist]?.id) return false;
                
              const start = new Date(`${c.fecha}`).toISOString();
              const end = new Date(`${c.fin_tentativo}`).toISOString();
              const selected = new Date(`${appointmentDate}T${appointmentTime}`).toISOString();
                
              return selected >= start && selected < end;
            }) && (
              <span className="text-red-600 text-xs block text-center mt-1 mb-4">
                Ya existe una cita agendada para este odontólogo en el horario seleccionado. <br /> Por favor, elija otro horario.
              </span>
            )}

            {appointmentDate && appointmentTime && (() => {
              const selectedDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
              const now = new Date();
              const selectedHour = selectedDateTime.getHours();
              const selectedMinute = selectedDateTime.getMinutes();

              const isValidHour = (
                (selectedHour > 8 && selectedHour < 14) ||
                (selectedHour === 8 && selectedMinute >= 0) ||
                (selectedHour === 14 && selectedMinute === 0)
              );

              {/* Validates past dates */} 
              if (selectedDateTime.toISOString() < now.toISOString()) {
                return (
                  <span className="text-red-600 text-xs block text-center mt-1 mb-4">
                    Ha seleccionado un horario inválido. <br /> Por favor, elija otro horario.
                  </span>
                );
              }

              {/* Validates schedule */}
              if (!isValidHour) {
                return (
                  <span className="text-red-600 text-xs block text-center mt-1 mb-4">
                    El horario debe estar entre las 08:00 y las 14:00. <br /> Por favor, elija otro horario.
                  </span>
                );
              }

              return null;
            })()}

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

                {/* Confirmation modal */}
                {showConfirm && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                      <h2 className="text-xl font-bold text-center mb-4">✅<br></br>Cita Programada</h2>
                      <p className="text-center mb-6">Su cita ha sido procesada exitosamente. Para más información, comunicate a través de WhatsApp</p>
                      <div className="flex justify-center">
                        <Button
                          className="w-1/2 bg-green-300 hover:bg-green-500 rounded"
                          onClick={() => {
                          setShowConfirm(false);
                          }}
                        >
                          Continuar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Failed modal */}
                {showFailed && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm ">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                      <h2 className="text-xl font-bold text-center mb-4">😥<br></br>Error al programar la cita</h2>
                      <p className="text-center mb-6">Ha ocurrido un error inesperado. Por favor, intentelo nuevamente y si el error persiste contecte a soporte</p>
                      <div className="flex justify-center">
                        <Button
                          className="w-1/2 bg-green-300 hover:bg-green-500 rounded"
                          onClick={() => {
                          setShowFailed(false);
                          }}
                        >
                          Continuar
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