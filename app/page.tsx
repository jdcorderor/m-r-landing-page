import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  return (
    <div>
        <div className="header d-flex w-100 h-30" style={{ alignItems: "center" }}>
          <div className="p-20" style={{ fontSize: "1.2rem" }}>
            Mavarez & Román
          </div>
          <div className="d-flex ml-auto p-20" style={{ gap: "40px", alignItems: "center" }}>
            <a href="#conocenos">Conócenos</a>
            <a href="#servicios">Servicios</a>
            <a href="#consultorio">Consultorio</a>
            <a href="#testimonios">Testimonios</a>
            <a href="#contacto">Contacto</a>
            <a href="./Agendar" className="bg-black p-2.5" style={{ color: "white", fontSize: "1.1rem", fontWeight: "500", borderRadius: "7px", textDecoration: "none" }}>Agenda tu cita</a>
          </div>
        </div> 
        <div className="body d-flex p-20">
            <div className="w-100">
                <h1 style={{ fontSize: "7.5vh", fontWeight: "bold" }}>Mavarez & Román</h1>
                <p className="mt-4 mb-4" style={{ fontSize: "2.5vh", color: "#6b7280" }}>
                  Clínica odontológica con 24 años.
                </p>
                <br/>
                <a href="./Agendar" className="bg-black p-3" style={{ color: "white", fontSize: "1.3rem", fontWeight: "500", borderRadius: "7px", textDecoration: "none" }}>Agenda tu cita</a>
                <div style={{ backgroundColor: "#f3f4f6", marginTop: "10vh", borderRadius: "7px", width: "100%", height: "70vh" }}></div>
            </div>
        </div>
        <div className="body d-flex p-20" id="conocenos">
            <div className="w-100">
                <h2>Conócenos</h2>
                <div className="custom-grid w-100" style={{ marginTop: "8vh" }}>
                  <div className="odont-card">
                    <div style={{ backgroundColor: "#f3f4f6", width: "50%", height: "45vh", borderRadius: "10px" }}></div>
                    <h3 className="odont-nombre">Od. Ramón Mavarez</h3>
                    <p className="odont-desc">
                      Descripción
                    </p>
                  </div>
                  <div className="odont-card">
                    <div style={{ backgroundColor: "#f3f4f6", width: "50%", height: "45vh", borderRadius: "10px" }}></div>
                    <h3 className="odont-nombre">Od. Patricia Román</h3>
                    <p className="odont-desc">
                      Descripción
                    </p>
                  </div>
                </div>
            </div>
        </div>
        <div className="body d-flex p-20" id="servicios">
            <div className="w-100">
                <div className="custom-grid w-100" style={{ marginTop: "3vh" }}>
                  <div>
                    <h2 className="mb-5">Servicios</h2>
                    <h4>Servicio 1</h4>
                    <p className="description mb-4">Descripción del servicio 1</p>
                    <h4>Servicio 2</h4>
                    <p className="description mb-4">Descripción del servicio 2</p>
                    <h4>Servicio 3</h4>
                    <p className="description mb-4">Descripción del servicio 3</p>
                    <button className="bg-black mt-3 p-2.5" style={{ color: "white", fontSize: "1.2rem", fontWeight: "500", borderRadius: "7px" }}>Ver más</button>
                  </div>
                  <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "100%", borderRadius: "10px" }}></div>
                </div>
            </div>
        </div>
        <div className="body d-flex p-20" id="consultorio">
            <div className="w-100">
                <h2 className="mb-5">Consultorio</h2>
                <div className="custom-grid w-100" style={{ marginTop: "8vh" }}>
                  <div>
                    <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "40vh", borderRadius: "10px" }}></div>
                    <h4>Ubicación corta y horario.</h4>
                    <p className="desc mb-4">Descripción breve de la ubicación y horario de atención.</p>
                  </div>
                  <div style={{ backgroundColor: "#f3f4f6", width: "100%", height: "100%", borderRadius: "10px" }}></div>
                </div>
            </div>
        </div>
        <div className="body d-flex p-20" id="testimonios">
            <div className="w-100">
                <h2 className="mb-5">Testimonios</h2>
                <div className="custom-grid-3 w-100" style={{ marginTop: "8vh" }}>
                  <div className="testimonial-card">
                    <p className="testimonial">&quot;Excelente servicio&quot;</p>
                    <p className="testimonial-name">Nombre del paciente</p>
                    <p className="testimonial-date">Fecha</p>
                  </div>
                  <div className="testimonial-card">
                    <p className="testimonial">&quot;Excelente servicio&quot;</p>
                    <p className="testimonial-name">Nombre del paciente</p>
                    <p className="testimonial-date">Fecha</p>
                  </div>
                  <div className="testimonial-card">
                    <p className="testimonial">&quot;Excelente servicio&quot;</p>
                    <p className="testimonial-name">Nombre del paciente</p>
                    <p className="testimonial-date">Fecha</p>
                  </div>
                </div>
            </div>
        </div>
        <div className="body custom-grid p-20" style={{ backgroundColor: "#f3f4f6", alignItems: "center" }}>
          <h2>Comparte tu experiencia</h2>
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            <button className="bg-black p-3" style={{ color: "white", fontSize: "1.3rem", fontWeight: "500", width: "15vw", borderRadius: "7px" }}>Agregar comentario</button>
          </div>
        </div>
        <div className="footer p-20" id="contacto" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="mb-5" style={{ fontSize: "1.2rem" }}>
              Mavarez & Román
            </div>
            <div>
              <i className="bi bi-telephone"></i> 0212-1234567
            </div>
            <div>
              <i className="bi bi-envelope"></i> info@mavarezroman.com
            </div>
            <div>
              <i className="bi bi-instagram"></i> mavarezroman
            </div>
            <div className="mt-5" style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              Copyright 2025 <i className="bi bi-c-circle"></i>, Mavarez & Román. Todos los derechos reservados.
            </div>
          </div>
          <div style={{ minWidth: "180px", marginLeft: "40px" }}>
            <ul className="p-0 m-0" style={{ listStyle: "none" }}>
              <li><a href="#conocenos">Conócenos</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#consultorio">Consultorio</a></li>
              <li><a href="#testimonios">Testimonios</a></li>
              <li><a href="./Agendar">Agendar cita</a></li>
            </ul>
          </div>
        </div>
    </div>
  );
}