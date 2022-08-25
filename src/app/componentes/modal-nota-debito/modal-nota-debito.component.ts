import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {DatePipe} from "@angular/common";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {notaDebitoForm} from "./nota-debito-form";
import {NotaDebitoInterface} from "../../servicios/http/nota-de-debito/nota-debito.interface";
import {TablaFacturaPagoInterface} from "../../servicios/interfaces/tabla-factura-pago.interface";
import {NotaDebitoDetalleInterface} from "../../servicios/http/nota-de-debito-detalle/nota-debito-detalle.interface";
import {TablaNotaDebitoDetalleInterface} from "../../servicios/interfaces/tabla-nota-debito-detalle.interface";
import {NotaDebitoService} from "../../servicios/http/nota-de-debito/nota-debito.service";
import {NotaDebitoDetalleService} from "../../servicios/http/nota-de-debito-detalle/nota-debito-detalle.service";
import {NotaDebitoPagoService} from "../../servicios/http/nota-de-debito-pago/nota-debito-pago.service";
import {NotaDebitoPagoInterface} from "../../servicios/http/nota-de-debito-pago/nota-debito-pago.interface";
import {MetodoPagoInterface} from "../../servicios/http/metodo-de-pago/metodo-pago.interface";
import {MetodoPagoService} from "../../servicios/http/metodo-de-pago/metodo-pago.service";
import {NotaDebitoCreateInterface} from "../../servicios/http/nota-de-debito/nota-debito-create.interface";
import {ModalAgregarPagoComponent} from "../modal-agregar-pago/modal-agregar-pago.component";
import {ModalAgregarModificacionComponent} from "../modal-agregar-modificacion/modal-agregar-modificacion.component";

@Component({
  selector: 'app-modal-nota-debito',
  templateUrl: './modal-nota-debito.component.html',
  styleUrls: ['./modal-nota-debito.component.scss']
})
export class ModalNotaDebitoComponent implements OnInit {

  formGroupNotaDebito = new FormGroup({});
  fields = notaDebitoForm
  tituloModal = ''

  // TABLA DETALLE
  theadsDetalle = [
    'Razón de modificación',
    'Valor de la modificación',
    'Acciones'
  ];

  // TABLA PAGOS
  theadsPagos = [
    'Descripción',
    'Valor del pago',
    'Valor del plazo',
    'Unidad de tiempo',
    'Acciones'
  ];

  // ENTRADAS
  usuarioActual: number = -1;
  operacion = ''
  notaDebitoActual: number = -1

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

  notaDebitoDB: NotaDebitoInterface = {} as NotaDebitoInterface

  detallesDB: NotaDebitoDetalleInterface[] = []
  pagosDB: NotaDebitoPagoInterface[] = []

  detallesTabla: TablaNotaDebitoDetalleInterface[] = []
  pagosTabla: TablaFacturaPagoInterface[] = []

  //Cálculos
  numeroComprobante = ''
  claveAcceso = ''
  fechaEmisionNotaDebito: string | null  = ''
  fechaEmisionFactura: string | null = ''

  busquedaCliente: string = ''
  busquedaFactura: string = ''

  total_sin_modificacion = 0
  total_modificaciones = 0

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalNotaDebitoComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly notaDebitoService: NotaDebitoService,
               private readonly detalleNotaDebitoService: NotaDebitoDetalleService,
               private readonly empresaService: EmpresaService,
               private readonly clienteService: ClienteService,
               private readonly pagoNotaDebitoService: NotaDebitoPagoService,
               private readonly direccionService: DireccionService,
               private readonly facturaService: FacturaService,
               private readonly metodoPagoService: MetodoPagoService,
               public dialog: MatDialog,
               private datePipe: DatePipe) {
    const today = new Date()
    this.fechaEmisionNotaDebito = this.datePipe.transform(today, 'dd-MM-yyyy')
    this.usuarioActual = this.data.usuario
    this.operacion = this.data.operacion
    this.notaDebitoActual = this.data.nota_debito
    this.claveAcceso = (Math.floor(Math.random() * 9999999999) + 1000000000).toString()
    this.formGroupNotaDebito =this.formBuilder.group(
      {
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
        numero_factura: ['', [Validators.required]]
      }
    )
    this.buscarEmpresa()
  }

  ngOnInit(): void {
    if(this.operacion === 'editar'){
      this.tituloModal = 'Actualización de Nota de débito'
      this.buscarNotaDebito()
    }else{
      this.tituloModal = 'Registro de Nota de débito'
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
  buscarNotaDebito() {
    this.notaDebitoService.get(this.notaDebitoActual)
      .subscribe(
        {
          next: (datos) => {
            this.notaDebitoDB = datos as NotaDebitoInterface
            this.fechaEmisionNotaDebito = this.datePipe.transform(this.notaDebitoDB.fecha_emision, 'dd-MM-yyyy')
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.facturaService.get(this.notaDebitoDB.id_factura)
              .subscribe(
                {
                  next: (datos) => {
                    this.facturaDB = datos as FacturaInterface
                    this.fechaEmisionFactura = this.datePipe.transform(this.facturaDB.fecha_emision, 'dd-MM-yyyy')
                    this.busquedaFactura =  this.facturaDB.numero_comprobante
                    this.total_sin_modificacion = this.facturaDB.importe_total
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
            this.detalleNotaDebitoService.getDetalles(this.notaDebitoActual)
              .subscribe(
                {
                  next: (datos) => {
                    this.detallesDB = datos as NotaDebitoDetalleInterface[]
                    //this.detallesActualizar = this.detallesDB
                    console.log(this.detallesDB)
                  },
                  error: (err) => {
                    console.error(err)
                  },
                  complete: () => {
                    this.cargarDetalle()
                  }
                }
              )

            // Consultar pagos de factura
            this.pagoNotaDebitoService.getPagosFactura(this.notaDebitoActual)
              .subscribe(
                {
                  next: (datos) => {
                    this.pagosDB = datos as NotaDebitoPagoInterface[]
                    //this.pagosActualizar = this.pagosDB
                    //console.log(this.impuestosDB)
                  },
                  error: (err) => {
                    console.error(err)
                  },
                  complete: () => {
                    this.cargarPagos()
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
            this.claveAcceso = this.notaDebitoDB.clave_acceso
            this.numeroComprobante = this.notaDebitoDB.numero_comprobante
            this.formGroupNotaDebito.patchValue({
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
      const detalleTabla: TablaNotaDebitoDetalleInterface = {
        id_nota_debito: this.notaDebitoActual,
        id_detalle: detalle.id_nota_de_debito_detalle,
        razon_modificacion: detalle.razon_modificacion,
        valor_modificacion: detalle.valor_modificacion,
        estado: 'u',
      }
      this.detallesTabla.push(detalleTabla)
      this.actualizarTotalModificado()
    }
  }

  cargarPagos(){
    for(let pago of this.pagosDB){
      this.metodoPagoService.get(pago.id_metodo_de_pago)
        .subscribe(
          {
            next: (datos) => {
              const metodo_pago = datos as MetodoPagoInterface
              const pagoTabla: TablaFacturaPagoInterface = {
                id_factura: this.notaDebitoActual,
                id_pago: pago.id_nota_de_debito_pago,
                id_metodo_pago: metodo_pago.id_metodo_de_pago,
                nombre_metodo: metodo_pago.nombre_metodo_pago,
                valor: pago.valor_pago,
                plazo: pago.plazo,
                unidad_tiempo: pago.medida_tiempo,
                estado: 'u'
              }
              this.pagosTabla.push(pagoTabla)
            },
            error: (err) => {
              console.error(err)
            }
          }
        )
    }
  }

  // Enviar datos para crear o actualizar la nota de débito
  guardarNotaDebito(){
    let notaDebitoObject: NotaDebitoInterface | NotaDebitoCreateInterface = {} as NotaDebitoCreateInterface

    if(this.operacion === 'crear'){
      notaDebitoObject = {
        id_factura: this.facturaDB.id_factura,
        numero_comprobante: this.numeroComprobante,
        fecha_emision: new Date(),
        clave_acceso: this.claveAcceso,
        total_sin_modificacion: this.total_sin_modificacion,
        total_con_modificacion: this.total_sin_modificacion + this.total_modificaciones,
        habilitado: true,
        id_empresa: this.empresaActual.id_empresa,
      } as NotaDebitoCreateInterface
    }

    if(this.operacion === 'editar'){
      notaDebitoObject = {
        id_nota_de_debito: this.notaDebitoActual,
        id_factura: this.facturaDB.id_factura,
        numero_comprobante: this.numeroComprobante,
        fecha_emision: this.notaDebitoDB.fecha_emision,
        clave_acceso: this.claveAcceso,
        total_sin_modificacion: this.total_sin_modificacion,
        total_con_modificacion: this.total_sin_modificacion + this.total_modificaciones,
        habilitado: true,
        id_empresa: this.empresaActual.id_empresa,
      } as NotaDebitoInterface
    }

    this.dialogRef.close({nota_debito: notaDebitoObject, detalles: this.detallesTabla, pagos: this.pagosTabla})
  }

  // Consulta de información del cliente y factura
  buscarCliente(){
    this.formGroupNotaDebito.patchValue(
      {
        numero_factura: ''
      }
    )
    this.facturaDB = {} as FacturaInterface
    this.facturasBuscadas = []
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
  abrirModalAgregarModificacion() {
    const referenciaDialogo = this.dialog.open(
      ModalAgregarModificacionComponent,
      {
        disableClose: false,
        data: {
          usuario: this.usuarioActual,
          nota_debito: this.notaDebitoActual,
          factura: this.facturaDB
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const detalleTabla = datos['detalle'] as TablaNotaDebitoDetalleInterface
            detalleTabla.id_nota_debito = this.notaDebitoActual

            const detallesRepetidos = this.detallesTabla.filter(
              (item) => item.razon_modificacion === detalleTabla.razon_modificacion
            )
            if(detallesRepetidos.length === 0){
              this.detallesTabla.push(detalleTabla)
              this.actualizarTotalModificado()
            }

            //this.actualizarDescuento()
          }
        }
      )
  }

  abrirModalAgregarPago() {
    const referenciaDialogo = this.dialog.open(
      ModalAgregarPagoComponent,
      {
        disableClose: false,
        data: {

        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const pago = datos['pago'] as TablaFacturaPagoInterface
            pago.id_factura = this.notaDebitoActual

            const pagosRepetidos = this.pagosTabla.filter(
              (item) => item.id_metodo_pago === pago.id_metodo_pago
            )
            if(pagosRepetidos.length === 0){
              this.pagosTabla.push(pago)
            }
          }
        }
      )
  }

  actualizarTotalModificado() {
    this.total_modificaciones = 0
    for(let detalle of this.detallesTabla){
      if(detalle.estado != 'd'){
        this.total_modificaciones += detalle.valor_modificacion
      }
    }
  }

  // Eliminar un detalle de la lista
  eliminarDetalle(detalle: TablaNotaDebitoDetalleInterface) {
    //console.log('Antes: ', this.detallesTabla)
    if(this.operacion === 'crear'){
      this.detallesTabla = this.detallesTabla.filter(
        (item) => item.razon_modificacion !== detalle.razon_modificacion
      )
      //console.log('Despues: ', this.detallesTabla)
    }
    if(this.operacion === 'editar'){
      if(detalle.estado === 'u'){
        detalle.estado = 'd'
      }else{
        this.detallesTabla = this.detallesTabla.filter(
          (item) => item.razon_modificacion.trim() !== detalle.razon_modificacion.trim()
        )
      }
      //console.log('Despues: ', this.detallesTabla)
    }
    this.actualizarTotalModificado()
    //this.actualizarDescuento()
  }

  // Eliminar un pago de la lista
  eliminarPago(pago: TablaFacturaPagoInterface) {
    if(this.operacion === 'crear'){
      this.pagosTabla = this.pagosTabla.filter(
        (item) => item.id_metodo_pago !== pago.id_metodo_pago
      )
    }
    if(this.operacion === 'editar'){
      if(pago.estado === 'u'){
        pago.estado = 'd'
      }else{
        this.pagosTabla = this.pagosTabla.filter(
          (item) => item.id_metodo_pago !== pago.id_metodo_pago
        )
      }
    }
  }

  buscarFactura() {
    const idFactura = Number.parseInt(this.formGroupNotaDebito.get('numero_factura')?.value)
    this.facturaService.get(idFactura)
      .subscribe(
        {
          next: datos => {
            this.facturaDB = datos as FacturaInterface
            this.fechaEmisionFactura = this.datePipe.transform(this.facturaDB.fecha_emision, 'dd-MM-yyyy')
            this.busquedaFactura = this.facturaDB.numero_comprobante
            this.total_sin_modificacion = this.facturaDB.importe_total
          },
          error: err => {
            console.error(err)
          }
        }
      )
  }

}
