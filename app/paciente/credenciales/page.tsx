"use client";
import React, { useState, useEffect } from "react";

import Header from "@/components/alt-header";
import Input from "@/components/ui/input";

import { useRouter } from "next/navigation";

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

  // State variables for form inputs
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeated, setNewPasswordRepeated] = useState("");
  const [isClickable, setIsClickable] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (newPassword != "" && newPasswordRepeated != "") {
      if (newPassword != newPasswordRepeated) {
        setErrorMessage("La contraseña nueva debe coincidir en ambos campos");
        setIsClickable(false);
      } else {
        setErrorMessage("");
        setIsClickable(true);
      } 
    } else {
      setErrorMessage("");
      setIsClickable(false);
    }
  }, [newPassword, newPasswordRepeated])

  // --------------------------------------------------------------------------

  // Change password handler
  const handlePasswordChange = async (event: React.FormEvent) => {
      event.preventDefault();
  
      if (!oldPassword || !newPassword || !newPasswordRepeated) {
        setErrorMessage("Por favor, complete todos los campos");
        return;
      }
  
      try {
        const response = await fetch("/api/auth/password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: user.username, oldPassword: oldPassword, newPassword: newPassword }),
          credentials: "include",
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Error al enviar la solicitud");
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

  // --------------------------------------------------------------------------

  // Verify user variable
  if (user.username === "") return null;

  return (
    <section>
      <Header />

      <div className="flex flex-col max-w-xl bg-gray-100 rounded-2xl p-16 mx-auto my-16">

        <div className="flex flex-col gap-4 text-sm">
          <form action="submit" onSubmit={ handlePasswordChange }>
            <fieldset className="block space-y-6">
              <legend className="text-lg font-bold text-gray-800 pb-4">Cambiar contraseña</legend>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="old-password" className="font-medium text-gray-700 px-1">Contraseña actual *</label>
                  <Input id="old-password" type="password" required placeholder="Contraseña actual" value={oldPassword ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}/>
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="new-password" className="font-medium text-gray-700 px-1">Contraseña nueva *</label>
                  <Input id="new-password" type="password" required placeholder="Contraseña nueva" value={newPassword ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}/>
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="new-password-repeated" className="font-medium text-gray-700 px-1">Contraseña nueva (confirmación) *</label>
                  <Input id="new-password-repeated" type="password" required placeholder="Contraseña nueva (confirmación)" value={newPasswordRepeated ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPasswordRepeated(e.target.value)}/>
                </div>
                <div className="flex flex-col text-xs my-2">
                  <span className="block mx-auto font-semibold"><a href="/recuperar-credenciales" className="hover:underline">¿Olvidaste tu contraseña?</a></span>
                </div>
              </div>

              {(errorMessage != "") && (
                <span className="text-red-600 text-xs block text-center mb-4">
                  {errorMessage}
                </span>
              )}

              <button type="submit" disabled={!isClickable} className="block mx-auto px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                <span className="text-sm font-bold">Confirmar</span>
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </section>
  );
}