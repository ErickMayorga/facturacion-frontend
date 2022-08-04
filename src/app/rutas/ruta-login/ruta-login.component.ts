import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UsuarioInterface} from "../../servicios/http/usuario/usuario.interface";

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
    let idUsuario = this.verificarUsuario()
    if(idUsuario) {
      const ruta = ['/usuario',idUsuario];
      this.router.navigate(ruta);
    }
  }

  verificarUsuario(){
    return 1;
  }
}
