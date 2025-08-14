import { Phone, Mail, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="flex flex-col px-24 py-10" id="contacto">
            <div className="flex flex-col md:flex-row py-6">
                <div className="flex flex-col flex-1 justify-start gap-4">
                    <div className="font-bold">Mavarez & Román</div>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4"></Phone><span className="">+58 0212-1234567</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4"></Mail><span className="">clinicamavarezroman@gmail.com</span>    
                        </div>
                        <div className="flex items-center gap-2">
                            <Instagram className="w-4 h-4"></Instagram><span className="">mavarezroman</span>    
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                    <div><a href="#nosotros" className="hover:underline">Conócenos</a></div>
                    <div><a href="#servicios" className="hover:underline">Servicios</a></div>
                    <div><a href="#consultorio" className="hover:underline">Consultorio</a></div>
                    <div><a href="#testimonios" className="hover:underline">Testimonios</a></div>
                    <div><a href="/agendar" className="hover:underline">Agendar cita</a></div>
                </div>
            </div>
            <p className="mt-4 md:mt-0 mx-auto text-[0.85rem] text-center">Copyright © 2025, Clínica Mavarez & Román. Todos los derechos reservados.</p>
        </footer>
    );
}