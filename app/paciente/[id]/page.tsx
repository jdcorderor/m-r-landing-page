'use client'
import { useRouter, useParams } from 'next/navigation'
import React, { useEffect, useState } from "react"
import Input from '@/components/ui/input'
import Loading from '@/components/loading'
import Header from "@/components/alt-header"
import { Patient } from '@/app/types/patient'

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

    // State variable for loading view
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // --------------------------------------------------------------------------

    // Get patient ID from URL params
    const { id } = useParams();

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

    // Patient update handler
    const handlePatientUpdate = async () => {
        if (patient.nombre === "" || patient.apellido === "" || patient.cedula === null || patient.fecha_nacimiento === "" || patient.email === "" || patient.telefono === "" || patient.direccion === "" || patient.genero === "") {
            return;
        }
        
        try {
            const response = await fetch(`/api/pacientes/${user.username}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(patient),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                alert(errorData?.message || "Ocurrió un error inesperado");
            } else {
                router.push(`/paciente`);
            }
        } catch (error) {
            console.error("Error al actualizar paciente:", error);
        }
    };

    // --------------------------------------------------------------------------
    
    // Additional state variables
    const [isApple, setIsApple] = useState(false);
    
    // OS detector
    useEffect(() => {
        const ua = window.navigator.userAgent;
        if (/iPad|iPhone|iPod|Macintosh/.test(ua)) {
            setIsApple(true);
        }
    }, []);

    // --------------------------------------------------------------------------

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

                    <div className="w-full max-w-4xl md:bg-gray-50 md:border border-gray-200 rounded-lg md:my-10">

                        <main className="flex flex-col w-full gap-4 py-12">
                            <h1 className="text-2xl font-bold text-gray-800 text-center">Actualización de Datos</h1>

                            <div className="flex flex-col items-center">
                                <div className="flex flex-col w-full max-w-2xl p-8 gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                                        <div className="flex flex-col flex-1 gap-1">
                                            <label htmlFor="nombre" className="font-semibold">Nombre *</label>
                                            <Input id="nombre" required placeholder="Nombre" className="border-gray-300" value={patient.nombre || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), nombre: e.target.value }))} />
                                        </div>

                                        <div className="flex flex-col flex-1 gap-1">
                                            <label htmlFor="apellido" className="font-semibold">Apellido *</label>
                                            <Input id="apellido" required placeholder="Apellido" className="border-gray-300" value={patient.apellido || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), apellido: e.target.value }))} />
                                        </div>

                                        <div className="flex flex-col flex-1 gap-1">
                                            <label htmlFor="cedula" className="font-semibold">Cédula de Identidad</label>
                                            <Input id="cedula" required type="number" min="100000" max="99999999" placeholder="Cédula (ej. 12345678)" className="border-gray-300" value={patient.cedula || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), cedula: Number(e.target.value) }))} />
                                        </div>

                                        <div className="flex flex-col flex-1 gap-1">
                                            <label htmlFor="fecha-nacimiento" className="font-semibold">Fecha de nacimiento *</label>
                                            <input id="fecha-nacimiento" required type="date" placeholder="Fecha de nacimiento" className={`bg-white text-gray-700 border border-gray-300 rounded-lg outline-none px-3 py-2 ${isApple ? "h-9 md:h-10" : "w-full"}`}
                                            value={patient.fecha_nacimiento ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), fecha_nacimiento: e.target.value }))} max={new Date().toISOString().split('T')[0]} lang="es" inputMode="numeric" pattern="\d{2}/\d{2}/\d{4}"/>
                                        </div>
                                                    
                                        <div className="flex flex-col flex-1 gap-1">
                                            <label htmlFor="email" className="font-semibold">Correo electrónico *</label>
                                            <Input id="email" required placeholder="Correo electrónico" className="border-gray-300" value={patient.email || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), email: e.target.value }))} />
                                        </div>
                                                    
                                        <div className="flex flex-col flex-1 gap-1">
                                            <label htmlFor="telefono" className="font-semibold">Teléfono *</label>
                                            <Input id="telefono" required placeholder="Teléfono" className="border-gray-300" value={patient.telefono || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), telefono: e.target.value }))} />
                                        </div>

                                        <div className="flex flex-col w-full gap-1 text-sm text-gray-800">
                                            <label htmlFor="genero" className="font-semibold">Género *</label>
                                            <div className="h-9 flex gap-5 items-center justify-center text-sm">
                                                <label className="flex items-center gap-1">
                                                    <input type="radio" name="genero" value="M" className="h-3" checked={patient.genero === "M"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), genero: e.target.value }))}/>
                                                    <span>Masculino</span>
                                                </label>
                                                <label className="flex items-center gap-1">
                                                    <input type="radio" name="genero" value="F" className="h-3" checked={patient.genero === "F"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), genero: e.target.value }))}/>
                                                    <span>Femenino</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-1 gap-1 text-sm text-gray-800">
                                            <label htmlFor="direccion" className="font-semibold">Dirección *</label>
                                            <Input id="direccion" required placeholder="Dirección" className="border-gray-300" value={patient.direccion || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), direccion: e.target.value }))} />
                                        </div>
                                    </div>  
                                </div>

                                <div className="flex justify-center gap-2 text-sm">
                                    <button className="px-8 py-1 bg-blue-500 text-white font-medium rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out" onClick={ handlePatientUpdate }>
                                        Actualizar
                                    </button>
                                    <button className="px-8 py-1 bg-gray-200 font-medium rounded-full shadow-md hover:bg-gray-300" onClick={ () => router.push("/paciente") }>
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            )}
        </section>
    );
};