import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {DireccionCreateInterface} from "./direccion-create.interface";
import {DireccionInterface} from "./direccion.interface";


@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  url = environment.urlAPI + '/direcciones'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: DireccionCreateInterface): Observable<DireccionInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DireccionInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<DireccionInterface[]>{
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
          (resultadoEnData) => resultadoEnData as DireccionInterface[]
        )
      );
  }
  get(idUsuario: number):Observable<DireccionInterface>{
    return this.httpClient
      .get(this.url + '/' + idUsuario)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DireccionInterface
        )
      );
  }

  update(idUsuario:number, object: DireccionInterface): Observable<DireccionInterface>{
    return this.httpClient.put(this.url  + '/' + idUsuario, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DireccionInterface
        )
      )
  }

  delete(idUsuario:number):Observable<DireccionInterface>{
    return this.httpClient.delete(this.url  + '/' + idUsuario)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as DireccionInterface
        )
      )
  }

  getStringDireccion(direccionTemp: DireccionCreateInterface) {
    return direccionTemp.canton + ', ' + direccionTemp.parroquia + ', ' + direccionTemp.descripcion_exacta
  }
}
