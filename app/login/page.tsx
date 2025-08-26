"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Input from "@/components/ui/input";

export default function Page() {
  // Router
  const router = useRouter();

  // ---------------------------------------------------------

  // State variables for login form inputs
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  // ---------------------------------------------------------

  // State variable for error message
  const [errorMessage, setErrorMessage] = useState("");

  // Error message timer
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // ---------------------------------------------------------

  // Login handler
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username || !password) {
      setErrorMessage("Por favor, complete todos los campos");
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error de inicio de sesión");
        return;
      }

      const data = await response.json();

      if (data.message === "OK") {
        router.push("/paciente")
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setErrorMessage("Error de conexión. Intente nuevamente");
    }
  };

  return (
    <section>
        <Header />

        <div className="flex flex-col max-w-md bg-gray-100 rounded-2xl p-16 mx-auto my-16">
            <div className="block w-full justify-center space-y-8 text-gray-800">
                <span className="block text-3xl text-center font-bold">Iniciar sesión</span>

                <form onSubmit={ handleLogin } className="flex flex-col mx-auto gap-5">

                  <div className="flex flex-col gap-1 text-sm">
                      <label className="px-1 font-medium" htmlFor="">Usuario *</label>
                      <Input required placeholder="Usuario" value={username ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                      <label className="px-1 font-medium" htmlFor="">Contraseña *</label>
                      <Input required type="password" placeholder="Contraseña" value={password ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="block mx-auto font-semibold"><a href="/recuperar-credenciales" className="hover:underline">¿Olvidaste tu contraseña?</a></span>
                  </div>
                  <div className="mt-4">
                      <button className="w-full bg-gray-200 border-3 border-gray-300 rounded-full py-2 text-sm font-bold">Iniciar sesión</button>
                  </div>
                  <div className="flex justify-center mt-2 text-sm">
                    <span className="text-center">¿Es tu primera reservación? <a href="/agendar" className="font-bold hover:underline">Agenda aquí</a></span>
                  </div>

                  {errorMessage && <p className="text-sm text-red-600 text-center my-4">{errorMessage}</p>}

                </form>

            </div>
        </div>
    </section>
  );
}