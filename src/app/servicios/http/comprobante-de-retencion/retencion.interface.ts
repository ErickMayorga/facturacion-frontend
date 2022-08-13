export interface RetencionInterface {
  id_comprobante_de_retencion: number
  id_factura: number
  numero_comprobante: string
  fecha_emision: Date
  clave_acceso: string
  habilitado: boolean
  id_empresa: number
}
