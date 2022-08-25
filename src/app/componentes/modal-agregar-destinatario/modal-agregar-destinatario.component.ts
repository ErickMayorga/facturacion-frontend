import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {TablaDestinatarioInterface} from "../../servicios/interfaces/tabla-destinatario.interface";
import {DatePipe} from "@angular/common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {destinatarioForm} from "./destinatario-form";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";

@Component({
  selector: 'app-modal-agregar-destinatario',
  templateUrl: './modal-agregar-destinatario.component.html',
  styleUrls: ['./modal-agregar-destinatario.component.scss']
})
export class ModalAgregarDestinatarioComponent implements OnInit {

  formGroupDestinatario = new FormGroup({});
  fields = destinatarioForm

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

  direccionCliente = ''
  facturaDB: FacturaInterface = {} as FacturaInterface
  fechaEmisionFactura: string | null = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ModalAgregarDestinatarioComponent>,
              private readonly facturaService: FacturaService,
              private readonly clienteService: ClienteService,
              private readonly direccionService: DireccionService,
              private readonly formBuilder: FormBuilder,
              public dialog: MatDialog,
              private datePipe: DatePipe) {
    this.usuarioActual = this.data.usuario
    this.guiaRemisionActual = this.data.factura
    this.idEmpresa = this.data.empresa
    this.formGroupDestinatario =this.formBuilder.group(
      {
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
        numero_factura: ['', [Validators.required]],
        motivo: ['', [Validators.required,Validators.maxLength(45)]],
      }
    )
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close()
  }

  agregarFactura() {
    const motivo =  this.formGroupDestinatario.get('motivo')?.value.trim()

    const destinatario: TablaDestinatarioInterface = {
      id_guia_remision: NaN,
      id_destinatario: NaN,
      id_cliente: this.facturaDB.id_cliente,
      id_factura: this.facturaDB.id_factura,
      razon_social: this.clienteDB.nombres_razon_social,
      tipo_identificacion: this.clienteDB.tipo_identificacion,
      numero_identificacion: this.clienteDB.numero_identificacion,
      numero_factura: this.facturaDB.numero_comprobante,
      fecha_emision: this.datePipe.transform(this.facturaDB.fecha_emision, 'dd-MM-yyyy'),
      motivo: motivo,
      estado: 'c',
    }
    this.dialogRef.close({destinatario: destinatario})
  }

  // Consulta de información del cliente y factura
  buscarCliente(){
    this.formGroupDestinatario.patchValue(
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
              this.facturaService.getFacturasPorCliente(this.idEmpresa, this.clienteDB.id_cliente)
                .subscribe(
                  {
                    next: (datos) => {
                      const facturasCliente = datos as FacturaInterface[]
                      console.log(facturasCliente)
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

  buscarFactura() {
    const idFactura =  Number.parseInt(this.formGroupDestinatario.get('numero_factura')?.value)
    this.facturaService.get(idFactura)
      .subscribe(
        {
          next: (datos) => {
            this.facturaDB = datos as FacturaInterface
            this.fechaEmisionFactura = this.datePipe.transform(this.facturaDB.fecha_emision, 'dd-MM-yyyy')
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
  }
}
