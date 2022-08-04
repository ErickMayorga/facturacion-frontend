import { Component, OnInit } from '@angular/core';
import {ItemSideNavInterface} from "../../servicios/interfaces/itemSideNav.interface";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-ruta-home',
  templateUrl: './ruta-home.component.html',
  styleUrls: ['./ruta-home.component.scss']
})
export class RutaHomeComponent implements OnInit {

  isOpenMenu = true;

  itemsSideNav: ItemSideNavInterface[] = [
    {
      route: "emisor",
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

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    const parametroRuta$ = this.activatedRoute.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          this.idUsuario = parametrosRuta['idUsuario'];
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
}
