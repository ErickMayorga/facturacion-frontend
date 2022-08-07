import { Component, OnInit } from '@angular/core';
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {ClienteInterface} from "../../servicios/http/cliente/cliente.interface";
import {ClienteService} from "../../servicios/http/cliente/cliente.service";
import {ModalDireccionComponent} from "../../componentes/modal-direccion/modal-direccion.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ModalClienteComponent} from "../../componentes/modal-cliente/modal-cliente.component";
import {ActivatedRoute} from "@angular/router";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {ClienteCreateInterface} from "../../servicios/http/cliente/cliente-create.interface";

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
  private idDireccionRegistrada  = -1;

  constructor(private readonly clienteService: ClienteService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private readonly activatedRoute: ActivatedRoute,
              private readonly direccionService: DireccionService,) {
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

  realizarAccion(action: string, id_cliente: number){
    if(action === 'eliminar'){
      this.eliminarProductora(id_cliente)
    }

    if(action === 'editar'){
      
    }

  }

  registrarCliente(){
    const referenciaDialogo = this.dialog.open(
      ModalClienteComponent,
      {
        disableClose: false,
        data: {
          usuario: this.idUsuario
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            this.direccionCliente = datos['direccion'] as DireccionCreateInterface
            this.nuevoCliente = datos['cliente'] as ClienteCreateInterface
            this.registrarInformacion()
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

  refresh() {
    window.location.reload();
  }

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

  actualizarCliente(){

  }

  eliminarProductora(idProductora: number){
    const eliminar$ = this.clienteService.delete(idProductora);
    eliminar$.subscribe(
      {
        next: (datos) => {
          console.log({datos})
          //const url = ['/productoras']
          //this.router.navigate(url)
          this.refresh()
        },
        error: (error) => {
          console.error({error})
        }
      }
    )
  }
}
