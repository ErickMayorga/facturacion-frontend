export interface NotaCreditoCreateInterface {
  id_factura: number
  numero_comprobante: string
  fecha_emision: Date
  clave_acceso: string
  motivo: string
  total_sin_impuestos: number
  total_descuentos: number
  total_sin_iva: number
  total_iva: number
  total_ice: number
  total_irbpnr: number
  habilitado: boolean
  id_empresa: number
  importe_total: number
}
