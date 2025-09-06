'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react"
import Input from '@/components/ui/input'
import Loading from '@/components/loading'
import Header from "@/components/alt-header"
import { Reservation } from '@/app/types/date'
import { formatDate } from '@/hooks/formatDate'
import { X } from 'lucide-react'

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

    // State variable for search term
    const [searchTerm, setSearchTerm] = useState("");

    // --------------------------------------------------------------------------

    // State variable for dates array
    const [dates, setDates] = useState<Reservation[]>([]);

    // State variable for patients array
    const [patients, setPatients] = useState<{ id: number, nombre: string, apellido: string }[]>([]);

    // State variable for selected patient
    const [selectedPatient, setSelectedPatient] = useState<number>(0);

    // Get dates data from the DB using fetch
    useEffect(() => {
        const fetchDates = async () => {
            if (!user.username) return;

            try {
                const response = await fetch(`/api/pacientes/${user.username}/citas`, {
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
    
                setDates(data.dates);
                setPatients(data.patients)
                setSelectedPatient(data.patients[0].id)
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener citas:", error);
            }
        };
    
        fetchDates();
    }, [user.username]);

    // Filtered dates
    const filteredDates = dates.filter((d) => {
        const fecha = formatDate(d.fecha).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const especialista = d.especialista.toString() || "";
        const termino = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return ((fecha.includes(termino) || especialista.includes(termino)) && (d.paciente_id === selectedPatient));
    });

    // --------------------------------------------------------------------------

    // Date deletion handler
    const handleDateDeletion = async (id: number) => {
        try { 
            const response = await fetch(`/api/pacientes/${user.username}/citas`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id }),
                credentials: "include",
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

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
                <div>
                    <Header />

                    <main className="w-full px-[5vw] pt-8 pb-12">
                        <span className="block text-gray-800 text-2xl font-semibold mb-8">Mis citas</span>
                        
                        {(patients && patients?.length > 0) && (<div className="w-fit border-2 border-gray-200 rounded-3xl shadow-sm mb-4 overflow-hidden">
                                {patients?.map((p, index) => (
                                    <button key={index} className={`text-sm px-4 py-2 border-gray-300  ${(selectedPatient === p.id) ? "bg-gray-200 rounded-3xl" : ""}`} onClick={ () => { setSelectedPatient(p.id) } }>{p.nombre.split(" ")[0]} {p.nombre.split(" ")[1] ? ` ${p.nombre.split(" ")[1][0]}.` : ''} {p.apellido.split(" ")[0]}</button>
                                ))}
                            </div>
                        )}

                        <div className="bg-white py-1 space-y-2">
                            <Input className="border border-gray-300 text-sm font-medium shadow-none" placeholder="ej. Od. Ramón Mavarez | 01/01/2025" type="text" value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}></Input>
                            <div className={`w-full overflow-x-auto duration-500 max-h-[60vh]`}>
                                <table className="min-w-[900px] md:min-w-full divide-y divide-gray-200">
                                    <thead className="sticky top-0 bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Especialista</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Motivo</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Estado</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredDates.map((d, index) => (
                                            <tr key={index} className="hover:bg-gray-50 text-sm">
                                                <td className="px-4 py-3 text-sm">{d.fecha ? formatDate(d.fecha) : "-"}</td>
                                                <td className="px-4 py-3 text-sm">Od. {d.especialista || "-"}</td>
                                                <td className="px-4 py-3 text-sm">{d.motivo || "-"}</td>
                                                <td className="px-4 py-3 text-sm">{d.estado[0].toUpperCase()}{d.estado.slice(1, d.estado.length)}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <button className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50 cursor-pointer" title="Cancelar" onClick={() => { if (d.estado != "cancelada") { handleDateDeletion(d.id) }}}> 
                                                        <X className="w-5 h-5"></X>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {(dates.length > 0 && filteredDates.length === 0) && (
                                            <tr>
                                                <td colSpan={7} className="bg-gray-50 border-b border-gray-200 text-center text-sm text-gray-600 py-5">
                                                    No se han encontrado resultados coincidentes
                                                </td>
                                            </tr>
                                        )}

                                        {(dates.length === 0 && filteredDates.length === 0) && (
                                            <tr>
                                                <td colSpan={7} className="bg-gray-50 border-b border-gray-200 text-center text-sm text-gray-600 py-5">
                                                    No hay citas registradas
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded shadow-sm transition-colors border-3 border-gray-300 rounded-3xl cursor-pointer" type="button" onClick={() => router.push("/paciente")}>
                                Volver
                            </button>
                        </div>

                    </main>

                </div>
            )}
        </section>
    );
};