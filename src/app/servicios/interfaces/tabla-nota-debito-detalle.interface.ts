export interface TablaNotaDebitoDetalleInterface {
  id_nota_debito: number
  id_detalle: number
  razon_modificacion: string
  valor_modificacion: string
  estado: 'c' | 'u' | 'd'
}
