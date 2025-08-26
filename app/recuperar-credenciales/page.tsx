"use client";
// import React, { useState } from "react";

// import Header from "@/components/alt-header";
// import Input from "@/components/ui/input";
// import { useRouter } from "next/navigation";

export default function Page() {
  // // Router
  // const router = useRouter();

  // // --------------------------------------------------------------------------

  // // State variable for pages management
  // const [page, setPage] = useState<number>(0)

  // // --------------------------------------------------------------------------
  
  // // State variable for error message
  // const [errorMessage, setErrorMessage] = useState("");

  // // State variables for form inputs
  // const [user, setUser] = useState("");
  // const [code, setCode] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [newPasswordRepeated, setNewPasswordRepeated] = useState("");

  // // State variables for user validation
  // const [data, setData] = useState<{
  //   id?: number;
  //   email?: string;
  //   codigo?: string;
  // }>({});

  // // User validation handler
  // const handleUserValidation = async (event: React.FormEvent) => {
  //   event.preventDefault();
    
  //   if (!user) {
  //     setErrorMessage("Por favor, complete todos los campos");
  //     return;
  //   }
    
  //   try {
  //     const response = await fetch(`/api/auth/validate/${user}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });
    
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       setErrorMessage(errorData.message || "Error al enviar la solicitud");
  //       return;
  //     }
    
  //     const data = await response.json();
    
  //     if (data.message === "OK") {
  //       setData({
  //         id: data.data.id,
  //         email: data.data.email,
  //         codigo: data.data.codigo,
  //       });
  //       setPage(1);
  //     }
  //   } catch (error) {
  //     console.error("Error al enviar los datos:", error);
  //     setErrorMessage("Error de conexión. Intente nuevamente");
  //   }
  // };

  // // --------------------------------------------------------------------------

  // // Change password handler
  // const handlePasswordChange = async (event: React.FormEvent) => {
  //   event.preventDefault();
    
  //   if (!newPassword || !newPasswordRepeated) {
  //     setErrorMessage("Por favor, complete todos los campos");
  //     return;
  //   }
    
  //   try {
  //     const response = await fetch("/api/auth/password/recover", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id: data.id, newPassword: newPassword }),
  //       credentials: "include",
  //     });
    
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       setErrorMessage(errorData.message || "Error al enviar la solicitud");
  //       return;
  //     }
    
  //     const data = await response.json();
    
  //     if (data.message === "OK") {
  //       router.push("/paciente")
  //     }
  //   } catch (error) {
  //     console.error("Error al enviar los datos:", error);
  //     setErrorMessage("Error de conexión. Intente nuevamente");
  //   }
  // };

  // // --------------------------------------------------------------------------

  // function maskEmail(email: string): string {
  //   const [local, domain] = email.split("@");
  //   const visible = local.slice(0, 2);
  //   return `${visible}${"*".repeat(3)}@${domain}`;
  // }

  // return (
  //   <section>
  //     <Header />

  //     <div className="flex flex-col max-w-xl bg-gray-100 rounded-2xl p-16 mx-auto my-16">

  //       <div className={`${page != 0 ? "hidden" : ""} flex flex-col gap-4 text-sm`}>
  //         <form action="submit" onClick={ handleUserValidation }>
  //           <fieldset className="block space-y-6">
  //             <legend className="text-lg font-bold text-gray-800 pb-4">Recuperar contraseña</legend>

  //             <div className="flex flex-col gap-4">
  //               <div className="flex flex-col flex-1 gap-1">
  //                 <label htmlFor="user" className="font-medium text-gray-700 px-1">Usuario *</label>
  //                 <Input id="user" required placeholder="Ingrese su usuario" value={user ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}/>
  //               </div>
  //             </div>

  //             {(errorMessage != "") && (
  //               <span className="text-red-600 text-xs block text-center mb-4">
  //                 {errorMessage}
  //               </span>
  //             )}

  //             <button type="submit" className="block mx-auto px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
  //               <span className="text-sm font-bold">Enviar código</span>
  //             </button>
  //           </fieldset>
  //         </form>
  //       </div>

  //       <div className={`${page !== 1 ? "hidden" : ""} flex flex-col gap-6 text-sm`}>
  //         <form>
  //           <fieldset className="space-y-6">
  //             <legend className="text-lg font-bold text-gray-800 pb-2">Recuperar contraseña</legend>

  //             <p className="text-red-500 font-medium">Se ha enviado un código de seguridad a <span className="font-semibold">{email ? maskEmail(email) : ""}</span>.</p>

  //             <div className="flex flex-col gap-4">
  //               <div className="flex flex-col flex-1 gap-1">
  //                 <label htmlFor="security-code" className="font-medium text-gray-700 px-1">Código de seguridad *</label>
  //                 <Input id="security-code" required placeholder="Ingrese el código de seguridad" value={code ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}/>
  //               </div>
  //               <div className="flex flex-col flex-1 gap-1">
  //                 <label htmlFor="new-password" className="font-medium text-gray-700 px-1">Contraseña nueva *</label>
  //                 <Input id="new-password" required placeholder="Contraseña nueva" value={newPassword ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}/>
  //               </div>
  //               <div className="flex flex-col flex-1 gap-1">
  //                 <label htmlFor="new-password-repeated" className="font-medium text-gray-700 px-1">Contraseña nueva (confirmación) *</label>
  //                 <Input id="new-password-repeated" required placeholder="Contraseña nueva (confirmación)" value={newPasswordRepeated ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPasswordRepeated(e.target.value)}/>
  //               </div>
  //             </div>

  //             {(errorMessage != "") && (
  //               <span className="text-red-600 text-xs block text-center mb-4">
  //                 {errorMessage}
  //               </span>
  //             )}

  //             <button type="submit" className="block mx-auto px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
  //               <span className="text-sm font-bold">Confirmar</span>
  //             </button>
  //           </fieldset>
  //         </form>
  //       </div>


  //     </div>
  //   </section>
  // );
}