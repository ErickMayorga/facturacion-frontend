export interface TablaNotaCreditoInterface {
  id_nota_credito: number
  id_factura: number
  numero_comprobante: string
  razon_social_comprador: string
  identificacion_comprador: string
  numero_factura: string
  motivo: string
  fecha_emision: Date
  valor_total: number
  habilitado: boolean
}
