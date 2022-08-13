export interface TablaRetencionDetalleInterface {
  id_retencion: number
  id_detalle: number
  id_factura: number
  id_impuesto: number
  codigo_impuesto: string
  nombre_impuesto: string
  numero_factura: string
  base_imponible: number
  tarifa: number
  valor_total: number
  estado: 'c' | 'u' | 'd'
}
