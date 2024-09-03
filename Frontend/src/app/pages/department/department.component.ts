import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Department } from '../../common/interfaces/department';
import { EmployeeService } from '../../services/employee.service';
import { DeleteDialogueComponent } from '../../theme/components/delete-dialogue/delete-dialogue.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent {
  ngOnDestroy(): void {
    this.departmentSub?.unsubscribe();
    this.delete?.unsubscribe();
  }

  image = 'img/adddepartment.png'

  constructor(private employeeService: EmployeeService, private dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.getDepartment()
  }

  departmentSub!: Subscription;
  departments: Department[] = [];
  getDepartment(){
    this.departmentSub = this.employeeService.getDepartment(this.searchText, this.currentPage, this.pageSize).subscribe((department: any) =>{
      console.log(department);
      this.departments = department.items
    })
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  public onPageChanged(event: any){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getDepartment()
  }

  public searchText!: string;
  search(event: Event){
    this.searchText = (event.target as HTMLInputElement).value.trim()
    this.getDepartment()
  }

  addDepartment(department: Department | null){
    let dialogRef = this.dialog.open(AddDepartmentComponent, {
      data: department
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getDepartment();
    });
  }

  delete!: Subscription;
  deleteDepartment(id: string){
    let dialogRef = this.dialog.open(DeleteDialogueComponent, {});
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.delete = this.employeeService.deleteDepartment(id).subscribe(res => {
          this.snackBar.open("Department deleted successfully...","" ,{duration:3000})
          this.getDepartment()
        });
      }
    });
  }
}
