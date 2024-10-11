import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { DeboardingDialogComponent } from '../deboarding-dialog/deboarding-dialog.component';

@Component({
  selector: 'app-bio-verfication',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './bio-verfication.component.html',
  styleUrl: './bio-verfication.component.scss'
})
export class BioVerficationComponent {
  dialogRef = inject(MatDialogRef<BioVerficationComponent>)
  data = inject(MAT_DIALOG_DATA);
  employeeService = inject(EmployeeService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  public fingerImage = 'img/fingerprint.png';
  errorMessage: string | null = null;
  isVerifying: boolean = false;
  submit!: Subscription;
  async verifyBiometric() {
    this.isVerifying = true;
    try {
      this.submit = this.employeeService.getLastEntry(this.data.employeeCode).subscribe(res => {
        this.dialogRef.close(res);
        // if(res){

        //   // if(this.data.currentStatus === 'In'){
        //   //   let dialogRef = this.dialog.open(DeboardingDialogComponent, {
        //   //     data: this.data
        //   //   });
        //   //   dialogRef.afterClosed().subscribe((res: any) => {
        //   //     if (res && res.employee.currentStatus) {
        //   //       this.data.currentStatus = res.employee.currentStatus;
        //   //     }
        //   //     dialogRef.close();
        //   //     this.apiCallEvent.emit();
        //   //   });
        //   // }else{
        //   //     let data = {
        //   //       employeeId: this.data._id,
        //   //       checkInTime: new Date()
        //   //     }
        //   //     this.employeeService.employeeCheckIn(data).subscribe((res: any) => {
        //   //       this.snackBar.open("Employee checked In succesfully...","" ,{duration:3000})
        //   //       this.dialogRef.close();
        //   //       this.apiCallEvent.emit();
        //   //     },  (error: any) => {
        //   //       // Error callback
        //   //       console.error('Error occurred:', error);
        //   //       alert("Failed to check in employee. Please try again.");
        //   //     });
        //   //   }
        // }else{
        //   this.snackBar.open("Verification failed, Please try again...","" ,{duration:3000})
        //   this.dialogRef.close();
        // }
      })
    } catch (error) {
      this.errorMessage = 'Biometric Verification Failed';
      this.isVerifying = false;
    }
  }

  cancel() {
    this.dialogRef.close(); // Close dialog without success
  }
}
