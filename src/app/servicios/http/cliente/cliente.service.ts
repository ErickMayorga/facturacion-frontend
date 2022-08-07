import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ClienteInterface} from "./cliente.interface";
import {ClienteCreateInterface} from "./cliente-create.interface";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  url = environment.urlAPI + '/clientes'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: ClienteCreateInterface): Observable<ClienteInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ClienteInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<ClienteInterface[]>{
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
          (resultadoEnData) => resultadoEnData as ClienteInterface[]
        )
      );
  }
  get(idUsuario: number):Observable<ClienteInterface>{
    return this.httpClient
      .get(this.url + '/' + idUsuario)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ClienteInterface
        )
      );
  }

  update(idUsuario:number, object: ClienteInterface): Observable<ClienteInterface>{
    return this.httpClient.put(this.url  + '/' + idUsuario, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ClienteInterface
        )
      )
  }

  delete(idUsuario:number):Observable<ClienteInterface>{
    return this.httpClient.delete(this.url  + '/' + idUsuario)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ClienteInterface
        )
      )
  }

}
