import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-add-role',
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
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.scss'
})
export class AddRoleComponent {
  constructor(public dialogRef: MatDialogRef<AddRoleComponent>, @Inject(MAT_DIALOG_DATA) public role: any, private fb: FormBuilder,
  private snackBar: MatSnackBar, private employeeService: EmployeeService ) {}

  ngOnDestroy(): void {
    this.submit?.unsubscribe();
  }

  form!: FormGroup;
  ngOnInit(): void {
    this.form = this.fb.group({
      roleName: ['', Validators.required],
      status: [true, Validators.required]
    });

    if (this.role) {
      this.patchRole(this.role);
    }
  }

  patchRole(role: any){
    this.form.patchValue({
      roleName: role.roleName,
      status: role.status
    })
  }

  close(){
    this.dialogRef.close();
  }

  submit!: Subscription;
  onSubmit(){
    if(this.role){
      this.submit = this.employeeService.updateRole(this.form.getRawValue(), this.role._id).subscribe(role => {
        this.snackBar.open("Role updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
      });
    }else{
      this.submit = this.employeeService.addRole(this.form.getRawValue()).subscribe(role => {
        this.snackBar.open("Role added successfully...","" ,{duration:3000})
        this.dialogRef.close(role);
      });
    }
  }
}
