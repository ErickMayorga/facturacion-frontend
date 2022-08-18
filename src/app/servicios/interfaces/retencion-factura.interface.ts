export interface RetencionFacturaInterface {
  id_retencion: number
  id_detalle: number
  numero_retencion: string
  nombre_impuesto: string
  base_imponible: number
  tarifa: number
  valor_retenido: number
  habilitado: boolean
}
