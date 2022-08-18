import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DatePipe} from "@angular/common";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {retencionForm} from "./retencion-form";
import {RetencionInterface} from "../../servicios/http/comprobante-de-retencion/retencion.interface";
import {RetencionDetalleInterface} from "../../servicios/http/comprobante-de-retencion-detalle/retencion-detalle.interface";
import {TablaRetencionDetalleInterface} from "../../servicios/interfaces/tabla-retencion-detalle.interface";
import {RetencionService} from "../../servicios/http/comprobante-de-retencion/retencion.service";
import {RetencionDetalleService} from "../../servicios/http/comprobante-de-retencion-detalle/retencion-detalle.service";
import {RetencionCreateInterface} from "../../servicios/http/comprobante-de-retencion/retencion-create.interface";
import {ModalAgregarImpuestoComponent} from "../modal-agregar-impuesto/modal-agregar-impuesto.component";
import {ImpuestoService} from "../../servicios/http/impuesto/impuesto.service";
import {ImpuestoInterface} from "../../servicios/http/impuesto/impuesto.interface";

@Component({
  selector: 'app-modal-retencion',
  templateUrl: './modal-retencion.component.html',
  styleUrls: ['./modal-retencion.component.scss']
})
export class ModalRetencionComponent implements OnInit {

  formGroupRetencion = new FormGroup({});
  fields = retencionForm
  tituloModal = ''

  // TABLA DETALLE
  theadsDetalle = [
    'Código',
    'Descripción',
    'Base imponible',
    'Tarifa',
    'Total',
    'Acciones'
  ];

  // ENTRADAS
  usuarioActual: number = -1;
  operacion = ''
  retencionActual: number = -1

  // Cargar informacion
  empresaActual: EmpresaInterface =  {} as EmpresaInterface
  direccionMatriz = ''
  direccionEstablecimiento = ''
  direccionCliente = ''

  clienteDB: ClienteInterface = {
    id_cliente: -1,
    id_usuario: -1,
    nombres_razon_social: '',
    tipo_identificacion: '',
    id_direccion: -1,
    numero_identificacion: '',
    telefono: '',
    correo_electronico: '',
  } as ClienteInterface

  facturaDB: FacturaInterface = {} as FacturaInterface
  facturasBuscadas: FacturaInterface[] = []

  retencionDB: RetencionInterface = {} as RetencionInterface

  detallesDB: RetencionDetalleInterface[] = []

  detallesTabla: TablaRetencionDetalleInterface[] = []

  //Cálculos
  numeroComprobante = ''
  claveAcceso = ''
  fechaEmisionRetencion: string | null  = ''
  fechaEmisionFactura: string | null = ''

  busquedaCliente: string = ''
  busquedaFactura: string = ''
  total_retenido = 0

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalRetencionComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly retencionService: RetencionService,
               private readonly detalleRetencionService: RetencionDetalleService,
               private readonly empresaService: EmpresaService,
               private readonly clienteService: ClienteService,
               private readonly impuestoRetencionService: ImpuestoService,
               private readonly direccionService: DireccionService,
               private readonly facturaService: FacturaService,
               public dialog: MatDialog,
               private datePipe: DatePipe) {
    const today = new Date()
    this.fechaEmisionRetencion = this.datePipe.transform(today, 'dd-MM-yyyy')
    this.usuarioActual = this.data.usuario
    this.operacion = this.data.operacion
    this.retencionActual = this.data.retencion
    this.claveAcceso = (Math.floor(Math.random() * 9999999999) + 1000000000).toString()
    this.formGroupRetencion =this.formBuilder.group(
      {
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
        numero_factura: ['', [Validators.required]]
      }
    )
    this.buscarEmpresa()
  }

  ngOnInit(): void {
    if(this.operacion === 'editar'){
      this.tituloModal = 'Actualización de Comprobante de Retención'
      this.buscarRetencion()
    }else{
      this.tituloModal = 'Registro de Comprobante de Retención'
    }
  }

  cancelar() {
    this.dialogRef.close()
  }

  // Búsqueda de información del emisor
  private buscarEmpresa() {
    this.empresaService.getEmpresa(this.usuarioActual)
      .subscribe(
        {
          next: (datos) => {
            this.empresaActual = datos as EmpresaInterface
            if(this.operacion === 'crear'){
              this.numeroComprobante = this.empresaActual.codigo_establecimiento + '-' + this.empresaActual.codigo_punto_emision + '-' + this.data.next
            }
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            //Buscar dirección matriz
            this.direccionService.get(this.empresaActual.id_direccion_matriz)
              .subscribe(
                {
                  next: (datos) => {
                    const direccion = datos as DireccionInterface
                    this.direccionMatriz = this.direccionService.getStringDireccion(direccion)
                  },
                  error: (err) => {
                    console.log(err)
                  }
                }
              )

            //Buscar dirección establecimiento
            this.direccionService.get(this.empresaActual.id_direccion_establecimiento)
              .subscribe(
                {
                  next: (datos) => {
                    const direccion = datos as DireccionInterface
                    this.direccionEstablecimiento = this.direccionService.getStringDireccion(direccion)
                  },
                  error: (err) => {
                    console.log(err)
                  }
                }
              )
          }
        }
      )
  }

  // Carga inicial de información de la factura
  buscarRetencion() {
    this.retencionService.get(this.retencionActual)
      .subscribe(
        {
          next: (datos) => {
            this.retencionDB = datos as RetencionInterface
            this.fechaEmisionRetencion = this.datePipe.transform(this.retencionDB.fecha_emision, 'dd-MM-yyyy')
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.facturaService.get(this.retencionDB.id_factura)
              .subscribe(
                {
                  next: (datos) => {
                    this.facturaDB = datos as FacturaInterface
                    this.fechaEmisionFactura = this.datePipe.transform(this.facturaDB.fecha_emision, 'dd-MM-yyyy')
                    this.busquedaFactura =  this.facturaDB.numero_comprobante
                  },
                  error: (err) => {
                    console.error(err)
                  },
                  complete: () => {
                    // Consultar cliente
                    this.clienteService.get(this.facturaDB.id_cliente)
                      .subscribe(
                        {
                          next: (datos) => {
                            this.clienteDB = datos as ClienteInterface
                            this.busquedaCliente = this.clienteDB.numero_identificacion
                            //console.log(this.clienteDB.id_cliente)
                          },
                          error: (err) => {
                            console.error(err)
                          },
                          complete: () => {
                            this.cargarCliente()
                          }
                        }
                      )
                  }
                }
              )

            // Consultar detalle de factura
            this.detalleRetencionService.getDetalles(this.retencionActual)
              .subscribe(
                {
                  next: (datos) => {
                    this.detallesDB = datos as RetencionDetalleInterface[]
                    //this.detallesActualizar = this.detallesDB
                    //console.log(this.impuestosDB)
                  },
                  error: (err) => {
                    console.error(err)
                  },
                  complete: () => {
                    this.cargarDetalle()
                  }
                }
              )
          }
        }
      )
  }

  cargarInformacion() {
    // Buscar facturas del cliente
    this.facturaService.getFacturasPorCliente(this.empresaActual.id_empresa, this.clienteDB.id_cliente)
      .subscribe(
        {
          next: (datos) => {
            const facturasCliente = datos as FacturaInterface[]
            let facturasFiltradas: FacturaInterface[] = []
            for(let factura of facturasCliente){
              if(factura.habilitado){
                facturasFiltradas.push(factura)
              }
            }
            this.facturasBuscadas = facturasFiltradas
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.claveAcceso = this.retencionDB.clave_acceso
            this.numeroComprobante = this.retencionDB.numero_comprobante
            this.formGroupRetencion.patchValue({
              numero_identificacion: this.clienteDB.numero_identificacion,
              numero_factura: this.facturaDB.id_factura
            });
          }
        }
      )
  }

  cargarCliente(){
    this.direccionService.get(this.clienteDB.id_direccion)
      .subscribe(
        {
          next: (datos) => {
            const direccion = datos as DireccionInterface
            this.direccionCliente = this.direccionService.getStringDireccion(direccion)
          },
          error: (err) => {
            console.log(err)
          },
          complete: () => {
            this.cargarInformacion()
          }
        }
      )
  }

  cargarDetalle(){
    for(let detalle of this.detallesDB){
      this.impuestoRetencionService.get(detalle.id_impuesto)
        .subscribe(
          {
            next: (datos) => {
              const impuesto = datos as ImpuestoInterface

              const detalleTabla: TablaRetencionDetalleInterface = {
                id_retencion: this.retencionActual,
                id_detalle: detalle.id_comprobante_de_retencion_detalle,
                id_impuesto: detalle.id_impuesto,
                codigo_impuesto: '0' + impuesto.id_impuesto,
                nombre_impuesto: impuesto.nombre_impuesto,
                base_imponible: detalle.base_imponible,
                tarifa: impuesto.valor_impuesto,
                valor_total: detalle.total,
                estado: 'u',
              }
              this.detallesTabla.push(detalleTabla)
            },
            error: (err) => {
              console.error(err)
            },
            complete: () => {
              this.actualizarTotalRetenido()
              //this.actualizarDescuento()
            }
          }
        )
    }
  }

  // Enviar datos para crear o actualizar comprobante de retencion
  guardarRetencion(){
    let retencionObject: RetencionInterface | RetencionCreateInterface = {} as RetencionCreateInterface

    if(this.operacion === 'crear'){
      retencionObject = {
        id_factura: this.facturaDB.id_factura,
        numero_comprobante: this.numeroComprobante,
        fecha_emision: new Date(),
        clave_acceso: this.claveAcceso,
        habilitado: true,
        id_empresa: this.empresaActual.id_empresa,
        total_retenido: this.total_retenido,
      } as RetencionCreateInterface
    }

    if(this.operacion === 'editar'){
      retencionObject = {
        id_comprobante_de_retencion: this.retencionActual,
        id_factura: this.facturaDB.id_factura,
        numero_comprobante: this.numeroComprobante,
        fecha_emision: this.retencionDB.fecha_emision,
        clave_acceso: this.claveAcceso,
        habilitado: true,
        id_empresa: this.empresaActual.id_empresa,
        total_retenido: this.total_retenido,
      } as RetencionInterface
    }

    this.dialogRef.close({retencion: retencionObject, detalles: this.detallesTabla})
  }

  // Consulta de información del cliente y factura
  buscarCliente(){
    this.clienteService.getCliente(this.usuarioActual,this.busquedaCliente)
      .subscribe(
        {
          next: (datos) => {
            this.clienteDB = datos as ClienteInterface
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            if(this.clienteDB != null){
              //Buscar dirección cliente
              this.direccionService.get(this.clienteDB.id_direccion)
                .subscribe(
                  {
                    next: (datos) => {
                      const direccion = datos as DireccionInterface
                      this.direccionCliente = this.direccionService.getStringDireccion(direccion)
                    },
                    error: (err) => {
                      console.log(err)
                    }
                  }
                )
              // Buscar facturas del cliente
              this.facturaService.getFacturasPorCliente(this.empresaActual.id_empresa, this.clienteDB.id_cliente)
                .subscribe(
                  {
                    next: (datos) => {
                      const facturasCliente = datos as FacturaInterface[]
                      let facturasFiltradas: FacturaInterface[] = []
                      for(let factura of facturasCliente){
                        if(factura.habilitado){
                          facturasFiltradas.push(factura)
                        }
                      }
                      this.facturasBuscadas = facturasFiltradas
                    },
                    error: (err) => {
                      console.error(err)
                    }
                  }
                )
            } else{
              this.facturasBuscadas = []
            }
          }
        }
      )
  }

  // Agregar nuevo producto
  abrirModalAgregarImpuesto() {
    const referenciaDialogo = this.dialog.open(
      ModalAgregarImpuestoComponent,
      {
        disableClose: false,
        data: {
          usuario: this.usuarioActual,
          retencion: this.retencionActual,
          factura: this.facturaDB
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const detalleTabla = datos['detalle'] as TablaRetencionDetalleInterface
            detalleTabla.id_retencion = this.retencionActual
            this.detallesTabla.push(detalleTabla)
            this.actualizarTotalRetenido()
            //this.actualizarDescuento()
          }
        }
      )
  }

  actualizarTotalRetenido() {
    this.total_retenido = 0
    for(let detalle of this.detallesTabla){
      if(detalle.estado != 'd'){
        this.total_retenido += detalle.base_imponible * detalle.tarifa
      }
    }
  }

  // Eliminar un detalle de la lista
  eliminarDetalle(detalle: TablaRetencionDetalleInterface) {
    //console.log('Antes: ', this.detallesTabla)
    if(this.operacion === 'crear'){
      this.detallesTabla = this.detallesTabla.filter(
        (item) => item.id_impuesto !== detalle.id_impuesto
      )
      //console.log('Despues: ', this.detallesTabla)
    }
    if(this.operacion === 'editar'){
      if(detalle.estado === 'u'){
        detalle.estado = 'd'
      }else{
        this.detallesTabla = this.detallesTabla.filter(
          (item) => item.id_impuesto !== detalle.id_impuesto
        )
      }
      //console.log('Despues: ', this.detallesTabla)
    }
    this.actualizarTotalRetenido()
    //this.actualizarDescuento()
  }

  buscarFactura() {
    const idFactura = Number.parseInt(this.formGroupRetencion.get('numero_factura')?.value)
    this.facturaService.get(idFactura)
      .subscribe(
        {
          next: datos => {
            this.facturaDB = datos as FacturaInterface
            this.fechaEmisionFactura = this.datePipe.transform(this.facturaDB.fecha_emision, 'dd-MM-yyyy')
            this.busquedaFactura = this.facturaDB.numero_comprobante
          },
          error: err => {
            console.error(err)
          }
        }
      )
  }
}
