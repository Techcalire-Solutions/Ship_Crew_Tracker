import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { Settings, SettingsService } from '../../services/settings.service';
import { EmployeeService } from '../../services/employee.service';
import { DeleteDialogueComponent } from '../../theme/components/delete-dialogue/delete-dialogue.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { environment } from '../../../environments/environment';
import { OpenEmployeeComponent } from './open-employee/open-employee.component';
import { Employee } from '../../common/interfaces/employee';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatCardModule,
    NgxPaginationModule,
    DatePipe,
    DeleteDialogueComponent
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  public settings: Settings;
  public userImage = 'img/add_user.png';
  public defaultUser = 'img/users/default-user.jpg';
  url = environment.baseUrl;
  constructor(public settingsService: SettingsService, private snackBar: MatSnackBar,
    public dialog: MatDialog, private employeeService: EmployeeService){
    this.settings = this.settingsService.settings;
  }

  ngOnDestroy(): void {
    this.employeeSub?.unsubscribe();
    this.delete?.unsubscribe();
  }

  ngOnInit(): void {
    this.getEmployees()
  }

  public addEmployee(data: any){
    let dialogData = {
      stage: 'update',
      value: data
    }
    let dialogRef = this.dialog.open(AddEmployeeComponent, {
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getEmployees();
    });
  }

  employees: any[] = [];
  employeeSub!: Subscription;
  getEmployees(){
    this.employeeSub = this.employeeService.getEmployee(this.searchText, this.currentPage, this.pageSize).subscribe((employee: any) => {
      this.employees = employee.items;
      this.totalItems = employee.count;
    })
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  public onPageChanged(event: any){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getEmployees()
  }

  public searchText!: string;
  search(event: Event){
    this.searchText = (event.target as HTMLInputElement).value
    this.getEmployees()
  }

  delete!: Subscription;
  deleteEmployee(id: string){
    let dialogRef = this.dialog.open(DeleteDialogueComponent, {});
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.delete = this.employeeService.deleteEmployee(id).subscribe(res => {
          this.snackBar.open("Employee deleted successfully...","" ,{duration:3000})
          this.getEmployees()
        });
      }
    });
  }

  onToggleChange(event: any, id: string) {
    const newValue = event.checked;
    let data = {
      status : newValue
    }
    this.employeeService.updateEmployeeStatus(id, data).subscribe(res => {
      this.snackBar.open("Status updated successfully...","" ,{duration:3000})
      this.getEmployees()
    });
  }

  openEmployee(emp: Employee){
    let dialogRef = this.dialog.open(OpenEmployeeComponent, {
      data: {employee: emp}
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

}
