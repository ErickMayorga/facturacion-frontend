import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RutaSignupComponent} from "../../rutas/ruta-signup/ruta-signup.component";
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-modal-direccion',
  templateUrl: './modal-direccion.component.html',
  styleUrls: ['./modal-direccion.component.scss']
})
export class ModalDireccionComponent implements OnInit {

  direccionActual: DireccionCreateInterface = {
    canton: '',
    parroquia: '',
    descripcion_exacta: ''
  } as DireccionCreateInterface

  formGroupDireccion = new FormGroup({});

public dialogRefs = []
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalDireccionComponent>,
               private readonly formBuilder: FormBuilder,) {
    this.dialogRefs = [

    ]

    this.formGroupDireccion =this.formBuilder.group(
      {
        canton: ['', Validators.required],
        parroquia: ['', Validators.required],
        descripcion_exacta: ['', Validators.required],
      }
    )
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close()
  }

  guardarDireccion(){
    const canton =  this.formGroupDireccion.get('canton')?.value.trim()
    const parroquia =  this.formGroupDireccion.get('parroquia')?.value.trim()
    const descripcion =  this.formGroupDireccion.get('descripcion_exacta')?.value.trim()

    this.direccionActual = {
      canton: canton,
      parroquia: parroquia,
      descripcion_exacta: descripcion
    } as DireccionCreateInterface

    this.dialogRef.close({direccion: this.direccionActual})
  }

}
