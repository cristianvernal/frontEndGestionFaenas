export interface BaseResponse<T> {
    codigoRetorno: number,
    glosaRetorno: string,
    resultado: T,
    timestamp: Date,
}

