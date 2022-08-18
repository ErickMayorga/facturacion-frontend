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
import {ImpuestoInterface} from "../../servicios/http/impuesto/impuesto.interface";
import {RetencionInterface} from "../../servicios/http/comprobante-de-retencion/retencion.interface";
import {ImpuestoService} from "../../servicios/http/impuesto/impuesto.service";
import {ProductoImpuestoService} from "../../servicios/http/producto_impuesto/producto-impuesto.service";
import {RetencionService} from "../../servicios/http/comprobante-de-retencion/retencion.service";
import {RetencionDetalleService} from "../../servicios/http/comprobante-de-retencion-detalle/retencion-detalle.service";
import {ProductoImpuestoInterface} from "../../servicios/http/producto_impuesto/producto-impuesto.interface";
import {ImpuestoFacturaInterface} from "../../servicios/interfaces/impuesto-factura.interface";
import {RetencionDetalleInterface} from "../../servicios/http/comprobante-de-retencion-detalle/retencion-detalle.interface";
import {RetencionFacturaInterface} from "../../servicios/interfaces/retencion-factura.interface";

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
    'Valor del pago',
    'Valor del plazo',
    'Unidad de tiempo',
  ];

  // TABLA IMPUESTOS
  theadsImpuestos = [
    'Producto',
    'Impuesto',
    'Base imponible',
    'Tarifa',
    'Valor total'
  ];

  impuestosTabla: ImpuestoFacturaInterface[] = []

  // TABLA RETENCIONES
  theadsRetenciones = [
    'Comprobante de retención',
    'Nombre impuesto',
    'Base imponible',
    'Tarifa',
    'Valor retenido'
  ];

  retencionesTabla: RetencionFacturaInterface[] = []

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
  moneda = ''
  propina = 0
  total_sin_iva = 0
  total_iva = 0
  total_ice = 0
  total_irbpnr = 0
  total_descuento = 0
  total_sin_impuestos = 0
  importe_total = 0

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
              private readonly impuestoService: ImpuestoService,
              private readonly productoImpuestoService: ProductoImpuestoService,
              private readonly retencionService: RetencionService,
              private readonly detalleRetencionService: RetencionDetalleService,
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
            this.propina = this.facturaDB.propina
            this.moneda = this.facturaDB.moneda
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.cargarRetenciones()
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
              this.cargarImpuestos()
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
    this.importe_total = this.total_sin_iva + this.total_iva + this.propina - this.total_descuento
  }

  cargarImpuestos() {
    for(let producto of this.detallesTabla){
      this.productoImpuestoService.getImpuestosPorProducto(producto.id_producto)
        .subscribe(
          {
            next: (datos) => {
              const productoImpuestos = datos as ProductoImpuestoInterface[]
              for(let productoImpuesto of productoImpuestos){
                let impuestoFactura: ImpuestoFacturaInterface = {} as ImpuestoFacturaInterface
                // Consultar impuesto
                this.impuestoService.get(productoImpuesto.id_impuesto)
                  .subscribe(
                    {
                      next: (datos) => {
                        const impuesto = datos as ImpuestoInterface
                        impuestoFactura = {
                          id_producto: producto.id_producto,
                          id_impuesto: productoImpuesto.id_impuesto,
                          nombre_producto: producto.nombre_producto,
                          nombre_impuesto: impuesto.nombre_impuesto,
                          base_imponible: producto.precio_unitario,
                          tarifa: impuesto.valor_impuesto,
                          tipo_tarifa: impuesto.tipo_tarifa,
                          total: 0,
                        }

                        if(impuestoFactura.tipo_tarifa === 'específica'){
                          impuestoFactura.total = impuestoFactura.base_imponible + impuestoFactura.tarifa
                        }else{
                          impuestoFactura.total = impuestoFactura.base_imponible * impuestoFactura.tarifa
                        }

                        this.impuestosTabla.push(impuestoFactura)
                      },
                      error: (err) => {
                        console.error(err)
                      }
                    }
                  )
              }
            },
            error: err => {
              console.error(err)
            }
          }
        )
    }
  }

  cargarRetenciones() {
    this.retencionService.getComprobantesPorFactura(this.idFactura)
      .subscribe(
        {
          next: (datos) => {
            const retenciones = datos as RetencionInterface[]
            for(let retencion of retenciones){
              this.detalleRetencionService.getDetalles(retencion.id_comprobante_de_retencion)
                .subscribe(
                  {
                    next: (datos) => {
                      const detallesRetencion =  datos as RetencionDetalleInterface[]
                      for(let detalleRetencion of detallesRetencion){
                        this.impuestoService.get(detalleRetencion.id_impuesto)
                          .subscribe(
                            {
                              next: (datos) => {
                                const impuesto = datos as ImpuestoInterface
                                const retencionFactura: RetencionFacturaInterface = {
                                  id_retencion: retencion.id_comprobante_de_retencion,
                                  id_detalle: detalleRetencion.id_comprobante_de_retencion_detalle,
                                  numero_retencion: retencion.numero_comprobante,
                                  nombre_impuesto: impuesto.nombre_impuesto,
                                  base_imponible: detalleRetencion.base_imponible,
                                  tarifa: impuesto.valor_impuesto,
                                  valor_retenido: detalleRetencion.base_imponible * impuesto.valor_impuesto,
                                  habilitado: retencion.habilitado
                                } as RetencionFacturaInterface
                                this.retencionesTabla.push(retencionFactura)
                              },
                              error: (err) => {
                                console.error(err)
                              }
                            }
                          )
                      }
                    },
                    error: (err) => {
                      console.error(err)
                    }
                  }
                )
            }
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
  }
}
