import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";

export const signUpForm: InputGenericInterface[] = [
  {
    title: '*Nombres',
    nameField: 'nombres',
    type: 'text',
    helpText: 'Ingrese sus nombres',
    requiredMessage: 'El campo nombres es requerido',
    lengthMessage: 'El campo nombres debe tener máximo 45 caracteres'
  },
  {
    title: '*Apellidos',
    nameField: 'apellidos',
    type: 'text',
    helpText: 'Ingrese sus apellidos',
    requiredMessage: 'El campo apellidos es requerido',
    lengthMessage: 'El campo apellidos debe tener máximo 45 caracteres'
  },
  {
    title: '*Correo electrónico',
    nameField: 'correo',
    type: 'email',
    helpText: 'Ingrese su correo electrónico',
    requiredMessage: 'El correo electrónico es requerido',
    lengthMessage: 'El correo debe tener máximo 45 caracteres'
  },
  {
    title: '*Dirección',
    nameField: 'direccion',
    type: 'text',
    helpText: 'Ingrese su dirección de domicilio',
    requiredMessage: 'La dirección es requerida',
    lengthMessage: ''
  },
  {
    title: '*Contraseña',
    nameField: 'passwordUsuario',
    type: 'password',
    helpText: 'Ingrese una contraseña entre 8 y 16 caracteres alfanuméricos',
    requiredMessage: 'La contraseña es requerida',
    lengthMessage: 'La contraseña debe tener entre 8 y 16 caracteres alfanuméricos'
  },
  {
    title: '*Confirma tu contraseña',
    nameField: 'passwordConfirmacion',
    type: 'password',
    helpText: 'Ingrese nuevamente su contraseña',
    requiredMessage: 'La confirmación de contraseña es requerida',
    lengthMessage: 'La contraseña debe tener entre 8 y 16 caracteres alfanuméricos'
  }

];
