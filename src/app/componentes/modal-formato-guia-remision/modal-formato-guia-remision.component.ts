import {Component, Inject, OnInit} from '@angular/core';
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {GuiaRemisionInterface} from "../../servicios/http/guia-de-remision/guia-remision.interface";
import {TransportistaInterface} from "../../servicios/http/transportista/transportista.interface";
import {DestinatarioInterface} from "../../servicios/http/destinatario/destinatario.interface";
import {TablaDestinatarioInterface} from "../../servicios/interfaces/tabla-destinatario.interface";
import {GuiaRemisionService} from "../../servicios/http/guia-de-remision/guia-remision.service";
import {DestinatarioService} from "../../servicios/http/destinatario/destinatario.service";
import {TransportistaService} from "../../servicios/http/transportista/transportista.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-modal-formato-guia-remision',
  templateUrl: './modal-formato-guia-remision.component.html',
  styleUrls: ['./modal-formato-guia-remision.component.scss']
})
export class ModalFormatoGuiaRemisionComponent implements OnInit {

  // TABLA DETALLE
  theadsDestinatarios = [
    'Razón social',
    'ID del comprador',
    'Factura',
    'Fecha de emisión',
    'Motivo',
    //'Acciones'
  ];

  // Cargar informacion
  usuarioActual: number = -1
  idGuiaRemision: number = -1
  empresaActual: EmpresaInterface =  {} as EmpresaInterface
  direccionMatriz = ''
  direccionEstablecimiento = ''
  direccionTransportista = ''

  guiaRemisionDB: GuiaRemisionInterface = {} as GuiaRemisionInterface
  transportistaDB: TransportistaInterface = {} as TransportistaInterface

  destinatariosDB: DestinatarioInterface[] = []
  destinatariosTabla: TablaDestinatarioInterface[] = []

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalFormatoGuiaRemisionComponent>,
              private readonly guiaRemisionService: GuiaRemisionService,
              private readonly facturaService: FacturaService,
              private readonly destinatarioService: DestinatarioService,
              private readonly empresaService: EmpresaService,
              private readonly transportistaService: TransportistaService,
              private readonly clienteService: ClienteService,
              private readonly direccionService: DireccionService,
              public dialog: MatDialog,
              private datePipe: DatePipe) {
    this.usuarioActual = this.data.usuario
    this.empresaActual = this.data.empresa
    this.idGuiaRemision = this.data.guia_remision
    this.buscarEmpresa()
    this.buscarGuiaRemision()
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
  buscarGuiaRemision() {
    this.guiaRemisionService.get(this.idGuiaRemision)
      .subscribe(
        {
          next: (datos) => {
            this.guiaRemisionDB = datos as GuiaRemisionInterface

          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            // Consultar transportista
            this.transportistaService.get(this.guiaRemisionDB.id_transportista)
              .subscribe(
                {
                  next: (datos) => {
                    this.transportistaDB = datos as TransportistaInterface
                    //console.log(this.clienteDB.id_cliente)
                  },
                  error: (err) => {
                    console.error(err)
                  }
                }
              )
            // Consultar detalle de factura
            this.destinatarioService.getDestinatarios(this.idGuiaRemision)
              .subscribe(
                {
                  next: (datos) => {
                    this.destinatariosDB = datos as DestinatarioInterface[]
                    //this.detallesActualizar = this.detallesDB
                    //console.log(this.impuestosDB)
                  },
                  error: (err) => {
                    console.error(err)
                  },
                  complete: () => {
                    this.cargarDestinatarios()
                  }
                }
              )
          }
        }
      )
  }

  cargarDestinatarios(){
    for(let destinatario of this.destinatariosDB){
      this.facturaService.get(destinatario.id_factura)
        .subscribe(
          {
            next: (datos) => {
              const factura =  datos as FacturaInterface
              this.clienteService.get(destinatario.id_cliente)
                .subscribe(
                  {
                    next: (datos) => {
                      const cliente = datos as ClienteInterface
                      const destinatarioTabla: TablaDestinatarioInterface = {
                        id_guia_remision: this.idGuiaRemision,
                        id_destinatario: destinatario.id_destinatario,
                        id_cliente: destinatario.id_cliente,
                        id_factura: destinatario.id_factura,
                        razon_social: cliente.nombres_razon_social,
                        tipo_identificacion: cliente.tipo_identificacion,
                        numero_identificacion: cliente.numero_identificacion,
                        numero_factura: factura.numero_comprobante,
                        fecha_emision: this.datePipe.transform(factura.fecha_emision, 'dd-MM-yyyy'),
                        motivo: destinatario.motivo,
                        estado: 'u',
                      }
                      this.destinatariosTabla.push(destinatarioTabla)
                    },
                    error: (err) => {
                      console.error(err)
                    }
                  }
                )
            },
            error: (err) => {
              console.error(err)
            }
          }
        )
    }
  }

}
