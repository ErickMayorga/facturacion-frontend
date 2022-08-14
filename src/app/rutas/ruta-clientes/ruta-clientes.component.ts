import { Component, OnInit } from '@angular/core';
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ModalClienteComponent} from "../../componentes/modal-cliente/modal-cliente.component";
import {ActivatedRoute} from "@angular/router";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {ClienteCreateInterface} from "../../servicios/http/cliente/cliente-create.interface";
import {ConfirmacionDeAccionComponent} from "../../componentes/confirmacion-de-accion/confirmacion-de-accion.component";

@Component({
  selector: 'app-ruta-clientes',
  templateUrl: './ruta-clientes.component.html',
  styleUrls: ['./ruta-clientes.component.scss']
})
export class RutaClientesComponent implements OnInit {

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
              private readonly direccionService: DireccionService,) {
  }

  ngOnInit(): void {
    // @ts-ignore
    const parametroRuta$ = this.activatedRoute.parent.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          //console.log(parametrosRuta)
          this.idUsuario = Number.parseInt(parametrosRuta['idUsuario']);
          this.buscarClientes()
        }
      })
  }

  // Búsqueda y filtro de clientes

  buscarClientes() {
    this.clienteService.getClientes(this.idUsuario)
      .subscribe(
        {
          next: (datos) => {
            this.clientesDB = datos as ClienteInterface[]
          },
          error: (error) => {
            console.error(error)
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
      this.eliminarCliente(id_cliente)
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
            // Crear Cliente
            this.clienteService.create(this.nuevoCliente)
              .subscribe(
                {
                  next: (data) => {
                    this.snackBar.open('El cliente ha sido registrado con éxito!', 'OK', {
                      duration: 3000
                    });
                    const clienteCreado = data as ClienteInterface
                    console.log(clienteCreado)
                  },
                  error: (error) => {
                    console.log(error)
                  },
                  complete: () => {
                    this.refresh()
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
            this.snackBar.open('El cliente ha sido actualizado con éxito!', 'OK', {
              duration: 3000
            });
            //console.log(datos)

          },
          error: (error) => {
            console.error({error})
          },
          complete: () => {
            this.refresh()
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

  eliminarCliente(idCliente: number){
    const referenciaDialogo = this.dialog.open(
      ConfirmacionDeAccionComponent,
      {
        disableClose: false,
        data: {
          icono: 'warning',
          titulo: 'Confirmación de eliminación',
          mensaje: '¿Está seguro que desea eliminar este cliente?'
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const confirmacion = datos as boolean
            if(confirmacion){
              const eliminar$ = this.clienteService.delete(idCliente);
              eliminar$.subscribe(
                {
                  next: (datos) => {
                    this.snackBar.open('El cliente ha sido eliminado con éxito!', 'OK', {
                      duration: 3000
                    });
                    //console.log({datos})

                  },
                  error: (error) => {
                    console.error({error})
                  },
                  complete: () => {
                    this.refresh()
                  }
                }
              )
            }
          }
        }
      )
  }

  refresh() {
    window.location.reload();
  }
}
