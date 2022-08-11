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
import {TablaFacturaInterface} from "../../servicios/interfaces/tabla-factura.interface";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {TablaFacturaDetalleInterface} from "../../servicios/interfaces/tabla-factura-detalle.interface";
import {TablaFacturaPagoInterface} from "../../servicios/interfaces/tabla-factura-pago.interface";

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
  facturasBuscadas: TablaFacturaInterface[] = []

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

  //detallesRegistro: FacturaDetalleCreateInterface[] = []
  //detallesSeleccionados: FacturaDetalleInterface[] = []

  //pagosRegistro: FacturaPagoCreateInterface[] = []
  //pagosSeleccionados: FacturaPagoInterface[] = []

  detallesTabla: TablaFacturaDetalleInterface[] = []
  pagosTabla: TablaFacturaPagoInterface[] = []

  nuevaFactura: FacturaCreateInterface = {} as FacturaCreateInterface
  facturaSeleccionada: FacturaInterface = {} as FacturaInterface

  // Tabla
  facturasTabla: TablaFacturaInterface[] = []

  constructor(private readonly facturaService: FacturaService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly  facturaDetalleService: FacturaDetalleService,
              private readonly facturaPagoService: FacturaPagoService,
              private readonly clienteService: ClienteService) {
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
            //this.facturasBuscadas = this.facturasDB
          }
        }
      )
  }

  crearRegistrosTabla(){
    let index = 0
    for(let factura of this.facturasDB){
      this.clienteService.get(factura.id_cliente)
        .subscribe(
          {
            next: (datos) => {
              const cliente = datos as ClienteInterface
              const facturaTabla: TablaFacturaInterface = {
                idFactura: factura.id_factura,
                numero_comprobante: factura.numero_comprobante,
                razon_social_comprador: cliente.nombres_razon_social,
                identificacion_comprador: cliente.numero_identificacion,
                fecha_emision: factura.fecha_emision,
                valor_total: factura.total_con_iva
              }
              this.facturasTabla.push(facturaTabla)
            },
            error: (err) => {
              console.error(err)
            },
            complete: () => {
              index++
              if(index === this.facturasDB.length){
                this.facturasBuscadas = this.facturasTabla
              }
            }
          }
        )
    }
  }

  filtrarFacturas() {
    const facturasFiltradas = []
    for(let factura of this.facturasTabla){
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
      this.deshabilitarFactura(idFactura)
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
          factura: idFactura,
          next: this.facturasDB.length + 1
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const factura = datos['factura']
            const detalles = datos['detalles'] as TablaFacturaDetalleInterface
            const pagos = datos['pagos'] as TablaFacturaPagoInterface
            console.log(factura)
            console.log(detalles)
            console.log(pagos)

            if(operacion === 'crear'){
              this.nuevaFactura = factura as FacturaCreateInterface
              //this.detallesRegistro = detalles as FacturaDetalleCreateInterface[]
              //this.pagosRegistro = pagos as FacturaPagoCreateInterface[]
              //console.log(this.detallesRegistro)
              //this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.facturaSeleccionada = factura as FacturaInterface
              //this.detallesSeleccionados = detalles as FacturaDetalleInterface[]
              //this.pagosSeleccionados = pagos as FacturaPagoInterface[]
              //console.log(this.detallesSeleccionados)
              //this.actualizarInformacion()
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
            this.procesarDetalles()
            this.procesarPagos()
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
            this.procesarDetalles()
            this.procesarPagos()
            this.refresh()
          }
        }
      )
  }

  procesarDetalles(){
    for(let detalle of this.detallesTabla){
      if(detalle.estado === 'c'){

      }else if(detalle.estado === 'u'){

      }else if(detalle.estado === 'd'){

      }

    }
  }

  procesarPagos(){
    for(let pago of this.pagosTabla){
      if(pago.estado === 'c'){

      }else if(pago.estado === 'u'){

      }else if(pago.estado === 'd'){

      }

    }
  }

  crearDetalleFactura(detalleTabla: TablaFacturaDetalleInterface){
    const detalle = {

    } as FacturaDetalleInterface
  }

  crearPagoFactura(pagoTabla: TablaFacturaPagoInterface){
    const pago = {

    } as FacturaPagoInterface
  }

  deshabilitarFactura(idFactura: number){ // TODO
    //Eliminar factura
    /*
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

     */
  }

  refresh() {
    window.location.reload();
  }
}
