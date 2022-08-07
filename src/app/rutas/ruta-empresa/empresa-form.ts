import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const empresaForm: InputGenericInterface[] = [
  {
    title: 'RUC',
    nameField: 'ruc',
    type: 'text',
    helpText: 'Ingrese su número de RUC',
    requiredMessage: 'El RUC es requerido',
    lengthMessage: 'El RUC debe tener exactamente 13 caracteres'
  },
  {
    title: 'Razón Social',
    nameField: 'razon_social',
    type: 'text',
    helpText: 'Ingrese sus nombres o razón social',
    requiredMessage: 'La razón social es requerida',
    lengthMessage: 'La razón social debe tener máximo 100 caracteres'
  },
  {
    title: 'Nombre Comercial',
    nameField: 'nombre_comercial',
    type: 'text',
    helpText: 'Ingrese el nombre comercial de su empresa',
    lengthMessage: 'La razón social debe tener máximo 45 caracteres'
  },
  {
    title: 'Dirección Matriz',
    nameField: 'direccion_matriz',
    type: 'text',
    helpText: 'Ingrese la dirección de la matriz',
    requiredMessage: 'La dirección matriz es requerida',
  },
  {
    title: 'Dirección Establecimiento',
    nameField: 'direccion_establecimiento',
    type: 'text',
    helpText: 'Ingrese la dirección de su establecimiento',
    requiredMessage: 'La dirección establecimiento es requerida',
  },
  {
    title: 'Código de establecimiento',
    nameField: 'codigo_establecimiento',
    type: 'text',
    helpText: 'Ingrese un código para su establecimiento',
    requiredMessage: 'El código de establecimiento es requerido',
    lengthMessage: 'El código debe tener máximo 10 caracteres'
  },
  {
    title: 'Código del Punto de Emisión',
    nameField: 'codigo_punto_emision',
    type: 'text',
    helpText: 'Ingrese un código para su punto de emisión',
    requiredMessage: 'El código del punto de emisión es requerido',
    lengthMessage: 'El código debe tener máximo 10 caracteres'
  },
  {
    title: 'Contribuyente especial',
    nameField: 'contribuyente_especial',
    type: 'number',
    helpText: 'Ingrese su número de contribuyente especial',
    requiredMessage: 'El número de contribuyente es requerido',
    lengthMessage: 'El número de contribuyente debe ser mayor a 0'
  },
  {
    title: 'Obligado a llevar contabilidad',
    nameField: 'obligado_contabilidad',
    type: 'checkbox',
    helpText: 'Indique si está obligado a llevar contabilidad',
    requiredMessage: 'Este campo es requerido',
  },
  {
    title: 'Tipo de ambiente',
    nameField: 'ambiente',
    type: 'select',
    helpText: 'Seleccione un ambiente',
    requiredMessage: 'Este campo es requerido',
    options: ['Producción', 'Pruebas']
  },
];
