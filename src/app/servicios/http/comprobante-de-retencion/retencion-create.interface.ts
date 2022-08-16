export interface RetencionCreateInterface {
  id_factura: number
  numero_comprobante: string
  fecha_emision: Date
  clave_acceso: string
  habilitado: boolean
  id_empresa: number
  total_retenido: number
}
