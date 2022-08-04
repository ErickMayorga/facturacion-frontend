import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UsuarioInterface} from "../../servicios/http/usuario/usuario.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsuarioService} from "../../servicios/http/usuario/usuario.service";

@Component({
  selector: 'app-ruta-login',
  templateUrl: './ruta-login.component.html',
  styleUrls: ['./ruta-login.component.scss']
})
export class RutaLoginComponent implements OnInit {

  formGroup = new FormGroup({})

  credencialesValidas = true
  usuarioValidado: UsuarioInterface = {} as UsuarioInterface

  constructor(private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              private readonly usuarioService: UsuarioService,) {
    this.formGroup =this.formBuilder.group(
      {
        correoUsuario: ['', [Validators.required, Validators.email, Validators.maxLength(45)]],
        passwordUsuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      }
    )
  }

  ngOnInit(): void {
  }

  verificarUsuario(){
    const correoUsuario = this.formGroup.get('correoUsuario')?.value.trim()
    const passwordUsuario = this.formGroup.get('passwordUsuario')?.value.trim()

    this.usuarioService.getAll(
      {
        correo_electronico: correoUsuario,
        password: passwordUsuario,
      }
    ).subscribe({
        next: (datos) => { // try then
          const usuarios = datos as UsuarioInterface[]
          //console.log(usuarios)
          // Verificar correo y password
          for(let usuario of usuarios){
            if(correoUsuario === usuario.correo_electronico.trim() && passwordUsuario === usuario.password.trim()){
              this.credencialesValidas = true
              this.usuarioValidado = usuario
              return
            }
          }
          //console.log('El correo y/o password no coinciden')
          this.credencialesValidas = false
        },
        error: (error) => { // catch
          console.error({error});
        },
        complete: () => {
          if(this.credencialesValidas){
            const ruta = ['/usuario',this.usuarioValidado.id_usuario];
            this.router.navigate(ruta);
          }
        }
      }
    )
  }
}
