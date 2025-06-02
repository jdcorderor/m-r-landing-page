import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div>
        <div className="header w-100 h-30" style={{ display: "flex", alignItems: "center" }}>
          <div className="p-20" style={{ fontSize: "1.2rem" }}>
            Mavarez & Román
          </div>
          <div style={{ display: "flex", gap: "40px", marginLeft: "auto", marginRight: "60px", alignItems: "center" }}>
            <a href="">Conócenos</a>
            <a href="">Servicios</a>
            <a href="">Testimonios</a>
            <a href="">Contacto</a>
            <button className="bg-black p-2.5" style={{ color: "white", fontSize: "1.2rem", borderRadius: "7px" }}>Agenda tu cita</button>
          </div>
        </div> 
        <div className="body d-flex p-20">
            <div style={{ width: "100vw" }}>
                <h1 style={{ fontSize: "7vh", fontWeight: "bold" }}>Mavarez & Román</h1>
                <p style={{ fontSize: "2.5vh", marginTop: "25px", color: "#6b7280" }}>
                  Clínica odontológica con 24 años.
                </p>
                <button className="bg-black mt-3" style={{ color: "white", fontSize: "1.3rem", padding: "18px", borderRadius: "7px" }}>Agenda tu cita</button>
                <div style={{ backgroundColor: "#f3f4f6", marginTop: "10vh", borderRadius: "7px", width: "100%", height: "70vh" }}></div>
            </div>
        </div>
        <div className="body d-flex p-20">
            <div style={{ width: "100vw" }}>
                <h2 style={{ fontSize: "6vh", fontWeight: "bold" }}>Conócenos</h2>
                <div className="custom-grid" style={{ marginTop: "8vh", width: "100%" }}>
                  <div className="odont-card">
                    <div style={{ backgroundColor: "#f3f4f6", width: "50%", height: "45vh", borderRadius: "10px" }}></div>
                    <h3 className="odont-nombre">Od. Ramón Mavarez</h3>
                    <p className="odont-desc">
                      Descripción.
                    </p>
                  </div>
                  <div className="odont-card">
                    <div style={{ backgroundColor: "#f3f4f6", width: "50%", height: "45vh", borderRadius: "10px" }}></div>
                    <h3 className="odont-nombre">Od. Patricia Román</h3>
                    <p className="odont-desc">
                      Descripción.
                    </p>
                  </div>
                </div>
            </div>
        </div>
        <div className="body d-flex p-20">
            <div style={{ width: "100vw" }}>
                <h2 style={{ fontSize: "6vh", fontWeight: "bold" }}>Servicios</h2>
                <div>
                  
                </div>
            </div>
        </div>
        <div className="body d-flex p-20">
            <div style={{ width: "100vw" }}>
                <h2 style={{ fontSize: "6vh", fontWeight: "bold" }}>Consultorio</h2>
                <div className="custom-grid" style={{ marginTop: "8vh", width: "100%" }}>

                </div>
            </div>
        </div>
        <div className="body d-flex p-20">
            <div style={{ width: "100vw" }}>
                <h2 style={{ fontSize: "6vh", fontWeight: "bold" }}>Testimonios</h2>
                <div>
                  
                </div>
            </div>
        </div>
        <div>

        </div>
    </div>
  );
}