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
                c.id,
                pc.id AS paciente_id,
                c.codigo,
                c.fecha,
                CONCAT(o.nombre, ' ', o.apellido) AS especialista,
                c.diagnostico,
                c.tratamiento,
                c.observaciones,
                c.monto_total,
                COALESCE(SUM(p.monto), 0) AS monto_pagado
            FROM credenciales cd
            LEFT JOIN pacientes pc ON pc.credencial_id = cd.id
            LEFT JOIN historias h ON h.paciente_id = pc.id
            INNER JOIN consultas c ON c.historia_id = h.id
            LEFT JOIN odontologos o ON c.odontologo_id = o.id
            LEFT JOIN consultas_pagos cp ON cp.consulta_id = c.id
            LEFT JOIN pagos p ON p.id = cp.pago_id
            WHERE cd.usuario  = $1
            GROUP BY
                c.id,
                pc.id,
                c.codigo,
                c.fecha,
                o.nombre,
                o.apellido,
                c.diagnostico,
                c.tratamiento,
                c.observaciones,
                c.monto_total
            ORDER BY c.fecha DESC;
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

        return NextResponse.json({ consultations: results.rows, patients: patients });
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}