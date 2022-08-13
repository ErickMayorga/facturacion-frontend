export interface NotaDebitoInterface {
  id_nota_de_debito: number
  id_factura: number
  numero_comprobante: string
  fecha_emision: Date
  clave_acceso: string
  total_sin_modificacion: number
  total_con_modificacion: number
  habilitado: boolean
  id_empresa: number
}
