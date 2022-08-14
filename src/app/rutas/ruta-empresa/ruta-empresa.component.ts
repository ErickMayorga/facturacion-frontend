import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EmpresaService} from "../../servicios/http/empresa/empresa.service";
import {ModalDireccionComponent} from "../../componentes/modal-direccion/modal-direccion.component";
import {MatDialog} from "@angular/material/dialog";
import {DireccionCreateInterface} from "../../servicios/http/direccion/direccion-create.interface";
import {DireccionService} from "../../servicios/http/direccion/direccion.service";
import {DireccionInterface} from "../../servicios/http/direccion/direccion.interface";
import {EmpresaCreateInterface} from "../../servicios/http/empresa/empresa-create.interface";
import {EmpresaInterface} from "../../servicios/http/empresa/empresa.interface";
import {MatSnackBar} from "@angular/material/snack-bar";
import {empresaForm} from "./empresa-form";

@Component({
  selector: 'app-ruta-empresa',
  templateUrl: './ruta-empresa.component.html',
  styleUrls: ['./ruta-empresa.component.scss']
})
export class RutaEmpresaComponent implements OnInit {

  formGroupEmpresa = new FormGroup({});
  fields = empresaForm

  idUsuario: number = -1;
  direccionMatrizRegistro: DireccionCreateInterface = {} as DireccionCreateInterface;
  direccionMatrizActual: DireccionInterface = {} as DireccionInterface
  idDireccionMatriz = -1
  direccionEstablecimientoRegistro: DireccionCreateInterface = {} as DireccionCreateInterface;
  direccionEstablecimientoActual: DireccionInterface = {} as DireccionInterface
  idDireccionEstablecimiento = -1
  empresaRegistrada: EmpresaInterface = {} as EmpresaInterface ;

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly formBuilder: FormBuilder,
              private readonly empresaService: EmpresaService,
              private readonly direccionService: DireccionService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {
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
    this.formGroupEmpresa.get('direccion_matriz')?.disable()
    this.formGroupEmpresa.get('direccion_establecimiento')?.disable()
  }

  ngOnInit(): void {
    // @ts-ignore
    const parametroRuta$ = this.activatedRoute.parent.params;
    parametroRuta$
      .subscribe({
        next:(parametrosRuta) => {
          //console.log(parametrosRuta)
          this.idUsuario = Number.parseInt(parametrosRuta['idUsuario']);
          this.buscarEmpresa()
        }
      })
  }

  // Carga inicial de empresa registrada (si existe)

  private buscarEmpresa() {
    this.empresaService.getEmpresa(this.idUsuario)
      .subscribe(
        {
          next: (datos) => { // try then
            this.empresaRegistrada = datos as EmpresaInterface
          },
          error: (error) => { // catch
            console.error({error});
          },
          complete: () => {
            if(this.empresaRegistrada != null){
              this.cargarInformacion()
            }
          }
        }
      )
  }

  private cargarInformacion() {
    this.direccionService.get(this.empresaRegistrada.id_direccion_matriz)
      .subscribe(
        {
          next: (datos) => { // try then
            const direccion = datos as DireccionInterface
            this.direccionMatrizActual = direccion
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
                    this.direccionEstablecimientoActual= direccion
                  },
                  error: (error) => { // catch
                    console.error({error});
                  },
                  complete: () => {
                    this.formGroupEmpresa.patchValue({
                      ruc: this.empresaRegistrada.ruc,
                      razon_social: this.empresaRegistrada.nombres_razon_social,
                      nombre_comercial: this.empresaRegistrada.nombre_comercial,
                      direccion_matriz: this.direccionService.getStringDireccion(this.direccionMatrizActual),
                      direccion_establecimiento: this.direccionService.getStringDireccion(this.direccionEstablecimientoActual),
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

  // Guardado general de información y direcciones

  guardarInformacion() {
    if(this.empresaRegistrada != null){
      this.actualizarInformacion()
    }else{
      this.registrarInformacion()
    }
  }

  guardarDireccion(name: string){
    let direccionObject = null
    if(name === 'direccion_matriz'){
      direccionObject = this.direccionMatrizActual
    }else{
      direccionObject = this.direccionEstablecimientoActual
    }
    const referenciaDialogo = this.dialog.open(
      ModalDireccionComponent,
      {
        disableClose: false,
        data: {
          direccionActual: direccionObject,
        }
      }
    )
    const despuesCerrado$ = referenciaDialogo.afterClosed()
    despuesCerrado$
      .subscribe(
        (datos) => {
          if(datos!=undefined){
            const direccion = datos['direccion']
            if(name === 'direccion_matriz'){
              if(this.empresaRegistrada === null){
                this.direccionMatrizRegistro = direccion as DireccionCreateInterface
              }else{
                this.direccionMatrizActual = direccion as DireccionInterface
              }
              this.formGroupEmpresa.patchValue({
                direccion_matriz: this.direccionService.getStringDireccion(direccion),
              });
            }else if(name === 'direccion_establecimiento'){
              if(this.empresaRegistrada === null){
                this.direccionEstablecimientoRegistro = direccion as DireccionCreateInterface
              }else {
                this.direccionEstablecimientoActual = direccion as DireccionInterface
              }
              this.formGroupEmpresa.patchValue({
                direccion_establecimiento: this.direccionService.getStringDireccion(direccion),
              });
            }
          }
        }
      )
  }

  // Registro de nueva información

  private registrarInformacion(){
    this.direccionService.create(this.direccionMatrizRegistro)
      .subscribe(
        {
          next: (data) => {
            const direccionCreada = data as DireccionInterface
            this.idDireccionMatriz = direccionCreada.id_direccion
            //console.log(direccionCreada)
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.direccionService.create(this.direccionEstablecimientoRegistro)
              .subscribe(
                {
                  next: (data) => {
                    const direccionCreada = data as DireccionInterface
                    this.idDireccionEstablecimiento = direccionCreada.id_direccion
                    //console.log(direccionCreada)
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
      num_contribuyente_especial: Number.parseInt(contribuyente_especial),
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
            this.snackBar.open('La información del emisor ha sido registrada con éxito!', 'OK', {
              duration: 3000
            });
            //console.log(empresaCreada)
          },
          error: (error) => {
            console.log(error)
          }
        }
      )
  }

  // Actualizar información existente
  private actualizarInformacion() {
    this.idDireccionMatriz = this.direccionMatrizActual.id_direccion
    this.idDireccionEstablecimiento = this.direccionEstablecimientoActual.id_direccion
    this.actualizarDirecciones()
    this.actualizarEmpresa()
  }

  private actualizarEmpresa() {
    const ruc =  this.formGroupEmpresa.get('ruc')?.value.trim()
    const razon_social =  this.formGroupEmpresa.get('razon_social')?.value.trim()
    const nombre_comercial =  this.formGroupEmpresa.get('nombre_comercial')?.value.trim()
    const codigo_establecimiento =  this.formGroupEmpresa.get('codigo_establecimiento')?.value.trim()
    const codigo_punto_emision =  this.formGroupEmpresa.get('codigo_punto_emision')?.value.trim()
    const contribuyente_especial =  this.formGroupEmpresa.get('contribuyente_especial')?.value
    const obligado_contabilidad =  this.formGroupEmpresa.get('obligado_contabilidad')?.value
    const ambiente =  this.formGroupEmpresa.get('ambiente')?.value.trim()

    const empresaActualizar = {
      id_empresa: this.empresaRegistrada.id_empresa,
      id_usuario: this.idUsuario,
      ruc: ruc,
      nombres_razon_social: razon_social,
      nombre_comercial: nombre_comercial,
      codigo_establecimiento: codigo_establecimiento,
      codigo_punto_emision: codigo_punto_emision,
      num_contribuyente_especial: Number.parseInt(contribuyente_especial),
      id_direccion_matriz: this.idDireccionMatriz,
      id_direccion_establecimiento: this.idDireccionEstablecimiento,
      obligado_contabilidad: obligado_contabilidad,
      path_logo: '',
      ambiente: ambiente
    } as EmpresaInterface

    const actualizar$ = this.empresaService.update(this.empresaRegistrada.id_empresa, empresaActualizar);
    actualizar$
      .subscribe(
        {
          next: (datos) => {
            this.snackBar.open('Se ha actualizado su información con éxito!', 'OK', {
              duration: 3000
            });
          },
          error: (error) => {
            console.error({error})
          }
        }
      )
  }

  private actualizarDirecciones() {
    const actualizarMatriz$ = this.direccionService.update(this.idDireccionMatriz, this.direccionMatrizActual)
    actualizarMatriz$
      .subscribe(
        {
          next: (datos) => {
            //console.log(datos)
            //this._snackBar.open('Se ha actualizado su información con éxito')
          },
          error: (error) => {
            console.error({error})
          }
        }
      )

    const actualizarEstablecimiento$ = this.direccionService.update(this.idDireccionEstablecimiento, this.direccionEstablecimientoActual)
    actualizarEstablecimiento$
      .subscribe(
        {
          next: (datos) => {
            //this._snackBar.open('Se ha actualizado su información con éxito')
          },
          error: (error) => {
            console.error({error})
          }
        }
      )
  }
}
