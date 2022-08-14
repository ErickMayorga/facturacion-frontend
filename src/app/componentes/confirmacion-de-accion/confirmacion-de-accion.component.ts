import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmacion-de-accion',
  templateUrl: './confirmacion-de-accion.component.html',
  styleUrls: ['./confirmacion-de-accion.component.scss']
})
export class ConfirmacionDeAccionComponent implements OnInit {

  icono = ''
  titulo = ''
  mensaje = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ConfirmacionDeAccionComponent>,
              public dialog: MatDialog,) {
    this.icono = this.data.icono
    this.titulo = this.data.titulo
    this.mensaje = this.data.mensaje
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close()
  }

  confirmar(){
    this.dialogRef.close({confirmacion: true})
  }

}
