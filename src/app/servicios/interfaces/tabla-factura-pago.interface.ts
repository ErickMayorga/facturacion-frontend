export interface TablaFacturaPagoInterface {
  id_factura: number
  id_pago: number
  id_metodo_pago:number
  nombre_metodo: string
  valor: number
  plazo: number | ''
  unidad_tiempo: string
  estado: 'c' | 'u' | 'd'
}
