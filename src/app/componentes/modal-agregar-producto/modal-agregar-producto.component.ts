import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ProductoService} from "../../servicios/http/producto/producto.service";
import {ProductoInterface} from "../../servicios/http/producto/producto.interface";
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {FacturaDetalleInterface} from "../../servicios/http/factura-detalle/factura-detalle.interface";
import {FacturaDetalleCreateInterface} from "../../servicios/http/factura-detalle/factura-detalle-create.interface";
import {TablaFacturaDetalleInterface} from "../../servicios/interfaces/tabla-factura-detalle.interface";
import {ProductoImpuestoService} from "../../servicios/http/producto_impuesto/producto-impuesto.service";
import {ImpuestoService} from "../../servicios/http/impuesto/impuesto.service";
import {ProductoImpuestoInterface} from "../../servicios/http/producto_impuesto/producto-impuesto.interface";
import {ImpuestoInterface} from "../../servicios/http/impuesto/impuesto.interface";

@Component({
  selector: 'app-modal-agregar-producto',
  templateUrl: './modal-agregar-producto.component.html',
  styleUrls: ['./modal-agregar-producto.component.scss']
})
export class ModalAgregarProductoComponent implements OnInit {
  busquedaProducto = '';

  theads = [
    'Código Producto',
    'Código Auxiliar',
    'Descripción',
    'Tipo de producto',
    'Acciones'
  ];

  productosDB: ProductoInterface[] = []
  productosBuscados: ProductoInterface[] = []

  usuarioActual: number = -1;
  facturaActual: number = -1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalAgregarProductoComponent>,
              private readonly productoService: ProductoService,
              private readonly productoImpuestoService: ProductoImpuestoService,
              private readonly impuestoService: ImpuestoService,
              public dialog: MatDialog,) {
    this.usuarioActual = this.data.usuario
    this.facturaActual = this.data.factura
    this.buscarProductos()
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close()
  }

  buscarProductos() {
    this.productoService.getProductos(this.usuarioActual)
      .subscribe(
        {
          next: (datos) => {
            this.productosDB = datos as ProductoInterface[]
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.productosBuscados = this.productosDB
          }
        }
      )
  }

  filtrarProductos() {
    const productosFiltrados = []
    for(let producto of this.productosDB){
      if(producto.codigo_principal.includes(this.busquedaProducto) || producto.nombre.includes(this.busquedaProducto)){
        productosFiltrados.push(producto)
      }
    }
    this.productosBuscados = productosFiltrados
  }

  agregarProducto(producto: ProductoInterface) {
    let valor_iva: number = 0
    let valor_ice: number = 0
    let valor_irbpnr: number = 0
    let index = 0
    let productoImpuestos: ProductoImpuestoInterface[] = []
    this.productoImpuestoService.getImpuestosPorProducto(producto.id_producto)
      .subscribe(
        {
          next: (datos) => {
            productoImpuestos = datos as ProductoImpuestoInterface[]
            for(let productoImpuesto of productoImpuestos){
              // Consultar impuestos
              this.impuestoService.get(productoImpuesto.id_impuesto)
                .subscribe(
                  {
                    next: (datos) => {
                      const impuesto = datos as ImpuestoInterface
                      if(impuesto.categoria === 'iva'){
                        valor_iva = impuesto.valor_impuesto
                      }
                      if(impuesto.categoria === 'ice'){
                        valor_ice = impuesto.valor_impuesto
                      }
                      if(impuesto.categoria === 'irbpnr'){
                        valor_irbpnr = impuesto.valor_impuesto
                      }
                    },
                    error: (err) => {
                      console.error(err)
                    },
                    complete: () => {
                      index++
                      if(index === productoImpuestos.length){
                        this.crearRegistroProducto(producto, valor_iva, valor_ice, valor_irbpnr)
                      }
                    }
                  }
                )
            }
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
  }

  crearRegistroProducto(producto: ProductoInterface, iva: number, ice: number, irbpnr: number){
    const detalle: TablaFacturaDetalleInterface = {
      id_detalle: NaN,
      id_producto: producto.id_producto,
      codigo_principal: producto.codigo_principal,
      codigo_auxiliar: producto.codigo_auxiliar,
      nombre_producto: producto.nombre,
      precio_unitario: producto.valor_unitario,
      cantidad: 1,
      descuento: 0,
      valor_ice: ice,
      valor_irbpnr: irbpnr,
      valor_total: producto.valor_unitario,
      estado: 'c'
    }
    this.dialogRef.close({detalle: detalle})
  }
}
