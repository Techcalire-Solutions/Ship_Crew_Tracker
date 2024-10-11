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
import { OpenEmployeeComponent } from '../../employees/open-employee/open-employee.component';
import { BioVerficationComponent } from '../bio-verfication/bio-verfication.component';
import { MatPaginatorModule } from '@angular/material/paginator';

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
    MatListModule,
    MatPaginatorModule
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
    this.stayInEmployees();
    this.stayOutEmployees();
  }

  employeeSub!: Subscription;
  employees: Employee[] = [];
  getEmployees() {
    this.employeeSub = this.employeeService.getEmployee(this.searchText, this.currentPage, this.pageSize).subscribe((emp: any) => {
      this.employees = emp.items;
      this.totalItems = emp.count;
    });
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

  public userImage = 'img/users/default-user.jpg';
  image!: string;
  empIdSub!: Subscription;
  getEmployeeById(id: string){
    this.empIdSub = this.employeeService.getEmployeeByID(id).subscribe(emp => {
      this.image = emp.imageUrl;
    });
  }

  selectedEmployee: Employee | null = null
  @Output() apiCallEvent = new EventEmitter<void>();
  onSelectionChange(event: any) {
    this.selectedEmployee = event;
    let dialogRef = this.dialog.open(BioVerficationComponent, {
      data: this.selectedEmployee
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true && this.selectedEmployee) {
        if (this.selectedEmployee.currentStatus === 'In') {
          let dialogRef = this.dialog.open(DeboardingDialogComponent, {
            data: this.selectedEmployee
          });
          dialogRef.afterClosed().subscribe((res: any) => {
            if (res && res.employee.currentStatus && this.selectedEmployee) {
              this.selectedEmployee.currentStatus = res.employee.currentStatus;
            }
            this.apiCallEvent.emit();
            this.stayInEmployees();
            this.stayOutEmployees();
            this.selectedEmployee = null;
          });
        } else {
          let data = {
            employeeId: this.selectedEmployee._id,
            checkInTime: new Date()
          };
          this.employeeService.employeeCheckIn(data).subscribe(
            (res: any) => {
              console.log(res);
              this.snackBar.open("Employee checked In successfully...", "", { duration: 3000 });
              this.getEmployees();
              this.stayInEmployees();
              this.stayOutEmployees();
              this.apiCallEvent.emit();
              this.selectedEmployee = null; // Reset selectedEmployee
            },
            (error: any) => {
              console.error('Error occurred:', error);
              alert("Failed to check in employee. Please try again.");
              this.selectedEmployee = null; // Reset selectedEmployee on error
            }
          );
        }
      } else if (result === false) {
        this.snackBar.open("Verification failed, Please try again...", "", { duration: 3000 });
        this.selectedEmployee = null; // Reset selectedEmployee after failure
      }else{
        this.selectedEmployee = null;
      }
    });
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
      console.log(employees);

      this.outEmployees = employees;
      this.stayOutCount = employees.length;
    })
  }

  openEmployee(emp: Employee){
    let dialogRef = this.dialog.open(OpenEmployeeComponent, {
      data: {employee: emp}
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  onMouseEnter(event: MouseEvent): void {
    (event.target as HTMLElement).style.color = '#011b36'; // Change color on hover
  }

  onMouseLeave(event: MouseEvent): void {
    (event.target as HTMLElement).style.color = '#007bff'; // Revert color on leave
  }

  ngOnDestroy(): void {
    this.employeeSub.unsubscribe();
    this.stayInSub?.unsubscribe();
    this.stayOutSub?.unsubscribe();
  }

}
