import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {RetencionCreateInterface} from "./retencion-create.interface";
import {RetencionInterface} from "./retencion.interface";

@Injectable({
  providedIn: 'root'
})
export class RetencionService {
  url = environment.urlAPI + '/retenciones'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: RetencionCreateInterface): Observable<RetencionInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<RetencionInterface[]>{
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
          (resultadoEnData) => resultadoEnData as RetencionInterface[]
        )
      );
  }

  getComprobantes(idEmpresa: number){
    return this.httpClient
      .get(
        this.url + '/empresa/' + idEmpresa,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionInterface[]
        )
      );
  }

  getComprobantesPorFactura(idFactura: number){
    return this.httpClient
      .get(
        this.url + '/factura/' + idFactura,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionInterface[]
        )
      );
  }

  get(idObject: number):Observable<RetencionInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionInterface
        )
      );
  }

  update(idObject:number, object: RetencionInterface): Observable<RetencionInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionInterface
        )
      )
  }

  delete(idObject:number):Observable<RetencionInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionInterface
        )
      )
  }

  deshabilitar(idComprobante: number){
    return this.httpClient.delete(this.url  + '/deshabilitar/' + idComprobante)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as RetencionInterface
        )
      )
  }


}
