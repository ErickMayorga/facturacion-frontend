import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ProductoService} from "../../servicios/http/producto/producto.service";
import {ProductoInterface} from "../../servicios/http/producto/producto.interface";
import {productoForm} from "./producto-form";
import {ProductoImpuestoService} from "../../servicios/http/producto_impuesto/producto-impuesto.service";
import {ImpuestoService} from "../../servicios/http/impuesto/impuesto.service";
import {ProductoImpuestoInterface} from "../../servicios/http/producto_impuesto/producto-impuesto.interface";
import {ProductoCreateInterface} from "../../servicios/http/producto/producto-create.interface";
import {ImpuestoInterface} from "../../servicios/http/impuesto/impuesto.interface";
import {ProductoImpuestoCreateInterface} from "../../servicios/http/producto_impuesto/producto-impuesto-create.interface";

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss']
})
export class ModalProductoComponent implements OnInit {
  formGroupProducto = new FormGroup({});
  fields = productoForm

  usuarioActual: number = -1;
  operacion = ''
  productoActual: number = -1
  productoDB: ProductoInterface = {} as ProductoInterface
  impuestosDB: ProductoImpuestoInterface[] = []

  ivaImpuestos: ImpuestoInterface[] = []
  iceImpuestos: ImpuestoInterface[] = []
  irbpnrImpuestos: ImpuestoInterface[] = []

  ivaSeleccionado: ImpuestoInterface = {} as ImpuestoInterface
  iceSeleccionado: ImpuestoInterface = {} as ImpuestoInterface
  irbpnrSeleccionado: ImpuestoInterface = {} as ImpuestoInterface

  ivaProductoImpuesto: ProductoImpuestoInterface = {} as ProductoImpuestoInterface
  iceProductoImpuesto: ProductoImpuestoInterface = {} as ProductoImpuestoInterface
  irbpnrProductoImpuesto: ProductoImpuestoInterface = {} as ProductoImpuestoInterface

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalProductoComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly productoService: ProductoService,
               private readonly productoImpuestoService: ProductoImpuestoService,
               private readonly impuestoService: ImpuestoService,
               public dialog: MatDialog,) {
    this.buscarImpuestos()
    this.usuarioActual = this.data.usuario
    this.operacion = this.data.operacion
    this.productoActual = this.data.producto
    this.formGroupProducto =this.formBuilder.group(
      {
        codigo_principal: ['', [Validators.required, Validators.maxLength(10)]],
        codigo_auxiliar: ['', [Validators.maxLength(10)]],
        tipo_producto: ['', [Validators.required, Validators.maxLength(45)]],
        nombre: ['', [Validators.required, Validators.maxLength(45)]],
        valor_unitario: ['', [Validators.required]],
        iva: ['', [Validators.maxLength(45)]],
        ice: ['', [Validators.maxLength(45)]],
        irbpnr: ['', [Validators.maxLength(45)]],
      }
    )
  }

  ngOnInit(): void {
    if(this.operacion === 'editar'){
      this.buscarProducto()
    }
  }

  cancelar() {
    this.dialogRef.close()
  }

  buscarImpuestos() {
    this.impuestoService.getImpuestosPorCategoria('iva')
      .subscribe(
        {
          next: (datos) => {
            this.ivaImpuestos = datos as ImpuestoInterface[]
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
    this.impuestoService.getImpuestosPorCategoria('ice')
      .subscribe(
        {
          next: (datos) => {
            this.iceImpuestos = datos as ImpuestoInterface[]
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
    this.impuestoService.getImpuestosPorCategoria('irbpnr')
      .subscribe(
        {
          next: (datos) => {
            this.irbpnrImpuestos = datos as ImpuestoInterface[]
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
  }

  // Carga inicial de información del producto

  buscarProducto() {
    this.productoService.get(this.productoActual)
      .subscribe(
        {
          next: (datos) => {
            this.productoDB = datos as ProductoInterface
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.productoImpuestoService.getImpuestosPorProducto(this.productoActual)
              .subscribe(
                {
                  next: (datos) => {
                    this.impuestosDB = datos as ProductoImpuestoInterface[]
                    //console.log(this.impuestosDB)
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
    let index = 0
    for(let productoImpuesto of this.impuestosDB){
      this.impuestoService.get(productoImpuesto.id_impuesto)
        .subscribe(
          {
            next: (datos)=> {
              const impuesto = datos as ImpuestoInterface
              if(impuesto.categoria === 'iva'){
                this.ivaSeleccionado = impuesto
                this.ivaProductoImpuesto = productoImpuesto
              }else if(impuesto.categoria === 'ice'){
                this.iceSeleccionado =  impuesto
                this.iceProductoImpuesto = productoImpuesto
              }else if(impuesto.categoria === 'irbpnr'){
                this.irbpnrSeleccionado = impuesto
                this.irbpnrProductoImpuesto = productoImpuesto
              }
            },
            error: (err) => {
              console.error(err)
            },
            complete: () => {
              index++
              if(index === this.impuestosDB.length){
                this.formGroupProducto.patchValue({
                  codigo_principal: this.productoDB.codigo_principal,
                  codigo_auxiliar: this.productoDB.codigo_auxiliar,
                  tipo_producto: this.productoDB.tipo_producto,
                  nombre: this.productoDB.nombre,
                  valor_unitario: this.productoDB.valor_unitario,
                  iva: this.ivaSeleccionado.id_impuesto,
                  ice: this.iceSeleccionado.id_impuesto,
                  irbpnr: this.irbpnrSeleccionado.id_impuesto,
                });
              }
            }
          }
        )
    }
  }

  guardarProducto(){
    const codigo_principal =  this.formGroupProducto.get('codigo_principal')?.value.trim()
    const codigo_auxiliar =  this.formGroupProducto.get('codigo_auxiliar')?.value.trim()
    const tipo_producto =  this.formGroupProducto.get('tipo_producto')?.value.trim()
    const nombre =  this.formGroupProducto.get('nombre')?.value.trim()
    const valor_unitario = Number.parseFloat(this.formGroupProducto.get('valor_unitario')?.value)
    const idIVA =  Number.parseInt(this.formGroupProducto.get('iva')?.value)
    const idICE =  Number.parseInt(this.formGroupProducto.get('ice')?.value)
    const idIRBPNR =  Number.parseInt(this.formGroupProducto.get('irbpnr')?.value)


    let productoObject: ProductoInterface | ProductoCreateInterface = {} as ProductoCreateInterface

    let impuestos: ProductoImpuestoInterface[] | ProductoImpuestoCreateInterface[] = []
    let ivaImpuestoObject: ProductoImpuestoInterface | ProductoImpuestoCreateInterface = {} as ProductoImpuestoCreateInterface
    let iceImpuestoObject: ProductoImpuestoInterface | ProductoImpuestoCreateInterface = {} as ProductoImpuestoCreateInterface
    let irbpnrImpuestoObject: ProductoImpuestoInterface | ProductoImpuestoCreateInterface = {} as ProductoImpuestoCreateInterface

    if(this.operacion === 'crear'){
      productoObject = {
        id_usuario: this.usuarioActual,
        codigo_principal: codigo_principal,
        codigo_auxiliar: codigo_auxiliar,
        tipo_producto: tipo_producto,
        nombre: nombre,
        valor_unitario: valor_unitario
      } as ProductoCreateInterface

      ivaImpuestoObject = {
        id_producto: -1,
        id_impuesto: idIVA
      } as ProductoImpuestoCreateInterface
      iceImpuestoObject = {
        id_producto: -1,
        id_impuesto: idICE
      } as ProductoImpuestoCreateInterface
      irbpnrImpuestoObject = {
        id_producto: -1,
        id_impuesto: idIRBPNR
      } as ProductoImpuestoCreateInterface
    }

    if(this.operacion === 'editar'){
      productoObject = {
        id_producto: this.productoDB.id_producto,
        id_usuario: this.usuarioActual,
        codigo_principal: codigo_principal,
        codigo_auxiliar: codigo_auxiliar,
        tipo_producto: tipo_producto,
        nombre: nombre,
        valor_unitario: valor_unitario
      } as ProductoInterface

      ivaImpuestoObject = {
        id_producto_impuesto: this.ivaProductoImpuesto.id_producto_impuesto,
        id_producto: this.productoDB.id_producto,
        id_impuesto: idIVA
      } as ProductoImpuestoInterface
      iceImpuestoObject = {
        id_producto_impuesto: this.iceProductoImpuesto.id_producto_impuesto,
        id_producto: this.productoDB.id_producto,
        id_impuesto: idICE
      } as ProductoImpuestoInterface
      irbpnrImpuestoObject = {
        id_producto_impuesto: this.irbpnrProductoImpuesto.id_producto_impuesto,
        id_producto: this.productoDB.id_producto,
        id_impuesto: idIRBPNR
      } as ProductoImpuestoInterface
    }

    impuestos = [ivaImpuestoObject, iceImpuestoObject, irbpnrImpuestoObject]
    this.dialogRef.close({producto: productoObject, impuestos: impuestos})
  }
}

