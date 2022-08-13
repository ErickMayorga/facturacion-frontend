export interface RetencionDetalleCreateInterface {
  id_comprobante_de_retencion: number
  id_impuesto: number
  codigo_retencion: string
  codigo: string
  descripcion: string
  base_imponible: number
  fecha: Date
  id_factura: number
  porcentaje: number
  total: number
}
