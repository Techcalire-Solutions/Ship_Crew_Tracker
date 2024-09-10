import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ShipService } from '../../../services/ship.service';
import { Subscription, startWith } from 'rxjs';
import { Ship } from '../../../common/interfaces/ship';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { Employee } from '../../../common/interfaces/employee';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatOptionModule } from '@angular/material/core';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { environment } from '../../../../environments/environment';
import { DeboardingDialogComponent } from '../deboarding-dialog/deboarding-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeMonitoring } from '../../../common/interfaces/employee-monitoring';

@Component({
  selector: 'app-deboarding',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    DragulaModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatListModule
  ],
  templateUrl: './deboarding.component.html',
  styleUrl: './deboarding.component.scss',
})
export class DeboardingComponent implements OnInit, OnDestroy {
  @Output() apiCallEvent = new EventEmitter<void>();

  shipService = inject(ShipService);
  employeeService = inject(EmployeeService);
  dragulaService = inject(DragulaService);
  snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder)
  dialog = inject(MatDialog);

  url = environment.baseUrl;
  form: FormGroup = this.fb.group({
    shipCode: [''],
    noOfEmployees: []
  });

  ngOnInit(): void {
    this.getEmployees();
    this.stayInEmployees();
    this.stayOutEmployees();
  }

  employeeSub!: Subscription;
  employees: Employee[] = [];
  getEmployees() {
    this.employeeSub = this.employeeService.getEmployee().subscribe(emp => {
      this.employees = emp;
      console.log(this.employees);

    });
  }

  public userImage = 'img/users/default-user.jpg';
  image!: string;
  empIdSub!: Subscription;
  getEmployeeById(id: string){
    this.empIdSub = this.employeeService.getEmployeeByID(id).subscribe(emp => {
      this.image = emp.imageUrl;
    });
  }

  selectedEmployee!: Employee
  onSelectionChange(event: MatSelectionListChange) {
    this.selectedEmployee = event.options[0].value;
    if(this.selectedEmployee.currentStatus === 'In'){
      let dialogRef = this.dialog.open(DeboardingDialogComponent, {
        data: this.selectedEmployee
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if (res && res.employee.currentStatus) {
          this.selectedEmployee.currentStatus = res.employee.currentStatus;
        }
        this.apiCallEvent.emit();
      });
    }else{
        let data = {
          employeeId: this.selectedEmployee._id,
          checkInTime: new Date()
        }
        this.employeeService.employeeCheckIn(data).subscribe((res: any) => {
          console.log(res);

          this.snackBar.open("Employee checked In succesfully...","" ,{duration:3000})
          this.getEmployees()
          this.apiCallEvent.emit();
        },  (error: any) => {
          // Error callback
          console.error('Error occurred:', error);
          alert("Failed to check in employee. Please try again.");
        });
    }
  }

  stayInSub!: Subscription;
  stayInCount: number = 0;
  inEmployees: EmployeeMonitoring[] = [];
  stayInEmployees(){
    this.stayInSub = this.employeeService.getStayIn().subscribe(employees =>{
      this.inEmployees = employees;
      this.stayInCount = employees.length;
    })
  }

  stayOutSub!: Subscription;
  stayOutCount: number = 0;
  outEmployees: EmployeeMonitoring[] = [];
  stayOutEmployees(){
    this.stayOutSub = this.employeeService.getStayOut().subscribe(employees =>{
      this.outEmployees = employees;
      this.stayOutCount = employees.length;
    })
  }

  ngOnDestroy(): void {
    this.employeeSub.unsubscribe();
    this.stayInSub?.unsubscribe();
    this.stayOutSub?.unsubscribe();
  }
}
