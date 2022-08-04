import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InputGenericInterface} from "../../servicios/interfaces/input-generic.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {ModalDireccionComponent} from "../../componentes/modal-direccion/modal-direccion.component";
import {MatDialog} from "@angular/material/dialog";
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {EmpresaCreateInterface} from "../../servicios/http/empresa/empresa-create.interface";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {UsuarioCreateInterface} from "../../servicios/http/usuario/usuario-create.interface";
import {UsuarioInterface} from "../../servicios/http/usuario/usuario.interface";

@Component({
  selector: 'app-ruta-empresa',
  templateUrl: './ruta-empresa.component.html',
  styleUrls: ['./ruta-empresa.component.scss']
})
export class RutaEmpresaComponent implements OnInit {

  formGroupEmpresa = new FormGroup({});
  fields: InputGenericInterface[] = [
    {
      title: 'RUC',
      nameField: 'ruc',
      type: 'text',
      helpText: 'Ingrese su número de RUC',
      requiredMessage: 'El RUC es requerido',
      lengthMessage: 'El RUC debe tener exactamente 13 caracteres'
    },
    {
      title: 'Razón Social',
      nameField: 'razon_social',
      type: 'text',
      helpText: 'Ingrese sus nombres o razón social',
      requiredMessage: 'La razón social es requerida',
      lengthMessage: 'La razón social debe tener máximo 100 caracteres'
    },
    {
      title: 'Nombre Comercial',
      nameField: 'nombre_comercial',
      type: 'text',
      helpText: 'Ingrese el nombre comercial de su empresa',
      lengthMessage: 'La razón social debe tener máximo 45 caracteres'
    },
    {
      title: 'Dirección Matriz',
      nameField: 'direccion_matriz',
      type: 'text',
      helpText: 'Ingrese la dirección de la matriz',
      requiredMessage: 'La dirección matriz es requerida',
    },
    {
      title: 'Dirección Establecimiento',
      nameField: 'direccion_establecimiento',
      type: 'text',
      helpText: 'Ingrese la dirección de su establecimiento',
      requiredMessage: 'La dirección establecimiento es requerida',
    },
    {
      title: 'Código de establecimiento',
      nameField: 'codigo_establecimiento',
      type: 'text',
      helpText: 'Ingrese un código para su establecimiento',
      requiredMessage: 'El código de establecimiento es requerido',
      lengthMessage: 'El código debe tener máximo 10 caracteres'
    },
    {
      title: 'Código del Punto de Emisión',
      nameField: 'codigo_punto_emision',
      type: 'text',
      helpText: 'Ingrese un código para su punto de emisión',
      requiredMessage: 'El código del punto de emisión es requerido',
      lengthMessage: 'El código debe tener máximo 10 caracteres'
    },
    {
      title: 'Contribuyente especial',
      nameField: 'contribuyente_especial',
      type: 'number',
      helpText: 'Ingrese su número de contribuyente especial',
      requiredMessage: 'El número de contribuyente es requerido',
      lengthMessage: 'El número de contribuyente debe ser mayor a 0'
    },
    {
      title: 'Obligado a llevar contabilidad',
      nameField: 'obligado_contabilidad',
      type: 'checkbox',
      helpText: 'Indique si está obligado a llevar contabilidad',
      requiredMessage: 'Este campo es requerido',
    },
    {
      title: 'Tipo de ambiente',
      nameField: 'ambiente',
      type: 'select',
      helpText: 'Seleccione un ambiente',
      requiredMessage: 'Este campo es requerido',
      options: ['Producción', 'Pruebas']
    },

  ];

  idUsuario: number = -1;
  idEmpresa: number = -1
  direccionMatriz: DireccionCreateInterface | DireccionInterface = {} as DireccionCreateInterface;
  idDireccionMatriz = -1
  direccionEstablecimiento: DireccionCreateInterface | DireccionInterface = {} as DireccionCreateInterface;
  idDireccionEstablecimiento = -1
  empresaRegistrada: EmpresaInterface = {} as EmpresaInterface ;
  tieneEmpresa = false

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly formBuilder: FormBuilder,
              private readonly empresaService: EmpresaService,
              private readonly direccionService: DireccionService,
              public dialog: MatDialog) {
    this.formGroupEmpresa =this.formBuilder.group(
      {
        ruc: ['', [Validators.required, Validators.maxLength(13)]],
        razon_social: ['', [Validators.required, Validators.maxLength(100)]],
        nombre_comercial: ['', [Validators.maxLength(45)]],
        direccion_matriz: ['', Validators.required],
        direccion_establecimiento: ['', Validators.required],
        codigo_establecimiento: ['', [Validators.required, Validators.maxLength(10)]],
        codigo_punto_emision: ['', [Validators.required, Validators.maxLength(10)]],
        contribuyente_especial: ['', Validators.required],
        obligado_contabilidad: [false, Validators.required],
        ambiente:['', Validators.required]
      }
    )
  }

  ngOnInit(): void {
    // @ts-ignore
    const parametroRuta$ = this.activatedRoute.parent.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          //console.log(parametrosRuta)
          this.idUsuario = Number.parseInt(parametrosRuta['idUsuario']);
          this.buscarEmpresa(this.idUsuario)
        }
      })
  }

  guardarInformacion() {
    if(this.tieneEmpresa){
      this.actualizarInformacion()
    }else{
      this.registrarInformación()
    }

  }

  private buscarEmpresa(idUsuario: number) {
    this.empresaService.getAll({})
      .subscribe(
        {
          next: (datos) => { // try then
            const empresas = datos as EmpresaInterface[]
            //console.log(usuarios)
            // Verificar correo y password
            for(let empresa of empresas){
              if(empresa.id_usuario === this.idUsuario){
                this.tieneEmpresa = true
                this.empresaRegistrada = empresa
                return
              }
            }
            //console.log('El correo y/o password no coinciden')
            this.tieneEmpresa = false
          },
          error: (error) => { // catch
            console.error({error});
          },
          complete: () => {
            if(this.tieneEmpresa){
              this.cargarInformacion()
            }
          }
        }
      )
  }

  guardarDireccion(name: string) {
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
            if(name === 'direccion_matriz'){
              this.direccionMatriz = datos['direccion']
              this.formGroupEmpresa.patchValue({
                direccion_matriz: this.direccionService.getStringDireccion(this.direccionMatriz),
              });
            }else if(name === 'direccion_establecimiento'){
              this.direccionEstablecimiento = datos['direccion']
              this.formGroupEmpresa.patchValue({
                direccion_establecimiento: this.direccionService.getStringDireccion(this.direccionEstablecimiento),
              });
            }
          }
        }
      )
  }

  private registrarEmpresa(){
    const ruc =  this.formGroupEmpresa.get('ruc')?.value.trim()
    const razon_social =  this.formGroupEmpresa.get('razon_social')?.value.trim()
    const nombre_comercial =  this.formGroupEmpresa.get('nombre_comercial')?.value.trim()
    const codigo_establecimiento =  this.formGroupEmpresa.get('codigo_establecimiento')?.value.trim()
    const codigo_punto_emision =  this.formGroupEmpresa.get('codigo_punto_emision')?.value.trim()
    const contribuyente_especial =  this.formGroupEmpresa.get('contribuyente_especial')?.value
    const obligado_contabilidad =  this.formGroupEmpresa.get('obligado_contabilidad')?.value
    const ambiente =  this.formGroupEmpresa.get('ambiente')?.value.trim()

    const empresa = {
      id_usuario: this.idUsuario,
      ruc: ruc,
      nombres_razon_social: razon_social,
      nombre_comercial: nombre_comercial,
      codigo_establecimiento: codigo_establecimiento,
      codigo_punto_emision: codigo_punto_emision,
      num_contribuyente_especial: contribuyente_especial,
      id_direccion_matriz: this.idDireccionMatriz,
      id_direccion_establecimiento: this.idDireccionEstablecimiento,
      obligado_contabilidad: obligado_contabilidad,
      path_logo: '',
      ambiente: ambiente
    } as EmpresaCreateInterface

    this.empresaService.create(empresa)
      .subscribe(
        {
          next: (data) => {
            const empresaCreada = data as EmpresaInterface
            this.empresaRegistrada = empresaCreada
            console.log(empresaCreada)
          },
          error: (error) => {
            console.log(error)
          }
        }
      )
  }

  private registrarInformación(){
    this.direccionService.create(this.direccionMatriz)
      .subscribe(
        {
          next: (data) => {
            const direccionCreada = data as DireccionInterface
            this.idDireccionMatriz = direccionCreada.id_direccion
            console.log(direccionCreada)
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.direccionService.create(this.direccionEstablecimiento)
              .subscribe(
                {
                  next: (data) => {
                    const direccionCreada = data as DireccionInterface
                    this.idDireccionEstablecimiento = direccionCreada.id_direccion
                    console.log(direccionCreada)
                  },
                  error: (error) => {
                    console.log(error)
                  },
                  complete: () => {
                    this.registrarEmpresa()
                  }
                }
              )
          }
        }
      )
  }

  private actualizarInformacion() {
    console.log('Requiere actualización')
  }

  private cargarInformacion() {
    this.direccionService.get(this.empresaRegistrada.id_direccion_matriz)
      .subscribe(
        {
          next: (datos) => { // try then
            const direccion = datos as DireccionInterface
            this.direccionMatriz = direccion
          },
          error: (error) => { // catch
            console.error({error});
          },
          complete: () => {
            this.direccionService.get(this.empresaRegistrada.id_direccion_establecimiento)
              .subscribe(
                {
                  next: (datos) => { // try then
                    const direccion = datos as DireccionInterface
                    this.direccionEstablecimiento = direccion
                  },
                  error: (error) => { // catch
                    console.error({error});
                  },
                  complete: () => {
                    this.formGroupEmpresa.patchValue({
                      ruc: this.empresaRegistrada.ruc,
                      razon_social: this.empresaRegistrada.nombres_razon_social,
                      nombre_comercial: this.empresaRegistrada.nombre_comercial,
                      direccion_matriz: this.direccionService.getStringDireccion(this.direccionMatriz),
                      direccion_establecimiento: this.direccionService.getStringDireccion(this.direccionEstablecimiento),
                      codigo_establecimiento: this.empresaRegistrada.codigo_establecimiento,
                      codigo_punto_emision: this.empresaRegistrada.codigo_punto_emision,
                      contribuyente_especial: this.empresaRegistrada.num_contribuyente_especial,
                      obligado_contabilidad: this.empresaRegistrada.obligado_contabilidad,
                      ambiente: this.empresaRegistrada.ambiente
                    });
                  }
                }
              )
          }
        }
      )
  }
}
