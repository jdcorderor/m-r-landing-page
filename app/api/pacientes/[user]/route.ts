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
            WHERE c.usuario = $1`, [user]
        );

        // --------------------------------------------------------------------

        const ownerResult = await client.query("SELECT CONCAT(nombre, ' ', apellido) AS paciente FROM pacientes WHERE cedula = $1", [user])
        
        client.release();

        return NextResponse.json({ patients: result.rows, owner: ownerResult.rows[0]?.paciente ?? null });
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}

// POST Route
export async function POST(request: NextRequest, { params }: { params: Promise<{user: string}> }): Promise<NextResponse> {
    try {
        const { patient } = await request.json();

        const { user } = await params;

        const timestamp = new Date().toISOString();

        const client = await dbPool.connect();

        // -------------------------------------------------------------------------------------------

        const patientExists = await client.query("SELECT id FROM pacientes WHERE cedula = $1 LIMIT 1", [patient.cedula]);

        if (patientExists.rows.length != 0) {
            return NextResponse.json({ message: `Ya existe un paciente registrado con la C.I. ${patient.cedula}`}, { status: 401 })
        } else {
            const credentialsExist = await client.query(
                "SELECT id FROM credenciales WHERE usuario = $1 LIMIT 1",
                [user]
            );

            if (credentialsExist.rows.length === 0) {
                return NextResponse.json({ message: `La credencial ${patient.credencial} no existe. Por favor, ingrese una credencial válida` }, { status: 401 });
            }

            const credentialID = credentialsExist.rows[0].id;

            // -------------------------------------------------------------------------------------------

            const insertPatient = await client.query(
                "INSERT INTO pacientes (nombre, apellido, cedula, fecha_nacimiento, email, telefono, direccion, genero, credencial_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
                [patient.nombre, patient.apellido, patient.cedula, patient.fecha_nacimiento, patient.email, patient.telefono, patient.direccion, patient.genero, credentialID]
            );

            const patientID = insertPatient.rows[0].id;

            // -------------------------------------------------------------------------------------------

            const insertOdontogram = await client.query("INSERT INTO odontodiagramas DEFAULT VALUES RETURNING id", []);

            const odontogramID = insertOdontogram.rows[0].id;

            // -------------------------------------------------------------------------------------------

            for (let i = 0; i < 8; i++) {
                const insertSectors = await client.query(
                    "INSERT INTO sectores (nombre, odontodiagrama_id) VALUES ($1, $2) RETURNING id",
                    [i.toString(), odontogramID]
                );

                const sectorID = insertSectors.rows[0].id;

                if (i < 4) {
                    for (let j = 0; j < 8; j++) {
                        const insertTeeth = await client.query(
                            "INSERT INTO dientes (nombre, sector_id) VALUES ($1, $2) RETURNING id",
                            [j.toString(), sectorID]
                        );

                        const toothID = insertTeeth.rows[0].id;

                        for (let k = 1; k < 6; k++) {
                            await client.query(
                                "INSERT INTO segmentos (nombre, valor_afectacion, diente_id) VALUES ($1, $2, $3) RETURNING id",
                                [k.toString(), 0, toothID]
                            );
                        }
                    }
                } else {
                    for (let j = 0; j < 5; j++) {
                        const insertTeeth = await client.query(
                            "INSERT INTO dientes (nombre, sector_id) VALUES ($1, $2) RETURNING id",
                            [j.toString(), sectorID]
                        );

                        const toothID = insertTeeth.rows[0].id;

                        for (let k = 1; k < 6; k++) {
                            await client.query(
                                "INSERT INTO segmentos (nombre, valor_afectacion, diente_id) VALUES ($1, $2, $3) RETURNING id",
                                [k.toString(), 0, toothID]
                            );
                        }
                    }
                }
            }
            
            // -------------------------------------------------------------------------------------------

            const { rows } = await client.query("SELECT nextval('historias_codigo_seq') AS codigo");
            const codigo = rows[0].codigo;

            await client.query(
                "INSERT INTO historias (paciente_id, odontodiagrama_id, antecedentes, observaciones, codigo, fecha_modificacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [patientID, odontogramID, "", "", codigo, timestamp]
            )
        }

        client.release();

        return NextResponse.json({ message: "OK" }, {status: 201 });
    } catch (error) {
        console.error("Error inserting patient data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}