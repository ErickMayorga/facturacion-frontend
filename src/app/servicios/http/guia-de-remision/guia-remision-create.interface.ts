export interface GuiaRemisionCreateInterface {
  id_transportista: number
  numero_comprobante: string
  fecha_emision: Date
  clave_acceso: string
  id_direccion_partida: number
  habilitado: boolean
  id_empresa: number
}
