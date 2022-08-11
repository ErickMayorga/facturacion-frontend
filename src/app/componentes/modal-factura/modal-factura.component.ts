import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FacturaDetalleInterface} from "../../servicios/http/factura-detalle/factura-detalle.interface";
import {FacturaPagoInterface} from "../../servicios/http/factura-pago/factura-pago.interface";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {FacturaDetalleService} from "../../servicios/http/factura-detalle/factura-detalle.service";
import {FacturaPagoService} from "../../servicios/http/factura-pago/factura-pago.service";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {facturaForm} from "./factura-form";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {FacturaCreateInterface} from "../../servicios/http/factura/factura-create.interface";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {ModalAgregarProductoComponent} from "../modal-agregar-producto/modal-agregar-producto.component";
import {ProductoInterface} from "../../servicios/http/producto/producto.interface";
import {ModalAgregarPagoComponent} from "../modal-agregar-pago/modal-agregar-pago.component";
import {TablaFacturaDetalleInterface} from "../../servicios/interfaces/tabla-factura-detalle.interface";
import {TablaFacturaPagoInterface} from "../../servicios/interfaces/tabla-factura-pago.interface";
import {ProductoService} from "../../servicios/http/producto/producto.service";
import {MetodoPagoService} from "../../servicios/http/metodo-de-pago/metodo-pago.service";
import {MetodoPagoInterface} from "../../servicios/http/metodo-de-pago/metodo-pago.interface";

@Component({
  selector: 'app-modal-factura',
  templateUrl: './modal-factura.component.html',
  styleUrls: ['./modal-factura.component.scss']
})
export class ModalFacturaComponent implements OnInit {

  formGroupFactura = new FormGroup({});
  fields = facturaForm

  // TABLA DETALLE
  theadsDetalle = [
    'Código Producto',
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

  // TABLA PAGOS
  theadsPagos = [
    'Descripción',
    'Valor total',
    'Valor Plazo',
    'Unidad de tiempo',
    'Acciones'
  ];

  // ENTRADAS
  usuarioActual: number = -1;
  operacion = ''
  facturaActual: number = -1

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

  detallesDB: FacturaDetalleInterface[] = []
  pagosDB: FacturaPagoInterface[] = []

  detallesTabla: TablaFacturaDetalleInterface[] = []
  pagosTabla: TablaFacturaPagoInterface[] = []

  //Cálculos
  numeroComprobante = ''
  claveAcceso = ''

  busquedaCliente: string = ''
  total_sin_iva = 0
  total_con_iva = 0
  total_descuento = 0
  total_sin_impuestos = 0

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalFacturaComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly facturaService: FacturaService,
               private readonly detalleFacturaService: FacturaDetalleService,
               private readonly pagoFacturaService: FacturaPagoService,
               private readonly empresaService: EmpresaService,
               private readonly clienteService: ClienteService,
               private readonly productoService: ProductoService,
               private readonly metodoPagoService: MetodoPagoService,
               private readonly direccionService: DireccionService,
               public dialog: MatDialog,) {
    this.usuarioActual = this.data.usuario
    this.operacion = this.data.operacion
    this.facturaActual = this.data.factura
    this.claveAcceso = (Math.floor(Math.random() * 9999999999) + 1000000000).toString()
    this.formGroupFactura =this.formBuilder.group(
      {
        fecha_emision: ['', [Validators.required]],
        guia_remision: ['', [Validators.maxLength(45)]],
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
      }
    )
    this.buscarEmpresa()
  }

  ngOnInit(): void {
    if(this.operacion === 'editar'){
      this.buscarFactura()
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
            this.numeroComprobante = this.empresaActual.codigo_establecimiento + '-' + this.empresaActual.codigo_punto_emision + '-' + this.data.next
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
  buscarFactura() {
    this.facturaService.get(this.facturaActual)
      .subscribe(
        {
          next: (datos) => {
            this.facturaDB = datos as FacturaInterface
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.cargarInformacion()
            // Consultar cliente
            this.clienteService.get(this.facturaDB.id_cliente)
              .subscribe(
                {
                  next: (datos) => {
                    this.clienteDB = datos as ClienteInterface
                    console.log(this.clienteDB.id_cliente)
                  },
                  error: (err) => {
                    console.error(err)
                  },
                  complete: () => {
                    this.cargarCliente()
                  }
                }
              )
            // Consultar detalle de factura
            this.detalleFacturaService.getDetalleFactura(this.facturaActual)
              .subscribe(
                {
                  next: (datos) => {
                    this.detallesDB = datos as FacturaDetalleInterface[]
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

            // Consultar pagos de factura
            this.pagoFacturaService.getPagosFactura(this.facturaActual)
              .subscribe(
                {
                  next: (datos) => {
                    this.pagosDB = datos as FacturaPagoInterface[]
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
    this.formGroupFactura.patchValue({
      fecha_emision: this.facturaDB.fecha_emision,
      guia_remision: this.facturaDB.guia_de_remision,
      numero_identificacion: this.clienteDB.numero_identificacion,
    });
  }

  cargarCliente(){
    this.busquedaCliente = this.clienteDB.numero_identificacion
  }

  cargarDetalle(){
    for(let detalle of this.detallesDB){
      this.productoService.get(detalle.id_producto)
        .subscribe(
          {
            next: (datos) => {
              const producto = datos as ProductoInterface
              const productoTabla: TablaFacturaDetalleInterface = {
                id_detalle: detalle.id_factura_detalle,
                id_producto: detalle.id_producto,
                codigo_principal: producto.codigo_principal,
                codigo_auxiliar: producto.codigo_auxiliar,
                nombre_producto: producto.nombre,
                precio_unitario: producto.valor_unitario,
                cantidad: detalle.cantidad,
                descuento: detalle.descuento,
                valor_ice: detalle.valor_ice,
                valor_irbpnr: detalle.valor_irbpnr,
                valor_total: detalle.total_producto,
                estado: 'u'
              }
              this.detallesTabla.push(productoTabla)
            },
            error: (err) => {
              console.error(err)
            }
          }
        )
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
                id_pago: pago.id_factura_pago,
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

  guardarFactura(){
    const fecha_emision =  this.formGroupFactura.get('fecha_emision')?.value
    const guia_remision =  this.formGroupFactura.get('guia_remision')?.value.trim()
    const numero_identificacion =  this.formGroupFactura.get('numero_identificacion')?.value.trim()

    let facturaObject: FacturaInterface | FacturaCreateInterface = {} as FacturaCreateInterface

    if(this.operacion === 'crear'){
      const facturaCreate = {
        id_empresa: this.empresaActual.id_empresa,
        numero_comprobante: this.numeroComprobante,
        id_cliente: this.clienteDB.id_cliente,
        fecha_emision: fecha_emision,
        clave_acceso: this.claveAcceso,
        guia_de_remision: guia_remision,
        propina: 0,
        importe_total: 0,
        moneda: 'USD',
        total_sin_impuestos: this.total_sin_impuestos,
        total_descuento: this.total_descuento,
        total_sin_iva: this.total_sin_iva,
        total_con_iva: this.total_con_iva
      } as FacturaCreateInterface
      facturaObject = facturaCreate
    }

    if(this.operacion === 'editar'){
      const facturaUpdate = {
        id_factura: this.facturaActual,
        id_empresa: this.empresaActual.id_empresa,
        numero_comprobante: this.numeroComprobante,
        id_cliente: this.clienteDB.id_cliente,
        fecha_emision: fecha_emision,
        clave_acceso: this.claveAcceso,
        guia_de_remision: guia_remision,
        propina: 0,
        importe_total: 0,
        moneda: 'USD',
        total_sin_impuestos: this.total_sin_impuestos,
        total_descuento: this.total_descuento,
        total_sin_iva: this.total_sin_iva,
        total_con_iva: this.total_con_iva
      } as FacturaInterface
      facturaObject = facturaUpdate
    }

    this.dialogRef.close({factura: facturaObject, detalles: this.detallesTabla, pagos: this.pagosTabla})
  }

  eliminarDetalle(detalle: TablaFacturaDetalleInterface) {
    if(this.operacion === 'crear'){
      this.detallesTabla = this.detallesTabla.filter(
        (item) => item.id_producto !== detalle.id_producto
      )
    }
    if(this.operacion === 'editar'){
      if(detalle.estado === 'u'){
        detalle.estado = 'd'
      }else{
        this.detallesTabla = this.detallesTabla.filter(
          (item) => item.id_producto !== detalle.id_producto
        )
      }
    }
  }

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

  buscarCliente(){
    this.clienteService.getCliente(this.usuarioActual,this.busquedaCliente) // TODO: Filtrar por solo clientes del usuario Actual
      .subscribe(
        {
          next: (datos) => {
            if(datos != null){
              this.clienteDB = datos as ClienteInterface
            }
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
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
          }
        }
      )
  }

  abrirModalAgregarProducto() {
    const referenciaDialogo = this.dialog.open(
      ModalAgregarProductoComponent,
      {
        disableClose: false,
        data: {
          usuario: this.usuarioActual,
          factura: this.facturaActual
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const detalleTabla = datos['detalle'] as TablaFacturaDetalleInterface
            this.detallesTabla.push(detalleTabla)
            this.actualizarTotales()
            this.actualizarDescuento()
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
            this.pagosTabla.push(pago)
          }
        }
      )
  }

  actualizarTotales() {
    this.total_sin_iva = 0
    this.total_sin_impuestos = 0
    for(let detalle of this.detallesTabla){
      this.total_sin_iva += (detalle.precio_unitario + detalle.valor_ice + detalle.valor_irbpnr) * detalle.cantidad
      this.total_sin_impuestos += detalle.precio_unitario * detalle.cantidad
    }
    this.total_con_iva = this.total_sin_iva * 1.12
  }

  actualizarDescuento() {
    this.total_descuento = 0
    for(let detalle of this.detallesTabla){
      this.total_descuento += detalle.descuento
    }
  }
}
