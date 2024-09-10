import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../services/employee.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../common/interfaces/employee';
import { environment } from '../../../../environments/environment';
import { MatListModule } from '@angular/material/list';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeMonitoring } from '../../../common/interfaces/employee-monitoring';

@Component({
  selector: 'app-open-employee',
  standalone: true,
  imports: [ MatCardModule, MatDividerModule, MatIconModule, MatListModule, DatePipe, CommonModule, MatDialogModule],
  templateUrl: './open-employee.component.html',
  styleUrl: './open-employee.component.scss'
})
export class OpenEmployeeComponent implements OnInit, OnDestroy {
  constructor(public dialogRef: MatDialogRef<OpenEmployeeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
  private snackBar: MatSnackBar, private employeeService: EmployeeService ){}

  employee!: Employee;
  url = environment.baseUrl;
  public defaultUser = 'img/users/default-user.jpg';
  ngOnInit(): void {
    console.log(this.data.employee._id);

    this.getEmployee(this.data.employee._id)
  }

  getEmployee(id: string){
    console.log(id);

    this.employeeService.getEmployeeByID(id).subscribe(res => {
      console.log(res);

      this.employee = res;
      console.log(this.employee);
      this.getLog(id);
    });
  }

  logs: EmployeeMonitoring[] = [];
  getLog(id: string){
    this.employeeService.getEmployeeMonitoringData(id).subscribe(data =>{
      console.log(data);
      this.logs = data;
    });
  }

  ngOnDestroy(): void {
  }

  close(){
    this.dialogRef.close();
  }
}
