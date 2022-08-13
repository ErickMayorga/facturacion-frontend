import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-pantalla-indicaciones',
  templateUrl: './pantalla-indicaciones.component.html',
  styleUrls: ['./pantalla-indicaciones.component.scss']
})
export class PantallaIndicacionesComponent implements OnInit {

  @Input()
  idUsuario: number = -1
  @Input()
  mensaje: string = ''
  @Input()
  indicaciones: string = ''
  @Input()
  botones: [] = []

  constructor(private readonly router: Router,) { }

  ngOnInit(): void {
  }

  mostrarInformacionEmisor() {
    const ruta = ['usuario',this.idUsuario, 'empresa'];
    this.router.navigate(ruta);
  }
}
