import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const transportistaForm: InputGenericInterface[] = [
  {
    title: '*Nombre Completo/Razón Social',
    nameField: 'razon_social',
    type: 'text',
    helpText: 'Ingrese el nombre o razón social',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo puede tener máximo 100 caracteres'
  },
  {
    title: '*Tipo de identificación',
    nameField: 'tipo_identificacion',
    type: 'select',
    helpText: 'Seleccione un tipo de identificación',
    requiredMessage: 'Este campo es requerido',
    options: ['Cédula', 'RUC']
  },
  {
    title: '*Número de identificación',
    nameField: 'numero_identificacion',
    type: 'text',
    helpText: 'Ingrese el número de identificación',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo debe tener 10 o 13 caracteres'
  },
  {
    title: '*Correo electrónico',
    nameField: 'correo',
    type: 'email',
    helpText: 'Ingrese un correo electrónico',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo debe tener máximo 45 caracteres'
  },
  {
    title: '*Placa',
    nameField: 'placa',
    type: 'text',
    helpText: 'Ingrese la placa del vehículo',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo debe tener exactamente 9 caracteres'
  },
]
