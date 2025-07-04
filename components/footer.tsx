export default function Footer() {
    return (
        <footer className="flex flex-col pt-12 md:pt-16 px-[5vw]" id="contacto">
            <div className="flex flex-col md:flex-row pb-6">
                <div className="flex-1 justify-start gap-3 mb-4">
                    <div className="font-bold mb-4">Mavarez & Román</div>
                    <div className="py-1"><i className="bi bi-telephone"></i> 0212-1234567</div>
                    <div className="py-1"><i className="bi bi-envelope"></i> info@mavarezroman.com</div>
                    <div className="py-1"><i className="bi bi-instagram"></i> mavarezroman</div>
                </div>
                <div className="md:mt-0">
                    <div className="py-1"><a href="#nosotros" className="text-black" style={{ textDecoration: 'none' }}>Conócenos</a></div>
                    <div className="py-1"><a href="#servicios" className="text-black" style={{ textDecoration: 'none' }}>Servicios</a></div>
                    <div className="py-1"><a href="#consultorio" className="text-black" style={{ textDecoration: 'none' }}>Consultorio</a></div>
                    <div className="py-1"><a href="#testimonios" className="text-black" style={{ textDecoration: 'none' }}>Testimonios</a></div>
                    <div className="py-1"><a href="/agendar" className="text-black" style={{ textDecoration: 'none' }}>Agendar cita</a></div>
                </div>
            </div>
            <p className="mt-4 md:mt-0 mx-auto text-[0.85rem] text-center">Copyright 2025 <i className="bi bi-c-circle"></i>, Mavarez & Román. Todos los derechos reservados.</p>
        </footer>
    );
}