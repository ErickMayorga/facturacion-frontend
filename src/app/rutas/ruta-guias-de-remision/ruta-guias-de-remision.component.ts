import { Component, OnInit } from '@angular/core';
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {GuiaRemisionInterface} from "../../servicios/http/guia-de-remision/guia-remision.interface";
import {TablaGuiaRemisionInterface} from "../../servicios/interfaces/tabla-guia-remision.interface";
import {TablaDestinatarioInterface} from "../../servicios/interfaces/tabla-destinatario.interface";
import {GuiaRemisionCreateInterface} from "../../servicios/http/guia-de-remision/guia-remision-create.interface";
import {GuiaRemisionService} from "../../servicios/http/guia-de-remision/guia-remision.service";
import {DestinatarioService} from "../../servicios/http/destinatario/destinatario.service";
import {TransportistaService} from "../../servicios/http/transportista/transportista.service";
import {TransportistaInterface} from "../../servicios/http/transportista/transportista.interface";
import {ModalFormatoGuiaRemisionComponent} from "../../componentes/modal-formato-guia-remision/modal-formato-guia-remision.component";
import {ModalGuiaRemisionComponent} from "../../componentes/modal-guia-remision/modal-guia-remision.component";
import {DestinatarioCreateInterface} from "../../servicios/http/destinatario/destinatario-create.interface";
import {DestinatarioInterface} from "../../servicios/http/destinatario/destinatario.interface";

@Component({
  selector: 'app-ruta-guias-de-remision',
  templateUrl: './ruta-guias-de-remision.component.html',
  styleUrls: ['./ruta-guias-de-remision.component.scss']
})
export class RutaGuiasDeRemisionComponent implements OnInit {

  theads = [
    'Número de comprobante',
    'Razón Social del transportista',
    'ID del transportista',
    'Fecha de emisión',
    'Placa',
    'Acciones'
  ];

  guiasRemisionDB: GuiaRemisionInterface[] = []
  guiasRemisionBuscadas: TablaGuiaRemisionInterface[] = []

  actions: ActionButtonInterface[] = [
    {
      name: 'ver',
      icon: 'visibility'
    },
    {
      name: 'editar',
      icon: 'edit'
    },
    {
      name: 'eliminar',
      icon: 'block'
    },
  ]
  busqueda = '';
  idUsuario: number = -1;
  empresaActual: EmpresaInterface = {} as EmpresaInterface

  destinatariosTabla: TablaDestinatarioInterface[] = []

  nuevaGuiaRemision: GuiaRemisionCreateInterface = {} as GuiaRemisionCreateInterface
  guiaRemisionSeleccionada: GuiaRemisionInterface = {} as GuiaRemisionInterface

  // Tabla
  guiasRemisionTabla: TablaGuiaRemisionInterface[] = []

  idGuiaRemisionCreada: number = -1;

  constructor(private readonly guiaRemisionService: GuiaRemisionService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly  destinatarioService: DestinatarioService,
              private readonly transportistaService: TransportistaService,
              private readonly empresaService: EmpresaService) {

  }

  ngOnInit(): void {
    // @ts-ignore
    const parametroRuta$ = this.activatedRoute.parent.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          //console.log(parametrosRuta)
          this.idUsuario = Number.parseInt(parametrosRuta['idUsuario']);
          this.buscarGuiasRemision()
        }
      })
  }

  // Búsqueda y filtro de guias de remision en tabla
  buscarGuiasRemision() {
    this.empresaService.getEmpresa(this.idUsuario)
      .subscribe(
        {
          next: (datos) => {
            this.empresaActual = datos as EmpresaInterface
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            if(this.empresaActual != null){
              // Buscar guias de remision por empresa
              this.guiaRemisionService.getComprobantes(this.empresaActual.id_empresa)
                .subscribe(
                  {
                    next: (datos) => {
                      this.guiasRemisionDB = datos as GuiaRemisionInterface[]
                    },
                    error: (error) => {
                      console.log(error)
                    },
                    complete: () => {
                      this.crearRegistrosTabla()
                      //this.facturasBuscadas = this.facturasDB
                    }
                  }
                )
            }
          }
        }
      )
  }

  crearRegistrosTabla(){
    let index = 0
    for(let guiaRemision of this.guiasRemisionDB){
      this.transportistaService.get(guiaRemision.id_transportista)
        .subscribe(
          {
            next: (datos) => {
              const transportista = datos as TransportistaInterface
              const guiaRemisionTabla: TablaGuiaRemisionInterface = {
                idGuiaRemision: guiaRemision.id_guia_de_remision,
                numero_comprobante: guiaRemision.numero_comprobante,
                razon_social_transportista: transportista.nombres_razon_social,
                identificacion_transportista: transportista.numero_identificacion,
                fecha_emision: guiaRemision.fecha_emision,
                placa: transportista.placa,
                habilitado: guiaRemision.habilitado,
              }
              this.guiasRemisionTabla.push(guiaRemisionTabla)
            },
            error: (err) => {
              console.error(err)
            },
            complete: () => {
              index++
              if(index === this.guiasRemisionDB.length){
                this.guiasRemisionBuscadas = this.guiasRemisionTabla
              }
            }
          }
        )
    }
  }

  filtrarGuiasRemision() {
    const guiasRemisionFiltradas = []
    for(let guiaRemision of this.guiasRemisionTabla){
      if(guiaRemision.numero_comprobante.includes(this.busqueda)){
        guiasRemisionFiltradas.push(guiaRemision)
      }
    }
    this.guiasRemisionBuscadas = guiasRemisionFiltradas
  }

  // CRUD Guias de remision
  realizarAccion(action: string, idGuiaRemision: number){
    if(action === 'ver'){
      this.mostrarFormatoGuiaRemision(idGuiaRemision)
    }
    if(action === 'editar'){
      this.abrirModalGuiaRemision('editar', idGuiaRemision)
    }
    if(action === 'eliminar'){
      this.deshabilitarGuiaRemision(idGuiaRemision)
    }
  }

  // VISUALIZACIÓN
  mostrarFormatoGuiaRemision(idGuiaRemision: number) {
    this.dialog.open(
      ModalFormatoGuiaRemisionComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          empresa: this.empresaActual,
          guia_remision: idGuiaRemision,
        }
      }
    )
  }

  abrirModalGuiaRemision(operacion: 'crear'|'editar', idGuiaRemision: number = -1){
    const referenciaDialogo = this.dialog.open(
      ModalGuiaRemisionComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          operacion: operacion,
          guia_remision: idGuiaRemision,
          next: this.guiasRemisionDB.length + 1
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const guiaRemision = datos['guia_remision']
            const destinatarios = datos['destinatarios'] as TablaDestinatarioInterface[]

            if(operacion === 'crear'){
              this.nuevaGuiaRemision = guiaRemision as GuiaRemisionCreateInterface
              this.destinatariosTabla = destinatarios as TablaDestinatarioInterface[]
              this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.guiaRemisionSeleccionada = guiaRemision as GuiaRemisionInterface
              this.destinatariosTabla = destinatarios as TablaDestinatarioInterface[]
              this.actualizarInformacion()
            }
          }
        }
      )
  }

  // Crear Guia de remision
  registrarInformacion() {
    this.guiaRemisionService.create(this.nuevaGuiaRemision)
      .subscribe(
        {
          next: (data) => {
            this.snackBar.open('La guía de remisión ha sido registrada con éxito!', 'OK', {
              duration: 3000
            });
            const guiaRemisionCreada = data as GuiaRemisionInterface
            this.idGuiaRemisionCreada = guiaRemisionCreada.id_guia_de_remision
            //console.log(facturaCreada)
          },
          error: (error) => {
            console.error(error)
          },
          complete: () => {
            this.procesarDestinatarios()
            //this.snackBar.open('Se ha ingresado con éxito el nuevo producto!')
          }
        }
      )
  }

  // Actualizar Guia de remision
  actualizarInformacion(){
    const actualizarGuiaRemision$ = this.guiaRemisionService.update(this.guiaRemisionSeleccionada.id_guia_de_remision, this.guiaRemisionSeleccionada)
    actualizarGuiaRemision$
      .subscribe(
        {
          next: (datos) => {
            this.snackBar.open('La guía de remisión ha sido actualizada con éxito!', 'OK', {
              duration: 3000
            });
            //console.log(datos)
          },
          error: (error) => {
            console.error({error})
          },
          complete: () => {
            this.procesarDestinatarios()
          }
        }
      )
  }

  // Procesamiento de destinatarios
  procesarDestinatarios(){
    let index = 0
    for(let destinatario of this.destinatariosTabla){
      if(destinatario.estado === 'c'){
        const destinatarioCrear = this.crearDestinatario(destinatario, destinatario.estado) as DestinatarioCreateInterface
        this.destinatarioService.create(destinatarioCrear)
          .subscribe(
            {
              next: (datos) => {
                console.log(datos)
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                index++
                if(index === this.destinatariosTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }else if(destinatario.estado === 'u'){
        const destinatarioActualizar = this.crearDestinatario(destinatario, destinatario.estado) as DestinatarioInterface
        const actualizarDestinatario$ = this.destinatarioService.update(destinatarioActualizar.id_destinatario, destinatarioActualizar)
        actualizarDestinatario$
          .subscribe(
            {
              next: (datos) => {
                console.log(datos)
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                index++
                if(index === this.destinatariosTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }else if(destinatario.estado === 'd'){
        this.destinatarioService.delete(destinatario.id_destinatario)
          .subscribe(
            {
              next: (datos) => {
                console.log('Eliminado destinatario ' + destinatario.id_destinatario)
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                index++
                if(index === this.destinatariosTabla.length){
                  this.refresh()
                }
              }
            }
          )
      }
    }
  }

  // TODO: Logica del motivo
  crearDestinatario(destinatarioTabla: TablaDestinatarioInterface, operacion: string){
    if(operacion === 'c'){
      let idGuiaRemision = -1
      if(this.idGuiaRemisionCreada === -1){
        idGuiaRemision = this.guiaRemisionSeleccionada.id_guia_de_remision
      }else{
        idGuiaRemision = this.idGuiaRemisionCreada
      }
      return {
        id_guia_de_remision: idGuiaRemision,
        id_factura: destinatarioTabla.id_factura,
        id_cliente: destinatarioTabla.id_cliente,
        motivo: '',
      } as DestinatarioCreateInterface
    }
    return {
      id_destinatario: destinatarioTabla.id_destinatario,
      id_guia_de_remision: destinatarioTabla.id_guia_remision,
      id_factura: destinatarioTabla.id_factura,
      id_cliente: destinatarioTabla.id_cliente,
      motivo: '',
    } as DestinatarioInterface
  }

  deshabilitarGuiaRemision(idGuiaRemision: number){
    this.guiaRemisionService.deshabilitar(idGuiaRemision)
      .subscribe(
        {
          next: (datos) => {
            this.snackBar.open('La guía de remisión ha sido deshabilitada con éxito!', 'OK', {
              duration: 3000
            });
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
            this.refresh()
          }
        }
      )
    /*
    const eliminarProducto$ = this.facturaService.delete(idFactura);
    eliminarProducto$.subscribe(
      {
        next: (datos) => {
          //console.log({datos})
          this.refresh()
        },
        error: (error) => {
          console.error({error})
        }
      }
    )
     */
  }

  refresh() {
    window.location.reload();
  }

}
