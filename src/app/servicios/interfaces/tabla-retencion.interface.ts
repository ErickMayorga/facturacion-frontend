export interface TablaRetencionInterface {
  idRetencion: number
  idFactura: number
  numero_comprobante: string
  razon_social_comprador: string
  identificacion_comprador: string
  numero_factura: string
  fecha_emision: Date
  total_retenido: number
  habilitado: boolean
}
