'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react"
import Input from '@/components/ui/input'
import Loading from '@/components/loading'
import Header from "@/components/alt-header"
import { Consultation } from '@/app/types/consultation'
import { formatDate } from '@/hooks/formatDate'

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

    // State variable for consultations array
    const [consultations, setConsultations] = useState<Consultation[]>([]);

    // State variable for patients array
    const [patients, setPatients] = useState<{ id: number, nombre: string, apellido: string }[]>([]);

    // State variable for selected patient
    const [selectedPatient, setSelectedPatient] = useState<number>(0);

    // Get consultations data from the DB using fetch
    useEffect(() => {
        const fetchConsultations = async () => {
            if (!user.username) return;

            try {
                const response = await fetch(`/api/pacientes/${user.username}/consultas`, {
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
    
                setConsultations(data.consultations);
                setPatients(data.patients)
                setSelectedPatient(data.patients[0].id)
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener consultas:", error);
            }
        };
    
        fetchConsultations();
    }, [user.username]);

    // Filtered consultations
    const filteredConsultations = consultations.filter((c) => {
        const codigo = c.codigo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const fecha = formatDate(c.fecha).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const especialista = c.especialista.toString() || "";
        const termino = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return ((codigo.includes(termino) || fecha.includes(termino) || especialista.includes(termino)) && (c.paciente_id === selectedPatient));
    });

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
                        <span className="block text-gray-800 text-2xl font-semibold mb-8">Mis consultas</span>
                        
                        {(patients && patients?.length > 0) && (<div className="w-fit border-2 border-gray-200 rounded-3xl shadow-sm mb-4">
                                {patients?.map((p, index) => (
                                    <button key={index} className={`text-sm px-4 py-2 border-gray-300  ${(selectedPatient === p.id) ? "bg-gray-200 rounded-3xl" : ""}`} onClick={ () => { setSelectedPatient(p.id) } }>{p.nombre.split(" ")[0]} {p.nombre.split(" ")[1] ? ` ${p.nombre.split(" ")[1][0]}.` : ''} {p.apellido.split(" ")[0]}</button>
                                ))}
                            </div>
                        )}

                        <div className="bg-white py-1 space-y-2">
                            <Input className="border border-gray-300 text-sm font-medium shadow-none" placeholder="ej. Od. Ramón Mavarez | 01/01/2025" type="text" value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}></Input>
                            <div className={`w-full overflow-x-auto duration-500 max-h-[60vh]`}>
                                <table className="min-w-[1400px] md:min-w-full divide-y divide-gray-200">
                                    <thead className="sticky top-0 bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Especialista</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Diagnóstico</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tratamiento</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Monto total</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Deuda</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredConsultations.map((c, index) => (
                                            <tr key={index} className="hover:bg-gray-50 text-sm">
                                                <td className="px-4 py-3 text-sm">{c.fecha ? formatDate(c.fecha).split(", ")[0] : "-"}</td>
                                                <td className="px-4 py-3 text-sm">Od. {c.especialista || "-"}</td>
                                                <td className="px-4 py-3 text-sm max-w-md truncate">{c.diagnostico.join(", ") || "-"}</td>
                                                <td className="px-4 py-3 text-sm max-w-md truncate">{c.tratamiento.join(", ") || "-"}</td>
                                                <td className="px-4 py-3 text-sm">{new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(c.monto_total ?? 0)}</td>
                                                <td className={`px-4 py-3 text-sm ${c.monto_total != c.monto_pagado ? "text-red-600" : "text-green-600"}`}>{new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(c.monto_total - c.monto_pagado)}</td>
                                            </tr>
                                        ))}

                                        {(consultations.length > 0 && filteredConsultations.length === 0) && (
                                            <tr>
                                                <td colSpan={7} className="bg-gray-50 border-b border-gray-200 text-center text-sm text-gray-600 py-5">
                                                    No se han encontrado resultados coincidentes
                                                </td>
                                            </tr>
                                        )}

                                        {(consultations.length === 0 && filteredConsultations.length === 0) && (
                                            <tr>
                                                <td colSpan={7} className="bg-gray-50 border-b border-gray-200 text-center text-sm text-gray-600 py-5">
                                                    No hay consultas registradas
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