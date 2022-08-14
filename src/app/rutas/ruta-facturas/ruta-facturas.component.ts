import {Component, OnInit} from '@angular/core';
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {FacturaDetalleCreateInterface} from "../../servicios/http/factura-detalle/factura-detalle-create.interface";
import {FacturaDetalleInterface} from "../../servicios/http/factura-detalle/factura-detalle.interface";
import {FacturaCreateInterface} from "../../servicios/http/factura/factura-create.interface";
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
import {FacturaPagoCreateInterface} from "../../servicios/http/factura-pago/factura-pago-create.interface";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {ModalFormatoFacturaComponent} from "../../componentes/modal-formato-factura/modal-formato-factura.component";
import {ConfirmacionDeAccionComponent} from "../../componentes/confirmacion-de-accion/confirmacion-de-accion.component";

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
      icon: 'block'
    },
  ]
  busqueda = '';
  idUsuario: number = -1;
  empresaActual: EmpresaInterface = {} as EmpresaInterface

  detallesTabla: TablaFacturaDetalleInterface[] = []
  pagosTabla: TablaFacturaPagoInterface[] = []

  nuevaFactura: FacturaCreateInterface = {} as FacturaCreateInterface
  facturaSeleccionada: FacturaInterface = {} as FacturaInterface

  // Tabla
  facturasTabla: TablaFacturaInterface[] = []

  idFacturaCreada: number = -1;

  constructor(private readonly facturaService: FacturaService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly  facturaDetalleService: FacturaDetalleService,
              private readonly facturaPagoService: FacturaPagoService,
              private readonly clienteService: ClienteService,
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
          this.buscarFacturas()
        }
      })
  }

  // Búsqueda y filtro de facturas en tabla
  buscarFacturas() {
    this.empresaService.getEmpresa(this.idUsuario)
      .subscribe(
        {
          next: (datos) => {
            this.empresaActual = datos as EmpresaInterface
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            if(this.empresaActual != null){
              this.facturaService.getFacturas(this.empresaActual.id_empresa)
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
                valor_total: factura.total_con_iva,
                habilitado: factura.habilitado
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
    this.dialog.open(
      ModalFormatoFacturaComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          empresa: this.empresaActual,
          factura: idFactura,
        }
      }
    )
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
            const detalles = datos['detalles'] as TablaFacturaDetalleInterface[]
            const pagos = datos['pagos'] as TablaFacturaPagoInterface[]

            if(operacion === 'crear'){
              this.nuevaFactura = factura as FacturaCreateInterface
              this.detallesTabla = detalles as TablaFacturaDetalleInterface[]
              this.pagosTabla = pagos as TablaFacturaPagoInterface[]
              this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.facturaSeleccionada = factura as FacturaInterface
              this.detallesTabla = detalles as TablaFacturaDetalleInterface[]
              this.pagosTabla = pagos as TablaFacturaPagoInterface[]
              this.actualizarInformacion()
            }
          }
        }
      )
  }

  // Crear Factura
  registrarInformacion() {
    this.facturaService.create(this.nuevaFactura)
      .subscribe(
        {
          next: (data) => {
            this.snackBar.open('La factura ha sido registrada con éxito!', 'OK', {
              duration: 3000
            });
            const facturaCreada = data as FacturaInterface
            this.idFacturaCreada = facturaCreada.id_factura
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

  // Actualizar factura
  actualizarInformacion(){
    const actualizarFactura$ = this.facturaService.update(this.facturaSeleccionada.id_factura, this.facturaSeleccionada)
    actualizarFactura$
      .subscribe(
        {
          next: (datos) => {
            this.snackBar.open('La factura ha sido actualizada con éxito!', 'OK', {
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

  // Procesamiento de detalles
  procesarDetalles(){
    let index = 0
    for(let detalle of this.detallesTabla){
      if(detalle.estado === 'c'){
        const detalleCrear = this.crearDetalleFactura(detalle, detalle.estado) as FacturaDetalleCreateInterface
        this.facturaDetalleService.create(detalleCrear)
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
      }else if(detalle.estado === 'u'){
        const detalleActualizar = this.crearDetalleFactura(detalle, detalle.estado) as FacturaDetalleInterface
         const actualizarDetalle$ = this.facturaDetalleService.update(detalleActualizar.id_factura_detalle, detalleActualizar)
        actualizarDetalle$
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
      }else if(detalle.estado === 'd'){
        this.facturaDetalleService.delete(detalle.id_detalle)
          .subscribe(
            {
              next: (datos) => {
                console.log('Eliminado detalle ' + detalle.id_detalle)
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

  crearDetalleFactura(detalleTabla: TablaFacturaDetalleInterface, operacion: string){
    if(operacion === 'c'){
      let idFactura = -1
      if(this.idFacturaCreada === -1){
        idFactura = this.facturaSeleccionada.id_factura
      }else{
        idFactura = this.idFacturaCreada
      }
      return {
        id_factura: idFactura,
        id_producto: detalleTabla.id_producto,
        cantidad: detalleTabla.cantidad,
        descuento: detalleTabla.descuento,
        total_producto: detalleTabla.valor_total,
        valor_ice: detalleTabla.valor_ice,
        valor_irbpnr: detalleTabla.valor_irbpnr,
      } as FacturaDetalleCreateInterface
    }
    return {
      id_factura_detalle: detalleTabla.id_detalle,
      id_factura: detalleTabla.id_factura,
      id_producto: detalleTabla.id_producto,
      cantidad: detalleTabla.cantidad,
      descuento: detalleTabla.descuento,
      total_producto: detalleTabla.valor_total,
      valor_ice: detalleTabla.valor_ice,
      valor_irbpnr: detalleTabla.valor_irbpnr,
    } as FacturaDetalleInterface
  }

  // Procesamiento de pagos
  procesarPagos(){
    let index = 0
    for(let pago of this.pagosTabla){
      if(pago.estado === 'c'){
        const pagosCrear = this.crearPagoFactura(pago, pago.estado) as FacturaPagoCreateInterface
        this.facturaPagoService.create(pagosCrear)
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
      }else if(pago.estado === 'u'){
        const pagoActualizar = this.crearPagoFactura(pago, pago.estado) as FacturaPagoInterface
        const actualizarPago$ = this.facturaPagoService.update(pagoActualizar.id_factura_pago, pagoActualizar)
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
                if(index === this.detallesTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }else if(pago.estado === 'd'){
        this.facturaPagoService.delete(pago.id_pago)
          .subscribe(
            {
              next: (datos) => {
                console.log('Eliminado pago ' + pago.id_pago)
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

  crearPagoFactura(pagoTabla: TablaFacturaPagoInterface, operacion: string){
    if(operacion === 'c'){
      let idFactura = -1
      if(this.idFacturaCreada === -1){
        idFactura = this.facturaSeleccionada.id_factura
      }else{
        idFactura = this.idFacturaCreada
      }
      return {
        id_factura: idFactura,
        id_metodo_de_pago: pagoTabla.id_metodo_pago,
        valor_pago: pagoTabla.valor,
        medida_tiempo: pagoTabla.unidad_tiempo,
        plazo: pagoTabla.plazo,
      } as FacturaPagoCreateInterface
    }
    return {
      id_factura_pago: pagoTabla.id_pago,
      id_factura: pagoTabla.id_factura,
      id_metodo_de_pago: pagoTabla.id_metodo_pago,
      valor_pago: pagoTabla.valor,
      medida_tiempo: pagoTabla.unidad_tiempo,
      plazo: pagoTabla.plazo
    } as FacturaPagoInterface
  }

  deshabilitarFactura(idFactura: number){
    const referenciaDialogo = this.dialog.open(
      ConfirmacionDeAccionComponent,
      {
        disableClose: false,
        data: {
          icono: 'warning',
          titulo: 'Confirmación de deshabilitación',
          mensaje: '¿Está seguro que desea deshabilitar esta factura?'
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
              this.facturaService.deshabilitar(idFactura)
                .subscribe(
                  {
                    next: (datos) => {
                      this.snackBar.open('La factura ha sido deshabilitada con éxito!', 'OK', {
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
