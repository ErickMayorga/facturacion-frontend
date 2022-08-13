export interface TablaNotaDebitoInterface {
  id_nota_debito: number
  id_factura: number
  numero_comprobante: string
  razon_social_comprador: string
  identificacion_comprador: string
  numero_factura: number
  fecha_emision: Date
  total_sin_modificar: number
  total_modificado: number
  habilitado: boolean
}

