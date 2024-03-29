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
import { RutaFacturasComponent } from './rutas/ruta-facturas/ruta-facturas.component';
import { RutaGuiasDeRemisionComponent } from './rutas/ruta-guias-de-remision/ruta-guias-de-remision.component';
import { RutaNotasDeDebitoComponent } from './rutas/ruta-notas-de-debito/ruta-notas-de-debito.component';
import { RutaNotasDeCreditoComponent } from './rutas/ruta-notas-de-credito/ruta-notas-de-credito.component';
import { RutaRetencionesComponent } from './rutas/ruta-retenciones/ruta-retenciones.component';
import { RutaEmpresaComponent } from './rutas/ruta-empresa/ruta-empresa.component';
import { MatSnackBarModule} from "@angular/material/snack-bar";
import { RutaClientesComponent } from './rutas/ruta-clientes/ruta-clientes.component';
import { ModalClienteComponent } from './componentes/modal-cliente/modal-cliente.component';
import { RutaTransportistasComponent } from './rutas/ruta-transportistas/ruta-transportistas.component';
import { RutaProductosComponent } from './rutas/ruta-productos/ruta-productos.component';
import { ModalTransportistaComponent } from './componentes/modal-transportista/modal-transportista.component';
import { ModalProductoComponent } from './componentes/modal-producto/modal-producto.component';
import { ModalFacturaComponent } from './componentes/modal-factura/modal-factura.component';
import { ModalFormatoFacturaComponent } from './componentes/modal-formato-factura/modal-formato-factura.component';
import { ModalAgregarProductoComponent } from './componentes/modal-agregar-producto/modal-agregar-producto.component';
import { ModalAgregarPagoComponent } from './componentes/modal-agregar-pago/modal-agregar-pago.component';
import {CommonModule, DatePipe} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import { ModalAgregarDestinatarioComponent } from './componentes/modal-agregar-destinatario/modal-agregar-destinatario.component';
import { ModalAgregarImpuestoComponent } from './componentes/modal-agregar-impuesto/modal-agregar-impuesto.component';
import { ModalAgregarModificacionComponent } from './componentes/modal-agregar-modificacion/modal-agregar-modificacion.component';
import { ModalRetencionComponent } from './componentes/modal-retencion/modal-retencion.component';
import { ModalGuiaRemisionComponent } from './componentes/modal-guia-remision/modal-guia-remision.component';
import { ModalFormatoRetencionComponent } from './componentes/modal-formato-retencion/modal-formato-retencion.component';
import { ModalFormatoGuiaRemisionComponent } from './componentes/modal-formato-guia-remision/modal-formato-guia-remision.component';
import { ModalNotaCreditoComponent } from './componentes/modal-nota-credito/modal-nota-credito.component';
import { ModalFormatoNotaCreditoComponent } from './componentes/modal-formato-nota-credito/modal-formato-nota-credito.component';
import { ModalNotaDebitoComponent } from './componentes/modal-nota-debito/modal-nota-debito.component';
import { ModalFormatoNotaDebitoComponent } from './componentes/modal-formato-nota-debito/modal-formato-nota-debito.component';
import { PantallaIndicacionesComponent } from './componentes/pantalla-indicaciones/pantalla-indicaciones.component';
import { ConfirmacionDeAccionComponent } from './componentes/confirmacion-de-accion/confirmacion-de-accion.component';
import { ModalAgregarProductoNotaCreditoComponent } from './componentes/modal-agregar-producto-nota-credito/modal-agregar-producto-nota-credito.component';


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
    RutaFacturasComponent,
    RutaGuiasDeRemisionComponent,
    RutaNotasDeDebitoComponent,
    RutaNotasDeCreditoComponent,
    RutaRetencionesComponent,
    RutaEmpresaComponent,
    RutaClientesComponent,
    ModalClienteComponent,
    RutaTransportistasComponent,
    RutaProductosComponent,
    ModalTransportistaComponent,
    ModalProductoComponent,
    ModalFacturaComponent,
    ModalFormatoFacturaComponent,
    ModalAgregarProductoComponent,
    ModalAgregarPagoComponent,
    ModalAgregarDestinatarioComponent,
    ModalAgregarImpuestoComponent,
    ModalAgregarModificacionComponent,
    ModalRetencionComponent,
    ModalGuiaRemisionComponent,
    ModalFormatoRetencionComponent,
    ModalFormatoGuiaRemisionComponent,
    ModalNotaCreditoComponent,
    ModalFormatoNotaCreditoComponent,
    ModalNotaDebitoComponent,
    ModalFormatoNotaDebitoComponent,
    PantallaIndicacionesComponent,
    ConfirmacionDeAccionComponent,
    ModalAgregarProductoNotaCreditoComponent,
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
    MatIconModule,
    MatSnackBarModule,
    CommonModule,
    MatTabsModule
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
