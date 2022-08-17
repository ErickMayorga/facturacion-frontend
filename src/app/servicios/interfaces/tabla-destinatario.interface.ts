export interface TablaDestinatarioInterface {
  id_guia_remision: number
  id_destinatario: number
  id_cliente: number
  id_factura: number
  razon_social: string
  tipo_identificacion: string
  numero_identificacion: string
  numero_factura: string
  fecha_emision: string | null
  motivo: string
  estado: 'c' | 'u' | 'd'
}
