import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const facturaForm: InputGenericInterface[] = [
  {
    title: 'Fecha de emisión',
    nameField: 'fecha_emision',
    type: 'date',
    helpText: 'Ingrese la fecha de emisión',
    requiredMessage: 'Este campo es requerido',
  },
  {
    title: 'Guía de remisión',
    nameField: 'guia_remision',
    type: 'text',
    helpText: 'Ingrese el número de guía de remisión',
    lengthMessage: 'Este campo puede tener máximo 45 caracteres'
  },
  {
    title: 'Número de identificación',
    nameField: 'numero_identificacion',
    type: 'text',
    helpText: 'Ingrese el número de identificación del cliente para cargar su información',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo debe tener 10 0 13 caracteres'
  },
]
