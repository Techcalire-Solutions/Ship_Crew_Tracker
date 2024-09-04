import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Ship } from '../common/interfaces/ship';
import { Observable } from 'rxjs';
import { ShipEmployee } from '../common/interfaces/ship-employee';

@Injectable({
  providedIn: 'root'
})
export class ShipService {

  constructor(private _http: HttpClient) { }
  url = environment.baseUrl

  getShip(search?:string, page?: number, pageSize?: number):Observable<Ship[]>{
    return this._http.get<Ship[]>(this.url + `/ship/findall?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getShipById(id: string):Observable<Ship>{
    return this._http.get<Ship>(this.url + `/ship/findbyid/` + id);
  }

  addShip(data: any){
    return this._http.post(this.url + `/ship/add`, data);
  }

  updateShip(data: any, id: string){
    return this._http.patch(this.url + `/ship/edit/`+ id, data);
  }

  deleteShip(id: string){
    return this._http.delete(this.url + `/ship/delete/`+ id);
  }

  updateShipStatus(id: string, data: any){
    return this._http.patch(this.url + `/ship/updatestatus/`+ id, data);
  }

  getShipEmployee(search?:string, page?: number, pageSize?: number):Observable<ShipEmployee[]>{
    return this._http.get<ShipEmployee[]>(this.url + `/shipemployee/findall?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  addShipEmployee(data: any){
    return this._http.post(this.url + `/shipemployee/add`, data);
  }

  updateShipEmployee(data: any, id: string){
    return this._http.patch(this.url + `/shipemployee/edit/`+ id, data);
  }

  deleteShipEmployee(id: string){
    return this._http.delete(this.url + `/shipemployee/delete/`+ id);
  }

  updateShipEmployeeStatus(id: string, data: any){
    return this._http.patch(this.url + `/shipemployee/updatestatus/`+ id, data);
  }

  getShipEmployeeByShipId(id: string, search?:string, page?: number, pageSize?: number):Observable<ShipEmployee[]>{
    return this._http.get<ShipEmployee[]>(this.url + `/shipemployee/findallbyship?id=${id}&search=${search}&page=${page}&pageSize=${pageSize}`);
  }

}
