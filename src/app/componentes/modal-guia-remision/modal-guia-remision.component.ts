import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DatePipe} from "@angular/common";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {guiaRemisionForm} from "./guia-remision-form";
import {GuiaRemisionInterface} from "../../servicios/http/guia-de-remision/guia-remision.interface";
import {DestinatarioInterface} from "../../servicios/http/destinatario/destinatario.interface";
import {TablaDestinatarioInterface} from "../../servicios/interfaces/tabla-destinatario.interface";
import {GuiaRemisionService} from "../../servicios/http/guia-de-remision/guia-remision.service";
import {DestinatarioService} from "../../servicios/http/destinatario/destinatario.service";
import {TransportistaService} from "../../servicios/http/transportista/transportista.service";
import {TransportistaInterface} from "../../servicios/http/transportista/transportista.interface";
import {ModalAgregarDestinatarioComponent} from "../modal-agregar-destinatario/modal-agregar-destinatario.component";
import {GuiaRemisionCreateInterface} from "../../servicios/http/guia-de-remision/guia-remision-create.interface";
import {FacturaService} from "../../servicios/http/factura/factura.service";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {ModalDireccionComponent} from "../modal-direccion/modal-direccion.component";

@Component({
  selector: 'app-modal-guia-remision',
  templateUrl: './modal-guia-remision.component.html',
  styleUrls: ['./modal-guia-remision.component.scss']
})
export class ModalGuiaRemisionComponent implements OnInit {

  formGroupGuiaRemision = new FormGroup({});
  fields = guiaRemisionForm
  tituloModal = ''

  // TABLA DESTINATARIOS
  theadsDestinatarios = [
    'Razón social',
    'ID del comprador',
    'Factura',
    'Fecha de emisión',
    'Motivo',
    'Acciones'
  ];

  // ENTRADAS
  usuarioActual: number = -1;
  operacion = ''
  guiaRemisionActual: number = -1

  // Cargar informacion
  empresaActual: EmpresaInterface =  {} as EmpresaInterface
  direccionMatriz = ''
  direccionEstablecimiento = ''
  direccionPartida = ''

  transportistaDB: TransportistaInterface = {
    id_transportista: -1,
    id_usuario: -1,
    nombres_razon_social: '',
    tipo_identificacion: '',
    numero_identificacion: '',
    correo_electronico: '',
    placa: '',
  } as TransportistaInterface
  guiaRemisionDB: GuiaRemisionInterface = {} as GuiaRemisionInterface

  destinatariosDB: DestinatarioInterface[] = []

  destinatariosTabla: TablaDestinatarioInterface[] = []

  //Cálculos
  numeroComprobante = ''
  claveAcceso = ''
  fechaEmision: string | null  = ''

  busquedaTransportista: string = ''
  direccionPartidaObject: DireccionInterface = {} as DireccionInterface
  nextDireccion = -1


  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<ModalGuiaRemisionComponent>,
               private readonly formBuilder: FormBuilder,
               private readonly guiaRemisionService: GuiaRemisionService,
               private readonly destinatarioService: DestinatarioService,
               private readonly empresaService: EmpresaService,
               private readonly transportistaService: TransportistaService,
               private readonly clienteService: ClienteService,
               private readonly direccionService: DireccionService,
               private readonly facturaService: FacturaService,
               public dialog: MatDialog,
               private datePipe: DatePipe) {
    const today = new Date()
    this.fechaEmision = this.datePipe.transform(today, 'dd-MM-yyyy')
    this.usuarioActual = this.data.usuario
    this.operacion = this.data.operacion
    this.guiaRemisionActual = this.data.guia_remision
    this.claveAcceso = (Math.floor(Math.random() * 9999999999) + 1000000000).toString()
    this.formGroupGuiaRemision =this.formBuilder.group(
      {
        numero_identificacion: ['', [Validators.required, Validators.maxLength(13)]],
        direccionPartida: ['', [Validators.required]]
      }
    )

    this.formGroupGuiaRemision.get('direccionPartida')?.disable()
    this.direccionService.getNextIndex()
      .subscribe(
        {
          next: (index) => {
            this.nextDireccion = index
          },
          error: (error) => {
            console.error(error)
          }
        }
      )

    this.buscarEmpresa()
  }

  ngOnInit(): void {
    if(this.operacion === 'editar'){
      this.tituloModal = 'Actualización de Guía de Remisión'
      this.buscarGuiaRemision()
    }else{
      this.tituloModal = 'Registro de Guía de Remisión'
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
            if(this.operacion === 'crear'){
              this.numeroComprobante = this.empresaActual.codigo_establecimiento + '-' + this.empresaActual.codigo_punto_emision + '-' + this.data.next
            }
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

  // Carga inicial de información de la guía de remisión
  buscarGuiaRemision() {
    this.guiaRemisionService.get(this.guiaRemisionActual)
      .subscribe(
        {
          next: (datos) => {
            this.guiaRemisionDB = datos as GuiaRemisionInterface
            this.fechaEmision = this.datePipe.transform(this.guiaRemisionDB.fecha_emision, 'dd-MM-yyyy')
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.cargarInformacion()
            // Consultar direccion de partida
            this.direccionService.get(this.guiaRemisionDB.id_direccion_partida)
              .subscribe(
                {
                  next: (datos) => {
                    this.direccionPartidaObject = datos as DireccionInterface
                    this.formGroupGuiaRemision.patchValue(
                      {
                        direccionPartida: this.direccionService.getStringDireccion(this.direccionPartidaObject)
                      }
                    )
                  },
                  error: (err) => {
                    console.error(err)
                  }
                }
              )

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
                  },
                  complete: () => {
                    this.cargarTransportista()
                  }
                }
              )
            // Consultar destinatarios
            this.destinatarioService.getDestinatarios(this.guiaRemisionActual)
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

  cargarInformacion() {
    this.claveAcceso = this.guiaRemisionDB.clave_acceso
    this.numeroComprobante = this.guiaRemisionDB.numero_comprobante
    this.formGroupGuiaRemision.patchValue({
      numero_identificacion: this.transportistaDB.numero_identificacion,
    });
  }

  cargarTransportista(){
    this.busquedaTransportista = this.transportistaDB.numero_identificacion
  }

  cargarDestinatarios(){
    for(let destinatario of this.destinatariosDB){
      let facturaConsultada: FacturaInterface = {} as FacturaInterface
      let destinatarioTabla: TablaDestinatarioInterface = {} as TablaDestinatarioInterface
      this.facturaService.get(destinatario.id_factura)
        .subscribe(
          {
            next: (datos) => {
              facturaConsultada = datos as FacturaInterface
              destinatarioTabla = {
                id_guia_remision: this.guiaRemisionActual,
                id_destinatario: destinatario.id_destinatario,
                id_cliente: destinatario.id_cliente,
                id_factura: destinatario.id_factura,
                razon_social: '',
                tipo_identificacion: '',
                numero_identificacion: '',
                numero_factura: facturaConsultada.numero_comprobante,
                motivo: destinatario.motivo,
                fecha_emision: this.datePipe.transform(facturaConsultada.fecha_emision, 'dd-MM-yyyy'),
                estado:'u',
              }
            },
            error: (err) => {
              console.error(err)
            },
            complete: () => {
              this.clienteService.get(facturaConsultada.id_cliente)
                .subscribe(
                  {
                    next: (datos) => {
                      const cliente = datos as ClienteInterface
                      destinatarioTabla.numero_identificacion = cliente.numero_identificacion
                      destinatarioTabla.tipo_identificacion = cliente.tipo_identificacion
                      destinatarioTabla.razon_social = cliente.nombres_razon_social
                      this.destinatariosTabla.push(destinatarioTabla)

                    },
                    error: (err) => {
                      console.error(err)
                    }
                  }
                )
            }
          }
        )
    }
  }

  // Enviar datos para crear o actualizar una guia de remision
  guardarGuiaRemision(){
    let guiaRemisionObject: GuiaRemisionInterface | GuiaRemisionCreateInterface = {} as GuiaRemisionCreateInterface

    if(this.operacion === 'crear'){
      guiaRemisionObject = {
        id_transportista: this.transportistaDB.id_transportista,
        numero_comprobante: this.numeroComprobante,
        fecha_emision: new Date(),
        clave_acceso: this.claveAcceso,
        id_direccion_partida: this.nextDireccion, // TODO: Verificar dirección de partida
        habilitado: true,
        id_empresa: this.empresaActual.id_empresa,
      } as GuiaRemisionCreateInterface
    }

    if(this.operacion === 'editar'){
      guiaRemisionObject = {
        id_guia_de_remision: this.guiaRemisionActual,
        id_transportista: this.transportistaDB.id_transportista,
        numero_comprobante: this.numeroComprobante,
        fecha_emision: this.guiaRemisionDB.fecha_emision,
        clave_acceso: this.claveAcceso,
        id_direccion_partida: this.direccionPartidaObject.id_direccion, // TODO: Verificar dirección de partida
        habilitado: true,
        id_empresa: this.empresaActual.id_empresa,
      } as GuiaRemisionInterface
    }

    this.dialogRef.close({guia_remision: guiaRemisionObject, destinatarios: this.destinatariosTabla, direccionPartida: this.direccionPartidaObject})

  }

  // Consulta de información del transportista
  buscarTransportista(){
    this.transportistaService.getTransportista(this.usuarioActual,this.busquedaTransportista)
      .subscribe(
        {
          next: (datos) => {
            this.transportistaDB = datos as TransportistaInterface
          },
          error: (err) => {
            console.error(err)
          }
        }
      )
  }

  // Agregar nuevo producto
  abrirModalAgregarDestinatario() {
    const referenciaDialogo = this.dialog.open(
      ModalAgregarDestinatarioComponent,
      {
        disableClose: false,
        data: {
          usuario: this.usuarioActual,
          guia_remision: this.guiaRemisionActual,
          empresa: this.empresaActual.id_empresa
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const destinatarioTabla = datos['destinatario'] as TablaDestinatarioInterface
            destinatarioTabla.id_guia_remision = this.guiaRemisionActual

            const detallesRepetidos = this.destinatariosTabla.filter(
              (item) => item.id_factura === destinatarioTabla.id_factura
            )
            if(detallesRepetidos.length === 0){
              this.destinatariosTabla.push(destinatarioTabla)
            }


            //this.actualizarDescuento()
          }
        }
      )
  }

  // Eliminar un detalle de la lista
  eliminarDestinatario(destinatario: TablaDestinatarioInterface) {
    //console.log('Antes: ', this.detallesTabla)
    if(this.operacion === 'crear'){
      this.destinatariosTabla = this.destinatariosTabla.filter(
        (item) => item.id_cliente !== destinatario.id_cliente
      )
      //console.log('Despues: ', this.detallesTabla)
    }
    if(this.operacion === 'editar'){
      if(destinatario.estado === 'u'){
        destinatario.estado = 'd'
      }else{
        this.destinatariosTabla = this.destinatariosTabla.filter(
          (item) => item.id_cliente !== destinatario.id_cliente
        )
      }
      //console.log('Despues: ', this.detallesTabla)
    }
  }

  abrirModalDireccion() {
    const referenciaDialogo = this.dialog.open(
      ModalDireccionComponent,
      {
        disableClose: false,
        data: {
          direccionActual: this.direccionPartidaObject
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const direccion = datos['direccion']
            this.direccionPartidaObject = direccion as DireccionInterface
            this.formGroupGuiaRemision.patchValue({
              direccionPartida: this.direccionService.getStringDireccion(direccion),
            });
          }
        }
      )
  }
}
