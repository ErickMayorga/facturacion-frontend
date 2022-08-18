import {Component, Inject, OnInit} from '@angular/core';
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
import {NotaCreditoInterface} from "../../servicios/http/nota-de-credito/nota-credito.interface";
import {NotaCreditoDetalleInterface} from "../../servicios/http/nota-de-credito-detalle/nota-credito-detalle.interface";
import {TablaNotaCreditoDetalleInterface} from "../../servicios/interfaces/tabla-nota-credito-detalle.interface";
import {NotaCreditoService} from "../../servicios/http/nota-de-credito/nota-credito.service";
import {NotaCreditoDetalleService} from "../../servicios/http/nota-de-credito-detalle/nota-credito-detalle.service";
import {ProductoService} from "../../servicios/http/producto/producto.service";
import {ProductoInterface} from "../../servicios/http/producto/producto.interface";

@Component({
  selector: 'app-modal-formato-nota-credito',
  templateUrl: './modal-formato-nota-credito.component.html',
  styleUrls: ['./modal-formato-nota-credito.component.scss']
})
export class ModalFormatoNotaCreditoComponent implements OnInit {

  // TABLA DETALLE
  theadsDetalle = [
    'Código Producto',
    'Descripción',
    'Precio Unitario',
    'Cantidad',
    'Descuento',
    'Total Impuestos',
    'Valor Total',
  ];

  // Cargar informacion
  usuarioActual: number = -1
  idNotaCredito: number = -1
  empresaActual: EmpresaInterface =  {} as EmpresaInterface
  direccionMatriz = ''
  direccionEstablecimiento = ''
  direccionCliente = ''

  notaCreditoDB: NotaCreditoInterface = {} as NotaCreditoInterface
  clienteDB: ClienteInterface = {} as ClienteInterface
  facturaDB: FacturaInterface =  {} as FacturaInterface
  detallesDB: NotaCreditoDetalleInterface[] = []

  detallesTabla: TablaNotaCreditoDetalleInterface[] = []

  //Cálculos
  fechaEmisionFactura: string | null = ''
  total_sin_iva = 0
  total_iva = 0
  total_ice = 0
  total_irbpnr = 0
  total_descuento = 0
  total_sin_impuestos = 0
  importe_total = 0

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalFormatoNotaCreditoComponent>,
              private readonly notaCreditoService: NotaCreditoService,
              private readonly detalleNotaCreditoService: NotaCreditoDetalleService,
              private readonly empresaService: EmpresaService,
              private readonly clienteService: ClienteService,
              private readonly productoService: ProductoService,
              private readonly direccionService: DireccionService,
              private readonly facturaService: FacturaService,
              public dialog: MatDialog,
              private datePipe: DatePipe) {
    this.usuarioActual = this.data.usuario
    this.empresaActual = this.data.empresa
    this.idNotaCredito = this.data.nota_credito
    this.buscarEmpresa()
    this.buscarNotaCredito()
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
  buscarNotaCredito() {
    this.notaCreditoService.get(this.idNotaCredito)
      .subscribe(
        {
          next: (datos) => {
            this.notaCreditoDB = datos as NotaCreditoInterface

          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            // Consultar factura
            this.facturaService.get(this.notaCreditoDB.id_factura)
              .subscribe(
                {
                  next: (datos) => {
                    this.facturaDB = datos as FacturaInterface
                    this.fechaEmisionFactura = this.datePipe.transform(this.facturaDB.fecha_emision, 'dd-MM-yyyy')
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
                  },
                  error: (err) => {
                    console.error(err)
                  }
                }
              )

            // Consultar detalle de factura
            this.detalleNotaCreditoService.getDetalles(this.idNotaCredito)
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
              const detalleTabla: TablaNotaCreditoDetalleInterface = {
                id_nota_credito: this.idNotaCredito,
                id_detalle: detalle.id_nota_de_credito_detalle,
                id_producto: producto.id_producto,
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
                estado: 'u',
              }
              this.detallesTabla.push(detalleTabla)
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

}
