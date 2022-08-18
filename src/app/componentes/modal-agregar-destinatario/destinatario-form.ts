import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const destinatarioForm: InputGenericInterface[] = [
  {
    title: 'Motivo (Opcional)',
    nameField: 'motivo',
    type: 'text',
    helpText: 'Ingrese un motivo para la factura',
    requiredMessage: 'Este campo es requerido',
    lengthMessage: 'El motivo debe tener máximo 45 caracteres'
  }
]
