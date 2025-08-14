"use client";
import React, { useEffect, useState } from "react";

import Header from "@/components/header";

import Input from "@/components/ui/input";

export default function Page() {
  // State variables for login form inputs
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

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
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setErrorMessage("Error de conexión. Intente nuevamente");
    }
  };

  return (
    <section>
        <Header />

        <div className="flex flex-col max-w-md my-32 bg-gray-100 rounded-2xl p-16 mx-auto">
            <div className="block w-full justify-center space-y-8">
                <span className="block text-3xl text-center font-bold">Iniciar sesión</span>

                <form onSubmit={ handleLogin } className="flex flex-col mx-auto gap-2">

                  <div className="flex flex-col gap-2">
                      <label className="px-2" htmlFor="">Usuario *</label>
                      <Input required placeholder="Usuario" value={username ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>
                  </div>
                  <div className="flex flex-col gap-2">
                      <label className="px-2" htmlFor="">Contraseña *</label>
                      <Input required type="password" placeholder="Contraseña" value={password ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
                  </div>
                  <div className="mt-3">
                      <button className="w-full bg-gray-200 border-3 border-gray-300 rounded-lg py-2 font-bold">Iniciar sesión</button>
                  </div>
                  <div className="flex justify-center mt-3">
                    <span className="text-sm text-center">¿Es tu primera reservación? <a href="/agendar">Agenda aquí</a></span>
                  </div>

                  {errorMessage && <p className="text-red-600 text-sm my-4 text-center">{errorMessage}</p>}

                </form>

            </div>
        </div>
    </section>
  );
}