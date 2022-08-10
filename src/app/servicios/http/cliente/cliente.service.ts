import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ClienteInterface} from "./cliente.interface";
import {ClienteCreateInterface} from "./cliente-create.interface";
import {EmpresaInterface} from "../empresa/empresa.interface";

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

  get(idObject: number):Observable<ClienteInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ClienteInterface
        )
      );
  }

  getCliente(cedula: string) {
    return this.httpClient
      .get(
        this.url + '/cedula/' + cedula,
      )
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ClienteInterface
        )
      );
  }

  update(idObject:number, object: ClienteInterface): Observable<ClienteInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ClienteInterface
        )
      )
  }

  delete(idObject:number):Observable<ClienteInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as ClienteInterface
        )
      )
  }

}
