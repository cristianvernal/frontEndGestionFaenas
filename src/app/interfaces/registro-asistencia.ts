import { Faena } from "./faenas"
import { TipoRegistro } from "./tipoRegistro"

export interface RegistroAsistencia {
    idRegistro?: number;
    idFaena: number;
    runTrabajador: string;
    fechaHora: Date;
    // asistencia: boolean;
    tipoRegistroJoin: TipoRegistro;
}