export interface AttendanceTableDTO {
    nombre: string;
    apellido: string;
    rut: string;
    fecha: string;
    hora: string;
    idFaena: number;
    idRegistro: number;
    tipoMarcaje: {
        idTipoRegistro: number;
        tipoRegistro: string;
    }
    fechaEntrada: string;
    fechaSalida: string;
}