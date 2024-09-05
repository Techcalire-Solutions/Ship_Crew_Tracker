
import { MatCardModule } from '@angular/material/card';
import { DeboardingType } from '../../../common/interfaces/deboarding-type';
import { EmployeeService } from './../../../services/employee.service';
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-deboarding-dialog',
  standalone: true,
  imports: [MatCardModule, MatRadioModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './deboarding-dialog.component.html',
  styleUrl: './deboarding-dialog.component.scss'
})
export class DeboardingDialogComponent implements OnInit, OnDestroy{
  employeeService = inject(EmployeeService);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  constructor(public dialogRef: MatDialogRef<DeboardingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any){}

  form!: FormGroup
  ngOnInit(): void {
    this.form = this.fb.group({
      employeeId: [this.data._id],
      checkOutTime: [new Date()],
      currentStatus: [false],
      purpose: [''],
      status: [false]
    });

    this.getDeboardingType();
    console.log(this.data);

  }

  deboardSub!: Subscription;
  deboarding: DeboardingType[] = [];
  getDeboardingType(){
    this.deboardSub = this.employeeService.getDeboardingType().subscribe(deboardingType =>{
      this.deboarding = deboardingType;
    });
  }

  submit!: Subscription;
  onSubmit(){
    this.submit = this.employeeService.employeeCheckingOut(this.form.getRawValue()).subscribe(res=>{
      this.dialogRef.close(res);
      this.snackBar.open("Employee Checked Out succesfully...","" ,{duration:3000})
    })
  }

  close(){
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.deboardSub?.unsubscribe();
    this.submit?.unsubscribe();
  }
}
