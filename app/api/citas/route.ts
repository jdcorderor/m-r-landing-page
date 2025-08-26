import { dbPool } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Function to generate ISO date.
function generarISODate(fecha: string, hora:string): string {
  function convertirHora12A24(hora12: string): string {
    const match = hora12.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) throw new Error(`Formato de hora inválido: ${hora12}`);

    const [hora, minutos, periodo] = match.slice(1);
    let hora24 = parseInt(hora, 10);
    if (periodo.toUpperCase() === 'PM' && hora24 !== 12) hora24 += 12;
    if (periodo.toUpperCase() === 'AM' && hora24 === 12) hora24 = 0;

    return `${hora24.toString().padStart(2, '0')}:${minutos}`;
  }

  const hora24 = convertirHora12A24(hora);
  const fechaISO = new Date(`${fecha}T${hora24}:00-04:00`).toISOString();
  return fechaISO;
}

// GET Route
export async function GET() {
    try {
        const client = await dbPool.connect();
        const result = await client.query("SELECT fecha, fin_tentativo, odontologo_id FROM citas WHERE estado = 'confirmada' ORDER BY fecha DESC");
        client.release();

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}

// POST Route
export async function POST(request: Request) {
    try {
        const { paciente, odontologo, detalles } = await request.json();
        
        if (!paciente || !odontologo || !detalles) {
            return NextResponse.json({ message: "Faltan campos obligatorios (paciente, odontólogo, detalles)" }, { status: 400 });
        }

        const fecha = generarISODate(detalles.fecha_cita, detalles.hora_cita);

        const timestamp = new Date().toISOString();

        const client = await dbPool.connect();

        // -------------------------------------------------------------------------

        const patientResult = await client.query("SELECT id FROM pacientes WHERE cedula = $1 LIMIT 1", [paciente.cedula]);

        if (patientResult.rows.length != 0) {
            client.release();
            return NextResponse.json({ message: `${paciente.cedula}`}, { status: 401 });
        }

        // -------------------------------------------------------------------------

        const insertCredentials = await client.query(
            "INSERT INTO credenciales (usuario, clave) VALUES ($1, $2) RETURNING id",
            [paciente.cedula, await bcrypt.hash(`${paciente.nombre[0].toUpperCase()}${paciente.apellido[0].toUpperCase()}${paciente.cedula}`, 10)]
        );

        // Credentials submission
        // const email = {
        //         email: paciente.email,
        //         subject: `Credenciales - ${paciente.nombre} ${paciente.apellido} | Mavarez & Román`,
        //         text: `
        //             <p>Estimado/a ${paciente.nombre} ${paciente.apellido},</p>
        //             <p>Bienvenido/a a <strong>Mavarez & Román</strong>. Nos complace contar con usted como parte de nuestra comunidad de pacientes.</p>
        //             <p>A continuación, le enviamos sus credenciales de acceso a nuestra plataforma.</p>
        //             <br>
        //             <ul>
        //                 <li><strong>Usuario:</strong> ${paciente.email}</li>
        //                 <li><strong>Contraseña:</strong> ${paciente.password}</li>
        //             </ul>
        //             <br>
        //             <p>Puede ingresar a través del siguiente enlace: <a href="https://mavarezroman.com/login">https://mavarezroman.com/login</a></p>
        //             <p>Por razones de seguridad, le recomendamos cambiar su contraseña una vez haya iniciado sesión.</p>
        //             <br>
        //             <p>Ante cualquier duda o circunstancia, contáctenos por alguno de los siguientes medios:</p>
        //             <p><strong>Correo electrónico:</strong> ${process.env.EMAIL_USER}</p>
        //             <p><strong>Teléfono:</strong> ${process.env.PHONE_NUMBER}</p>
        //             <br>
        //             <p>Atentamente,<br><strong>Soporte Técnico de Mavarez & Román</strong></p>
        //         `
        // }

        // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(email),
        //     credentials: "include",
        // })

        // if (response.ok) {
        //     console.log("Email successfully sent")
        // }

        const credentialID = insertCredentials.rows[0].id;

        // -------------------------------------------------------------------------

        const insertPatient = await client.query(
            "INSERT INTO pacientes (nombre, apellido, cedula, fecha_nacimiento, email, telefono, direccion, genero, credencial_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
            [paciente.nombre, paciente.apellido, paciente.cedula, paciente.fecha_nacimiento, paciente.email, paciente.telefono, paciente.direccion, paciente.genero, credentialID]
        );

        const patientID = insertPatient.rows[0].id;

        // -------------------------------------------------------------------------------------------

        const insertOdontogram = await client.query("INSERT INTO odontodiagramas DEFAULT VALUES RETURNING id", []);

        const odontogramID = insertOdontogram.rows[0].id;

        // -------------------------------------------------------------------------------------------

        for (let i = 0; i < 8; i++) {
            const insertSectors = await client.query(
                "INSERT INTO sectores (nombre, odontodiagrama_id) VALUES ($1, $2) RETURNING id",
                [i.toString(), odontogramID]
            );

            const sectorID = insertSectors.rows[0].id;

            if (i < 4) {
                for (let j = 0; j < 8; j++) {
                    const insertTeeth = await client.query(
                        "INSERT INTO dientes (nombre, sector_id) VALUES ($1, $2) RETURNING id",
                        [j.toString(), sectorID]
                    );

                    const toothID = insertTeeth.rows[0].id;

                    for (let k = 1; k < 6; k++) {
                        await client.query(
                            "INSERT INTO segmentos (nombre, valor_afectacion, diente_id) VALUES ($1, $2, $3) RETURNING id",
                            [k.toString(), 0, toothID]
                        );
                    }
                }
            } else {
                for (let j = 0; j < 5; j++) {
                    const insertTeeth = await client.query(
                        "INSERT INTO dientes (nombre, sector_id) VALUES ($1, $2) RETURNING id",
                        [j.toString(), sectorID]
                    );

                    const toothID = insertTeeth.rows[0].id;

                    for (let k = 1; k < 6; k++) {
                        await client.query(
                            "INSERT INTO segmentos (nombre, valor_afectacion, diente_id) VALUES ($1, $2, $3) RETURNING id",
                            [k.toString(), 0, toothID]
                        );
                    }
                }
            }
        }
            
        // -------------------------------------------------------------------------------------------

        const { rows } = await client.query("SELECT nextval('historias_codigo_seq') AS codigo");
        const codigo = rows[0].codigo;

        await client.query(
            "INSERT INTO historias (paciente_id, odontodiagrama_id, antecedentes, observaciones, codigo, fecha_modificacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [patientID, odontogramID, "", "", codigo, timestamp]
        )

        // -------------------------------------------------------------------------

        await client.query(
            "INSERT INTO citas (odontologo_id, paciente_id, fecha, motivo, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [odontologo.id, patientID, fecha, detalles.motivo, "pendiente por confirmación"]
        );

        client.release();

        return NextResponse.json({ message: "OK" }, { status: 201 });
    } catch (error) {
        console.error("Error al enviar datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}   