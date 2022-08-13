export interface TablaNotaDebitoPagoInterface {
  id_nota_debito: number
  id_pago: number
  id_metodo_pago:number
  nombre_metodo: string
  valor: number
  plazo: number | ''
  unidad_tiempo: string
  estado: 'c' | 'u' | 'd'
}
