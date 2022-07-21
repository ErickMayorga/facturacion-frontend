import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RutaLoginComponent } from './rutas/ruta-login/ruta-login.component';
import { RutaNotFoundComponent } from './rutas/ruta-not-found/ruta-not-found.component';
import { InputGenericComponent } from './componentes/input-generic/input-generic.component';
import { RutaHomeComponent } from './rutas/ruta-home/ruta-home.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatDialogModule} from "@angular/material/dialog";
import { RutaComprobantesComponent } from './rutas/ruta-comprobantes/ruta-comprobantes.component';
import { RutaSignupComponent } from './rutas/ruta-signup/ruta-signup.component';
import { BotonComprobanteComponent } from './componentes/boton-comprobante/boton-comprobante.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
