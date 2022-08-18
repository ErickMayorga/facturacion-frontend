export interface ImpuestoFacturaInterface {
  id_producto: number
  id_impuesto: number
  nombre_producto: string
  nombre_impuesto: string
  base_imponible: number
  tarifa: number
  tipo_tarifa: string
  total: number
}
