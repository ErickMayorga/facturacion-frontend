export interface EmpresaInterface {
  id_empresa: number,
  id_usuario: number,
  ruc: string,
  nombres_razon_social: string,
  nombre_comercial?: string,
  codigo_establecimiento: string
  codigo_punto_emision: string,
  num_contribuyente_especial: number
  id_direccion_matriz: number,
  id_direccion_establecimiento: number,
  obligado_contabilidad: boolean,
  path_logo?: string,
  ambiente: string
}
