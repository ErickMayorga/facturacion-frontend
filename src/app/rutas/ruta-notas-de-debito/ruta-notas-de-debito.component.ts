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
import {NotaDebitoInterface} from "../../servicios/http/nota-de-debito/nota-debito.interface";
import {TablaNotaDebitoInterface} from "../../servicios/interfaces/tabla-nota-debito.interface";
import {TablaNotaDebitoDetalleInterface} from "../../servicios/interfaces/tabla-nota-debito-detalle.interface";
import {NotaDebitoCreateInterface} from "../../servicios/http/nota-de-debito/nota-debito-create.interface";
import {NotaDebitoService} from "../../servicios/http/nota-de-debito/nota-debito.service";
import {NotaDebitoPagoService} from "../../servicios/http/nota-de-debito-pago/nota-debito-pago.service";
import {TablaNotaDebitoPagoInterface} from "../../servicios/interfaces/tabla-nota-debito-pago.interface";
import {ModalFormatoNotaDebitoComponent} from "../../componentes/modal-formato-nota-debito/modal-formato-nota-debito.component";
import {ModalNotaDebitoComponent} from "../../componentes/modal-nota-debito/modal-nota-debito.component";
import {NotaDebitoDetalleCreateInterface} from "../../servicios/http/nota-de-debito-detalle/nota-debito-detalle-create.interface";
import {NotaDebitoDetalleInterface} from "../../servicios/http/nota-de-debito-detalle/nota-debito-detalle.interface";
import {NotaDebitoPagoCreateInterface} from "../../servicios/http/nota-de-debito-pago/nota-debito-pago-create.interface";
import {NotaDebitoPagoInterface} from "../../servicios/http/nota-de-debito-pago/nota-debito-pago.interface";
import {NotaDebitoDetalleService} from "../../servicios/http/nota-de-debito-detalle/nota-debito-detalle.service";
import {TablaFacturaPagoInterface} from "../../servicios/interfaces/tabla-factura-pago.interface";

@Component({
  selector: 'app-ruta-notas-de-debito',
  templateUrl: './ruta-notas-de-debito.component.html',
  styleUrls: ['./ruta-notas-de-debito.component.scss']
})
export class RutaNotasDeDebitoComponent implements OnInit {

  theads = [
    'Número de comprobante',
    'Razón Social del cliente',
    'ID del cliente',
    'Factura',
    'Fecha de emisión',
    'Total sin modificación',
    'Total con modificación',
    'Acciones'
  ];

  notasDebitoDB: NotaDebitoInterface[] = []
  notasDebitoBuscadas: TablaNotaDebitoInterface[] = []

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

  detallesTabla: TablaNotaDebitoDetalleInterface[] = []
  pagosTabla: TablaFacturaPagoInterface[] = []

  nuevaNotaDebito: NotaDebitoCreateInterface = {} as NotaDebitoCreateInterface
  notaDebitoSeleccionada: NotaDebitoInterface = {} as NotaDebitoInterface

  // Tabla
  notaDebitoTabla: TablaNotaDebitoInterface[] = []

  idNotaDebitoCreada: number = -1;

  constructor(private readonly notaDebitoService: NotaDebitoService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly  notaDebitoDetalleService: NotaDebitoDetalleService,
              private readonly notaDebitoPagoService: NotaDebitoPagoService,
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
          this.buscarNotasDebito()
        }
      })
  }

  // Búsqueda y filtro de notas de debito en tabla
  buscarNotasDebito() {
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
              this.notaDebitoService.getComprobantes(this.empresaActual.id_empresa)
                .subscribe(
                  {
                    next: (datos) => {
                      this.notasDebitoDB = datos as NotaDebitoInterface[]
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
    for(let notaDebito of this.notasDebitoDB){
      // Buscar factura
      let idCliente = -1
      let facturaActual: FacturaInterface = {} as FacturaInterface
      this.facturaService.get(notaDebito.id_factura)
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
                        const notaDebitoTabla: TablaNotaDebitoInterface = {
                          id_nota_debito: notaDebito.id_nota_de_debito,
                          id_factura: notaDebito.id_factura,
                          numero_comprobante: notaDebito.numero_comprobante,
                          razon_social_comprador: cliente.nombres_razon_social,
                          identificacion_comprador: cliente.numero_identificacion,
                          numero_factura: facturaActual.numero_comprobante,
                          fecha_emision: notaDebito.fecha_emision,
                          total_sin_modificar: notaDebito.total_sin_modificacion,
                          total_modificado: notaDebito.total_con_modificacion,
                          habilitado: notaDebito.habilitado,
                        }
                        this.notaDebitoTabla.push(notaDebitoTabla)
                      },
                      error: (err) => {
                        console.error(err)
                      },
                      complete: () => {
                        index++
                        if(index === this.notasDebitoDB.length){
                          this.notasDebitoBuscadas = this.notaDebitoTabla
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

  filtrarNotasDebito() {
    const notasDebitoFiltradas = []
    for(let notaDebito of this.notaDebitoTabla){
      if(notaDebito.numero_comprobante.includes(this.busqueda)){
        notasDebitoFiltradas.push(notaDebito)
      }
    }
    this.notasDebitoBuscadas = notasDebitoFiltradas
  }

  // CRUD Notas de debito
  realizarAccion(action: string, idNotaDebito: number){
    if(action === 'ver'){
      this.mostrarFormatoNotaDebito(idNotaDebito)
    }
    if(action === 'editar'){
      this.abrirModalNotaDebito('editar', idNotaDebito)
    }
    if(action === 'eliminar'){
      this.deshabilitarNotaDebito(idNotaDebito)
    }
  }

  // VISUALIZACIÓN
  mostrarFormatoNotaDebito(idNotaDebito: number) {
    this.dialog.open(
      ModalFormatoNotaDebitoComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          empresa: this.empresaActual,
          nota_debito: idNotaDebito,
        }
      }
    )
  }

  abrirModalNotaDebito(operacion: 'crear'|'editar', idNotaDebito: number = -1){
    const referenciaDialogo = this.dialog.open(
      ModalNotaDebitoComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          operacion: operacion,
          nota_debito: idNotaDebito,
          next: this.notasDebitoDB.length + 1
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const notaDebito = datos['nota_debito']
            const detalles = datos['detalles'] as TablaNotaDebitoDetalleInterface[]
            const pagos = datos['pagos'] as TablaFacturaPagoInterface[]

            if(operacion === 'crear'){
              this.nuevaNotaDebito = notaDebito as NotaDebitoCreateInterface
              this.detallesTabla = detalles as TablaNotaDebitoDetalleInterface[]
              this.pagosTabla = pagos as TablaFacturaPagoInterface[]

              this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.notaDebitoSeleccionada = notaDebito as NotaDebitoInterface
              this.detallesTabla = detalles as TablaNotaDebitoDetalleInterface[]
              this.pagosTabla = pagos as TablaFacturaPagoInterface[]
              this.actualizarInformacion()
            }
          }
        }
      )
  }

  // Crear Nota de debito
  registrarInformacion() {
    this.notaDebitoService.create(this.nuevaNotaDebito)
      .subscribe(
        {
          next: (data) => {
            this.snackBar.open('La nota de débito ha sido registrada con éxito!', 'OK', {
              duration: 3000
            });
            const notaCreditoCreada = data as NotaDebitoInterface
            this.idNotaDebitoCreada = notaCreditoCreada.id_nota_de_debito
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

  // Actualizar Nota de debito
  actualizarInformacion(){
    const actualizarNotaDebito$ = this.notaDebitoService.update(this.notaDebitoSeleccionada.id_nota_de_debito, this.notaDebitoSeleccionada)
    actualizarNotaDebito$
      .subscribe(
        {
          next: (datos) => {
            this.snackBar.open('La nota de débito ha sido actualizada con éxito!', 'OK', {
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

  // Procesamiento de detalles de nota de débito
  procesarDetalles(){
    let index = 0
    for(let notaDebitoDetalle of this.detallesTabla){
      if(notaDebitoDetalle.estado === 'c'){
        const detalleNotaDebitoCrear = this.crearDetalleNotaDebito(notaDebitoDetalle, notaDebitoDetalle.estado) as NotaDebitoDetalleCreateInterface
        this.notaDebitoDetalleService.create(detalleNotaDebitoCrear)
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
                  this.procesarPagos()
                }
              }
            }
          )
      }else if(notaDebitoDetalle.estado === 'u'){
        const detalleNotaDebitoActualizar = this.crearDetalleNotaDebito(notaDebitoDetalle, notaDebitoDetalle.estado) as NotaDebitoDetalleInterface
        const actualizarNotaDebito$ = this.notaDebitoDetalleService.update(detalleNotaDebitoActualizar.id_nota_de_debito_detalle, detalleNotaDebitoActualizar)
        actualizarNotaDebito$
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
                  this.procesarPagos()
                }
              }
            }
          )
      }else if(notaDebitoDetalle.estado === 'd'){
        this.notaDebitoDetalleService.delete(notaDebitoDetalle.id_detalle)
          .subscribe(
            {
              next: (datos) => {
                console.log('Eliminado detalle de nota de débito ' + notaDebitoDetalle.id_detalle)
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                index++
                if(index === this.detallesTabla.length){
                  this.procesarPagos()
                }
              }
            }
          )
      }
    }
  }

  crearDetalleNotaDebito(detalleNotaDebitoTabla: TablaNotaDebitoDetalleInterface, operacion: string){
    if(operacion === 'c'){
      let idNotaDebito = -1
      if(this.idNotaDebitoCreada === -1){
        idNotaDebito = this.notaDebitoSeleccionada.id_nota_de_debito
      }else{
        idNotaDebito = this.idNotaDebitoCreada
      }
      return {
        id_nota_de_debito: idNotaDebito,
        razon_modificacion: detalleNotaDebitoTabla.razon_modificacion,
        valor_modificacion: detalleNotaDebitoTabla.valor_modificacion
      } as NotaDebitoDetalleCreateInterface
    }
    return {
      id_nota_de_debito_detalle: detalleNotaDebitoTabla.id_detalle,
      id_nota_de_debito: detalleNotaDebitoTabla.id_nota_debito,
      razon_modificacion: detalleNotaDebitoTabla.razon_modificacion,
      valor_modificacion: detalleNotaDebitoTabla.valor_modificacion,
    } as NotaDebitoDetalleInterface
  }

  // Procesamiento de pagos de nota de débito
  procesarPagos(){
    let index = 0
    for(let pago of this.pagosTabla){
      if(pago.estado === 'c'){
        const pagosCrear = this.crearPagoNotaDebito(pago, pago.estado) as NotaDebitoPagoCreateInterface
        this.notaDebitoPagoService.create(pagosCrear)
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
                if(index === this.pagosTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }else if(pago.estado === 'u'){
        const pagoActualizar = this.crearPagoNotaDebito(pago, pago.estado) as NotaDebitoPagoInterface
        const actualizarPago$ = this.notaDebitoPagoService.update(pagoActualizar.id_nota_de_debito_pago, pagoActualizar)
        actualizarPago$
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
                if(index === this.pagosTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }else if(pago.estado === 'd'){
        this.notaDebitoPagoService.delete(pago.id_pago)
          .subscribe(
            {
              next: (datos) => {
                console.log('Eliminado pago de nota de débito ' + pago.id_pago)
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                index++
                if(index === this.pagosTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }
    }
  }

  crearPagoNotaDebito(pagoTabla: TablaFacturaPagoInterface, operacion: string){
    if(operacion === 'c'){
      let idNotaDebito = -1
      if(this.idNotaDebitoCreada === -1){
        idNotaDebito = this.notaDebitoSeleccionada.id_nota_de_debito
      }else{
        idNotaDebito = this.idNotaDebitoCreada
      }
      return {
        id_nota_de_debito: idNotaDebito,
        id_metodo_de_pago: pagoTabla.id_metodo_pago,
        valor_pago: pagoTabla.valor,
        medida_tiempo: pagoTabla.unidad_tiempo,
        plazo: pagoTabla.plazo,
      } as NotaDebitoPagoCreateInterface
    }
    return {
      id_nota_de_debito_pago: pagoTabla.id_pago,
      id_nota_de_debito: pagoTabla.id_factura,
      id_metodo_de_pago: pagoTabla.id_metodo_pago,
      valor_pago: pagoTabla.valor,
      medida_tiempo: pagoTabla.unidad_tiempo,
      plazo: pagoTabla.plazo
    } as NotaDebitoPagoInterface
  }

  deshabilitarNotaDebito(idNotaDebito: number){
    const referenciaDialogo = this.dialog.open(
      ConfirmacionDeAccionComponent,
      {
        disableClose: false,
        data: {
          icono: 'warning',
          titulo: 'Confirmación de deshabilitación',
          mensaje: '¿Está seguro que desea deshabilitar esta nota de débito?'
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
              this.notaDebitoService.deshabilitar(idNotaDebito)
                .subscribe(
                  {
                    next: (datos) => {
                      this.snackBar.open('La nota de débito ha sido deshabilitada con éxito!', 'OK', {
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
