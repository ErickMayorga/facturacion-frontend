import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BotonComprobanteInterface} from "../../servicios/interfaces/botonComprobante.interface";

@Component({
  selector: 'app-ruta-comprobantes',
  templateUrl: './ruta-comprobantes.component.html',
  styleUrls: ['./ruta-comprobantes.component.scss']
})
export class RutaComprobantesComponent implements OnInit {

  idUsuario = -1
  comprobantes: BotonComprobanteInterface[] = [
    {
      color: '#5484DE',
      icon: 'description',
      tittle: 'FACTURAS'
    },
    {
      color: '#806CAC',
      icon: 'local_shipping',
      tittle: 'GUÍAS DE REMISIÓN'
    },
    {
      color: '#D83444',
      icon: 'card_giftcard',
      tittle: 'NOTAS DE DÉBITO'
    },
    {
      color: '#607C2C',
      icon: 'card_membership',
      tittle: 'NOTAS DE CRÉDITO'
    },
    {
      color: '#986C14',
      icon: 'money_off',
      tittle: 'COMPROBANTES DE RETENCIÓN'
    },
  ];

  constructor(private readonly router: Router,
  private readonly activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    // @ts-ignore
    const parametroRuta$ = this.activatedRoute.parent.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          //console.log(parametrosRuta)
          this.idUsuario = parametrosRuta['idUsuario'];
          this.buscarUsuario(this.idUsuario)
        }
      })
  }

  buscarUsuario(id:number){

  }

}
