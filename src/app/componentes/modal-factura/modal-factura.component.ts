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
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";

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

  actionsDetalle: ActionButtonInterface[] = [
    {
      name: 'editar',
      icon: 'edit'
    },
    {
      name: 'eliminar',
      icon: 'delete'
    },
  ]

  // TABLA PAGOS
  theadsPagos = [
    'Descripción',
    'Valor total',
    'Valor Plazo',
    'Unidad de tiempo',
    'Acciones'
  ];

  actionsPagos: ActionButtonInterface[] = [
    {
      name: 'editar',
      icon: 'edit'
    },
    {
      name: 'eliminar',
      icon: 'delete'
    },
  ]

  // ENTRADAS
  usuarioActual: number = -1;
  operacion = ''
  facturaActual: number = -1

  // Cargar informacion
  empresaActual: EmpresaInterface =  {} as EmpresaInterface
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

  // Nueva Factura
  detallesRegistro: FacturaDetalleInterface[] = []
  pagosRegistro: FacturaPagoInterface[] = []

  // Actualizar Factura
  detallesActualizar:FacturaDetalleInterface[] = []
  pagosActualizar: FacturaPagoInterface[] = []

  //Cálculos
  busquedaCliente: string = ''
  total_sin_iva = 0
  total_con_iva = 0

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalFacturaComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly facturaService: FacturaService,
               private readonly detalleFacturaService: FacturaDetalleService,
               private readonly pagoFacturaService: FacturaPagoService,
               private readonly empresaService: EmpresaService,
               private readonly clienteService: ClienteService,
               public dialog: MatDialog,) {
    this.usuarioActual = this.data.usuario
    this.buscarEmpresa()
    this.operacion = this.data.operacion
    this.facturaActual = this.data.factura
    this.formGroupFactura =this.formBuilder.group(
      {
        fecha_emision: ['', [Validators.required]],
        guia_remision: ['', [Validators.maxLength(45)]],
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
      }
    )
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
          },
          error: (err) => {
            console.error(err)
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
                    this.detallesActualizar = this.detallesDB
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
                    this.pagosActualizar = this.pagosDB
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

  }

  cargarDetalle(){

  }

  cargarPagos(){

  }

  guardarFactura(){
    const fecha_emision =  this.formGroupFactura.get('fecha_emision')?.value.trim()
    const guia_remision =  this.formGroupFactura.get('guia_remision')?.value.trim()

    let facturaObject: FacturaInterface | FacturaCreateInterface = {} as FacturaCreateInterface

    if(this.operacion === 'crear'){
      facturaObject = {

      } as FacturaCreateInterface
    }

    if(this.operacion === 'editar'){
      facturaObject = {

      } as FacturaInterface
    }

    this.dialogRef.close({factura: facturaObject, detalles: '', pagos: ''})
  }

  realizarAccionDetalle(action: string, idDetalle: number) {

  }

  realizarAccionPago(action: string, idPago: number) {

  }

  agregarProducto() {

  }

  agregarPago() {

  }

  buscarCliente(){
    this.clienteService.getCliente(this.busquedaCliente)
      .subscribe(
        {
          next: (datos) => {
            if(datos != null){
              this.clienteDB = datos as ClienteInterface
            }
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
  }
}
