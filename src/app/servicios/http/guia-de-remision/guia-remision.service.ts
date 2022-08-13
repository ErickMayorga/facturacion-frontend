import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GuiaRemisionCreateInterface} from "./guia-remision-create.interface";
import {GuiaRemisionInterface} from "./guia-remision.interface";

@Injectable({
  providedIn: 'root'
})
export class GuiaRemisionService {
  url = environment.urlAPI + '/guia-de-remision'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: GuiaRemisionCreateInterface): Observable<GuiaRemisionInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as GuiaRemisionInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<GuiaRemisionInterface[]>{
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
          (resultadoEnData) => resultadoEnData as GuiaRemisionInterface[]
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
          (resultadoEnData) => resultadoEnData as GuiaRemisionInterface[]
        )
      );
  }

  get(idObject: number):Observable<GuiaRemisionInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as GuiaRemisionInterface
        )
      );
  }

  update(idObject:number, object: GuiaRemisionInterface): Observable<GuiaRemisionInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as GuiaRemisionInterface
        )
      )
  }

  delete(idObject:number):Observable<GuiaRemisionInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as GuiaRemisionInterface
        )
      )
  }

  deshabilitar(idComprobante: number){
    return this.httpClient.delete(this.url  + '/deshabilitar/' + idComprobante)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as GuiaRemisionInterface
        )
      )
  }


}
