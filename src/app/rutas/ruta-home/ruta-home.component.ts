import { Component, OnInit } from '@angular/core';
import {ItemSideNavInterface} from "../../servicios/interfaces/app/itemSideNav.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-ruta-home',
  templateUrl: './ruta-home.component.html',
  styleUrls: ['./ruta-home.component.scss']
})
export class RutaHomeComponent implements OnInit {

  isOpenMenu = true;

  itemsSideNav: ItemSideNavInterface[] = [
    {
      route: "/emisor",
      icon: "business",
      title: "Mi información"
    },
    {
      route: "/comprobantes",
      icon: "library_books",
      title: "Comprobantes"
    },
    {
      route: "/clientes",
      icon: "people",
      title: "Clientes"
    },
    {
      route: "/transportistas",
      icon: "local_shipping",
      title: "Transportistas"
    },
    {
      route: "/productos",
      icon: "business_center",
      title: "Productos"
    },
  ]

  constructor(private readonly router: Router,) { }

  ngOnInit(): void {

  }

  redirectUser(route: string) {
    const ruta = [route];
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
