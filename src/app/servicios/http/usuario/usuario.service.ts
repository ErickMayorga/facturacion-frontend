import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {UsuarioCreateInterface} from "./usuario-create.interface";
import {UsuarioInterface} from "./usuario.interface";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = environment.urlAPI + '/usuarios'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: UsuarioCreateInterface): Observable<UsuarioInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as UsuarioInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<UsuarioInterface[]>{
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
          (resultadoEnData) => resultadoEnData as UsuarioInterface[]
        )
      );
  }
  get(idObject: number):Observable<UsuarioInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as UsuarioInterface
        )
      );
  }

  update(idObject:number, object: UsuarioInterface): Observable<UsuarioInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as UsuarioInterface
        )
      )
  }

  delete(idObject:number):Observable<UsuarioInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as UsuarioInterface
        )
      )
  }


}
