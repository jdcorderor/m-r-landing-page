"use client"
import { useState } from "react"

import Link from "next/link"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  // State variable for toggle menu
  const [isOpen, setIsOpen] = useState(false)

  // Routes array
  const routes = [
    { href: "/#nosotros", label: "Acerca de" },
    { href: "/#servicios", label: "Servicios" },
    { href: "/#consultorio", label: "Consultorio" },
    { href: "/#testimonios", label: "Testimonios" },
    { href: "/Mavarez & Román - Manual de Usuario.pdf", label: "Documentación" },
    { href: "/paciente", label: "Agenda tu cita" },
  ]

  return (
    <header className="sticky w-full bg-white/90 px-6 md:px-20 py-4 top-0 z-50">
      <div className="flex h-16 justify-start items-center">
        <div className="flex-1 text-sm">
            <Link href="/" className="font-medium">Mavarez & Román</Link>
        </div>

        <nav className="hidden md:flex gap-8 text-sm">
          {routes.map((route) => (
            route.href.endsWith(".pdf") ? (
              <a key={route.href} href={route.href} target="_blank" rel="noopener noreferrer">{route.label}</a>
            ) : (
              <Link key={route.href} href={route.href}>
                {route.label}
              </Link>
            )
          ))}
        </nav>
        
        {/* Toggle menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="justify-end"><Menu className="h-5 w-5" /></button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 my-8">
              {routes.map((route) => (
                route.href.endsWith(".pdf") ? (
                  <a key={route.href} href={route.href} className="text-lg text-white" onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer">{route.label}</a>
                ) : (
                  <Link key={route.href} href={route.href} className="text-lg text-white" onClick={() => setIsOpen(false)}>
                    {route.label}
                  </Link>
                )
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}