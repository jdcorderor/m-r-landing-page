import { dbPool } from "@/lib/db";
import { NextResponse } from "next/server";


// GET ROUTE
export async function GET() {
    try {
        const client = await dbPool.connect();
        const result = await client.query("SELECT * FROM citas");
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
        const { fecha, hora, servicio_id, cliente_id } = await request.json();

        const client = await dbPool.connect();
        const result = await client.query(
            "INSERT INTO citas (fecha, hora, servicio_id, cliente_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [fecha, hora, servicio_id, cliente_id]
        );
        client.release();

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error al enviar datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}   

// UPDATE ROUTE

// DELETE ROUTE
