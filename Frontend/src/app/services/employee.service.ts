import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../common/interfaces/role';
import { DeboardingType } from '../common/interfaces/deboarding-type';
import { Employee } from '../common/interfaces/employee';
import { Rank } from '../common/interfaces/rank';
import { Department } from '../common/interfaces/department';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private _http: HttpClient) { }
  url = environment.baseUrl

  getRole(search?:string, page?: number, pageSize?: number):Observable<Role[]>{
    return this._http.get<Role[]>(this.url + `/role/findall?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  addRole(data: any){
    return this._http.post(this.url + `/role/add`, data);
  }

  updateRole(data: any, id: string){
    return this._http.patch(this.url + `/role/edit/`+ id, data);
  }

  deleteRole(id: string){
    return this._http.delete(this.url + `/role/delete/`+ id);
  }

  getDeboardingType(search?:string, page?: number, pageSize?: number):Observable<DeboardingType[]>{
    return this._http.get<DeboardingType[]>(this.url + `/deboardingtype/findall?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  addDeboardingType(data: any){
    return this._http.post(this.url + `/deboardingtype/add`, data);
  }

  updateDeboardingType(data: any, id: string){
    return this._http.patch(this.url + `/deboardingtype/edit/`+ id, data);
  }

  deleteDeboardingType(id: string){
    return this._http.delete(this.url + `/deboardingtype/delete/`+ id);
  }

  getEmployee(search?:string, page?: number, pageSize?: number):Observable<Employee[]>{
    return this._http.get<Employee[]>(this.url + `/employee/findall?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  getEmployeeByID(id: string):Observable<Employee>{
    return this._http.get<Employee>(this.url + `/employee/findbyid` + id);
  }

  uploadEmployeeImage(file: any): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + '/employee/fileupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  deleteImage(fileName: string){
    return this._http.delete(this.url + `/employee/filedelete/?fileName=${fileName}`);
  }

  addEmployee(data: any){
    return this._http.post(this.url + `/employee/add`, data);
  }

  updateEmployee(data: any, id: string){
    return this._http.patch(this.url + `/employee/edit/`+ id, data);
  }

  deleteEmployee(id: string){
    return this._http.delete(this.url + `/employee/delete/`+ id);
  }

  updateEmployeeStatus(id: string, data: any){
    return this._http.patch(this.url + `/employee/updatestatus/`+ id, data);
  }

  getRank(search?:string, page?: number, pageSize?: number):Observable<Rank[]>{
    return this._http.get<Rank[]>(this.url + `/rank/findall?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  addRank(data: any){
    return this._http.post(this.url + `/rank/add`, data);
  }

  updateRank(data: any, id: string){
    return this._http.patch(this.url + `/rank/edit/`+ id, data);
  }

  deleteRank(id: string){
    return this._http.delete(this.url + `/rank/delete/`+ id);
  }

  getDepartment(search?:string, page?: number, pageSize?: number):Observable<Department[]>{
    return this._http.get<Department[]>(this.url + `/department/findall?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  addDepartment(data: any){
    return this._http.post(this.url + `/department/add`, data);
  }

  updateDepartment(data: any, id: string){
    return this._http.patch(this.url + `/department/edit/`+ id, data);
  }

  deleteDepartment(id: string){
    return this._http.delete(this.url + `/department/delete/`+ id);
  }

  employeeCheckingOut(data: any){
    return this._http.post(this.url + `/employeemonitoring/checkout/`, data);
  }
  employeeCheckIn(data: any){
    return this._http.patch(this.url + `/employeemonitoring/checkin/`, data);
  }
}
