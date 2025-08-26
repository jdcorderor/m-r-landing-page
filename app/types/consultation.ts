// Define consultationt type
export type Consultation = {
    id: number,
    paciente_id: number,
    codigo: string,
    fecha: string,
    especialista: string,
    diagnostico: string[],
    tratamiento: string[],
    observaciones: string,
    monto_total: number,
    monto_pagado: number,
}