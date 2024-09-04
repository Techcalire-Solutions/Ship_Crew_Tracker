import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../common/interfaces/employee';
import { MatSelectModule } from '@angular/material/select';
import { AddEmployeeComponent } from '../../employees/add-employee/add-employee.component';
import { ShipService } from '../../../services/ship.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign-employees',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    DatePipe,
    MatSlideToggle,
    MatAutocompleteModule,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './assign-employees.component.html',
  styleUrl: './assign-employees.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
  ],
})
export class AssignEmployeesComponent implements OnInit, OnDestroy {
  form!: FormGroup
  ngOnDestroy(): void {
    this.submit?.unsubscribe();
    this.empSub?.unsubscribe();
  }

  fb = inject(FormBuilder)
  dialog = inject(MatDialog)
  snackBar = inject(MatSnackBar)
  constructor( @Optional() public dialogRef: MatDialogRef<AssignEmployeesComponent>, private employeeService: EmployeeService,
  @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any, private shipService: ShipService){}

  ngOnInit(): void {
    this.form = this.fb.group({
      shipId: [this.dialogData.id],
      employeeId: [],
      startingDate: [new Date()],
      status: [true]
    });

    this.getEmployee();
    this.getShipEmployees();
  }

  empSub!: Subscription;
  employees: Employee[] = [];
  getEmployee(){
    this.empSub = this.employeeService.getEmployee(this.filterValue).subscribe(employee =>{
      this.employees = employee
    });
  }

  filterValue: string = "";
  searchemployee(event: Event){
    this.filterValue = (event.target as HTMLInputElement).value.trim();
    console.log(this.filterValue);

    this.getEmployee()
  }

  addNewEmployee(data: any){
    data = {
      stage: 'filter',
      value: this.filterValue
    }
    let dialogRef = this.dialog.open(AddEmployeeComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getEmployee()
      this.form.get('employeeId')?.setValue(res._id)
    });
  }

  submit!: Subscription;
  onSubmit(){
    console.log(this.form.getRawValue());
    this.submit = this.shipService.addShipEmployee(this.form.getRawValue()).subscribe(res =>{
      this.snackBar.open("Employee Assigned successfully...","" ,{duration:3000})
    });
  }

  close(){
    this.dialogRef.close();
  }

  seSub!: Subscription;
  assignedEmployeeIds: any[] = [];
  getShipEmployees(){
    this.seSub = this.shipService.getShipEmployee().subscribe(ship => {
      this.assignedEmployeeIds = ship.map(employee => employee.employeeId);
    });
  }

}
