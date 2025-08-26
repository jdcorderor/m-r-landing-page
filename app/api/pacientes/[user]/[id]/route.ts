import { dbPool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

// GET Route
export async function GET(request: NextRequest, { params }: { params: Promise<{user: string, id: number}> }): Promise<NextResponse> {
    try {
        const { user, id } = await params;

        const client = await dbPool.connect();

        const result = await client.query(
            `SELECT 
                c.id AS usuario_id, 
                p.id AS paciente_id,
                p.nombre, 
                p.apellido, 
                p.cedula,
                p.fecha_nacimiento,
                p.email,
                p.telefono,
                p.direccion,
                p.genero
            FROM credenciales c
            LEFT JOIN pacientes p ON c.id = p.credencial_id
            WHERE p.id = $1 AND c.usuario = $2`, [id, user]
        );
        
        client.release();

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}

// PUT Route
export async function PUT(request: NextRequest, { params }: { params: Promise<{ user: string, id: number }> }): Promise<NextResponse> {
    try {
        const { user, id } = await params;

        const patient = await request.json();
        
        const client = await dbPool.connect();

        // --------------------------------------------------------------------------------

        const idResult = await client.query("SELECT cedula FROM pacientes WHERE id = $1 LIMIT 1", [id]);

        const currentID = idResult.rows[0].cedula;

        if (currentID != patient.cedula) {
            const patientExists = await client.query("SELECT id FROM pacientes WHERE cedula = $1 LIMIT 1", [patient.cedula]); 
            
            if (patientExists.rows.length != 0) {
                return NextResponse.json({ message: `Ya existe un paciente registrado con la C.I. ${patient.cedula}`}, { status: 401 })
            }
        }

        // --------------------------------------------------------------------------------

         const result = await client.query(`
            UPDATE pacientes p
            SET nombre = $3,
                apellido = $4,
                cedula = $5,
                fecha_nacimiento = $6,
                email = $7,
                telefono = $8,
                direccion = $9,
                genero = $10
            FROM credenciales c
            WHERE p.credencial_id = c.id AND p.id = $1 AND c.usuario = $2`,
            [id, user, patient.nombre, patient.apellido, patient.cedula, patient.fecha_nacimiento, patient.email, patient.telefono, patient.direccion, patient.genero]
        );

        client.release();

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Patient not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "OK" }, { status: 200 });
    } catch (error) {
        console.error("Error al actualizar paciente:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}