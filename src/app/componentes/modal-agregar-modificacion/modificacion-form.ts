import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const modificacionForm: InputGenericInterface[] = [
  {
    title: '*Razón de la modificación',
    nameField: 'razon_modificacion',
    type: 'text',
    helpText: 'Ingrese una razón para la modificación',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'La razón debe tener máximo 45 caracteres'
  },
  {
    title: '*Valor de la modificación',
    nameField: 'valor_modificacion',
    type: 'float',
    helpText: 'Ingrese el valor de la modificación',
    requiredMessage: 'Este campo es requerido',
  }
]
