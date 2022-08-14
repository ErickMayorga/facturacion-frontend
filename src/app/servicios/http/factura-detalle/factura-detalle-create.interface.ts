export interface FacturaDetalleCreateInterface {
  id_factura: number
  id_producto: number
  cantidad: number
  descuento: number
  total_producto: number
  valor_iva: number
  valor_ice: number
  valor_irbpnr: number
}
