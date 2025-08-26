// Define confirmed date type
export type ConfirmedDate = {
  fecha: string;
  fin_tentativo: string;
  odontologo_id: string;
}

// Define date type
export type Reservation = {
  id: number,
  paciente_id: number,
  nombre: string,
  apellido: string,
  telefono: string,
  email: string;
  motivo: string,
  especialista: string,
  fecha: string,
  estado: string
}