export interface ProductoInterface {
  id_producto: number
  id_usuario: number
  codigo_principal: string
  codigo_auxiliar?: string
  tipo_producto: string
  nombre: string
  valor_unitario: number
}
