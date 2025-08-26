"use client";
import React, { useState, useEffect } from "react";
import Loading from "@/components/loading";
import Header from "@/components/alt-header";
import { useRouter } from "next/navigation";
import { Patient } from "../types/patient";
import { Pencil, Clock } from "lucide-react";
import { formatDate } from "@/hooks/formatDate";

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

  // State variable for dentists list
  const [patients, setPatients] = useState<Patient[]>([]);

  // Credentials owner
  const [owner, setOwner] = useState("");
          
  // Get patients from the DB using fetch
  useEffect(() => {
    const fetchPatients = async () => {
      if (!user.username) return;

      try {
        const response = await fetch(`/api/pacientes/${user.username}`, {
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
        
        setPatients(data.patients);
        setOwner(data.owner);

        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
      }
    };

    fetchPatients();
  }, [user]);

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
            <span className="block text-gray-800 text-2xl font-semibold mb-8">Bienvenido(a){owner ? `, ${owner.split(" ")[0]}` : ""}</span>
              <div className="bg-white py-1">
                <div className="">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patients.map((p) => (
                      <div key={p.paciente_id} className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:shadow-md transition">
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="text-lg font-semibold text-gray-700 mb-2">{p.nombre} {p.apellido}</div>
                          <div className="text-gray-600"><span className="font-medium">Cédula de identidad:</span> {p.cedula || "-"}</div>
                          <div className="text-gray-600"><span className="font-medium">Fecha de nacimiento:</span>{" "}
                            {formatDate(p.fecha_nacimiento)}
                          </div>
                          <div className="text-gray-600"><span className="font-medium">Correo electrónico:</span> {p.email}</div>
                          <div className="text-gray-600"><span className="font-medium">Teléfono:</span> {p.telefono}</div>
                        </div>

                        <div className="flex w-full justify-center gap-2 mt-8">
                          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-full gap-2" title="Editar" onClick={() => router.push(`paciente/${p.paciente_id}`)}>
                            <Pencil className="w-4 h-4" /> Actualizar datos
                          </button>
                          <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-5 py-2 rounded-full gap-2" title="Agendar" onClick={() => router.push(`paciente/agendar/${p.paciente_id}`)}>
                            <Clock className="w-5 h-5" /> Agendar cita
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 flex justify-center">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded shadow-sm transition-colors border-3 border-gray-300 rounded-3xl cursor-pointer" type="button" onClick={() => router.push("/paciente/registro")}>
                    Registrar paciente
                  </button>
                </div>
              </div>
          </main>
        </div>
      )}
    </section>
  );
}