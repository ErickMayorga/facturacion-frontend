import { Component, OnInit } from '@angular/core';
import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UsuarioService} from "../../servicios/http/usuario/usuario.service";
import {UsuarioCreateInterface} from "../../servicios/http/usuario/usuario-create.interface";
import {UsuarioInterface} from "../../servicios/http/usuario/usuario.interface";
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {MatDialog} from "@angular/material/dialog";
import {ModalDireccionComponent} from "../../componentes/modal-direccion/modal-direccion.component";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";

@Component({
  selector: 'app-ruta-signup',
  templateUrl: './ruta-signup.component.html',
  styleUrls: ['./ruta-signup.component.scss']
})
export class RutaSignupComponent implements OnInit {
  formGroupUsuario = new FormGroup({});

  fields: InputGenericInterface[] = [
    {
      title: 'Nombres',
      nameField: 'nombres',
      type: 'text',
      helpText: 'Ingrese sus nombres',
      requiredMessage: 'El campo nombres es requerido',
      lengthMessage: 'El campo nombres debe tener máximo 45 caracteres'
    },
    {
      title: 'Apellidos',
      nameField: 'apellidos',
      type: 'text',
      helpText: 'Ingrese sus apellidos',
      requiredMessage: 'El campo apellidos es requerido',
      lengthMessage: 'El campo apellidos debe tener máximo 45 caracteres'
    },
    {
      title: 'Correo electrónico',
      nameField: 'correo',
      type: 'email',
      helpText: 'Ingrese su correo electrónico',
      requiredMessage: 'El correo electrónico es requerido',
      lengthMessage: 'El correo debe tener máximo 45 caracteres'
    },
    {
      title: 'Dirección',
      nameField: 'direccion',
      type: 'text',
      helpText: 'Ingrese su dirección de domicilio',
      requiredMessage: 'La dirección es requerida',
      lengthMessage: ''
    },
    {
      title: 'Contraseña',
      nameField: 'passwordUsuario',
      type: 'password',
      helpText: 'Ingrese una contraseña entre 8 y 16 caracteres alfanuméricos',
      requiredMessage: 'La contraseña es requerida',
      lengthMessage: 'La contraseña debe tener entre 8 y 16 caracteres alfanuméricos'
    },
    {
      title: 'Confirma tu contraseña',
      nameField: 'passwordConfirmacion',
      type: 'password',
      helpText: 'Ingrese nuevamente su contraseña',
      requiredMessage: 'La confirmación de contraseña es requerida',
      lengthMessage: 'La contraseña debe tener entre 8 y 16 caracteres alfanuméricos'
    }

  ];

  passwordCheck = true
  direccionTemp: DireccionCreateInterface = {} as DireccionCreateInterface;
  idDireccionRegistrada = -1

  constructor(private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              private readonly usuarioService: UsuarioService,
              private readonly direccionService: DireccionService,
              public dialog: MatDialog) {

    this.formGroupUsuario =this.formBuilder.group(
      {
        nombres: ['', [Validators.required, Validators.max(45)]],
        apellidos: ['', [Validators.required, Validators.max(45)]],
        correo: ['', [Validators.required, Validators.email, Validators.max(45)]],
        direccion: ['', Validators.required],
        passwordUsuario: ['', [Validators.required, Validators.min(8), Validators.max(16)]],
        passwordConfirmacion: ['', [Validators.required, Validators.min(8), Validators.max(16)]],
      }
    )

    /*
    this.formGroupUsuario =this.formBuilder.group(
      {
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        correo: ['', Validators.required],
        direccion: ['', Validators.required],
        passwordUsuario: ['', Validators.required],
        passwordConfirmacion: ['', Validators.required],
      }
    )

     */
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

      this.direccionService.create(this.direccionTemp)
        .subscribe(
          {
            next: (data) => {
              const direccionCreada = data as DireccionInterface
              this.idDireccionRegistrada = direccionCreada.id_direccion
              console.log(direccionCreada)
            },
            error: (error) => {
              console.log(error)
            },
            complete: () => {
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
                      console.log(usuarioCreado)
                    },
                    error: (error) => {
                      console.log(error)
                    }
                  }
                )
            }
          }
        )
      const ruta = ['/login'];
      this.router.navigate(ruta);
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
