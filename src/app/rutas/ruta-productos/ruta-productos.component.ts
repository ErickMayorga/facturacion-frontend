import { Component, OnInit } from '@angular/core';
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {ClienteCreateInterface} from "../../servicios/http/cliente/cliente-create.interface";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {ModalClienteComponent} from "../../componentes/modal-cliente/modal-cliente.component";

@Component({
  selector: 'app-ruta-productos',
  templateUrl: './ruta-productos.component.html',
  styleUrls: ['./ruta-productos.component.scss']
})
export class RutaProductosComponent implements OnInit {

  theads = [
    'Razón Social',
    'Tipo de ID',
    'ID del cliente',
    'Acciones'
  ];

  clientesDB: ClienteInterface[] = []
  clientesBuscados: ClienteInterface[] = []

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
  private direccionCliente: DireccionCreateInterface = {} as DireccionCreateInterface;
  private nuevoCliente: ClienteCreateInterface = {} as ClienteCreateInterface;
  private direccionSeleccionada: DireccionInterface = {} as DireccionInterface;
  private clienteSeleccionado: ClienteInterface = {} as ClienteInterface;

  constructor(private readonly clienteService: ClienteService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly direccionService: DireccionService,
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
    this.clienteService.getAll({})
      .subscribe(
        {
          next: (datos) => {
            this.clientesDB = datos as ClienteInterface[]
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.clientesBuscados = this.clientesDB
          }
        }
      )
  }

  filtrarClientes() {
    const clientesFiltrados = []
    for(let cliente of this.clientesDB){
      if(cliente.nombres_razon_social.includes(this.busqueda) || cliente.numero_identificacion.includes(this.busqueda)){
        clientesFiltrados.push(cliente)
      }
    }
    this.clientesBuscados = clientesFiltrados
  }

  // CRUD Clientes

  realizarAccion(action: string, id_cliente: number){
    if(action === 'eliminar'){
      this.eliminarProductora(id_cliente)
    }
    if(action === 'editar'){
      this.abrirModalCliente('editar', id_cliente)
    }
  }

  abrirModalCliente(operacion: 'crear'|'editar', idCliente: number = -1){
    const referenciaDialogo = this.dialog.open(
      ModalClienteComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario,
          operacion: operacion,
          cliente: idCliente
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const direccion = datos['direccion']
            const cliente = datos['cliente']
            if(operacion === 'crear'){
              this.direccionCliente = direccion as DireccionCreateInterface
              this.nuevoCliente = cliente as ClienteCreateInterface
              this.registrarInformacion()
            }
            if(operacion === 'editar'){
              this.direccionSeleccionada = direccion as DireccionInterface
              this.clienteSeleccionado = cliente as ClienteInterface
              this.actualizarInformacion()
            }
          }
        }
      )
  }

  registrarInformacion() {
    this.direccionService.create(this.direccionCliente)
      .subscribe(
        {
          next: (data) => {
            const direccionCreada = data as DireccionInterface
            this.nuevoCliente.id_direccion = direccionCreada.id_direccion
            //console.log(direccionCreada)
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            // Crear Usuario
            this.clienteService.create(this.nuevoCliente)
              .subscribe(
                {
                  next: (data) => {
                    const  usuarioCreado = data as ClienteInterface
                    console.log(usuarioCreado)
                  },
                  error: (error) => {
                    console.log(error)
                  },
                  complete: () => {
                    this.refresh()
                    this.snackBar.open('Se ha ingresado con éxito el nuevo cliente!')
                  }
                }
              )
          }
        }
      )
  }

  actualizarInformacion(){
    const actualizarCliente$ = this.clienteService.update(this.clienteSeleccionado.id_cliente, this.clienteSeleccionado)
    actualizarCliente$
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
            this._snackBar.open('Se ha actualizado el cliente con éxito')
          }
        }
      )
    const actualizarDireccion$ = this.direccionService.update(this.direccionSeleccionada.id_direccion, this.direccionSeleccionada)
    actualizarDireccion$
      .subscribe(
        {
          next: (datos) => {
            //console.log(datos)
            //this._snackBar.open('Se ha actualizado su información con éxito')
          },
          error: (error) => {
            console.error({error})
          }
        }
      )
  }

  eliminarProductora(idProductora: number){
    const eliminar$ = this.clienteService.delete(idProductora);
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
