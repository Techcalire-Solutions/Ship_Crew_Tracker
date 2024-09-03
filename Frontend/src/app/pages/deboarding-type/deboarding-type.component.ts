import { Component } from '@angular/core';
import { AddDeboardingTypeComponent } from './add-deboarding-type/add-deboarding-type.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DeboardingType } from '../../common/interfaces/deboarding-type';
import { EmployeeService } from '../../services/employee.service';
import { DeleteDialogueComponent } from '../../theme/components/delete-dialogue/delete-dialogue.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-deboarding-type',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './deboarding-type.component.html',
  styleUrl: './deboarding-type.component.scss'
})
export class DeboardingTypeComponent {
  ngOnDestroy(): void {
    this.deboardingtypeSub?.unsubscribe();
    this.delete?.unsubscribe();
  }

  constructor(private employeeService: EmployeeService, private dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.getDeboardingType()
    this.getRole()
  }

  deboardingtypeSub!: Subscription;
  deboardingtypes: DeboardingType[] = [];
  getDeboardingType(){
    this.deboardingtypeSub = this.employeeService.getDeboardingType(this.searchText, this.currentPage, this.pageSize).subscribe((deboardingtype: any) =>{
      console.log(deboardingtype);
      this.deboardingtypes = deboardingtype.items
    })
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  public onPageChanged(event: any){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getDeboardingType()
  }

  public searchText!: string;
  search(event: Event){
    this.searchText = (event.target as HTMLInputElement).value.trim()
    this.getDeboardingType()
  }

  addDeboardingType(deboardingtype: DeboardingType | null){
    let dialogRef = this.dialog.open(AddDeboardingTypeComponent, {
      data: deboardingtype
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getDeboardingType();
    });
  }

  delete!: Subscription;
  deleteDeboardingType(id: string){
    let dialogRef = this.dialog.open(DeleteDialogueComponent, {});
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.delete = this.employeeService.deleteDeboardingType(id).subscribe(res => {
          this.snackBar.open("DeboardingType deleted successfully...","" ,{duration:3000})
          this.getDeboardingType()
        });
      }
    });
  }

  roles: any[] = [];
  getRole(){
    this.employeeService.getRole(this.searchText, this.currentPage, this.pageSize).subscribe((role: any) =>{
      console.log(role);
      this.roles = role.items
    })
  }
}
