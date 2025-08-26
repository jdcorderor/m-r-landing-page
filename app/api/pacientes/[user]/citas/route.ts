import { dbPool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

// GET Route
export async function GET(request: NextRequest, { params }: { params: Promise<{user: string}> }): Promise<NextResponse> {
    try {
        const { user } = await params;

        if (!user) {
            return NextResponse.json({ message: "Faltan campos obligatorios (usuario)" }, { status: 400 });
        }

        const client = await dbPool.connect();

        const query = `
            SELECT
                d.id,
                p.id AS paciente_id,
                p.nombre,
                p.apellido,
                p.telefono,
                p.email,
                d.motivo,
                CONCAT(o.nombre, ' ', o.apellido) AS especialista,
                d.fecha,
                d.estado
            FROM credenciales c
            LEFT JOIN pacientes p ON p.credencial_id = c.id
            LEFT JOIN citas d ON d.paciente_id = p.id
            LEFT JOIN odontologos o ON d.odontologo_id = o.id
            WHERE c.usuario  = $1 AND DATE(d.fecha) >= CURRENT_DATE
            ORDER BY d.fecha ASC;
        `;

        const results = await client.query(query, [user]);

        // --------------------------------------------------------------------

        const patientsResult = await client.query(`
            SELECT 
                p.id, 
                p.nombre, 
                p.apellido 
            FROM credenciales c
            LEFT JOIN pacientes p ON p.credencial_id = c.id
            WHERE c.usuario = $1`
        , [user])

        const patients = patientsResult.rows;
        
        client.release();

        return NextResponse.json({ dates: results.rows, patients: patients });
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}

// PUT Route
export async function PUT(request: NextRequest, { params }: { params: Promise<{user: string}> }): Promise<NextResponse> {
    try {
        const { user } = await params;

        if (!user) {
            return NextResponse.json({ message: "Faltan campos obligatorios (usuario)" }, { status: 400 });
        }

        const { id } = await request.json();

        const client = await dbPool.connect();

        const query = `
            UPDATE citas
                SET estado = $1
            WHERE id = $2
            RETURNING *;
        `;

        await client.query(query, ["cancelada", id]);
        
        client.release();

        return NextResponse.json({ message: "OK" }, { status: 201 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}