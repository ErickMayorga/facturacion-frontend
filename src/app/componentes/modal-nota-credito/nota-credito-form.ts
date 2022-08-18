import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const notaCreditoForm: InputGenericInterface[] = [
  {
    title: '*Número de identificación',
    nameField: 'numero_identificacion',
    type: 'text',
    helpText: 'Ingrese el número de identificación del cliente para cargar su información',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo debe tener 10 o 13 caracteres'
  },
  {
    title: '*Número de factura',
    nameField: 'numero_factura',
    type: 'select',
    helpText: 'Seleccione una factura del cliente',
    requiredMessage: 'Este campo es requerido',
  },
  {
    title: '*Motivo',
    nameField: 'motivo',
    type: 'text',
    helpText: 'Ingrese un motivo de la nota de crédito',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo debe tener máximo 45 caracteres',
  },
]
