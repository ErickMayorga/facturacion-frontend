import { Component, OnInit } from '@angular/core';
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {FacturaDetalleCreateInterface} from "../../servicios/http/factura-detalle/factura-detalle-create.interface";
import {FacturaDetalleInterface} from "../../servicios/http/factura-detalle/factura-detalle.interface";
import {FacturaCreateInterface} from "../../servicios/http/factura/factura-create.interface";
import {FacturaPagoCreateInterface} from "../../servicios/http/factura-pago/factura-pago-create.interface";
import {FacturaPagoInterface} from "../../servicios/http/factura-pago/factura-pago.interface";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {FacturaDetalleService} from "../../servicios/http/factura-detalle/factura-detalle.service";
import {FacturaPagoService} from "../../servicios/http/factura-pago/factura-pago.service";
import {ModalFacturaComponent} from "../../componentes/modal-factura/modal-factura.component";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";

@Component({
  selector: 'app-ruta-facturas',
  templateUrl: './ruta-facturas.component.html',
  styleUrls: ['./ruta-facturas.component.scss']
})
export class RutaFacturasComponent implements OnInit {

  theads = [
    'Número de comprobante',
    'Razón Social del comprador',
    'ID del comprador',
    'Fecha de emisión',
    'Valor total',
    'Acciones'
  ];

  facturasDB: FacturaInterface[] = []
  facturasBuscadas: FacturaInterface[] = []

  actions: ActionButtonInterface[] = [
    {
      name: 'ver',
      icon: 'visibility'
    },
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
  idUsuario: number = -1;

  detallesRegistro: FacturaDetalleCreateInterface[] = []
  detallesSeleccionados: FacturaDetalleInterface[] = []

  pagosRegistro: FacturaPagoCreateInterface[] = []
  pagosSeleccionados: FacturaPagoInterface[] = []

  nuevaFactura: FacturaCreateInterface = {} as FacturaCreateInterface
  facturaSeleccionada: FacturaInterface = {} as FacturaInterface

  constructor(private readonly facturaService: FacturaService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly  facturaDetalleService: FacturaDetalleService,
              private readonly facturaPagoService: FacturaPagoService,) {
    this.buscarFacturas()
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

  // Búsqueda y filtro de facturas

  buscarFacturas() {
    this.facturaService.getAll({})
      .subscribe(
        {
          next: (datos) => {
            this.facturasDB = datos as FacturaInterface[]
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.crearRegistrosTabla()
            this.facturasBuscadas = this.facturasDB
          }
        }
      )
  }

  crearRegistrosTabla(){

  }

  filtrarFacturas() {
    const facturasFiltradas = []
    for(let factura of this.facturasDB){
      if(factura.numero_comprobante.includes(this.busqueda)){
        facturasFiltradas.push(factura)
      }
    }
    this.facturasBuscadas = facturasFiltradas
  }

  // CRUD Facturas

  realizarAccion(action: string, idFactura: number){
    if(action === 'ver'){
      this.mostrarFormatoFactura(idFactura)
    }
    if(action === 'editar'){
      this.abrirModalFactura('editar', idFactura)
    }
    if(action === 'eliminar'){
      this.eliminarFactura(idFactura)
    }
  }

  // VISUALIZACIÓN
  mostrarFormatoFactura(idFactura: number) {

  }

  abrirModalFactura(operacion: 'crear'|'editar', idFactura: number = -1){
    const referenciaDialogo = this.dialog.open(
      ModalFacturaComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          operacion: operacion,
          factura: idFactura
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const factura = datos['factura']
            const detalles = datos['detalles']
            const pagos = datos['pagos']

            if(operacion === 'crear'){
              this.nuevaFactura = factura as FacturaCreateInterface
              this.detallesRegistro = detalles as FacturaDetalleCreateInterface[]
              this.pagosRegistro = pagos as FacturaPagoCreateInterface[]
              //console.log(this.detallesRegistro)
              this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.facturaSeleccionada = factura as FacturaInterface
              this.detallesSeleccionados = detalles as FacturaDetalleInterface[]
              this.pagosSeleccionados = pagos as FacturaPagoInterface[]
              //console.log(this.detallesSeleccionados)
              this.actualizarInformacion()
            }
          }
        }
      )
  }

  registrarInformacion() {
    let idFacturaCreada = -1
    // Crear Factura
    this.facturaService.create(this.nuevaFactura)
      .subscribe(
        {
          next: (data) => {
            this.snackBar.open('Se ha ingresado con éxito la nueva factura!')
            const facturaCreada = data as FacturaInterface
            idFacturaCreada = facturaCreada.id_factura
            //console.log(facturaCreada)
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            // Crear Factura Detalles
            for (let detalle of this.detallesRegistro) {
              if (detalle.id_producto > 0) { // TODO: Revisar consistencia
                detalle.id_factura = idFacturaCreada
                this.facturaDetalleService.create(detalle)
                  .subscribe(
                    {
                      next: (data) => {
                        const facturaDetalleCreado = data as FacturaDetalleInterface
                        //console.log(productoImpuestoCreado)
                      },
                      error: (error) => {
                        console.log(error)
                      }
                    }
                  )
              }
            }

            // Crear Factura Pagos
            for (let pago of this.pagosRegistro) {
              if (pago.id_metodo_de_pago > 0) { // TODO: Revisar consistencia
                pago.id_factura = idFacturaCreada
                this.facturaPagoService.create(pago)
                  .subscribe(
                    {
                      next: (data) => {
                        const facturaPagoCreado = data as FacturaPagoInterface
                        //console.log(productoImpuestoCreado)
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
    const actualizarFactura$ = this.facturaService.update(this.facturaSeleccionada.id_factura, this.facturaSeleccionada)
    actualizarFactura$
      .subscribe(
        {
          next: (datos) => {
            this.snackBar.open('Se ha actualizado la factura con éxito!')
            //console.log(datos)
          },
          error: (error) => {
            console.error({error})
          },
          complete: () => {
            this.refresh()
          }
        }
      )

    // Actualizar detalles
    for(let detalle of this.detallesSeleccionados){
      if(detalle.id_factura_detalle != undefined){ // TODO: Revisar consistencia
        const actualizarFacturaDetalle$ = this.facturaDetalleService.update(detalle.id_factura_detalle, detalle)
        actualizarFacturaDetalle$
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

    // Actualizar pagos
    for(let pago of this.pagosSeleccionados){
      if(pago.id_factura_pago != undefined){ // TODO: Revisar consistencia
        const actualizarFacturaPago$ = this.facturaPagoService.update(pago.id_factura_pago, pago)
        actualizarFacturaPago$
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

  eliminarFactura(idFactura: number){
    //Eliminar factura
    const eliminarProducto$ = this.facturaService.delete(idFactura);
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

    //Eliminar detalle de factura
    const eliminarDetalleFactura$ = this.facturaDetalleService.deleteDetalle(idFactura);
    eliminarDetalleFactura$.subscribe(
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

    //Eliminar detalle de factura
    const eliminarPagosFactura$ = this.facturaPagoService.deletePagos(idFactura);
    eliminarPagosFactura$.subscribe(
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
