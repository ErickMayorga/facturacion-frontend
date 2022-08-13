export interface TablaNotaCreditoDetalleInterface {
  id_nota_credito: number
  id_detalle: number
  id_producto: number
  codigo_principal: string
  codigo_auxiliar: string | undefined
  nombre_producto: string
  precio_unitario: number
  cantidad: number
  descuento: number
  valor_ice: number
  valor_irbpnr: number
  valor_total: number
  estado: 'c' | 'u' | 'd'
}
