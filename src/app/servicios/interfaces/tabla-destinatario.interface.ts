export interface TablaDestinatarioInterface {
  id_guia_remision: number
  id_destinatario: number
  id_cliente: number
  id_factura: number
  razon_social: string
  tipo_identificacion: string
  numero_identificacion: string
  numero_factura: number
  estado: 'c' | 'u' | 'd'
}
