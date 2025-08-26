import { dbPool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

// GET Route
export async function GET(request: NextRequest, { params }: { params: Promise<{user: number}> }): Promise<NextResponse> {
    const { user } = await params;

    try {
        const client = await dbPool.connect();

        const query = `
            SELECT
                p.id,
                cp.consulta_id,
                CONCAT(pac.nombre, ' ', pac.apellido) AS paciente,
                c.codigo,
                p.monto,
                p.metodo,
                p.referencia,
                p.fecha
            FROM credenciales cd
            LEFT JOIN pacientes pac ON pac.credencial_id = cd.id
            LEFT JOIN historias h ON h.paciente_id = pac.id
            LEFT JOIN consultas c ON c.historia_id = h.id
            LEFT JOIN consultas_pagos cp ON cp.consulta_id = c.id
            JOIN pagos p ON cp.pago_id = p.id
            WHERE cd.usuario = $1;
        `;

        const results = await client.query(query, [user]);

        client.release();

        return NextResponse.json(results.rows);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}