export interface FacturaPagoInterface {
  id_factura_pago: number
  id_factura: number
  id_metodo_de_pago: number
  valor_pago: number
  medida_tiempo: string
  plazo: number
}
