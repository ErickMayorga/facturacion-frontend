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
import {NotaDebitoPagoInterface} from "../../servicios/http/nota-de-debito-pago/nota-debito-pago.interface";
import {NotaDebitoInterface} from "../../servicios/http/nota-de-debito/nota-debito.interface";
import {NotaDebitoDetalleInterface} from "../../servicios/http/nota-de-debito-detalle/nota-debito-detalle.interface";
import {TablaNotaDebitoDetalleInterface} from "../../servicios/interfaces/tabla-nota-debito-detalle.interface";
import {TablaNotaDebitoPagoInterface} from "../../servicios/interfaces/tabla-nota-debito-pago.interface";
import {NotaDebitoService} from "../../servicios/http/nota-de-debito/nota-debito.service";
import {NotaDebitoDetalleService} from "../../servicios/http/nota-de-debito-detalle/nota-debito-detalle.service";
import {NotaDebitoPagoService} from "../../servicios/http/nota-de-debito-pago/nota-debito-pago.service";
import {MetodoPagoService} from "../../servicios/http/metodo-de-pago/metodo-pago.service";
import {MetodoPagoInterface} from "../../servicios/http/metodo-de-pago/metodo-pago.interface";

@Component({
  selector: 'app-modal-formato-nota-debito',
  templateUrl: './modal-formato-nota-debito.component.html',
  styleUrls: ['./modal-formato-nota-debito.component.scss']
})
export class ModalFormatoNotaDebitoComponent implements OnInit {

  // TABLA DETALLE
  theadsDetalle = [
    'Razón de modificación',
    'Valor de modificación',
  ];

  // TABLA PAGOS
  theadsPagos = [
    'Descripción',
    'Valor del pago',
    'Valor del plazo',
    'Unidad de tiempo',
  ];

  // Cargar informacion
  usuarioActual: number = -1
  idNotaDebito: number = -1
  empresaActual: EmpresaInterface =  {} as EmpresaInterface
  direccionMatriz = ''
  direccionEstablecimiento = ''
  direccionCliente = ''

  notaDebitoDB: NotaDebitoInterface = {} as NotaDebitoInterface
  clienteDB: ClienteInterface = {} as ClienteInterface
  facturaDB: FacturaInterface =  {} as FacturaInterface
  detallesDB: NotaDebitoDetalleInterface[] = []
  pagosDB: NotaDebitoPagoInterface[] = []

  detallesTabla: TablaNotaDebitoDetalleInterface[] = []
  pagosTabla: TablaNotaDebitoPagoInterface[] = []

  //Cálculos
  fechaEmisionFactura: string | null = ''
  total_sin_modificacion = 0
  total_modificaciones = 0

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalFormatoNotaDebitoComponent>,
              private readonly notaDebitoService: NotaDebitoService,
              private readonly detalleNotaDebitoService: NotaDebitoDetalleService,
              private readonly empresaService: EmpresaService,
              private readonly clienteService: ClienteService,
              private readonly pagoNotaDebitoService: NotaDebitoPagoService,
              private readonly metodoPagoService: MetodoPagoService,
              private readonly direccionService: DireccionService,
              private readonly facturaService: FacturaService,
              public dialog: MatDialog,
              private datePipe: DatePipe) {
    this.usuarioActual = this.data.usuario
    this.empresaActual = this.data.empresa
    this.idNotaDebito = this.data.nota_debito
    this.buscarEmpresa()
    this.buscarNotaDebito()
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
  buscarNotaDebito() {
    this.notaDebitoService.get(this.idNotaDebito)
      .subscribe(
        {
          next: (datos) => {
            this.notaDebitoDB = datos as NotaDebitoInterface

          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            // Consultar factura
            this.facturaService.get(this.notaDebitoDB.id_factura)
              .subscribe(
                {
                  next: (datos) => {
                    this.facturaDB = datos as FacturaInterface
                    this.fechaEmisionFactura = this.datePipe.transform(this.facturaDB.fecha_emision, 'dd-MM-yyyy')
                    this.total_sin_modificacion = this.facturaDB.importe_total
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

            // Consultar detalle de nota de debito
            this.detalleNotaDebitoService.getDetalles(this.idNotaDebito)
              .subscribe(
                {
                  next: (datos) => {
                    this.detallesDB = datos as NotaDebitoDetalleInterface[]
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

            // Consultar pagos de nota de debito
            this.pagoNotaDebitoService.getPagosFactura(this.idNotaDebito)
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
      const detalleTabla: TablaNotaDebitoDetalleInterface = {
        id_nota_debito: this.idNotaDebito,
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
              const pagoTabla: TablaNotaDebitoPagoInterface = {
                id_nota_debito: this.idNotaDebito,
                id_pago: pago.id_nota_de_debito_pago,
                id_metodo_pago: metodo_pago.id_metodo_de_pago,
                nombre_metodo: metodo_pago.nombre_metodo_pago,
                valor: pago.valor_pago,
                plazo: pago.plazo,
                unidad_tiempo: pago.medida_tiempo,
                estado: 'u',
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

  actualizarTotalModificado() {
    this.total_modificaciones = 0
    for(let detalle of this.detallesTabla){
      if(detalle.estado != 'd'){
        this.total_modificaciones += detalle.valor_modificacion
      }
    }
  }

}
