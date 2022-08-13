import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {DestinatarioCreateInterface} from "./destinatario-create.interface";
import {DestinatarioInterface} from "./destinatario.interface";

@Injectable({
  providedIn: 'root'
})
export class DestinatarioService {
  url = environment.urlAPI + '/destinatarios'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: DestinatarioCreateInterface): Observable<DestinatarioInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DestinatarioInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<DestinatarioInterface[]>{
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
          (resultadoEnData) => resultadoEnData as DestinatarioInterface[]
        )
      );
  }

  get(idObject: number):Observable<DestinatarioInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DestinatarioInterface
        )
      );
  }

  getDestinatarios(idComprobante: number) {
    return this.httpClient
      .get(
        this.url + '/comprobante/' + idComprobante,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DestinatarioInterface[]
        )
      );
  }

  update(idObject:number, object: DestinatarioInterface): Observable<DestinatarioInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DestinatarioInterface
        )
      )
  }

  delete(idObject:number):Observable<DestinatarioInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DestinatarioInterface
        )
      )
  }

  deleteDestinatarios(idComprobante: number){
    return this.httpClient.delete(this.url  + '/comprobante/' + idComprobante)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DestinatarioInterface[]
        )
      )
  }

}
