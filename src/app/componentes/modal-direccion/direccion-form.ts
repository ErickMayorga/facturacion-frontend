import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const direccionForm: InputGenericInterface[] = [
  {
    title: 'Cantón',
    nameField: 'canton',
    type: 'text',
    helpText: 'Ingrese el nombre del cantón',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo puede tener máximo 45 caracteres'
  },
  {
    title: 'Parroquia',
    nameField: 'parroquia',
    type: 'text',
    helpText: 'Ingrese el nombre de la parroquia',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo puede tener máximo 45 caracteres'
  },
  {
    title: 'Descripción exacta',
    nameField: 'descripcion',
    type: 'text',
    helpText: 'Ingrese las calles y número de casa',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'Este campo puede tener máximo 100 caracteres'
  },
]
