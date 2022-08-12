import {Component, Inject, OnInit} from '@angular/core';
import {ProductoInterface} from "../../servicios/http/producto/producto.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ProductoService} from "../../servicios/http/producto/producto.service";
import {ProductoImpuestoService} from "../../servicios/http/producto_impuesto/producto-impuesto.service";
import {ImpuestoService} from "../../servicios/http/impuesto/impuesto.service";
import {ProductoImpuestoInterface} from "../../servicios/http/producto_impuesto/producto-impuesto.interface";
import {ImpuestoInterface} from "../../servicios/http/impuesto/impuesto.interface";
import {TablaFacturaDetalleInterface} from "../../servicios/interfaces/tabla-factura-detalle.interface";
import {MetodoPagoInterface} from "../../servicios/http/metodo-de-pago/metodo-pago.interface";
import {MetodoPagoService} from "../../servicios/http/metodo-de-pago/metodo-pago.service";
import {TablaFacturaPagoInterface} from "../../servicios/interfaces/tabla-factura-pago.interface";
import {metodoPagoForm} from "./metodo-pago-form";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-modal-agregar-pago',
  templateUrl: './modal-agregar-pago.component.html',
  styleUrls: ['./modal-agregar-pago.component.scss']
})
export class ModalAgregarPagoComponent implements OnInit {

  formGroupPago = new FormGroup({});
  fields = metodoPagoForm

  metodosPagoDB: MetodoPagoInterface[] = []

  usuarioActual: number = -1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalAgregarPagoComponent>,
              private readonly metodoPagoService: MetodoPagoService,
              private readonly formBuilder: FormBuilder,
              public dialog: MatDialog,) {
    this.buscarMetodosPago()
    this.usuarioActual = this.data.usuario
    this.formGroupPago =this.formBuilder.group(
      {
        metodo_pago: ['', [Validators.required, Validators.maxLength(45)]],
        valor_pago: ['', Validators.required],
        unidad_tiempo: ['Ninguno', ],
        plazo_tiempo: ['', ],
      }
    )
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close()
  }

  buscarMetodosPago() {
    this.metodoPagoService.getAll({})
      .subscribe(
        {
          next: (datos) => {
            this.metodosPagoDB = datos as MetodoPagoInterface[]
            let optionsMetodoPago:string[] = []
            for(let metodo of this.metodosPagoDB){
              optionsMetodoPago.push(metodo.nombre_metodo_pago)
            }
            this.fields[0].options = optionsMetodoPago
          },
          error: (error) => {
            console.log(error)
          }
        }
      )
  }

  agregarPago() {
    const idMetodoPago =  Number.parseInt(this.formGroupPago.get('metodo_pago')?.value)
    const valor_pago =  Number.parseFloat(this.formGroupPago.get('valor_pago')?.value)
    let unidad_tiempo: string =  this.formGroupPago.get('unidad_tiempo')?.value.trim()
    let plazo_tiempo: number =  Number.parseInt(this.formGroupPago.get('plazo_tiempo')?.value)

    if(isNaN(plazo_tiempo)){
      plazo_tiempo = 0
    }

    this.metodoPagoService.get(idMetodoPago)
      .subscribe(
        {
          next: (datos) => {
            const metodo = datos as MetodoPagoInterface
            const pago: TablaFacturaPagoInterface = {
              id_factura: NaN,
              id_pago: NaN,
              id_metodo_pago: idMetodoPago,
              nombre_metodo: metodo.nombre_metodo_pago,
              valor: valor_pago,
              plazo: plazo_tiempo,
              unidad_tiempo: unidad_tiempo,
              estado: 'c',
            }
            this.dialogRef.close({pago: pago})
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
  }


}
