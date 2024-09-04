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
import { MatListModule } from '@angular/material/list';

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

  form: FormGroup = this.fb.group({
    shipCode: [''],
    noOfEmployees: []
  });

  ngOnInit(): void {
    this.getShips();
    this.getEmployees();
  }

  shipSub!: Subscription;
  ships: Ship[] = [];
  getShips(){
    this.shipSub = this.shipService.getShip().subscribe(ship => {
      this.ships = ship;
    });
  }

  employeeSub!: Subscription;
  employees: Employee[] = [];
  getEmployees() {
    this.employeeSub = this.employeeService.getEmployee().subscribe(emp => {
      this.employees = emp;
      console.log(this.employees);

      for (let i = 0; i < this.assignedEmployeeIds.length; i++) {
        this.employees = this.employees.filter(emp => emp._id != this.assignedEmployeeIds[i].employeeId._id);
      }
      console.log(this.employees);
    });
  }

  public userImage = 'img/users/default-user.jpg';
  image!: string;
  empIdSub!: Subscription;
  getEmployeeById(id: string){
    this.empIdSub = this.employeeService.getEmployeeByID(id).subscribe(emp => {
      this.image = emp.image;
    });
  }

  ngOnDestroy(): void {
    this.shipSub.unsubscribe();
    this.employeeSub.unsubscribe();
  }

  assignedEmployeeIds: any[] = [];
  shipId!: string;
  getEmployeesByShip(id: string){
    this.shipId = id;
    this.shipService.getShipEmployeeByShipId(id).subscribe((emp: any) => {
      this.assignedEmployeeIds = emp
      this.getEmployees()
      this.patchShip(id)
    });
  }

  patchShip(id: string) {
    this.shipService.getShipById(id).subscribe((ship: any) => {
      console.log(ship);
      this.form.patchValue({
        shipCode: ship.shipCode,
        noOfEmployees: ship.noOfEmployees
      })
    });
  }
}
