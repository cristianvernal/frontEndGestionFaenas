import { Faena } from "./faenas"
import { TipoRegistro } from "./tipoRegistro"

export interface RegistroAsistencia {
    idRegistro?: number;
    idFaena: number;
    runTrabajador: string;
    fecha: Date;
    hora: Date;
    tipoRegistroJoin: TipoRegistro;
    tipoMarcaje: {
    idTipoRegistro: number;
    tipoRegistro: string;
  }
}