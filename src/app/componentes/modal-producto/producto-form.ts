import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const productoForm: InputGenericInterface[] = [
  {
    title: '*Código principal',
    nameField: 'codigo_principal',
    type: 'text',
    helpText: 'Ingrese el código principal',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo puede tener máximo 10 caracteres'
  },
  {
    title: 'Código auxiliar (Opcional)',
    nameField: 'codigo_auxiliar',
    type: 'text',
    helpText: 'Ingrese el código auxiliar',
    lengthMessage: 'Este campo puede tener máximo 10 caracteres'
  },
  {
    title: '*Tipo de producto',
    nameField: 'tipo_producto',
    type: 'select',
    helpText: 'Seleccione el tipo de producto',
    requiredMessage: 'Este campo es requerido',
    options: ['Bien', 'Servicio']
  },
  {
    title: '*Nombre del producto',
    nameField: 'nombre',
    type: 'text',
    helpText: 'Ingrese el nombre del producto',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo debe tener máximo 45 caracteres'
  },
  {
    title: '*Valor Unitario',
    nameField: 'valor_unitario',
    type: 'float',
    helpText: 'Ingrese el valor unitario',
    requiredMessage: 'Este campo es requerido',
  },
]
