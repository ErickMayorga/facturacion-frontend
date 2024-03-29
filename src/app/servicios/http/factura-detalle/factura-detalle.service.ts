import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {FacturaDetalleCreateInterface} from "./factura-detalle-create.interface";
import {FacturaDetalleInterface} from "./factura-detalle.interface";

@Injectable({
  providedIn: 'root'
})
export class FacturaDetalleService {
  url = environment.urlAPI + '/factura-detalle'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: FacturaDetalleCreateInterface): Observable<FacturaDetalleInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<FacturaDetalleInterface[]>{
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
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface[]
        )
      );
  }

  get(idObject: number):Observable<FacturaDetalleInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface
        )
      );
  }

  getDetalleFactura(idComprobante: number) {
    return this.httpClient
      .get(
        this.url + '/comprobante/' + idComprobante,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface[]
        )
      );
  }

  update(idObject:number, object: FacturaDetalleInterface): Observable<FacturaDetalleInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface
        )
      )
  }

  delete(idObject:number):Observable<FacturaDetalleInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface
        )
      )
  }

  deleteDetalle(idComprobante: number){
    return this.httpClient.delete(this.url  + '/comprobante/' + idComprobante)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as FacturaDetalleInterface[]
        )
      )
  }

}
