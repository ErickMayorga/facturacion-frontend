import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {TransportistaInterface} from "./transportista.interface";
import {TransportistaCreateInterface} from "./transportista-create.interface";

@Injectable({
  providedIn: 'root'
})
export class TransportistaService {
  url = environment.urlAPI + '/transportistas'

  constructor(private readonly httpClient: HttpClient) {

  }

  create(object: TransportistaCreateInterface): Observable<TransportistaInterface>{
    return this.httpClient.post(this.url,object,{})
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as TransportistaInterface
        )
      );
  }

  getAll(queryParams?:any): Observable<TransportistaInterface[]>{
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
          (resultadoEnData) => resultadoEnData as TransportistaInterface[]
        )
      );
  }
  get(idObject: number):Observable<TransportistaInterface>{
    return this.httpClient
      .get(this.url + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as TransportistaInterface
        )
      );
  }

  update(idObject:number, object: TransportistaInterface): Observable<TransportistaInterface>{
    return this.httpClient.put(this.url  + '/' + idObject, object)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as TransportistaInterface
        )
      )
  }

  delete(idObject:number):Observable<TransportistaInterface>{
    return this.httpClient.delete(this.url  + '/' + idObject)
      .pipe(
        map(
          (resultadoEnData) => resultadoEnData as TransportistaInterface
        )
      )
  }

}
