import { Component, OnInit } from '@angular/core';
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {RetencionInterface} from "../../servicios/http/comprobante-de-retencion/retencion.interface";
import {TablaRetencionInterface} from "../../servicios/interfaces/tabla-retencion.interface";
import {TablaRetencionDetalleInterface} from "../../servicios/interfaces/tabla-retencion-detalle.interface";
import {RetencionCreateInterface} from "../../servicios/http/comprobante-de-retencion/retencion-create.interface";
import {RetencionService} from "../../servicios/http/comprobante-de-retencion/retencion.service";
import {RetencionDetalleService} from "../../servicios/http/comprobante-de-retencion-detalle/retencion-detalle.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {ModalFormatoRetencionComponent} from "../../componentes/modal-formato-retencion/modal-formato-retencion.component";
import {ModalRetencionComponent} from "../../componentes/modal-retencion/modal-retencion.component";
import {RetencionDetalleCreateInterface} from "../../servicios/http/comprobante-de-retencion-detalle/retencion-detalle-create.interface";
import {RetencionDetalleInterface} from "../../servicios/http/comprobante-de-retencion-detalle/retencion-detalle.interface";

@Component({
  selector: 'app-ruta-retenciones',
  templateUrl: './ruta-retenciones.component.html',
  styleUrls: ['./ruta-retenciones.component.scss']
})
export class RutaRetencionesComponent implements OnInit {

  theads = [
    'Número de comprobante',
    'Razón Social del transportista',
    'ID del transportista',
    'Factura',
    'Fecha de emisión',
    'Total retenido',
    'Acciones'
  ];

  retencionesDB: RetencionInterface[] = []
  retencionesBuscadas: TablaRetencionInterface[] = []

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
  empresaActual: EmpresaInterface = {} as EmpresaInterface

  detallesTabla: TablaRetencionDetalleInterface[] = []

  nuevaRetencion: RetencionCreateInterface = {} as RetencionCreateInterface
  retencionSeleccionada: RetencionInterface = {} as RetencionInterface

  // Tabla
  retencionesTabla: TablaRetencionInterface[] = []

  idRetencionCreada: number = -1;

  constructor(private readonly retencionService: RetencionService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly  retencionDetalleService: RetencionDetalleService,
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
          this.buscarRetenciones()
        }
      })
  }

  // Búsqueda y filtro de retenciones en tabla
  buscarRetenciones() {
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
            // Buscar retenciones por empresa
            this.retencionService.getComprobantes(this.empresaActual.id_empresa)
              .subscribe(
                {
                  next: (datos) => {
                    this.retencionesDB = datos as RetencionInterface[]
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
      )
  }

  crearRegistrosTabla(){
    let index = 0
    for(let retencion of this.retencionesDB){
      // Buscar factura
      let idCliente = -1
      let facturaActual: FacturaInterface = {} as FacturaInterface
      this.facturaService.get(retencion.id_factura)
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
              // Buscar cliente
              this.clienteService.get(idCliente) // TODO: Verificar cliente de la factura
                .subscribe(
                  {
                    next: (datos) => {
                      const cliente = datos as ClienteInterface
                      const retencionTabla: TablaRetencionInterface = {
                        idRetencion: retencion.id_comprobante_de_retencion,
                        idFactura: retencion.id_factura,
                        numero_comprobante: retencion.numero_comprobante,
                        razon_social_comprador: cliente.nombres_razon_social,
                        identificacion_comprador: cliente.numero_identificacion,
                        numero_factura: facturaActual.numero_comprobante,
                        fecha_emision: retencion.fecha_emision,
                        total_retenido: -1, // TODO: Verificar total referido
                        habilitado: retencion.habilitado,
                      }
                      this.retencionesTabla.push(retencionTabla)
                    },
                    error: (err) => {
                      console.error(err)
                    },
                    complete: () => {
                      index++
                      if(index === this.retencionesDB.length){
                        this.retencionesBuscadas = this.retencionesTabla
                      }
                    }
                  }
                )
            }
          }
        )
    }
  }

  filtrarRetenciones() {
    const retencionesFiltradas = []
    for(let retencion of this.retencionesTabla){
      if(retencion.numero_comprobante.includes(this.busqueda)){
        retencionesFiltradas.push(retencion)
      }
    }
    this.retencionesBuscadas = retencionesFiltradas
  }

  // CRUD Retenciones
  realizarAccion(action: string, idRetencion: number){
    if(action === 'ver'){
      this.mostrarFormatoRetencion(idRetencion)
    }
    if(action === 'editar'){
      this.abrirModalRetencion('editar', idRetencion)
    }
    if(action === 'eliminar'){
      this.deshabilitarRetencion(idRetencion)
    }
  }

  // VISUALIZACIÓN
  mostrarFormatoRetencion(idRetencion: number) {
    this.dialog.open(
      ModalFormatoRetencionComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          empresa: this.empresaActual,
          retencion: idRetencion,
        }
      }
    )
  }

  abrirModalRetencion(operacion: 'crear'|'editar', idRetencion: number = -1){
    const referenciaDialogo = this.dialog.open(
      ModalRetencionComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          operacion: operacion,
          retencion: idRetencion,
          next: this.retencionesDB.length + 1
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const retencion = datos['retencion']
            const detalles = datos['detalles'] as TablaRetencionDetalleInterface[]

            if(operacion === 'crear'){
              this.nuevaRetencion = retencion as RetencionCreateInterface
              this.detallesTabla = detalles as TablaRetencionDetalleInterface[]
              this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.retencionSeleccionada = retencion as RetencionInterface
              this.detallesTabla = detalles as TablaRetencionDetalleInterface[]
              this.actualizarInformacion()
            }
          }
        }
      )
  }

  // Crear Retencion
  registrarInformacion() {
    this.retencionService.create(this.nuevaRetencion)
      .subscribe(
        {
          next: (data) => {
            this.snackBar.open('Se ha ingresado con éxito el nuevo comprobante de retención!')
            const guiaRemisionCreada = data as RetencionInterface
            this.idRetencionCreada = guiaRemisionCreada.id_comprobante_de_retencion
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

  // Actualizar Retencion
  actualizarInformacion(){
    const actualizarRetencion$ = this.retencionService.update(this.retencionSeleccionada.id_comprobante_de_retencion, this.retencionSeleccionada)
    actualizarRetencion$
      .subscribe(
        {
          next: (datos) => {
            this.snackBar.open('Se ha actualizado el comprobante de retención con éxito!')
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

  // Procesamiento de detalles de retencion
  procesarDetalles(){
    let index = 0
    for(let retencionDetalle of this.detallesTabla){
      if(retencionDetalle.estado === 'c'){
        const detalleRetencionCrear = this.crearDestinatario(retencionDetalle, retencionDetalle.estado) as RetencionDetalleCreateInterface
        this.retencionDetalleService.create(detalleRetencionCrear)
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
      }else if(retencionDetalle.estado === 'u'){
        const detalleRetencionActualizar = this.crearDestinatario(retencionDetalle, retencionDetalle.estado) as RetencionDetalleInterface
        const actualizarDetalleRetencion$ = this.retencionDetalleService.update(detalleRetencionActualizar.id_comprobante_de_retencion_detalle, detalleRetencionActualizar)
        actualizarDetalleRetencion$
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
      }else if(retencionDetalle.estado === 'd'){
        this.retencionDetalleService.delete(retencionDetalle.id_detalle)
          .subscribe(
            {
              next: (datos) => {
                console.log('Eliminado detalle de retencion ' + retencionDetalle.id_detalle)
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

  // TODO: Logica de campos de codigo
  crearDestinatario(detalleRetencionTabla: TablaRetencionDetalleInterface, operacion: string){
    if(operacion === 'c'){
      let idRetencion = -1
      if(this.idRetencionCreada === -1){
        idRetencion = this.retencionSeleccionada.id_comprobante_de_retencion
      }else{
        idRetencion = this.idRetencionCreada
      }
      return {
        id_comprobante_de_retencion: idRetencion,
        id_impuesto: detalleRetencionTabla.id_impuesto,
        codigo_retencion: '', // TODO: Revisar campos de codigo
        codigo: detalleRetencionTabla.codigo_impuesto,
        descripcion: detalleRetencionTabla.nombre_impuesto,
        base_imponible: detalleRetencionTabla.base_imponible,
        fecha: new Date(),
        id_factura: detalleRetencionTabla.id_factura,
        porcentaje: detalleRetencionTabla.tarifa,
        total: detalleRetencionTabla.valor_total,
      } as RetencionDetalleCreateInterface
    }
    return {
      id_comprobante_de_retencion_detalle: detalleRetencionTabla.id_detalle,
      id_comprobante_de_retencion: detalleRetencionTabla.id_retencion,
      id_impuesto: detalleRetencionTabla.id_impuesto,
      codigo_retencion: '', // TODO: Revisar campos de codigo
      codigo: detalleRetencionTabla.codigo_impuesto,
      descripcion: detalleRetencionTabla.nombre_impuesto,
      base_imponible: detalleRetencionTabla.base_imponible,
      fecha: new Date(),
      id_factura: detalleRetencionTabla.id_factura,
      porcentaje: detalleRetencionTabla.tarifa,
      total: detalleRetencionTabla.valor_total,
    } as RetencionDetalleInterface
  }

  deshabilitarRetencion(idRetencion: number){
    this.retencionService.deshabilitar(idRetencion)
      .subscribe(
        {
          next: (datos) => {

          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.refresh()
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
