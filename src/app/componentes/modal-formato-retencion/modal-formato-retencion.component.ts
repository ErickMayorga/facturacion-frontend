import {Component, Inject, OnInit} from '@angular/core';
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {ImpuestoService} from "../../servicios/http/impuesto/impuesto.service";
import {RetencionService} from "../../servicios/http/comprobante-de-retencion/retencion.service";
import {RetencionDetalleService} from "../../servicios/http/comprobante-de-retencion-detalle/retencion-detalle.service";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {RetencionInterface} from "../../servicios/http/comprobante-de-retencion/retencion.interface";
import {RetencionDetalleInterface} from "../../servicios/http/comprobante-de-retencion-detalle/retencion-detalle.interface";
import {TablaRetencionDetalleInterface} from "../../servicios/interfaces/tabla-retencion-detalle.interface";
import {ImpuestoInterface} from "../../servicios/http/impuesto/impuesto.interface";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-modal-formato-retencion',
  templateUrl: './modal-formato-retencion.component.html',
  styleUrls: ['./modal-formato-retencion.component.scss']
})
export class ModalFormatoRetencionComponent implements OnInit {

  // TABLA DETALLE
  theadsDetalle = [
    'Código',
    'Descripción',
    'Base imponible',
    'Tarifa',
    'Total',
  ];

  // Cargar informacion
  usuarioActual: number = -1
  idRetencion: number = -1
  empresaActual: EmpresaInterface =  {} as EmpresaInterface
  direccionMatriz = ''
  direccionEstablecimiento = ''
  direccionCliente = ''

  retencionDB: RetencionInterface = {} as RetencionInterface
  clienteDB: ClienteInterface = {} as ClienteInterface
  facturaDB: FacturaInterface =  {} as FacturaInterface
  detallesDB: RetencionDetalleInterface[] = []

  detallesTabla: TablaRetencionDetalleInterface[] = []

  //Cálculos
  fechaEmisionFactura: string | null = ''
  total_retenido = 0

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalFormatoRetencionComponent>,
              private readonly retencionService: RetencionService,
              private readonly detalleRetencionService: RetencionDetalleService,
              private readonly empresaService: EmpresaService,
              private readonly clienteService: ClienteService,
              private readonly impuestoService: ImpuestoService,
              private readonly direccionService: DireccionService,
              private readonly facturaService: FacturaService,
              public dialog: MatDialog,
              private datePipe: DatePipe) {
    this.usuarioActual = this.data.usuario
    this.empresaActual = this.data.empresa
    this.idRetencion = this.data.retencion
    this.buscarEmpresa()
    this.buscarRetencion()
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
  buscarRetencion() {
    this.retencionService.get(this.idRetencion)
      .subscribe(
        {
          next: (datos) => {
            this.retencionDB = datos as RetencionInterface

          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            // Consultar factura
            this.facturaService.get(this.retencionDB.id_factura)
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
            this.detalleRetencionService.getDetalles(this.idRetencion)
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
      this.impuestoService.get(detalle.id_impuesto)
        .subscribe(
          {
            next: (datos) => {
              const impuesto = datos as ImpuestoInterface
              const impuestoTabla: TablaRetencionDetalleInterface = {
                id_retencion: this.idRetencion,
                id_detalle: detalle.id_comprobante_de_retencion_detalle,
                id_impuesto: detalle.id_impuesto,
                codigo_impuesto: '0' + impuesto.id_impuesto,
                nombre_impuesto: impuesto.nombre_impuesto,
                base_imponible: detalle.base_imponible,
                tarifa: impuesto.valor_impuesto,
                valor_total: detalle.total,
                estado: 'u',
              }
              this.detallesTabla.push(impuestoTabla)
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
    this.total_retenido = 0
    for(let detalle of this.detallesTabla){
      if(detalle.estado != 'd'){
        this.total_retenido += detalle.base_imponible * detalle.tarifa
      }
    }
  }

}
