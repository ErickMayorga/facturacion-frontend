import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const impuestoRetencionForm: InputGenericInterface[] = [
  {
    title: '*Impuesto',
    nameField: 'impuesto_retencion',
    type: 'select',
    helpText: 'Seleccione un impuesto para retención',
    requiredMessage: 'Este campo es requerido',
    options: ['IVA', 'Impuesto a la renta']
  },
  {
    title: '*Base imponible',
    nameField: 'base_imponible',
    type: 'float',
    helpText: 'Ingrese el valor de base imponible',
    requiredMessage: 'Este campo es requerido',
  }
]
