export interface NotaCreditoInterface {
  id_nota_de_credito: number
  id_factura: number
  numero_comprobante: string
  fecha_emision: Date
  clave_acceso: string
  motivo: string
  total_sin_impuestos: number
  total_con_impuestos: number
  total_descuentos: number
  total_sin_iva: number
  total_con_iva: number
  habilitado: boolean
  id_empresa: number
}
