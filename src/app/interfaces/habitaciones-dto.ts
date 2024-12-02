import { HabitacionEstadoDTO } from "./habitacion-estado-dto";
import { HotelDTO } from "./hotel-dto";

export interface HabitacionesDTO {
    idHabitacion: number,
    numeroHabitacion: number,
    hotel: HotelDTO,
    estado: HabitacionEstadoDTO,
}