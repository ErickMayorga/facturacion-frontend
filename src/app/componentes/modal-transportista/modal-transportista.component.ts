import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {transportistaForm} from "./transportista-form";
import {TransportistaInterface} from "../../servicios/http/transportista/transportista.interface";
import {TransportistaService} from "../../servicios/http/transportista/transportista.service";
import {TransportistaCreateInterface} from "../../servicios/http/transportista/transportista-create.interface";

@Component({
  selector: 'app-modal-transportista',
  templateUrl: './modal-transportista.component.html',
  styleUrls: ['./modal-transportista.component.scss']
})
export class ModalTransportistaComponent implements OnInit {

  formGroupTransportista = new FormGroup({});
  fields = transportistaForm

  usuarioActual: number = -1;
  operacion = ''
  transportistaActual: number = -1
  transportistaDB: TransportistaInterface = {} as TransportistaInterface

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalTransportistaComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly transportistaService: TransportistaService,
               public dialog: MatDialog,) {
    this.usuarioActual = this.data.usuario
    this.operacion = this.data.operacion
    this.transportistaActual = this.data.transportista
    this.formGroupTransportista =this.formBuilder.group(
      {
        razon_social: ['', [Validators.required, Validators.maxLength(100)]],
        tipo_identificacion: ['', Validators.required],
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
        correo: ['', [Validators.required, Validators.maxLength(45)]],
        placa: ['', [Validators.required, Validators.maxLength(9)]],
      }
    )
  }

  ngOnInit(): void {
    if(this.operacion === 'editar'){
      this.buscarTransportista()
    }
  }

  cancelar() {
    this.dialogRef.close()
  }

  // Carga inicial de información del transportista
  buscarTransportista() {
    this.transportistaService.get(this.transportistaActual)
      .subscribe(
        {
          next: (datos) => {
            this.transportistaDB = datos as TransportistaInterface
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

  cargarInformacion() {
    this.formGroupTransportista.patchValue({
      razon_social: this.transportistaDB.nombres_razon_social,
      tipo_identificacion: this.transportistaDB.tipo_identificacion,
      numero_identificacion: this.transportistaDB.numero_identificacion,
      correo: this.transportistaDB.correo_electronico,
      placa: this.transportistaDB.placa
    });
  }

  guardarTransportista(){
    const razon_social =  this.formGroupTransportista.get('razon_social')?.value.trim()
    const tipo_identificacion =  this.formGroupTransportista.get('tipo_identificacion')?.value.trim()
    const numero_identificacion =  this.formGroupTransportista.get('numero_identificacion')?.value.trim()
    const correo =  this.formGroupTransportista.get('correo')?.value.trim()
    const placa =  this.formGroupTransportista.get('placa')?.value.trim()

    let transportistaObject: TransportistaInterface | TransportistaCreateInterface = {} as TransportistaCreateInterface

    if(this.operacion === 'crear'){
      transportistaObject = {
        id_usuario: this.usuarioActual,
        nombres_razon_social: razon_social,
        tipo_identificacion: tipo_identificacion,
        numero_identificacion: numero_identificacion,
        correo_electronico: correo,
        placa: placa
      } as TransportistaCreateInterface
    }

    if(this.operacion === 'editar'){
      transportistaObject = {
        id_transportista: this.transportistaDB.id_transportista,
        id_usuario: this.usuarioActual,
        nombres_razon_social: razon_social,
        tipo_identificacion: tipo_identificacion,
        numero_identificacion: numero_identificacion,
        correo_electronico: correo,
        placa: placa
      } as TransportistaInterface
    }


    this.dialogRef.close({transportista: transportistaObject})
  }
}
