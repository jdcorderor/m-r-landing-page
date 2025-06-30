export default function Footer() {
    return (
        <footer className="flex flex-col pt-12 md:pt-16 px-[5vw]" id="contacto">
            <div className="flex pb-6">
                <div className="flex-1 justify-start gap-3">
                    <div className="font-bold mb-4">Mavarez & Román</div>
                    <div className="py-1"><i className="bi bi-telephone"></i> 0212-1234567</div>
                    <div className="py-1"><i className="bi bi-envelope"></i> info@mavarezroman.com</div>
                    <div className="py-1"><i className="bi bi-instagram"></i> mavarezroman</div>
                </div>
                <div>
                    <ul>
                        <li className="py-1"><a href="#nosotros" className="text-black" style={{ textDecoration: 'none' }}>Conócenos</a></li>
                        <li className="py-1"><a href="#servicios" className="text-black" style={{ textDecoration: 'none' }}>Servicios</a></li>
                        <li className="py-1"><a href="#consultorio" className="text-black" style={{ textDecoration: 'none' }}>Consultorio</a></li>
                        <li className="py-1"><a href="#testimonios" className="text-black" style={{ textDecoration: 'none' }}>Testimonios</a></li>
                        <li className="py-1"><a href="/agendar" className="text-black" style={{ textDecoration: 'none' }}>Agendar cita</a></li>
                    </ul>
                </div>
            </div>
            <p className="mt-3 md:mt-0 mx-auto text-[0.85rem] text-center">Copyright 2025 <i className="bi bi-c-circle"></i>, Mavarez & Román. Todos los derechos reservados.</p>
        </footer>
    );
}