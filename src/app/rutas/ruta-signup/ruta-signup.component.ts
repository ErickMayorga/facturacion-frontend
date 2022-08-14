import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UsuarioService} from "../../servicios/http/usuario/usuario.service";
import {UsuarioCreateInterface} from "../../servicios/http/usuario/usuario-create.interface";
import {UsuarioInterface} from "../../servicios/http/usuario/usuario.interface";
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {MatDialog} from "@angular/material/dialog";
import {ModalDireccionComponent} from "../../componentes/modal-direccion/modal-direccion.component";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {signUpForm} from "./sign-up-form";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-ruta-signup',
  templateUrl: './ruta-signup.component.html',
  styleUrls: ['./ruta-signup.component.scss']
})
export class RutaSignupComponent implements OnInit {
  formGroupUsuario = new FormGroup({});

  fields = signUpForm

  passwordCheck = true
  direccionTemp: DireccionCreateInterface = {} as DireccionCreateInterface;
  idDireccionRegistrada = -1

  constructor(private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              private readonly usuarioService: UsuarioService,
              private readonly direccionService: DireccionService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {

    this.formGroupUsuario =this.formBuilder.group(
      {
        nombres: ['', [Validators.required, Validators.maxLength(45)]],
        apellidos: ['', [Validators.required, Validators.maxLength(45)]],
        correo: ['', [Validators.required, Validators.email, Validators.maxLength(45)]],
        direccion: ['', Validators.required],
        passwordUsuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
        passwordConfirmacion: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      }
    )
    this.formGroupUsuario.get('direccion')?.disable()
  }

  ngOnInit(): void {

  }

  registrarUsuario() {
    const nombre =  this.formGroupUsuario.get('nombres')?.value.trim()
    const apellido =  this.formGroupUsuario.get('apellidos')?.value.trim()
    const correo =  this.formGroupUsuario.get('correo')?.value.trim()
    const password =  this.formGroupUsuario.get('passwordUsuario')?.value.trim()
    const confirmacion =  this.formGroupUsuario.get('passwordConfirmacion')?.value.trim()

    this.verificarPassword(password, confirmacion)

    if(this.passwordCheck){
      let direccionCreada: DireccionInterface = {} as DireccionInterface
      this.direccionService.create(this.direccionTemp)
        .subscribe(
          {
            next: (data) => {
              direccionCreada = data as DireccionInterface
              this.idDireccionRegistrada = direccionCreada.id_direccion
              //console.log(direccionCreada)
            },
            error: (error) => {
              console.log(error)
            },
            complete: () => {
              if(direccionCreada != null){
                const usuario = {
                  nombres: nombre,
                  apellidos: apellido,
                  id_direccion: this.idDireccionRegistrada,
                  correo_electronico: correo,
                  password: password
                } as UsuarioCreateInterface

                // Crear Usuario
                this.usuarioService.create(usuario)
                  .subscribe(
                    {
                      next: (data) => {
                        const  usuarioCreado = data as UsuarioInterface
                        this.snackBar.open('El usuario ha sido registrado con éxito!', 'OK', {
                          duration: 3000
                        });
                        //console.log(usuarioCreado)
                      },
                      error: (error) => {
                        console.log(error)
                      },
                      complete: () => {
                        const ruta = ['/login'];
                        this.router.navigate(ruta);
                      }
                    }
                  )
              }
            }
          }
        )
    }
  }

  guardarDireccion(){
    const referenciaDialogo = this.dialog.open(
      ModalDireccionComponent,
      {
        disableClose: false,
        data: {}
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            this.direccionTemp = datos['direccion']
            this.formGroupUsuario.patchValue({
              direccion: this.direccionService.getStringDireccion(this.direccionTemp),
            });
          }
        }
      )
  }

  verificarPassword(password: string, confirmacion: string){
    if(password === confirmacion){
      this.passwordCheck = true
    }else{
      this.passwordCheck = false
    }
  }

}
