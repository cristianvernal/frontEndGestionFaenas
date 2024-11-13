export interface CrearTrabajadorDTO {
  idTipoUsuario: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  run: string;
  fechaNacimiento: string;
  fechaContratacion: string;
  direccion: string;
  telefono: string;
  comuna: string;
  region: string;
  email: string;
  calleDireccion: string;
  numeroDireccion: string;
  cargos: {
    id: number;
    nombre: string;
    descripcion: string;
  };
}
