import { Component, OnInit } from '@angular/core';
import {ItemSideNavInterface} from "../../servicios/interfaces/itemSideNav.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioService} from "../../servicios/http/usuario/usuario.service";
import {UsuarioInterface} from "../../servicios/http/usuario/usuario.interface";

@Component({
  selector: 'app-ruta-home',
  templateUrl: './ruta-home.component.html',
  styleUrls: ['./ruta-home.component.scss']
})
export class RutaHomeComponent implements OnInit {

  isOpenMenu = true;

  itemsSideNav: ItemSideNavInterface[] = [
    {
      route: "empresa",
      icon: "business",
      title: "Mi información"
    },
    {
      route: "comprobantes",
      icon: "library_books",
      title: "Comprobantes"
    },
    {
      route: "clientes",
      icon: "people",
      title: "Clientes"
    },
    {
      route: "transportistas",
      icon: "local_shipping",
      title: "Transportistas"
    },
    {
      route: "productos",
      icon: "business_center",
      title: "Productos"
    },
  ]

  idUsuario =-1
  nombreUsuario = '';

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly usuarioService: UsuarioService) { }

  ngOnInit(): void {
    const parametroRuta$ = this.activatedRoute.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          this.idUsuario = Number.parseInt(parametrosRuta['idUsuario']);
          //console.log(this.idUsuario)
          this.buscarUsuario()
        }
      })
  }

  redirectUser(route: string) {
    const ruta = ['usuario',this.idUsuario, route];
    this.router.navigate(ruta);
  }

  toggleSidenav() {
    if(this.isOpenMenu){
      this.isOpenMenu = false;
    }else{
      this.isOpenMenu = true;
    }
  }

  private buscarUsuario() {
    // Buscar información de usuario
    this.usuarioService.get(this.idUsuario)
      .subscribe(
        {
          next: (datos) => { // try then
            const admin = datos as UsuarioInterface
            this.nombreUsuario = admin.nombres.toUpperCase() + ' ' + admin.apellidos.toUpperCase()
          },
          error: (error) => { // catch
            console.error({error});
          }
        }
      )
  }
}
