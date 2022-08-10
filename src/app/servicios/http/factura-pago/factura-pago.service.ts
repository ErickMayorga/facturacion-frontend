import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {FacturaPagoCreateInterface} from "./factura-pago-create.interface";
import {FacturaPagoInterface} from "./factura-pago.interface";
import {FacturaDetalleInterface} from "../factura-detalle/factura-detalle.interface";

@Injectable({
  providedIn: 'root'
})
export class FacturaPagoService {
  url = environment.urlAPI + '/factura-pago'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: FacturaPagoCreateInterface): Observable<FacturaPagoInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaPagoInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<FacturaPagoInterface[]>{
    Object
      .keys(queryParams)
      .forEach( k => {
        if(!queryParams[k]){
          delete queryParams[k]
        }
      })
    return this.httpClient
      .get(
        this.url,
        {
          params: queryParams
        }
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaPagoInterface[]
        )
      );
  }

  get(idObject: number):Observable<FacturaPagoInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaPagoInterface
        )
      );
  }

  getPagosFactura(idFactura: number) {
    return this.httpClient
      .get(
        this.url + '/factura/' + idFactura,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaPagoInterface[]
        )
      );
  }

  update(idObject:number, object: FacturaPagoInterface): Observable<FacturaPagoInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaPagoInterface
        )
      )
  }

  delete(idObject:number):Observable<FacturaPagoInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaPagoInterface
        )
      )
  }

  deletePagos(idFactura: number){
    return this.httpClient.delete(this.url  + '/factura/' + idFactura)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaPagoInterface[]
        )
      )
  }
}
