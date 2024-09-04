import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatListModule } from '@angular/material/list';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../../../services/employee.service';
import { ShipService } from '../../../services/ship.service';
import { ShipEmployee } from '../../../common/interfaces/ship-employee';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  constructor( @Optional() public dialogRef: MatDialogRef<EmployeeListComponent>, private employeeService: EmployeeService,
  @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any, private shipService: ShipService){}

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.viewList(this.dialogData.id)
  }

  employee: ShipEmployee[] = [];
  viewList(id: string){
    this.shipService.getShipEmployeeByShipId(id).subscribe(employ => {
      this.employee = employ
      console.log(this.employee);
    });
  }


}
