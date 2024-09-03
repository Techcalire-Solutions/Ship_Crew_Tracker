import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [
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
    MatSlideToggle
  ],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss'
})
export class AddDepartmentComponent {
  constructor(public dialogRef: MatDialogRef<AddDepartmentComponent>, @Inject(MAT_DIALOG_DATA) public department: any, private fb: FormBuilder,
  private snackBar: MatSnackBar, private employeeService: EmployeeService ) {}

  ngOnDestroy(): void {
    this.submit?.unsubscribe();
  }

  form!: FormGroup;
  ngOnInit(): void {
    this.form = this.fb.group({
      departmentName: ['', Validators.required],
      status: [true, Validators.required]
    });

    if (this.department) {
      this.patchDepartment(this.department);
    }
  }

  patchDepartment(department: any){
    this.form.patchValue({
      departmentName: department.departmentName,
      status: department.status
    })
  }

  close(){
    this.dialogRef.close();
  }

  submit!: Subscription;
  onSubmit(){
    if(this.department){
      this.submit = this.employeeService.updateDepartment(this.form.getRawValue(), this.department._id).subscribe(department => {
        this.snackBar.open("Department updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
      });
    }else{
      this.submit = this.employeeService.addDepartment(this.form.getRawValue()).subscribe(department => {
        this.snackBar.open("Department added successfully...","" ,{duration:3000})
        this.dialogRef.close(department);
      });
    }
  }
}
