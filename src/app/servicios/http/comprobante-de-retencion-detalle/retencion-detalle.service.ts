import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {RetencionDetalleCreateInterface} from "./retencion-detalle-create.interface";
import {RetencionDetalleInterface} from "./retencion-detalle.interface";

@Injectable({
  providedIn: 'root'
})
export class RetencionDetalleService {
  url = environment.urlAPI + '/retencion-detalle'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: RetencionDetalleCreateInterface): Observable<RetencionDetalleInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionDetalleInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<RetencionDetalleInterface[]>{
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
          (resultadoEnData) => resultadoEnData as RetencionDetalleInterface[]
        )
      );
  }

  get(idObject: number):Observable<RetencionDetalleInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionDetalleInterface
        )
      );
  }

  getDetalles(idComprobante: number) {
    return this.httpClient
      .get(
        this.url + '/comprobante/' + idComprobante,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionDetalleInterface[]
        )
      );
  }

  update(idObject:number, object: RetencionDetalleInterface): Observable<RetencionDetalleInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionDetalleInterface
        )
      )
  }

  delete(idObject:number):Observable<RetencionDetalleInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionDetalleInterface
        )
      )
  }

  deleteDetalle(idComprobante: number){
    return this.httpClient.delete(this.url  + '/comprobante/' + idComprobante)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionDetalleInterface[]
        )
      )
  }

}
