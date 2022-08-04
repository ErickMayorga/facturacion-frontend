import {Component, Input, OnInit} from '@angular/core';
import {BotonComprobanteInterface} from "../../servicios/interfaces/botonComprobante.interface";

@Component({
  selector: 'app-boton-comprobante',
  templateUrl: './boton-comprobante.component.html',
  styleUrls: ['./boton-comprobante.component.scss']
})
export class BotonComprobanteComponent implements OnInit {

  @Input()
  botonComprobante: BotonComprobanteInterface = {} as BotonComprobanteInterface

  constructor() { }

  ngOnInit(): void {
  }

}
