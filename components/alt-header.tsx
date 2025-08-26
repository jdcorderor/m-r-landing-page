"use client"
import { useState } from "react"

import Link from "next/link"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { handleLogout } from "@/app/services/logout"
import { useRouter } from "next/navigation"

export default function Header() {
  // Router
  const router = useRouter();

  // State variable for toggle menu
  const [isOpen, setIsOpen] = useState(false)

  // Routes array
  const routes = [
    { href: "/paciente/citas", label: "Mis citas" },
    { href: "/paciente/consultas", label: "Mis consultas" },
    { href: "/paciente/pagos", label: "Mis pagos" },
    { href: "/paciente/credenciales", label: "Cambiar contraseña" },
  ]

  return (
    <header className="sticky w-full bg-white/90 px-6 md:px-20 py-4 top-0 z-50">
      <div className="flex h-16 justify-start items-center">
        <div className="flex-1 text-sm">
            <Link href="/paciente" className="font-medium">Mavarez & Román</Link>
        </div>

        <nav className="hidden md:flex gap-8 text-sm">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              {route.label}
            </Link>
          ))}
          <button className="cursor-pointer" onClick={ () => { handleLogout(); router.push("/login") } }>Cerrar sesión</button>
        </nav>
        
        {/* Toggle menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="justify-end"><Menu className="h-5 w-5" /></button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 my-8">
              {routes.map((route) => (
                <Link key={route.href} href={route.href} className="text-lg text-white" onClick={() => setIsOpen(false)}>
                  {route.label}
                </Link>
              ))}
              <button onClick={ () => { handleLogout(); setIsOpen(false); router.push("/login") } } className="text-lg text-white text-left cursor-pointer">Cerrar sesión</button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}