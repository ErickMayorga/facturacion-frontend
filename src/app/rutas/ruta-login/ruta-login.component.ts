import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UsuarioInterface} from "../../servicios/interfaces/model/usuario.interface";

@Component({
  selector: 'app-ruta-login',
  templateUrl: './ruta-login.component.html',
  styleUrls: ['./ruta-login.component.scss']
})
export class RutaLoginComponent implements OnInit {

  credencialesValidas = false
  tipoUsuarioValido = false
  usuarioValidado: UsuarioInterface = {} as UsuarioInterface

  constructor(private readonly router: Router,) { }

  ngOnInit(): void {
  }

  ingresarUsuario() {
    const ruta = ['/home'];
    this.router.navigate(ruta);
  }
}
