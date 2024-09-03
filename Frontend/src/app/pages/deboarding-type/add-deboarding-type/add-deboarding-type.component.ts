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
import { DeboardingType } from '../../../common/interfaces/deboarding-type';

@Component({
  selector: 'app-add-deboarding-type',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggle
  ],
  templateUrl: './add-deboarding-type.component.html',
  styleUrl: './add-deboarding-type.component.scss'
})
export class AddDeboardingTypeComponent {
  constructor(public dialogRef: MatDialogRef<AddDeboardingTypeComponent>, @Inject(MAT_DIALOG_DATA) public deboardingtype: any, private fb: FormBuilder,
  private snackBar: MatSnackBar, private employeeService: EmployeeService ) {}

  ngOnDestroy(): void {
    this.submit?.unsubscribe();
  }

  form!: FormGroup;
  ngOnInit(): void {
    this.form = this.fb.group({
      typeName: ['', Validators.required],
      description: [''],
      curfewTime: ['', Validators.required],
      status: [true, Validators.required]
    });

    if (this.deboardingtype) {
      this.patchDeboardingType(this.deboardingtype);
    }

    if(this.deboardingtype){
      this.patchDeboardingType(this.deboardingtype)
    }
  }

  patchDeboardingType(deboardingtype: DeboardingType){
    this.form.patchValue({
      typeName: deboardingtype.typeName,
      description: deboardingtype.description,
      curfewTime: deboardingtype.curfewTime,
      status: deboardingtype.status
    })
  }

  close(){
    this.dialogRef.close();
  }

  submit!: Subscription;
  onSubmit(){
    if(this.deboardingtype){
      this.submit = this.employeeService.updateDeboardingType(this.form.getRawValue(), this.deboardingtype._id).subscribe(deboardingtype => {
        this.snackBar.open("DeboardingType updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
      });
    }else{
      this.submit = this.employeeService.addDeboardingType(this.form.getRawValue()).subscribe(deboardingtype => {
        this.snackBar.open("DeboardingType added successfully...","" ,{duration:3000})
        this.dialogRef.close(deboardingtype);
      });
    }
  }
}
