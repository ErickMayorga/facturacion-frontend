export interface ProductoCreateInterface {
  id_usuario: number
  codigo_principal: string
  codigo_auxiliar?: string
  tipo_producto: number
  nombre: string
  valor_unitario: number
}
