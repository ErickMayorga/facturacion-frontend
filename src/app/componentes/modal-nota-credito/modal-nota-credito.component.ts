import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {ProductoService} from "../../servicios/http/producto/producto.service";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DatePipe} from "@angular/common";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {ProductoInterface} from "../../servicios/http/producto/producto.interface";
import {NotaCreditoInterface} from "../../servicios/http/nota-de-credito/nota-credito.interface";
import {NotaCreditoDetalleInterface} from "../../servicios/http/nota-de-credito-detalle/nota-credito-detalle.interface";
import {NotaCreditoService} from "../../servicios/http/nota-de-credito/nota-credito.service";
import {NotaCreditoDetalleService} from "../../servicios/http/nota-de-credito-detalle/nota-credito-detalle.service";
import {NotaCreditoCreateInterface} from "../../servicios/http/nota-de-credito/nota-credito-create.interface";
import {TablaFacturaDetalleInterface} from "../../servicios/interfaces/tabla-factura-detalle.interface";
import {ModalAgregarProductoComponent} from "../modal-agregar-producto/modal-agregar-producto.component";
import {notaCreditoForm} from "./nota-credito-form";

@Component({
  selector: 'app-modal-nota-credito',
  templateUrl: './modal-nota-credito.component.html',
  styleUrls: ['./modal-nota-credito.component.scss']
})
export class ModalNotaCreditoComponent implements OnInit {

  formGroupNotaCredito = new FormGroup({});
  fields = notaCreditoForm
  tituloModal = ''

  // TABLA DETALLE
  theadsDetalle = [
    'Código Principal',
    'Código Auxiliar',
    'Descripción',
    'Precio Unitario',
    'Cantidad',
    'Descuento',
    'Valor ICE',
    'Valor IRBPNR',
    'Valor Total',
    'Acciones'
  ];

  // ENTRADAS
  usuarioActual: number = -1;
  operacion = ''
  notaCreditoActual: number = -1

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
  notaCreditoDB: NotaCreditoInterface = {} as NotaCreditoInterface
  facturaDB: FacturaInterface = {} as FacturaInterface
  facturasBuscadas: FacturaInterface[] = []

  detallesDB: NotaCreditoDetalleInterface[] = []

  detallesTabla: TablaFacturaDetalleInterface[] = []

  //Cálculos
  numeroComprobante = ''
  claveAcceso = ''
  fechaEmisionNotaCredito: string | null  = ''
  fechaEmisionFactura: string | null = ''

  busquedaCliente: string = ''
  busquedaFactura: string = ''
  moneda = ''
  total_sin_iva = 0
  total_iva = 0
  total_ice = 0
  total_irbpnr = 0
  total_descuento = 0
  total_sin_impuestos = 0
  importe_total = 0

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalNotaCreditoComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly notaCreditoService: NotaCreditoService,
               private readonly facturaService: FacturaService,
               private readonly detalleNotaCreditoService: NotaCreditoDetalleService,
               private readonly empresaService: EmpresaService,
               private readonly clienteService: ClienteService,
               private readonly productoService: ProductoService,
               private readonly direccionService: DireccionService,
               public dialog: MatDialog,
               private datePipe: DatePipe) {
    const today = new Date()
    this.fechaEmisionNotaCredito = this.datePipe.transform(today, 'dd-MM-yyyy')
    this.usuarioActual = this.data.usuario
    this.operacion = this.data.operacion
    this.notaCreditoActual = this.data.nota_credito
    this.claveAcceso = (Math.floor(Math.random() * 9999999999) + 1000000000).toString()
    this.formGroupNotaCredito =this.formBuilder.group(
      {
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
        numero_factura: ['', [Validators.required]],
        motivo: ['', [Validators.required, Validators.maxLength(45)]]
      }
    )
    this.buscarEmpresa()
  }

  ngOnInit(): void {
    if(this.operacion === 'editar'){
      this.tituloModal = 'Actualización de Nota de crédito'
      this.buscarNotaCredito()
    }else{
      this.tituloModal = 'Registro de Nota de crédito'
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
  buscarNotaCredito() {
    this.notaCreditoService.get(this.notaCreditoActual)
      .subscribe(
        {
          next: (datos) => {
            this.notaCreditoDB = datos as NotaCreditoInterface
            this.fechaEmisionNotaCredito = this.datePipe.transform(this.notaCreditoDB.fecha_emision, 'dd-MM-yyyy')
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.facturaService.get(this.notaCreditoDB.id_factura)
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
            this.detalleNotaCreditoService.getDetalles(this.notaCreditoActual)
              .subscribe(
                {
                  next: (datos) => {
                    this.detallesDB = datos as NotaCreditoDetalleInterface[]
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
            this.claveAcceso = this.notaCreditoDB.clave_acceso
            this.numeroComprobante = this.notaCreditoDB.numero_comprobante
            this.formGroupNotaCredito.patchValue({
              numero_identificacion: this.clienteDB.numero_identificacion,
              numero_factura: this.facturaDB.numero_comprobante,
              motivo: this.notaCreditoDB.motivo
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
      this.productoService.get(detalle.id_producto)
        .subscribe(
          {
            next: (datos) => {
              const producto = datos as ProductoInterface
              const productoTabla: TablaFacturaDetalleInterface = {
                id_factura: this.notaCreditoActual,
                id_detalle: detalle.id_nota_de_credito_detalle,
                id_producto: detalle.id_producto,
                codigo_principal: producto.codigo_principal,
                codigo_auxiliar: producto.codigo_auxiliar,
                nombre_producto: producto.nombre,
                precio_unitario: producto.valor_unitario,
                cantidad: detalle.cantidad,
                descuento: detalle.descuento,
                valor_iva: detalle.valor_iva,
                valor_ice: detalle.valor_ice,
                valor_irbpnr: detalle.valor_irbpnr,
                valor_total: detalle.total_producto,
                estado: 'u'
              }
              this.detallesTabla.push(productoTabla)
            },
            error: (err) => {
              console.error(err)
            },
            complete: () => {
              this.actualizarTotales()
              //this.actualizarDescuento()
            }
          }
        )
    }
  }

  // Enviar datos para crear o actualizar factura
  guardarNotaCredito(){
    const motivo = this.formGroupNotaCredito.get('motivo')?.value.trim()
    let notaCreditoObject: NotaCreditoInterface | NotaCreditoCreateInterface = {} as NotaCreditoCreateInterface

    if(this.operacion === 'crear'){
      notaCreditoObject = {
        id_empresa: this.empresaActual.id_empresa,
        id_factura: this.facturaDB.id_factura,
        numero_comprobante: this.numeroComprobante,
        fecha_emision: new Date(),
        clave_acceso: this.claveAcceso,
        motivo: motivo,
        importe_total: this.importe_total,
        total_sin_impuestos: this.total_sin_impuestos,
        total_descuentos: this.total_descuento,
        total_sin_iva: this.total_sin_iva,
        total_iva: this.total_iva,
        total_ice: this.total_ice,
        total_irbpnr: this.total_irbpnr,
        habilitado: true
      } as NotaCreditoCreateInterface
    }

    if(this.operacion === 'editar'){
      notaCreditoObject = {
        id_nota_de_credito: this.notaCreditoActual,
        id_factura:this.facturaDB.id_factura,
        id_empresa: this.empresaActual.id_empresa,
        numero_comprobante: this.numeroComprobante,
        fecha_emision: this.notaCreditoDB.fecha_emision,
        clave_acceso: this.claveAcceso,
        motivo: motivo,
        importe_total: this.importe_total,
        total_sin_impuestos: this.total_sin_impuestos,
        total_descuentos: this.total_descuento,
        total_sin_iva: this.total_sin_iva,
        total_iva: this.total_iva,
        total_ice: this.total_ice,
        total_irbpnr: this.total_irbpnr,
        habilitado: true
      } as NotaCreditoInterface
    }

    this.dialogRef.close({nota_credito: notaCreditoObject, detalles: this.detallesTabla})
  }

  // Consulta de información del cliente
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
  abrirModalAgregarProducto() {
    const referenciaDialogo = this.dialog.open(
      ModalAgregarProductoComponent,
      {
        disableClose: false,
        data: {
          usuario: this.usuarioActual,
          factura: this.notaCreditoActual
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const detalleTabla = datos['detalle'] as TablaFacturaDetalleInterface
            detalleTabla.id_factura = this.notaCreditoActual
            this.detallesTabla.push(detalleTabla)
            this.actualizarTotales()
            //this.actualizarDescuento()
          }
        }
      )
  }

  actualizarTotales() {
    this.total_sin_iva = 0
    this.total_sin_impuestos = 0
    this.total_iva = 0
    this.total_descuento = 0
    for(let detalle of this.detallesTabla){
      if(detalle.estado != 'd'){
        this.total_sin_iva += (detalle.precio_unitario + detalle.valor_ice + detalle.valor_irbpnr) * detalle.cantidad
        this.total_sin_impuestos += detalle.precio_unitario * detalle.cantidad
        this.total_iva += detalle.valor_iva * detalle.cantidad
        this.total_ice += detalle.valor_ice * detalle.cantidad
        this.total_irbpnr += detalle.valor_irbpnr * detalle.cantidad
        this.total_descuento += detalle.descuento
      }
    }
    this.importe_total = this.total_sin_iva + this.total_iva - this.total_descuento
  }

  // Eliminar un detalle de la lista
  eliminarDetalle(detalle: TablaFacturaDetalleInterface) {
    //console.log('Antes: ', this.detallesTabla)
    if(this.operacion === 'crear'){
      this.detallesTabla = this.detallesTabla.filter(
        (item) => item.id_producto !== detalle.id_producto
      )
      //console.log('Despues: ', this.detallesTabla)
    }
    if(this.operacion === 'editar'){
      if(detalle.estado === 'u'){
        detalle.estado = 'd'
      }else{
        this.detallesTabla = this.detallesTabla.filter(
          (item) => item.id_producto !== detalle.id_producto
        )
      }
      //console.log('Despues: ', this.detallesTabla)
    }
    this.actualizarTotales()
    //this.actualizarDescuento()
  }

  buscarFactura() {
    const idFactura = Number.parseInt(this.formGroupNotaCredito.get('numero_factura')?.value)
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
