import { EmployeeService } from './../../services/employee.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Role } from '../../common/interfaces/role';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AddRoleComponent } from './add-role/add-role.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogueComponent } from '../../theme/components/delete-dialogue/delete-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit, OnDestroy{
  public userImage = 'img/add_user.png';
  ngOnDestroy(): void {
    this.roleSub?.unsubscribe();
    this.delete?.unsubscribe();
  }

  constructor(private employeeService: EmployeeService, private dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.getRole()
  }

  roleSub!: Subscription;
  roles: Role[] = [];
  getRole(){
    this.roleSub = this.employeeService.getRole(this.searchText, this.currentPage, this.pageSize).subscribe((role: any) =>{
      this.roles = role.items
    })
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  public onPageChanged(event: any){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getRole()
  }

  public searchText!: string;
  search(event: Event){
    this.searchText = (event.target as HTMLInputElement).value.trim()
    this.getRole()
  }

  addRole(role: Role | null){
    let dialogRef = this.dialog.open(AddRoleComponent, {
      data: role
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getRole();
    });
  }

  delete!: Subscription;
  deleteRole(id: string){
    let dialogRef = this.dialog.open(DeleteDialogueComponent, {});
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.delete = this.employeeService.deleteRole(id).subscribe(res => {
          this.snackBar.open("Role deleted successfully...","" ,{duration:3000})
          this.getRole()
        });
      }
    });
  }
}
