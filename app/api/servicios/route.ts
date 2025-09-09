import { dbPool } from "@/lib/db";
import { NextResponse } from "next/server";

// GET ROUTE
export async function GET() {
    try {
        const client = await dbPool.connect();
        const result = await client.query("SELECT nombre, descripcion, caracteristicas, imagen_url FROM servicios WHERE activo = TRUE");
        client.release();

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}