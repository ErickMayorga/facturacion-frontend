import {Component, Inject, OnInit} from '@angular/core';
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";
import {ClienteCreateInterface} from "../../servicios/http/cliente/cliente-create.interface";
import {ModalDireccionComponent} from "../modal-direccion/modal-direccion.component";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss']
})
export class ModalClienteComponent implements OnInit {

  formGroupCliente = new FormGroup({});
  fields: InputGenericInterface[] = [
    {
      title: 'Nombre Completo/Razón Social',
      nameField: 'razon_social',
      type: 'text',
      helpText: 'Ingrese el nombre o razón social',
      requiredMessage: 'Este campo es requerido',
      lengthMessage: 'Este campo puede tener máximo 100 caracteres'
    },
    {
      title: 'Tipo de identificación',
      nameField: 'tipo_identificacion',
      type: 'select',
      helpText: 'Seleccione un tipo de identificación',
      requiredMessage: 'Este campo es requerido',
      options: ['Cédula', 'RUC']
    },
    {
      title: 'Número de identificación',
      nameField: 'numero_identificacion',
      type: 'text',
      helpText: 'Ingrese el número de identificación',
      requiredMessage: 'Este campo es requerido',
      lengthMessage: 'Este campo debe tener 10 o 13 caracteres'
    },
    {
      title: 'Dirección de domicilio',
      nameField: 'direccion',
      type: 'text',
      helpText: 'Ingrese una dirección',
      requiredMessage: 'Este campo es requerido',
    },
    {
      title: 'Teléfono',
      nameField: 'telefono',
      type: 'text',
      helpText: 'Ingrese un teléfono convencional o celular',
      requiredMessage: 'Este campo es requerido',
      lengthMessage: 'Este campo debe máximo 10 caracteres'
    },
    {
      title: 'Correo electrónico',
      nameField: 'correo',
      type: 'email',
      helpText: 'Ingrese un correo electrónico',
      requiredMessage: 'Este campo es requerido',
      lengthMessage: 'Este campo debe máximo 45 caracteres'
    },
  ]

  mostrarDireccion = false

  direccionCliente: DireccionCreateInterface = {} as DireccionCreateInterface;
  idDireccionCreada = -1
  private usuarioActual: number = -1;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalClienteComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly direccionService: DireccionService,
               public dialog: MatDialog,) {
    this.usuarioActual = this.data.usuario
    this.formGroupCliente =this.formBuilder.group(
      {
        razon_social: ['', [Validators.required, Validators.maxLength(100)]],
        tipo_identificacion: ['', Validators.required],
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
        direccion: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.maxLength(10)]],
        correo: ['', [Validators.required, Validators.maxLength(45)]],
      }
    )
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close()
  }

  guardarCliente(){
    const razon_social =  this.formGroupCliente.get('razon_social')?.value.trim()
    const tipo_identificacion =  this.formGroupCliente.get('tipo_identificacion')?.value.trim()
    const numero_identificacion =  this.formGroupCliente.get('numero_identificacion')?.value.trim()
    const telefono =  this.formGroupCliente.get('telefono')?.value.trim()
    const correo =  this.formGroupCliente.get('correo')?.value.trim()

    const clienteActual = {
      id_usuario: this.usuarioActual,
      nombres_razon_social: razon_social,
      tipo_identificacion: tipo_identificacion,
      id_direccion: -1,
      numero_identificacion: numero_identificacion,
      telefono: telefono,
      correo_electronico: correo,
    } as ClienteCreateInterface

    this.dialogRef.close({cliente: clienteActual, direccion: this.direccionCliente})
  }

  guardarDireccion(){
    const referenciaDialogo = this.dialog.open(
      ModalDireccionComponent,
      {
        disableClose: false,
        data: {}
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            this.direccionCliente = datos['direccion'] as DireccionCreateInterface
            this.formGroupCliente.patchValue({
              direccion: this.direccionService.getStringDireccion(this.direccionCliente),
            });
          }
        }
      )
  }

}
