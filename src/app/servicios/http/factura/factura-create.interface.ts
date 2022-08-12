export interface FacturaCreateInterface {
  id_empresa: number
  numero_comprobante: string
  id_cliente: number
  fecha_emision: Date
  clave_acceso: string
  guia_de_remision?: string
  propina: number
  importe_total: number
  moneda: string
  total_sin_impuestos: number
  total_descuento: number
  total_sin_iva: number
  total_con_iva: number
  habilitado: boolean
}
