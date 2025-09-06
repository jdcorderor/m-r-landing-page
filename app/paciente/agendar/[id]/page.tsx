'use client'
import { useRouter, useParams } from 'next/navigation'
import React, { useEffect, useState } from "react"
import Image from 'next/image'
import Button from '@/components/ui/button'
import Loading from '@/components/loading'
import Header from "@/components/alt-header"
import { Dentist } from '@/app/types/dentist'
import { ConfirmedDate } from '@/app/types/date'
import { Patient } from '@/app/types/patient'
import Calendar from '@/components/ui/calendar'

export default function Page() {
    // Router
    const router = useRouter();

    // State variable for user
    const [user, setUser] = useState({
        username: ""
    });

    // User verification handler
    useEffect(() => {
        const verifyAuth = async () => {
        try {
            const response = await fetch("/api/auth/verify", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            });
            if (response.ok) {
            const data = await response.json();

            setUser(user => ({
                ...user,
                username: data.message.username,
            }));
            } else {
            router.push("/login");
            }
        } catch (error) {
            console.error("Error:", error);
            router.push("/login");
        }
        };
        verifyAuth();
    }, [router]);

    // --------------------------------------------------------------------------

    // Get patient ID from URL params
    const { id } = useParams();

    // ------------------------------------------------------------------------------
    
    // State variable for loading view
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // State variable for views management
    const [page, setPage] = useState<number>(0);

    // --------------------------------------------------------------------------

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
    }, []);

    // --------------------------------------------------------------------------

    // State variable for patient data
    const [patient, setPatient] = useState<Patient>({ usuario_id: 0, paciente_id: 0, nombre: "", apellido: "", cedula: null, fecha_nacimiento: "", email: "", telefono: "", direccion: "", genero: "" });
              
    // Get patient data from the DB using fetch
    useEffect(() => {
        const fetchPatient = async () => {
            if (!user.username) return;

            try {
                const response = await fetch(`/api/pacientes/${user.username}/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
        
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
        
                const data = await response.json();

                setPatient(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener pacientes:", error);
            }
        };
    
        fetchPatient();
    }, [id, user]);

    // --------------------------------------------------------------------------

    // State variables for booking form inputs
    const [dentist, setDentist] = useState<number | null>(null);
    const [appointmentDate, setAppointmentDate] = useState<string | null>(null);
    const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
    const [reason, setReason] = useState<string | null>(null);

    // State variables for modal visibility
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showSentModal, setShowSentModal] = useState<boolean>(false);
    const [showFailModal, setShowFailModal] = useState<boolean>(false);

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
            paciente: id,
            odontologo: dentist !== null && dentists[dentist] ? dentists[dentist] : null,
            detalles: {
                fecha_cita: appointmentDate,
                hora_cita: appointmentTime,
                motivo: reason
            }
        }

        try {
            const response = await fetch("/api/pacientes/agendar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newDate),
                credentials: "include",
            });

            if (response.ok) {
                setShowModal(false);
                setShowSentModal(true);
            } else {
                setShowFailModal(true);
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            setShowFailModal(true);
        }
    };

    // ------------------------------------------------------------------------------

    // Verify user variable
    if (user.username === "") return null;

    return (
        <section>
            {isLoading && (
                <div className="flex justify-center items-center min-h-screen bg-white transition-opacity duration-500">
                    <Loading />
                </div>
            )}

            {!isLoading && (
                <div className="flex flex-col items-center justify-center w-full">
                    <Header />

                    <div className="flex flex-col w-full max-w-4xl md:bg-gray-100 rounded-2xl p-8 md:p-16 mx-auto md:my-16"> 
                        <form onSubmit={ handleSubmit }>
                            <div className={`${page === 0 ? "block w-full max-w-4xl text-sm" : "hidden" }`}>
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
                                        <button type="button" onClick={() => { if (dentist != null) { setPage(page + 1) } }} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                                            <span className="text-sm">Continuar</span>
                                        </button>
                                    </div>
                                </fieldset>
                            </div>

                            <div className={`${page === 1 ? "block w-full max-w-4xl text-sm" : "hidden" }`}>
                                <fieldset className="block space-y-4">
                                    <legend className="text-lg font-bold text-gray-800 pb-4">Seleccione la fecha de la reservación</legend>

                                    <div className="block overflow-hidden max-w-xs md:max-w-sm landscape:max-w-full">
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

                            <div className={`${page === 2 ? "block w-full max-w-4xl text-sm" : "hidden" }`}>
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
                            
                            <div className={`${page === 3 ? "block text-sm" : "hidden" }`}>
                                <fieldset className="block space-y-4">
                                    <legend className="text-lg font-bold text-gray-800 pb-4">Revisión y envío</legend>

                                    <div className="flex flex-col w-full justify-center gap-6">
                                        <div>
                                            <h3 className="flex pb-2 text-base text-gray-800 font-bold">Datos personales</h3>
                                            <p>
                                                <b>Paciente:</b> {patient.nombre} {patient.apellido} <br />
                                            </p>
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
                                                <div className="flex justify-between mt-4 gap-2">
                                                    <Button className="w-full bg-gray-200 hover:bg-gray-300 rounded-full py-2" onClick={() => setShowModal(false)}>
                                                        Cancelar
                                                    </Button>
                                                    <Button className="w-full bg-gray-600 text-white hover:bg-gray-700 rounded-full py-2"
                                                    onClick={() => { 
                                                            setShowModal(false);
                                                            const telefono = "584120426729";
                                                            const mensaje = encodeURIComponent(
                                                                `¡Hola! Quiero agendar una cita en Mavarez & Román.\n\n` +
                                                                `Nombre: ${patient.nombre}\n` +
                                                                `Apellido: ${patient.apellido}\n` +
                                                                `Cédula: ${patient.cedula}\n` +
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
                                                <Button className="w-full bg-green-300 hover:bg-green-400 rounded-full py-2 my-2" onClick={() => { setShowSentModal(false); router.push("/paciente") }}> 
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
                                                <span className="text-center text-sm text-gray-600">Estimado usuario, ha ocurrido un error inesperado. Por favor, intente nuevamente. <br /><br />Si el problema persiste, comuníquese con atención al cliente: <strong> 04XX-XXXXXXX </strong></span>
                                                <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-full py-2 my-2 transition" onClick={() => { setShowFailModal(false); router.push("/paciente") }}> 
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
            )}
        </section>
    );
};