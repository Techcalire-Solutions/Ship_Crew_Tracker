import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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

  ngOnDestroy(): void {
    this.employeeSub.unsubscribe();
  }

  selectedEmployee!: Employee
  onSelectionChange(event: MatSelectionListChange) {
    this.selectedEmployee = event.options[0].value;
    if(this.selectedEmployee.currentStatus === 'In'){
      let dialogRef = this.dialog.open(DeboardingDialogComponent, {
        data: this.selectedEmployee
      });
      dialogRef.afterClosed().subscribe((res: any) => {
      });
    }else{
        let data = {
          employeeId: this.selectedEmployee._id,
          checkInTime: new Date()
        }
        this.employeeService.employeeCheckIn(data).subscribe((res: any) => {
          this.snackBar.open("Employee checkedin succesfully...","" ,{duration:3000})
          this.getEmployees()
        });
    }
  }
}
