import { dbPool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

function generateSecurityCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET ROUTE
export async function GET(request: NextRequest, { params }: { params: Promise<{ user: string }> }): Promise<NextResponse> {
  try {
    const { user } = await params;

    if (!user) {
      return NextResponse.json({ message: "Faltan campos obligatorios (usuario)" }, { status: 400 });
    }

    const client = await dbPool.connect();

    const result = await client.query(
      `
      SELECT 
        c.id,
        c.usuario, 
        c.clave,
        p.nombre,
        p.apellido,
        p.email
      FROM credenciales c
      LEFT JOIN pacientes p ON c.id = p.credencial_id
      WHERE c.usuario = $1
      LIMIT 1
    `,
      [user]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    const paciente = result.rows[0];

    const code = generateSecurityCode();

    // // Security code email
    // const email = {
    //   email: paciente.email,
    //   subject: `Credenciales - ${paciente.nombre} ${paciente.apellido} | Mavarez & Román`,
    //   text: `
    //     <p>Estimado/a ${paciente.nombre} ${paciente.apellido},</p>
    //     <p>Su código de seguridad es: <b>${code}</b>.</p>
    //     <br>
    //     <p>Ante cualquier duda o circunstancia, contáctenos por alguno de los siguientes medios:</p>
    //     <p><strong>Correo electrónico:</strong> ${process.env.EMAIL_USER}</p>
    //     <p><strong>Teléfono:</strong> ${process.env.PHONE_NUMBER}</p>
    //     <br>
    //     <p>Atentamente,<br><strong>Soporte Técnico de Mavarez & Román</strong></p>
    //   `,
    // };

    // const emailResponse = await fetch(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/email`, {
    //         method: "POST",
    //         headers: {
    //         "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(email),
    //         credentials: "include",
    //     }
    // );

    // if (!emailResponse.ok) {
    //   console.error("Error al enviar el correo");
    //   return NextResponse.json({ message: "Error al enviar el correo" }, { status: 502 });
    // }

    return NextResponse.json({
      message: "OK",
      data: {
        id: paciente.id,
        email: paciente.email,
        codigo: code,
      },
    });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 }
    );
  }
}