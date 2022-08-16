import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {TablaDestinatarioInterface} from "../../servicios/interfaces/tabla-destinatario.interface";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-modal-agregar-destinatario',
  templateUrl: './modal-agregar-destinatario.component.html',
  styleUrls: ['./modal-agregar-destinatario.component.scss']
})
export class ModalAgregarDestinatarioComponent implements OnInit {

  busquedaCliente = ''
  busquedaFactura = '';

  theads = [
    'Número de factura',
    'Fecha de emisión',
    'Importe Total',
    'Acciones'
  ];

  facturasDB: FacturaInterface[] = []
  facturasBuscadas: FacturaInterface[] = []
  clienteDB: ClienteInterface = {} as ClienteInterface

  usuarioActual: number = -1;
  guiaRemisionActual: number = -1;
  idEmpresa: number = -1

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalAgregarDestinatarioComponent>,
              private readonly facturaService: FacturaService,
              private readonly clienteService: ClienteService,
              public dialog: MatDialog,
              private datePipe: DatePipe) {
    this.usuarioActual = this.data.usuario
    this.guiaRemisionActual = this.data.factura
    this.idEmpresa = this.data.empresa
    this.buscarFacturas()
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close()
  }

  buscarFacturas() {
    this.facturaService.getFacturas(this.idEmpresa)
      .subscribe(
        {
          next: (datos) => {
            this.facturasDB = datos as FacturaInterface[]
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.facturasBuscadas = this.facturasDB
          }
        }
      )
  }

  filtrarFacturas() {
    if(this.busquedaCliente === ''){
      //Buscar facturas
      const facturasFiltradas = []
      for(let factura of this.facturasDB){
        if(factura.numero_comprobante.includes(this.busquedaFactura)){
          facturasFiltradas.push(factura)
        }
      }
      this.facturasBuscadas = facturasFiltradas
    }else{
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
                this.facturaService.getFacturasPorCliente(this.idEmpresa, this.clienteDB.id_cliente)
                  .subscribe(
                    {
                      next: (datos) => {
                        this.facturasBuscadas = datos as FacturaInterface[]
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
  }


  agregarFactura(factura: FacturaInterface) {
    let clienteSeleccionado: ClienteInterface = {} as ClienteInterface
    this.clienteService.get(factura.id_cliente)
      .subscribe(
        {
          next: (datos) => {
            clienteSeleccionado = datos as ClienteInterface
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            if(this.clienteDB != null){
              const destinatario: TablaDestinatarioInterface = {
                id_guia_remision: NaN,
                id_destinatario: NaN,
                id_cliente: factura.id_cliente,
                id_factura: factura.id_factura,
                razon_social: clienteSeleccionado.nombres_razon_social,
                tipo_identificacion: clienteSeleccionado.tipo_identificacion,
                numero_identificacion: clienteSeleccionado.numero_identificacion,
                numero_factura: factura.numero_comprobante,
                fecha_emision: this.datePipe.transform(factura.fecha_emision, 'dd-MM-yyyy'),
                estado: 'c',
              }
              this.dialogRef.close({destinatario: destinatario})
            }
          }
        }
      )
  }

}
