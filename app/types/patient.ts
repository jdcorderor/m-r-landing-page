// Define patient type
export type Patient = {
    usuario_id: number;
    paciente_id: number;
    nombre: string;
    apellido: string;
    cedula: number | null;
    fecha_nacimiento: string;
    email: string;
    telefono: string;
    direccion: string;
    genero: string;
}