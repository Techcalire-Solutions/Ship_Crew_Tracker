import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { Ship } from '../../../common/interfaces/ship';
import { ShipService } from '../../../services/ship.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-ship',
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
    DatePipe
  ],
  templateUrl: './add-ship.component.html',
  styleUrl: './add-ship.component.scss'
})
export class AddShipComponent implements OnInit, OnDestroy {
  constructor(public dialogRef: MatDialogRef<AddShipComponent>, @Inject(MAT_DIALOG_DATA) public ship: Ship, private fb: FormBuilder,
  private shipService: ShipService, private snackBar: MatSnackBar ) {}

  ngOnDestroy(): void {
    this.submit?.unsubscribe();
  }

  form!: FormGroup;
  ngOnInit(): void {
    this.form = this.fb.group({
      shipName: ['', Validators.required],
      noOfEmployees: [, Validators.required],
      shipCode: ['', Validators.required]
    });

    if (this.ship) {
      this.patchShip(this.ship);
    }
  }

  patchShip(ship: Ship){
    this.form.patchValue({
      shipName: ship.shipName,
      noOfEmployees: ship.noOfEmployees,
      shipCode: ship.shipCode
    })
  }

  close(){
    this.dialogRef.close();
  }

  submit!: Subscription;
  onSubmit(){
    if(this.ship){
      this.submit = this.shipService.updateShip(this.form.getRawValue(), this.ship._id).subscribe(ship => {
        console.log(ship);

        this.snackBar.open("Ship updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
      });
    }else{
      console.log(this.form.getRawValue());

      this.submit = this.shipService.addShip(this.form.getRawValue()).subscribe(ship => {
        console.log(ship);

        this.snackBar.open("Ship added successfully...","" ,{duration:3000})
        this.dialogRef.close();
      });
    }
  }
}
