import { Faena } from "./faenas"
import { TipoRegistro } from "./tipoRegistro"

export interface RegistroAsistencia {
    idRegistro?: number;
    faena: Faena;
    idTrabajador: number;
    fechaHora: Date;
    asistencia: boolean;
    tipoRegistroJoin: TipoRegistro;
}