import { Component, OnInit } from '@angular/core';
import {ActionButtonInterface} from "../../servicios/interfaces/actionButton.interface";
import {FacturaInterface} from "../../servicios/http/factura/factura.interface";

@Component({
  selector: 'app-ruta-facturas',
  templateUrl: './ruta-facturas.component.html',
  styleUrls: ['./ruta-facturas.component.scss']
})
export class RutaFacturasComponent implements OnInit {
  theads = [
    'Número',
    'Razón Social Comprador',
    'ID del comprador',
    'Fecha de emisión',
    'Valor Total'
  ];
  facturas: FacturaInterface[] = [

  ];

  actions: ActionButtonInterface[] = [
    {
      name: 'ver',
      icon: ''
    },
    {
      name: 'editar',
      icon: ''
    },
    {
      name: 'eliminar',
      icon: ''
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  realizarAccion(action: string){

  }

}
