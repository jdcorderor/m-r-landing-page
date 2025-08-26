'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react"
import Input from '@/components/ui/input'
import Loading from '@/components/loading'
import Header from "@/components/alt-header"

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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // --------------------------------------------------------------------------

    // State variable for patient data
    const [patient, setPatient] = useState<{ nombre: string, apellido: string, cedula: number | null, fecha_nacimiento: string, email: string, telefono: string, direccion: string, genero: string }>({ nombre: "", apellido: "", cedula: null, fecha_nacimiento: "", email: "", telefono: "", direccion: "", genero: "" });

    // --------------------------------------------------------------------------

    // Patient registration handler
    const handlePatientRegistration = async () => {
        if (patient.nombre === "" || patient.apellido === "" || patient.cedula === null || patient.fecha_nacimiento === "" || patient.email === "" || patient.telefono === "" || patient.direccion === "" || patient.genero === "") {
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await fetch(`/api/pacientes/${user.username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ patient: patient }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                alert(errorData?.message || "Ocurrió un error inesperado");
            } else {
                router.push(`/paciente`);
            }
        } catch (error) {
            console.error("Error al registrar paciente:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --------------------------------------------------------------------------

    // Verify user variable
    if (user.username === "") return null;

    return (
        <section className="flex flex-col items-center justify-center w-full">
            {!isLoading && (
                <div className="flex flex-col items-center justify-center w-full">
                    <Header />

                    <div className="w-full max-w-4xl bg-gray-50 border border-gray-200 rounded-lg my-10">

                        <main className="flex flex-col w-full gap-4 py-12">
                            <h1 className="text-2xl font-bold text-gray-800 text-center">Registro de Paciente</h1>

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
                                            <Input id="fecha-nacimiento" required type="date" placeholder="Fecha de nacimiento" max={new Date().toISOString().split("T")[0]} className="border-gray-300" value={patient.fecha_nacimiento} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatient(prev => ({ ...(prev ?? {}), fecha_nacimiento: e.target.value }))} />
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
                                    <button className="px-8 py-1 bg-blue-500 text-white font-medium rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out" onClick={ handlePatientRegistration }>
                                        Registrar
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

            {isLoading && (
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
};