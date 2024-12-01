import { TipoRegistro } from "./tipoRegistro"

export interface RegistroAsistencia {
    idRegistro?: number;
    runTrabajador: string;
    fecha: string;
    hora: string;
    idFaena: number;
    tipoRegistroJoin: TipoRegistro;
    tipoMarcaje: {
    idTipoRegistro: number;
    tipoRegistro: string;
  }
}