import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RutaLoginComponent } from './rutas/ruta-login/ruta-login.component';
import { RutaNotFoundComponent } from './rutas/ruta-not-found/ruta-not-found.component';
import { InputGenericComponent } from './componentes/input-generic/input-generic.component';
import { RutaHomeComponent } from './rutas/ruta-home/ruta-home.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { RutaComprobantesComponent } from './rutas/ruta-comprobantes/ruta-comprobantes.component';
import { RutaSignupComponent } from './rutas/ruta-signup/ruta-signup.component';
import { BotonComprobanteComponent } from './componentes/boton-comprobante/boton-comprobante.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from "@angular/material/core";
import { ModalDireccionComponent } from './componentes/modal-direccion/modal-direccion.component';
import {MatIconModule} from "@angular/material/icon";
import { InputDireccionComponent } from './componentes/input-direccion/input-direccion.component';


@NgModule({
  declarations: [
    AppComponent,
    RutaLoginComponent,
    RutaNotFoundComponent,
    InputGenericComponent,
    RutaHomeComponent,
    RutaComprobantesComponent,
    RutaSignupComponent,
    BotonComprobanteComponent,
    ModalDireccionComponent,
    InputDireccionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
