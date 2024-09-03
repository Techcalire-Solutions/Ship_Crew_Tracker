import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-add-rank',
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
  templateUrl: './add-rank.component.html',
  styleUrl: './add-rank.component.scss'
})
export class AddRankComponent {
  constructor(public dialogRef: MatDialogRef<AddRankComponent>, @Inject(MAT_DIALOG_DATA) public rank: any, private fb: FormBuilder,
  private snackBar: MatSnackBar, private employeeService: EmployeeService ) {}

  ngOnDestroy(): void {
    this.submit?.unsubscribe();
  }

  form!: FormGroup;
  ngOnInit(): void {
    this.form = this.fb.group({
      rankName: ['', Validators.required],
      status: [true, Validators.required]
    });

    if (this.rank) {
      this.patchRank(this.rank);
    }
  }

  patchRank(rank: any){
    this.form.patchValue({
      rankName: rank.rankName,
      status: rank.status
    })
  }

  close(){
    this.dialogRef.close();
  }

  submit!: Subscription;
  onSubmit(){
    if(this.rank){
      this.submit = this.employeeService.updateRank(this.form.getRawValue(), this.rank._id).subscribe(rank => {
        this.snackBar.open("Rank updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
      });
    }else{
      this.submit = this.employeeService.addRank(this.form.getRawValue()).subscribe(rank => {
        this.snackBar.open("Rank added successfully...","" ,{duration:3000})
        this.dialogRef.close(rank);
      });
    }
  }
}
