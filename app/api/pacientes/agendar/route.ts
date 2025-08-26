import { dbPool } from "@/lib/db";
import { NextResponse } from "next/server";

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

// POST Route
export async function POST(request: Request) {
    try {
        const { paciente, odontologo, detalles } = await request.json();
        
        if (!paciente || !odontologo || !detalles) {
            return NextResponse.json({ message: "Faltan campos obligatorios (paciente, odontólogo, detalles)" }, { status: 400 });
        }

        const fecha = generarISODate(detalles.fecha_cita, detalles.hora_cita);

        const client = await dbPool.connect();

        await client.query(
            "INSERT INTO citas (odontologo_id, paciente_id, fecha, motivo, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [odontologo.id, paciente, fecha, detalles.motivo, "pendiente por confirmación"]
        )

        client.release();

        return NextResponse.json({message: "OK"}, { status: 201 });
    } catch (error) {
        console.error("Error al enviar datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}   