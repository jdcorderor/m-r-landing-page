import { dbPool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

// GET Route
export async function GET(request: NextRequest, { params }: { params: Promise<{user: number}> }): Promise<NextResponse> {
    const { user } = await params;

    try {
        const client = await dbPool.connect();

        const query = `
            WITH consultas_por_usuario AS (
                SELECT
                    c.id AS consulta_id,
                    c.monto_total
                FROM credenciales cd
                JOIN pacientes pac ON pac.credencial_id = cd.id
                JOIN historias h ON h.paciente_id = pac.id
                JOIN consultas c ON c.historia_id = h.id
                WHERE cd.usuario = $1
            ),

            pagos_por_usuario AS (
                SELECT
                    p.id AS pago_id,
                    p.monto
                FROM credenciales cd
                JOIN pacientes pac ON pac.credencial_id = cd.id
                JOIN historias h ON h.paciente_id = pac.id
                JOIN consultas c ON c.historia_id = h.id
                JOIN consultas_pagos cp ON cp.consulta_id = c.id
                JOIN pagos p ON p.id = cp.pago_id
                WHERE cd.usuario = $1
            )

            SELECT
                (SELECT COUNT(*) FROM pagos_por_usuario) AS total_pagos,
                COALESCE((SELECT SUM(monto) FROM pagos_por_usuario), 0) AS total_pagado,
                COALESCE((SELECT SUM(monto_total) FROM consultas_por_usuario), 0)
                    - COALESCE((SELECT SUM(monto) FROM pagos_por_usuario), 0) AS deuda_total;
        `;

        const results = await client.query(query, [user]);

        client.release();

        return NextResponse.json(results.rows[0]);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}