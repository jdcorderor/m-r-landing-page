import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const params = await request.json();
    const { email, subject, text } = params;

    const result = await transporter.sendMail({
      from: `"Mavarez & Román" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html:
        `
        <div style="font-family: Arial, sans-serif; color: #333;">
            ${text}
        </div>
        `,
    });

    console.log("Correo enviado: ", result.messageId);

    return NextResponse.json({ message: "Correo electrónico enviado exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("Error al enviar:", error);
    return NextResponse.json({ message: "Error al enviar el correo", error }, { status: 500 });
  }
}