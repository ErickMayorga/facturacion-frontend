import { Component, OnInit } from '@angular/core';
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {ProductoInterface} from "../../servicios/http/producto/producto.interface";
import {ProductoCreateInterface} from "../../servicios/http/producto/producto-create.interface";
import {ProductoService} from "../../servicios/http/producto/producto.service";
import {ModalProductoComponent} from "../../componentes/modal-producto/modal-producto.component";
import {ProductoImpuestoCreateInterface} from "../../servicios/http/producto_impuesto/producto-impuesto-create.interface";
import {ProductoImpuestoInterface} from "../../servicios/http/producto_impuesto/producto-impuesto.interface";
import {ProductoImpuestoService} from "../../servicios/http/producto_impuesto/producto-impuesto.service";

@Component({
  selector: 'app-ruta-productos',
  templateUrl: './ruta-productos.component.html',
  styleUrls: ['./ruta-productos.component.scss']
})
export class RutaProductosComponent implements OnInit {

  theads = [
    'Código Producto',
    'Código Auxiliar',
    'Descripción',
    'Tipo de producto',
    'Acciones'
  ];

  productosDB: ProductoInterface[] = []
  productosBuscados: ProductoInterface[] = []

  actions: ActionButtonInterface[] = [
    {
      name: 'editar',
      icon: 'edit'
    },
    {
      name: 'eliminar',
      icon: 'delete'
    },
  ]
  busqueda = '';
  private idUsuario: number = -1;
  impuestosRegistro: ProductoImpuestoCreateInterface[] = []
  impuestosSeleccionados: ProductoImpuestoInterface[] = []
  private nuevoProducto: ProductoCreateInterface = {} as ProductoCreateInterface;
  private productoSeleccionado: ProductoInterface = {} as ProductoInterface;

  constructor(private readonly productoService: ProductoService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly  productoImpuestoService: ProductoImpuestoService) {
    this.buscarProductos()
  }

  ngOnInit(): void {
    // @ts-ignore
    const parametroRuta$ = this.activatedRoute.parent.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          //console.log(parametrosRuta)
          this.idUsuario = Number.parseInt(parametrosRuta['idUsuario']);
        }
      })
  }

  // Búsqueda y filtro de productos

  buscarProductos() {
    this.productoService.getAll({})
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
      if(producto.codigo_principal.includes(this.busqueda) || producto.nombre.includes(this.busqueda)){
        productosFiltrados.push(producto)
      }
    }
    this.productosBuscados = productosFiltrados
  }

  // CRUD Productos

  realizarAccion(action: string, idProducto: number){
    if(action === 'eliminar'){
      this.eliminarProducto(idProducto)
    }
    if(action === 'editar'){
      this.abrirModalProducto('editar', idProducto)
    }
  }

  abrirModalProducto(operacion: 'crear'|'editar', idProducto: number = -1){
    const referenciaDialogo = this.dialog.open(
      ModalProductoComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          operacion: operacion,
          producto: idProducto
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const impuestos = datos['impuestos']
            const producto = datos['producto']

            if(operacion === 'crear'){
              this.impuestosRegistro = impuestos as ProductoImpuestoCreateInterface[]
              this.nuevoProducto = producto as ProductoCreateInterface
              console.log(this.impuestosRegistro)
              this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.impuestosSeleccionados = impuestos as ProductoImpuestoInterface[]
              this.productoSeleccionado = producto as ProductoInterface
              console.log(this.impuestosSeleccionados)
              this.actualizarInformacion()
            }
          }
        }
      )
  }

  registrarInformacion() {
    let idProductoCreado = -1
    // Crear Producto
    this.productoService.create(this.nuevoProducto)
      .subscribe(
        {
          next: (data) => {
            this.snackBar.open('Se ha ingresado con éxito el nuevo producto!')
            const productoCreado = data as ProductoInterface
            idProductoCreado = productoCreado.id_producto
            console.log(productoCreado)
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            // Crear Producto impuesto
            for(let impuesto of this.impuestosRegistro){
              if(impuesto.id_impuesto > 0){
                impuesto.id_producto = idProductoCreado
                this.productoImpuestoService.create(impuesto)
                  .subscribe(
                    {
                      next: (data) => {
                        const productoImpuestoCreado = data as ProductoImpuestoInterface
                        console.log(productoImpuestoCreado)
                      },
                      error: (error) => {
                        console.log(error)
                      }
                    }
                  )
              }
            }
            this.refresh()
            //this.snackBar.open('Se ha ingresado con éxito el nuevo producto!')
          }
        }
      )
  }

  actualizarInformacion(){
    const actualizarProducto$ = this.productoService.update(this.productoSeleccionado.id_producto, this.productoSeleccionado)
    actualizarProducto$
      .subscribe(
        {
          next: (datos) => {
            this.snackBar.open('Se ha actualizado el producto con éxito')
            console.log(datos)
          },
          error: (error) => {
            console.error({error})
          },
          complete: () => {
            this.refresh()
          }
        }
      )
    for(let impuesto of this.impuestosSeleccionados){
      if(impuesto.id_producto_impuesto != undefined){
        const actualizarImpuesto$ = this.productoImpuestoService.update(impuesto.id_producto_impuesto, impuesto)
        actualizarImpuesto$
          .subscribe(
            {
              next: (datos) => {
                console.log(datos)
                //this._snackBar.open('Se ha actualizado su información con éxito')
              },
              error: (error) => {
                console.error({error})
              }
            }
          )
      }
    }
  }

  eliminarProducto(idProducto: number){
    //Eliminar producto
    const eliminarProducto$ = this.productoService.delete(idProducto);
    eliminarProducto$.subscribe(
      {
        next: (datos) => {
          //console.log({datos})
          this.refresh()
        },
        error: (error) => {
          console.error({error})
        }
      }
    )
    //Eliminar producto-impuestos
    const eliminarProductoImpuestos$ = this.productoImpuestoService.deleteImpuestos(idProducto);
    eliminarProductoImpuestos$.subscribe(
      {
        next: (datos) => {
          //console.log({datos})
          //this.refresh()
        },
        error: (error) => {
          console.error({error})
        }
      }
    )

  }



  refresh() {
    window.location.reload();
  }

}
