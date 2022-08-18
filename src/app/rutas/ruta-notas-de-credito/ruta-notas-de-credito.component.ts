import { Component, OnInit } from '@angular/core';
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {ConfirmacionDeAccionComponent} from "../../componentes/confirmacion-de-accion/confirmacion-de-accion.component";
import {NotaCreditoInterface} from "../../servicios/http/nota-de-credito/nota-credito.interface";
import {TablaNotaCreditoInterface} from "../../servicios/interfaces/tabla-nota-credito.interface";
import {TablaNotaCreditoDetalleInterface} from "../../servicios/interfaces/tabla-nota-credito-detalle.interface";
import {NotaCreditoCreateInterface} from "../../servicios/http/nota-de-credito/nota-credito-create.interface";
import {NotaCreditoService} from "../../servicios/http/nota-de-credito/nota-credito.service";
import {NotaCreditoDetalleService} from "../../servicios/http/nota-de-credito-detalle/nota-credito-detalle.service";
import {ModalFormatoNotaCreditoComponent} from "../../componentes/modal-formato-nota-credito/modal-formato-nota-credito.component";
import {ModalNotaCreditoComponent} from "../../componentes/modal-nota-credito/modal-nota-credito.component";
import {NotaCreditoDetalleCreateInterface} from "../../servicios/http/nota-de-credito-detalle/nota-credito-detalle-create.interface";
import {NotaCreditoDetalleInterface} from "../../servicios/http/nota-de-credito-detalle/nota-credito-detalle.interface";
import {TablaFacturaDetalleInterface} from "../../servicios/interfaces/tabla-factura-detalle.interface";

@Component({
  selector: 'app-ruta-notas-de-credito',
  templateUrl: './ruta-notas-de-credito.component.html',
  styleUrls: ['./ruta-notas-de-credito.component.scss']
})
export class RutaNotasDeCreditoComponent implements OnInit {

  theads = [
    'Número de comprobante',
    'Razón Social del cliente',
    'ID del cliente',
    'Factura',
    'Motivo',
    'Fecha de emisión',
    'Total',
    'Acciones'
  ];

  notasCreditoDB: NotaCreditoInterface[] = []
  notasCreditoBuscadas: TablaNotaCreditoInterface[] = []

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
      icon: 'block'
    },
  ]
  busqueda = '';
  idUsuario: number = -1;
  empresaActual: EmpresaInterface = {} as EmpresaInterface

  detallesTabla: TablaFacturaDetalleInterface[] = []

  nuevaNotaCredito: NotaCreditoCreateInterface = {} as NotaCreditoCreateInterface
  notaCreditoSeleccionada: NotaCreditoInterface = {} as NotaCreditoInterface

  // Tabla
  notaCreditoTabla: TablaNotaCreditoInterface[] = []

  idNotaCreditoCreada: number = -1;

  constructor(private readonly notaCreditoService: NotaCreditoService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly  notaCreditoDetalleService: NotaCreditoDetalleService,
              private readonly clienteService: ClienteService,
              private readonly facturaService: FacturaService,
              private readonly empresaService: EmpresaService) {

  }

  ngOnInit(): void {
    // @ts-ignore
    const parametroRuta$ = this.activatedRoute.parent.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          //console.log(parametrosRuta)
          this.idUsuario = Number.parseInt(parametrosRuta['idUsuario']);
          this.buscarNotasCredito()
        }
      })
  }

  // Búsqueda y filtro de notas de crédito en tabla
  buscarNotasCredito() {
    this.empresaService.getEmpresa(this.idUsuario)
      .subscribe(
        {
          next: (datos) => {
            this.empresaActual = datos as EmpresaInterface
            //console.log(this.empresaActual)
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            if(this.empresaActual != null){
              // Buscar retenciones por empresa
              this.notaCreditoService.getComprobantes(this.empresaActual.id_empresa)
                .subscribe(
                  {
                    next: (datos) => {
                      this.notasCreditoDB = datos as NotaCreditoInterface[]
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
          }
        }
      )
  }

  crearRegistrosTabla(){
    let index = 0
    for(let notaCredito of this.notasCreditoDB){
      // Buscar factura
      let idCliente = -1
      let facturaActual: FacturaInterface = {} as FacturaInterface
      this.facturaService.get(notaCredito.id_factura)
        .subscribe(
          {
            next: (datos) => {
              facturaActual = datos as FacturaInterface
              idCliente = facturaActual.id_cliente
            },
            error: (err) => {
              console.error(err)
            },
            complete: () => {
              if(facturaActual != null){
                // Buscar cliente
                this.clienteService.get(idCliente) // TODO: Verificar cliente de la factura
                  .subscribe(
                    {
                      next: (datos) => {
                        const cliente = datos as ClienteInterface
                        const notaCreditoTabla: TablaNotaCreditoInterface = {
                          id_nota_credito: notaCredito.id_nota_de_credito,
                          id_factura: notaCredito.id_factura,
                          numero_comprobante: notaCredito.numero_comprobante,
                          razon_social_comprador: cliente.nombres_razon_social,
                          identificacion_comprador: cliente.numero_identificacion,
                          numero_factura: facturaActual.numero_comprobante,
                          motivo: notaCredito.motivo,
                          fecha_emision: notaCredito.fecha_emision,
                          valor_total: notaCredito.importe_total,
                          habilitado: notaCredito.habilitado,
                        }
                        this.notaCreditoTabla.push(notaCreditoTabla)
                      },
                      error: (err) => {
                        console.error(err)
                      },
                      complete: () => {
                        index++
                        if(index === this.notasCreditoDB.length){
                          this.notasCreditoBuscadas = this.notaCreditoTabla
                        }
                      }
                    }
                  )
              }
            }
          }
        )
    }
  }

  filtrarNotasCredito() {
    const notasCreditoFiltradas = []
    for(let notaCredito of this.notaCreditoTabla){
      if(notaCredito.numero_comprobante.includes(this.busqueda)){
        notasCreditoFiltradas.push(notaCredito)
      }
    }
    this.notasCreditoBuscadas = notasCreditoFiltradas
  }

  // CRUD Notas de credito
  realizarAccion(action: string, idNotaCredito: number){
    if(action === 'ver'){
      this.mostrarFormatoNotaCredito(idNotaCredito)
    }
    if(action === 'editar'){
      this.abrirModalNotaCredito('editar', idNotaCredito)
    }
    if(action === 'eliminar'){
      this.deshabilitarNotaCredito(idNotaCredito)
    }
  }

  // VISUALIZACIÓN
  mostrarFormatoNotaCredito(idNotaCredito: number) {
    this.dialog.open(
      ModalFormatoNotaCreditoComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          empresa: this.empresaActual,
          nota_credito: idNotaCredito,
        }
      }
    )
  }

  abrirModalNotaCredito(operacion: 'crear'|'editar', idNotaCredito: number = -1){
    const referenciaDialogo = this.dialog.open(
      ModalNotaCreditoComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          operacion: operacion,
          nota_credito: idNotaCredito,
          next: this.notasCreditoDB.length + 1
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const notaCredito = datos['nota_credito']
            const detalles = datos['detalles'] as TablaFacturaDetalleInterface[]

            if(operacion === 'crear'){
              this.nuevaNotaCredito = notaCredito as NotaCreditoCreateInterface
              //console.log(this.nuevaNotaCredito)
              this.detallesTabla = detalles as TablaFacturaDetalleInterface[]
              this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.notaCreditoSeleccionada = notaCredito as NotaCreditoInterface
              this.detallesTabla = detalles as TablaFacturaDetalleInterface[]
              this.actualizarInformacion()
            }
          }
        }
      )
  }

  // Crear Nota de credito
  registrarInformacion() {
    this.notaCreditoService.create(this.nuevaNotaCredito)
      .subscribe(
        {
          next: (data) => {
            this.snackBar.open('La nota de crédito ha sido registrada con éxito!', 'OK', {
              duration: 3000
            });
            const notaCreditoCreada = data as NotaCreditoInterface
            this.idNotaCreditoCreada = notaCreditoCreada.id_nota_de_credito
            //console.log(facturaCreada)
          },
          error: (error) => {
            console.error(error)
          },
          complete: () => {
            this.procesarDetalles()
            //this.snackBar.open('Se ha ingresado con éxito el nuevo producto!')
          }
        }
      )
  }

  // Actualizar Nota de credito
  actualizarInformacion(){
    const actualizarNotaCredito$ = this.notaCreditoService.update(this.notaCreditoSeleccionada.id_nota_de_credito, this.notaCreditoSeleccionada)
    actualizarNotaCredito$
      .subscribe(
        {
          next: (datos) => {
            this.snackBar.open('La nota de crédito ha sido actualizada con éxito!', 'OK', {
              duration: 3000
            });
            //console.log(datos)
          },
          error: (error) => {
            console.error({error})
          },
          complete: () => {
            this.procesarDetalles()
          }
        }
      )
  }

  // Procesamiento de detalles de nota de crédito
  procesarDetalles(){
    let index = 0
    for(let notaCreditoDetalle of this.detallesTabla){
      if(notaCreditoDetalle.estado === 'c'){
        const detalleNotaCreditoCrear = this.crearDetalleNotaCredito(notaCreditoDetalle, notaCreditoDetalle.estado) as NotaCreditoDetalleCreateInterface
        console.log(detalleNotaCreditoCrear)
        this.notaCreditoDetalleService.create(detalleNotaCreditoCrear)
          .subscribe(
            {
              next: (datos) => {
                console.log(datos)
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                index++
                if(index === this.detallesTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }else if(notaCreditoDetalle.estado === 'u'){
        const detalleNotaCreditoActualizar = this.crearDetalleNotaCredito(notaCreditoDetalle, notaCreditoDetalle.estado) as NotaCreditoDetalleInterface
        const actualizarNotaCredito$ = this.notaCreditoDetalleService.update(detalleNotaCreditoActualizar.id_nota_de_credito_detalle, detalleNotaCreditoActualizar)
        actualizarNotaCredito$
          .subscribe(
            {
              next: (datos) => {
                console.log(datos)
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                index++
                if(index === this.detallesTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }else if(notaCreditoDetalle.estado === 'd'){
        this.notaCreditoDetalleService.delete(notaCreditoDetalle.id_detalle)
          .subscribe(
            {
              next: (datos) => {
                console.log('Eliminado detalle de nota de crédito ' + notaCreditoDetalle.id_detalle)
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                index++
                if(index === this.detallesTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }
    }
  }

  crearDetalleNotaCredito(detalleNotaCreditoTabla: TablaFacturaDetalleInterface, operacion: string){
    if(operacion === 'c'){
      let idNotaCredito = -1
      if(this.idNotaCreditoCreada === -1){
        idNotaCredito = this.notaCreditoSeleccionada.id_nota_de_credito
      }else{
        idNotaCredito = this.idNotaCreditoCreada
      }
      return {
        id_nota_de_credito: idNotaCredito,
        cantidad: detalleNotaCreditoTabla.cantidad,
        descuento: detalleNotaCreditoTabla.descuento,
        total_producto: detalleNotaCreditoTabla.valor_total,
        valor_iva: detalleNotaCreditoTabla.valor_iva,
        valor_ice: detalleNotaCreditoTabla.valor_ice,
        valor_irbpnr: detalleNotaCreditoTabla.valor_irbpnr,
        id_producto: detalleNotaCreditoTabla.id_producto
      } as NotaCreditoDetalleCreateInterface
    }
    return {
      id_nota_de_credito_detalle: detalleNotaCreditoTabla.id_detalle,
      id_nota_de_credito: detalleNotaCreditoTabla.id_factura,
      cantidad: detalleNotaCreditoTabla.cantidad,
      descuento: detalleNotaCreditoTabla.descuento,
      total_producto: detalleNotaCreditoTabla.valor_total,
      valor_iva: detalleNotaCreditoTabla.valor_iva,
      valor_ice: detalleNotaCreditoTabla.valor_ice,
      valor_irbpnr: detalleNotaCreditoTabla.valor_irbpnr,
      id_producto: detalleNotaCreditoTabla.id_producto
    } as NotaCreditoDetalleInterface
  }

  deshabilitarNotaCredito(idNotaCredito: number){
    const referenciaDialogo = this.dialog.open(
      ConfirmacionDeAccionComponent,
      {
        disableClose: false,
        data: {
          icono: 'warning',
          titulo: 'Confirmación de deshabilitación',
          mensaje: '¿Está seguro que desea deshabilitar esta nota de crédito?'
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const confirmacion = datos as boolean
            if(confirmacion){
              this.notaCreditoService.deshabilitar(idNotaCredito)
                .subscribe(
                  {
                    next: (datos) => {
                      this.snackBar.open('La nota de crédito ha sido deshabilitada con éxito!', 'OK', {
                        duration: 3000
                      });
                    },
                    error: (err) => {
                      console.error(err)
                    },
                    complete: () => {
                      this.refresh()
                    }
                  }
                )
            }
          }
        }
      )
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
