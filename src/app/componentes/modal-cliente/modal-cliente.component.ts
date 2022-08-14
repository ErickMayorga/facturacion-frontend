import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClienteCreateInterface} from "../../servicios/http/cliente/cliente-create.interface";
import {ModalDireccionComponent} from "../modal-direccion/modal-direccion.component";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {clienteForm} from "./cliente-form";

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss']
})
export class ModalClienteComponent implements OnInit {

  formGroupCliente = new FormGroup({});
  fields = clienteForm
  tituloModal = ''

  nextDireccion = -1
  usuarioActual: number = -1;
  operacion = ''
  clienteActual: number = -1
  clienteDB: ClienteInterface = {} as ClienteInterface
  direccionCliente: DireccionInterface = {} as DireccionInterface;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalClienteComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly direccionService: DireccionService,
               private readonly clienteService: ClienteService,
               public dialog: MatDialog,) {
    this.usuarioActual = this.data.usuario
    this.operacion = this.data.operacion
    this.clienteActual = this.data.cliente
    this.formGroupCliente =this.formBuilder.group(
      {
        razon_social: ['', [Validators.required, Validators.maxLength(100)]],
        tipo_identificacion: ['', Validators.required],
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
        direccion: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.maxLength(10)]],
        correo: ['', [Validators.required, Validators.maxLength(45), Validators.email]],
      }
    )

    this.formGroupCliente.get('direccion')?.disable()

    this.direccionService.getNextIndex()
      .subscribe(
        {
          next: (index) => {
            this.nextDireccion = index
          },
          error: (error) => {
            console.error(error)
          }
        }
      )
  }

  ngOnInit(): void {
    if(this.operacion === 'editar'){
      this.tituloModal = 'Actualización de cliente'
      this.buscarCliente()
    } else{
      this.tituloModal = 'Registro de cliente'
    }
  }

  cancelar() {
    this.dialogRef.close()
  }

  // Carga inicial de información del cliente
  buscarCliente() {
    this.clienteService.get(this.clienteActual)
      .subscribe(
        {
          next: (datos) => {
            this.clienteDB = datos as ClienteInterface
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.direccionService.get(this.clienteDB.id_direccion)
              .subscribe(
                {
                  next: (datos) => {
                    this.direccionCliente = datos as DireccionInterface
                  },
                  error: (err) => {
                    console.error(err)
                  },
                  complete: () => {
                    this.cargarInformacion()
                  }
                }
              )
          }
        }
      )
  }

  cargarInformacion() {
    this.formGroupCliente.patchValue({
      razon_social: this.clienteDB.nombres_razon_social,
      tipo_identificacion: this.clienteDB.tipo_identificacion,
      numero_identificacion: this.clienteDB.numero_identificacion,
      direccion: this.direccionService.getStringDireccion(this.direccionCliente),
      telefono: this.clienteDB.telefono,
      correo: this.clienteDB.correo_electronico,
    });
  }

  abrirModalDireccion(){
    const referenciaDialogo = this.dialog.open(
      ModalDireccionComponent,
      {
        disableClose: false,
        data: {
          direccionActual: this.direccionCliente
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const direccion = datos['direccion']
            this.direccionCliente = direccion as DireccionInterface
            this.formGroupCliente.patchValue({
              direccion: this.direccionService.getStringDireccion(direccion),
            });
          }
        }
      )
  }

  guardarCliente(){
    const razon_social =  this.formGroupCliente.get('razon_social')?.value.trim()
    const tipo_identificacion =  this.formGroupCliente.get('tipo_identificacion')?.value.trim()
    const numero_identificacion =  this.formGroupCliente.get('numero_identificacion')?.value.trim()
    const telefono =  this.formGroupCliente.get('telefono')?.value.trim()
    const correo =  this.formGroupCliente.get('correo')?.value.trim()

    let clienteObject: ClienteInterface | ClienteCreateInterface = {} as ClienteCreateInterface

    if(this.operacion === 'crear'){
      clienteObject = {
        id_usuario: this.usuarioActual,
        nombres_razon_social: razon_social,
        tipo_identificacion: tipo_identificacion,
        id_direccion: this.nextDireccion,
        numero_identificacion: numero_identificacion,
        telefono: telefono,
        correo_electronico: correo,
      } as ClienteCreateInterface
    }

    if(this.operacion === 'editar'){
      clienteObject = {
        id_cliente: this.clienteDB.id_cliente,
        id_usuario: this.usuarioActual,
        nombres_razon_social: razon_social,
        tipo_identificacion: tipo_identificacion,
        id_direccion: this.direccionCliente.id_direccion,
        numero_identificacion: numero_identificacion,
        telefono: telefono,
        correo_electronico: correo,
      } as ClienteInterface
    }


    this.dialogRef.close({cliente: clienteObject, direccion: this.direccionCliente})
  }
}
