import { Component, OnInit } from '@angular/core';
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {TransportistaInterface} from "../../servicios/http/transportista/transportista.interface";
import {TransportistaCreateInterface} from "../../servicios/http/transportista/transportista-create.interface";
import {TransportistaService} from "../../servicios/http/transportista/transportista.service";
import {ModalTransportistaComponent} from "../../componentes/modal-transportista/modal-transportista.component";

@Component({
  selector: 'app-ruta-transportistas',
  templateUrl: './ruta-transportistas.component.html',
  styleUrls: ['./ruta-transportistas.component.scss']
})
export class RutaTransportistasComponent implements OnInit {

  theads = [
    'Razón Social',
    'Tipo de ID',
    'ID del transportista',
    'Acciones'
  ];

  transportistasDB: TransportistaInterface[] = []
  transportistasBuscados: TransportistaInterface[] = []

  actions: ActionButtonInterface[] = [
    {
      name: 'editar',
      icon: 'edit'
    },
    {
      name: 'eliminar',
      icon: 'delete'
    },
  ]
  busqueda = '';
  private idUsuario: number = -1;
  private nuevoTransportista: TransportistaCreateInterface = {} as TransportistaCreateInterface
  private transportistaSeleccionado: TransportistaInterface = {} as TransportistaInterface

  constructor(private readonly transportistaService: TransportistaService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar) {
    this.buscarClientes()
  }

  ngOnInit(): void {
    // @ts-ignore
    const parametroRuta$ = this.activatedRoute.parent.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          //console.log(parametrosRuta)
          this.idUsuario = Number.parseInt(parametrosRuta['idUsuario']);
        }
      })
  }

  // Búsqueda y filtro de clientes

  buscarClientes() {
    this.transportistaService.getAll({})
      .subscribe(
        {
          next: (datos) => {
            this.transportistasDB = datos as TransportistaInterface[]
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.transportistasBuscados = this.transportistasDB
          }
        }
      )
  }

  filtrarClientes() {
    const transportistasFiltrados = []
    for(let transportista of this.transportistasDB){
      if(transportista.nombres_razon_social.includes(this.busqueda) || transportista.numero_identificacion.includes(this.busqueda)){
        transportistasFiltrados.push(transportista)
      }
    }
    this.transportistasBuscados = transportistasFiltrados
  }

  // CRUD Clientes

  realizarAccion(action: string, id_transportista: number){
    if(action === 'eliminar'){
      this.eliminarTransportista(id_transportista)
    }
    if(action === 'editar'){
      this.abrirModalTransportista('editar', id_transportista)
    }
  }

  abrirModalTransportista(operacion: 'crear'|'editar', idTransportista: number = -1){
    const referenciaDialogo = this.dialog.open(
      ModalTransportistaComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          operacion: operacion,
          transportista: idTransportista
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const transportista = datos['transportista']
            if(operacion === 'crear'){
              this.nuevoTransportista = transportista as TransportistaCreateInterface
              this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.transportistaSeleccionado = transportista as TransportistaInterface
              this.actualizarInformacion()
            }
          }
        }
      )
  }

  registrarInformacion() {
    // Crear Transportista
    this.transportistaService.create(this.nuevoTransportista)
      .subscribe(
        {
          next: (data) => {
            const transportistaCreado = data as TransportistaInterface
            console.log(transportistaCreado)
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.refresh()
            this.snackBar.open('Se ha ingresado con éxito el nuevo transportista!')
          }
        }
      )
  }

  actualizarInformacion(){
    const actualizarTransportista$ = this.transportistaService.update(this.transportistaSeleccionado.id_transportista, this.transportistaSeleccionado)
    actualizarTransportista$
      .subscribe(
        {
          next: (datos) => {
            //console.log(datos)
            this.refresh()
          },
          error: (error) => {
            console.error({error})
          },
          complete: () => {
            this._snackBar.open('Se ha actualizado el transportista con éxito')
          }
        }
      )
  }

  eliminarTransportista(idTransportista: number){
    const eliminar$ = this.transportistaService.delete(idTransportista);
    eliminar$.subscribe(
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
  }

  refresh() {
    window.location.reload();
  }

}
