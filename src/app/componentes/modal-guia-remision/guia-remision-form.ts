import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const guiaRemisionForm: InputGenericInterface[] = [
  {
    title: 'Fecha de emisión',
    nameField: 'fecha_emision',
    type: 'date',
    helpText: 'Ingrese la fecha de emisión',
    requiredMessage: 'Este campo es requerido',
  },
  {
    title: '*Número de identificación',
    nameField: 'numero_identificacion',
    type: 'text',
    helpText: 'Ingrese el número de identificación del cliente para cargar su información',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo debe tener 10 o 13 caracteres'
  },
  {
    title: '*Dirección de partida',
    nameField: 'direccionPartida',
    type: 'text',
    helpText: 'Ingrese la dirección de partida',
    requiredMessage: 'Este campo es requerido',
  },
]
