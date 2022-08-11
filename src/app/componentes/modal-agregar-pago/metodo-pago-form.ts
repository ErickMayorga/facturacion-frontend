import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const metodoPagoForm: InputGenericInterface[] = [
  {
    title: 'Método de pago',
    nameField: 'metodo_pago',
    type: 'select',
    helpText: 'Seleccione un método de pago',
    requiredMessage: 'Este campo es requerido',
  },
  {
    title: 'Valor del pago',
    nameField: 'valor_pago',
    type: 'text',
    helpText: 'Ingrese el valor del pago',
    requiredMessage: 'Este campo es requerido',
  },
  {
    title: 'Unidad de tiempo',
    nameField: 'unidad_tiempo',
    type: 'select',
    helpText: 'Seleccione la unidad de tiempo',
    options: ['Ninguno', 'Días', 'Meses', 'Años']
  },
  {
    title: 'Plazo de tiempo',
    nameField: 'plazo_tiempo',
    type: 'number',
    helpText: 'Ingrese el plazo de tiempo',
  }
]
