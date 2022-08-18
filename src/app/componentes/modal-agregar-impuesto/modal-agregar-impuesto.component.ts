import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {impuestoRetencionForm} from "./impuesto-retencion-form";
import {ImpuestoService} from "../../servicios/http/impuesto/impuesto.service";
import {ImpuestoInterface} from "../../servicios/http/impuesto/impuesto.interface";
import {TablaRetencionDetalleInterface} from "../../servicios/interfaces/tabla-retencion-detalle.interface";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";

@Component({
  selector: 'app-modal-agregar-impuesto',
  templateUrl: './modal-agregar-impuesto.component.html',
  styleUrls: ['./modal-agregar-impuesto.component.scss']
})
export class ModalAgregarImpuestoComponent implements OnInit {

  formGroupImpuesto = new FormGroup({});
  fields = impuestoRetencionForm

  impuestosRetencionDB: ImpuestoInterface[] = []

  usuarioActual: number = -1;
  factura: FacturaInterface = {} as FacturaInterface
  impuestoSeleccionado: ImpuestoInterface = {} as ImpuestoInterface
  baseImponible: number = 0;
  tarifa: number = 0

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalAgregarImpuestoComponent>,
              private readonly impuestoService: ImpuestoService,
              private readonly formBuilder: FormBuilder,
              public dialog: MatDialog,) {
    this.usuarioActual = this.data.usuario
    this.factura = this.data.factura
    this.formGroupImpuesto =this.formBuilder.group(
      {
        impuesto: ['', [Validators.required]],
        base_imponible: ['', Validators.required],
        impuesto_retencion: ['', Validators.required]
      }
    )
    this.formGroupImpuesto.get('base_imponible')?.disable()
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close()
  }

  buscarImpuestos() {
    const categoria = this.formGroupImpuesto.get('impuesto')?.value.trim()
    this.tarifa = 0
    this.impuestoService.getImpuestosPorCategoria(categoria)
      .subscribe(
        {
          next: (datos) => {
            this.impuestosRetencionDB = datos as ImpuestoInterface[]
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.verificarTipoImpuesto()
          }
        }
      )
  }

  agregarImpuesto() {
    const idImpuesto =  Number.parseInt(this.formGroupImpuesto.get('impuesto_retencion')?.value)
    const baseImponible =  Number.parseFloat(this.formGroupImpuesto.get('base_imponible')?.value)

    this.impuestoService.get(idImpuesto)
      .subscribe(
        {
          next: (datos) => {
            const impuesto = datos as ImpuestoInterface
            const detalleTabla: TablaRetencionDetalleInterface = {
              id_retencion: NaN,
              id_detalle: NaN,
              id_impuesto: idImpuesto,
              codigo_impuesto: '0' + impuesto.id_impuesto,
              nombre_impuesto: impuesto.nombre_impuesto,
              base_imponible: baseImponible,
              tarifa: impuesto.valor_impuesto,
              valor_total: baseImponible * impuesto.valor_impuesto,
              estado: 'c',
            }

            if(impuesto.categoria === 'iva_retencion'){
              detalleTabla.base_imponible = this.factura.total_iva
              detalleTabla.valor_total = this.factura.total_iva * detalleTabla.tarifa
            }

            this.dialogRef.close({detalle: detalleTabla})
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
  }

  verificarTipoImpuesto(){
    const categoria = this.formGroupImpuesto.get('impuesto')?.value.trim()
    if(categoria === 'iva_retencion'){
      this.formGroupImpuesto.get('base_imponible')?.disable()
      this.formGroupImpuesto.patchValue({
        base_imponible: this.factura.total_iva
      })
      this.baseImponible = this.factura.total_iva
    }else{
      this.formGroupImpuesto.get('base_imponible')?.enable()
      this.formGroupImpuesto.patchValue({
        base_imponible: ''
      })
    }
  }

  calcularTotal() {
    const idImpuesto = Number.parseInt(this.formGroupImpuesto.get('impuesto_retencion')?.value)
    this.baseImponible = Number.parseFloat(this.formGroupImpuesto.get('base_imponible')?.value)

    console.log(this.baseImponible)

    this.impuestoService.get(idImpuesto)
      .subscribe(
        {
          next: datos => {
            this.impuestoSeleccionado = datos as ImpuestoInterface
            this.tarifa = this.impuestoSeleccionado.valor_impuesto
          },
          error: err => {
            console.error(err)
          }
        }
      )
  }
}
