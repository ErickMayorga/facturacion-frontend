import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {EmpresaCreateInterface} from "./empresa-create.interface";
import {EmpresaInterface} from "./empresa.interface";

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  url = environment.urlAPI + '/empresas'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: EmpresaCreateInterface): Observable<EmpresaInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as EmpresaInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<EmpresaInterface[]>{
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
          (resultadoEnData) => resultadoEnData as EmpresaInterface[]
        )
      );
  }
  get(idUsuario: number):Observable<EmpresaInterface>{
    return this.httpClient
      .get(this.url + '/' + idUsuario)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as EmpresaInterface
        )
      );
  }

  update(idUsuario:number, object: EmpresaInterface): Observable<EmpresaInterface>{
    return this.httpClient.put(this.url  + '/' + idUsuario, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as EmpresaInterface
        )
      )
  }

  delete(idUsuario:number):Observable<EmpresaInterface>{
    return this.httpClient.delete(this.url  + '/' + idUsuario)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as EmpresaInterface
        )
      )
  }
}
