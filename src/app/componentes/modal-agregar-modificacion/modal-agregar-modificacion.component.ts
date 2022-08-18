import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {modificacionForm} from "./modificacion-form";
import {TablaNotaDebitoDetalleInterface} from "../../servicios/interfaces/tabla-nota-debito-detalle.interface";

@Component({
  selector: 'app-modal-agregar-modificacion',
  templateUrl: './modal-agregar-modificacion.component.html',
  styleUrls: ['./modal-agregar-modificacion.component.scss']
})
export class ModalAgregarModificacionComponent implements OnInit {

  formGroupModificacion = new FormGroup({});
  fields = modificacionForm

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalAgregarModificacionComponent>,
              private readonly formBuilder: FormBuilder,
              public dialog: MatDialog,) {
    this.formGroupModificacion =this.formBuilder.group(
      {
        razon_modificacion: ['', [Validators.required, Validators.maxLength(45)]],
        valor_modificacion: ['', Validators.required],
      }
    )
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close()
  }

  agregarModificacion() {
    const razon =  this.formGroupModificacion.get('razon_modificacion')?.value.trim()
    const valor =  Number.parseFloat(this.formGroupModificacion.get('valor_modificacion')?.value)

    const detalle: TablaNotaDebitoDetalleInterface = {
      id_nota_debito: NaN,
      id_detalle: NaN,
      razon_modificacion: razon,
      valor_modificacion: valor,
      estado: 'c',
    }
    this.dialogRef.close({detalle: detalle})

  }

}
