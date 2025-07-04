import { dbPool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET ROUTE
export async function GET() {
    try {
        const client = await dbPool.connect();
        const result = await client.query("SELECT * FROM comentarios WHERE estado = 'aprobado' ORDER BY fecha DESC");
        client.release(); // Release the client back to the pool

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}

// POST ROUTE
export async function POST(request: Request) {
    try {
        const { emisor, email, comentario } = await request.json();

        if (!emisor || !email || !comentario) {
            return NextResponse.json({ message: "Faltan campos obligatorios (emisor, email, comentario)" }, { status: 400 });
        }

        const client = await dbPool.connect();
        const newComment = await client.query(
            "INSERT INTO comentarios (emisor, email, comentario, estado) VALUES ($1, $2, $3, $4) RETURNING *",
            [emisor, email, comentario, "pendiente"]
        );
        client.release(); // Release the client back to the pool

        return NextResponse.json(newComment.rows[0] , { status: 201 });
    } catch (error) {
        console.error('Error al enviar datos:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}