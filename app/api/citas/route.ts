import { dbPool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET ROUTE
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

// POST ROUTE
export async function POST(request: Request) {
    try {
        const { paciente, odontologo, detalles } = await request.json();
        
        if (!paciente || !odontologo || !detalles) {
            return NextResponse.json({ message: "Faltan campos obligatorios (paciente, odontólogo, detalles)" }, { status: 400 });
        }

        const fecha = new Date(`${detalles.fecha_cita}T${detalles.hora_cita}:00-04:00`).toISOString();

        const client = await dbPool.connect();

        let pacienteID: number;
        
        const pacienteResult = await client.query(
            "SELECT id FROM pacientes WHERE nombre = $1 AND apellido = $2 AND cedula = $3 AND fecha_nacimiento = $4 LIMIT 1",
            [paciente.nombre, paciente.apellido, paciente.cedula, paciente.fecha_nacimiento]
        );

        if (pacienteResult.rows.length != 0) {
            pacienteID = pacienteResult.rows[0].id;
        } else {
            const insertResult = await client.query(
                "INSERT INTO pacientes (nombre, apellido, cedula, fecha_nacimiento, email, telefono, direccion, genero) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
                [paciente.nombre, paciente.apellido, paciente.cedula, paciente.fecha_nacimiento, paciente.email, paciente.telefono, paciente.direccion, paciente.genero]
            );
            pacienteID = insertResult.rows[0].id;
        }

        const result = await client.query(
            "INSERT INTO citas (odontologo_id, paciente_id, fecha, motivo, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [odontologo.id, pacienteID, fecha, detalles.motivo, "pendiente por confirmación"]
        );
        client.release();

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error al enviar datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}   