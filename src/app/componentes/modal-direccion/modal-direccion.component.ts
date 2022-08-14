import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {direccionForm} from "./direccion-form";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";

@Component({
  selector: 'app-modal-direccion',
  templateUrl: './modal-direccion.component.html',
  styleUrls: ['./modal-direccion.component.scss']
})
export class ModalDireccionComponent implements OnInit {

  formGroupDireccion = new FormGroup({});
  direccionPrevia:DireccionInterface = {} as DireccionInterface
  fields = direccionForm
  tituloModal = ''

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalDireccionComponent>,
               private readonly formBuilder: FormBuilder,) {
    this.direccionPrevia = this.data.direccionActual
    this.formGroupDireccion =this.formBuilder.group(
      {
        canton: ['', Validators.required],
        parroquia: ['', Validators.required],
        descripcion: ['', Validators.required],
      }
    )
  }

  ngOnInit(): void {
    if(this.direccionPrevia != undefined){
      //const direccionArray = this.direccionPrevia.trim().split(',')
      this.tituloModal = 'Actualización de dirección'
      this.formGroupDireccion.patchValue({
        canton: this.direccionPrevia.canton,
        parroquia: this.direccionPrevia.parroquia,
        descripcion: this.direccionPrevia.descripcion_exacta
      });
    }else{
      this.tituloModal = 'Registro de dirección'
    }
  }

  cancelar() {
    this.dialogRef.close()
  }

  guardarDireccion(){
    const canton =  this.formGroupDireccion.get('canton')?.value.trim()
    const parroquia =  this.formGroupDireccion.get('parroquia')?.value.trim()
    const descripcion =  this.formGroupDireccion.get('descripcion')?.value.trim()

    let direccionActual = null

    if(this.direccionPrevia === undefined){
      direccionActual = {
        canton: canton,
        parroquia: parroquia,
        descripcion_exacta: descripcion
      } as DireccionCreateInterface
    }else{
      direccionActual = {
        id_direccion: this.direccionPrevia.id_direccion,
        canton: canton,
        parroquia: parroquia,
        descripcion_exacta: descripcion
      } as DireccionInterface
    }
    this.dialogRef.close({direccion: direccionActual})
  }

}
