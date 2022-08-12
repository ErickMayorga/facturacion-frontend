import {Component, Inject, OnInit} from '@angular/core';
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {FacturaDetalleInterface} from "../../servicios/http/factura-detalle/factura-detalle.interface";
import {FacturaPagoInterface} from "../../servicios/http/factura-pago/factura-pago.interface";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {ProductoInterface} from "../../servicios/http/producto/producto.interface";
import {TablaFacturaDetalleInterface} from "../../servicios/interfaces/tabla-factura-detalle.interface";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {FacturaDetalleService} from "../../servicios/http/factura-detalle/factura-detalle.service";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {ProductoService} from "../../servicios/http/producto/producto.service";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {FacturaPagoService} from "../../servicios/http/factura-pago/factura-pago.service";
import {MetodoPagoService} from "../../servicios/http/metodo-de-pago/metodo-pago.service";
import {MetodoPagoInterface} from "../../servicios/http/metodo-de-pago/metodo-pago.interface";
import {TablaFacturaPagoInterface} from "../../servicios/interfaces/tabla-factura-pago.interface";
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {ImpuestoInterface} from "../../servicios/http/impuesto/impuesto.interface";

@Component({
  selector: 'app-modal-formato-factura',
  templateUrl: './modal-formato-factura.component.html',
  styleUrls: ['./modal-formato-factura.component.scss']
})
export class ModalFormatoFacturaComponent implements OnInit {

  // TABLA DETALLE
  theadsDetalle = [
    'Código Producto',
    'Descripción',
    'Precio Unitario',
    'Cantidad',
    'Descuento',
    'Total Impuestos',
    'Valor Total',
    //'Acciones'
  ];

  // TABLA PAGOS
  theadsPagos = [
    'Descripción',
    'Valor total',
    'Valor Plazo',
    'Unidad de tiempo',
  ];

  // TABLA IMPUESTOS
  theadsImpuestos = [
    'Código',
    'Descripción',
    'Base imponible',
    'Tarifa',
    'Valor total'
  ];

  impuestosTabla: [] = []

  // TABLA RETENCIONES
  theadsRetenciones = [
    'Código',
    'Nombre impuesto',
    'Base imponible',
    'Tarifa',
    'Valor retenido'
  ];

  retencionesTabla: [] = []

  actions: ActionButtonInterface[] = [
    {
      name: 'impuestos',
      icon: 'paid'
    },
    {
      name: 'info',
      icon: 'info'
    },
  ]

  // Cargar informacion
  usuarioActual: number = -1
  idFactura: number = -1
  empresaActual: EmpresaInterface =  {} as EmpresaInterface
  direccionMatriz = ''
  direccionEstablecimiento = ''
  direccionCliente = ''

  facturaDB: FacturaInterface = {} as FacturaInterface
  clienteDB: ClienteInterface = {} as ClienteInterface
  detallesDB: FacturaDetalleInterface[] = []
  pagosDB: FacturaPagoInterface[] = []

  detallesTabla: TablaFacturaDetalleInterface[] = []
  pagosTabla: TablaFacturaPagoInterface[] = []

  //Cálculos
  total_sin_iva = 0
  total_con_iva = 0
  total_descuento = 0
  total_sin_impuestos = 0

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalFormatoFacturaComponent>,
              private readonly facturaService: FacturaService,
              private readonly detalleFacturaService: FacturaDetalleService,
              private readonly pagoFacturaService: FacturaPagoService,
              private readonly metodoPagoService: MetodoPagoService,
              private readonly empresaService: EmpresaService,
              private readonly clienteService: ClienteService,
              private readonly productoService: ProductoService,
              private readonly direccionService: DireccionService,
              public dialog: MatDialog,) {
    this.usuarioActual = this.data.usuario
    this.empresaActual = this.data.empresa
    this.idFactura = this.data.factura
    this.buscarEmpresa()
    this.buscarFactura()
  }

  ngOnInit(): void {
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
    this.facturaService.get(this.idFactura)
      .subscribe(
        {
          next: (datos) => {
            this.facturaDB = datos as FacturaInterface
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
            // Consultar detalle de factura
            this.detalleFacturaService.getDetalleFactura(this.idFactura)
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
            this.pagoFacturaService.getPagosFactura(this.idFactura)
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
                id_factura: this.idFactura,
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
            },
            complete: () => {
              this.actualizarTotales()
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
                id_factura: this.idFactura,
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

  actualizarTotales() {
    this.total_sin_iva = 0
    this.total_sin_impuestos = 0
    for(let detalle of this.detallesTabla){
      if(detalle.estado != 'd'){
        this.total_sin_iva += (detalle.precio_unitario + detalle.valor_ice + detalle.valor_irbpnr) * detalle.cantidad
        this.total_sin_impuestos += detalle.precio_unitario * detalle.cantidad
      }
    }
    this.actualizarDescuento()
    this.total_con_iva = (this.total_sin_iva * 1.12) - this.total_descuento
  }

  actualizarDescuento() {
    this.total_descuento = 0
    for(let detalle of this.detallesTabla){
      if(detalle.estado != 'd'){
        this.total_descuento += detalle.descuento
      }
    }
  }

  realizarAccion(name: string, id_factura_detalle: number) {

  }

  cargarImpuestos() {

  }

  cargarRetenciones() {

  }
}
