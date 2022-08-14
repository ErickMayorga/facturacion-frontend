export interface FacturaDetalleInterface {
  id_factura_detalle: number
  id_factura: number
  id_producto: number
  cantidad: number
  descuento: number
  total_producto: number
  valor_iva: number
  valor_ice: number
  valor_irbpnr: number
}
