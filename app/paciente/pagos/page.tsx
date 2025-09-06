'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react"
import Input from '@/components/ui/input'
import Loading from '@/components/loading'
import Header from "@/components/alt-header"
import { Payment } from '@/app/types/payment'
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

    // State variable for payment stats
    const [statistics, setStatistics] = useState<{ total_pagos: number, total_pagado: number, deuda_total: number }>({ total_pagos: 0, total_pagado: 0, deuda_total: 0 })

    // Get payment stats from the DB using fetch
    useEffect(() => {
        const fetchPayments = async () => {
            if (!user.username) return;

            try {
                const response = await fetch(`/api/pacientes/${user.username}/pagos/stats`, {
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
    
                setStatistics(data);
            } catch (error) {
                console.error("Error al obtener consultas:", error);
            }
        };
    
        fetchPayments();
    }, [user.username]);

    // --------------------------------------------------------------------------

    // State variable for payments array
    const [payments, setPayments] = useState<Payment[]>([]);

    // Get payments data from the DB using fetch
    useEffect(() => {
        const fetchPayments = async () => {
            if (!user.username) return;

            try {
                const response = await fetch(`/api/pacientes/${user.username}/pagos`, {
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
    
                setPayments(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener consultas:", error);
            }
        };
    
        fetchPayments();
    }, [user.username]);

    // Filtered payments
    const filteredPayments = payments.filter((c) => {
        const codigo = c.codigo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const fecha = formatDate(c.fecha).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const paciente = c.paciente.toString() || "";
        const termino = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return codigo.includes(termino) || fecha.includes(termino) || paciente.includes(termino);
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
                        <span className="block text-gray-800 text-2xl font-semibold mb-8">Mis pagos</span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Total cancelado</h3>
                                <p className="text-2xl font-semibold text-green-600">
                                    {new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(statistics?.total_pagado ?? 0)}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Deuda total</h3>
                                <p className="text-2xl font-semibold text-red-600">
                                    {new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(statistics?.deuda_total ?? 0)}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Pagos realizados</h3>
                                <p className="text-2xl font-semibold text-yellow-600">
                                    {Number(statistics?.total_pagos) ?? 0}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white py-1 space-y-2">
                            <Input className="border border-gray-300 text-sm font-medium shadow-none" placeholder="ej. Pedro Pérez | 01/01/2025" type="text" value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}></Input>
                            <div className={`w-full overflow-x-auto duration-500 max-h-[60vh]`}>
                                <table className="min-w-[900px] md:min-w-full divide-y divide-gray-200">
                                    <thead className="sticky top-0 bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">N° Consulta</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Paciente</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Monto</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Método</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Referencia</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPayments.map((c, index) => (
                                            <tr key={index} className="hover:bg-gray-50 text-sm">
                                                <td className="px-4 py-3 text-sm">{c.codigo || "-"}</td>
                                                <td className="px-4 py-3 text-sm">{c.fecha ? formatDate(c.fecha) : "-"}</td>
                                                <td className="px-4 py-3 text-sm">{c.paciente || "-"}</td>
                                                <td className="px-4 py-3 text-sm">{new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(c.monto ?? 0)}</td>
                                                <td className="px-4 py-3 text-sm">{c.metodo|| "-"}</td>
                                                <td className="px-4 py-3 text-sm">{c.referencia || "-"}</td>
                                            </tr>
                                        ))}

                                        {(payments.length > 0 && filteredPayments.length === 0) && (
                                            <tr>
                                                <td colSpan={7} className="bg-gray-50 border-b border-gray-200 text-center text-sm text-gray-600 py-5">
                                                    No se han encontrado resultados coincidentes
                                                </td>
                                            </tr>
                                        )}

                                        {(payments.length === 0 && filteredPayments.length === 0) && (
                                            <tr>
                                                <td colSpan={7} className="bg-gray-50 border-b border-gray-200 text-center text-sm text-gray-600 py-5">
                                                    No hay transacciones registradas
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