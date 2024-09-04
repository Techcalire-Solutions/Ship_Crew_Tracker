import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog';
import { Settings, SettingsService } from '../../services/settings.service';
import { ShipService } from '../../services/ship.service';
import { Subscription } from 'rxjs';
import { AddShipComponent } from './add-ship/add-ship.component';
import { DeleteDialogueComponent } from '../../theme/components/delete-dialogue/delete-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignEmployeesComponent } from './assign-employees/assign-employees.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';

@Component({
  selector: 'app-ship',
  standalone: true,
  imports: [
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatCardModule,
    NgxPaginationModule,
    DatePipe,
    DeleteDialogueComponent,
    CommonModule
  ],
  templateUrl: './ship.component.html',
  styleUrl: './ship.component.scss'
})
export class ShipComponent implements OnInit, OnDestroy {
  public shipImage = 'img/ship_image.png'
  public settings: Settings;
  constructor(public settingsService: SettingsService, private snackBar: MatSnackBar,
    public dialog: MatDialog, private shipService: ShipService){
    this.settings = this.settingsService.settings;
  }

  public userImage = 'img/users/default-user.jpg';

  ngOnDestroy(): void {
    this.shipSub?.unsubscribe();
    this.delete?.unsubscribe();
  }

  ngOnInit(): void {
    this.getShips()
  }

  public addShip(data: any){
    let dialogRef = this.dialog.open(AddShipComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getShips();
    });
  }

  public assignEmployeesShip(id: string){
    let dialogRef = this.dialog.open(AssignEmployeesComponent, {
      data: {id: id},
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getShips();
    });
  }

  ships: any[] = [];
  shipSub!: Subscription;
  getShips(){
    this.shipSub = this.shipService.getShip(this.searchText, this.currentPage, this.pageSize).subscribe((ship: any) => {
      this.ships = ship.items;
      this.totalItems = ship.count;
    })
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  public onPageChanged(event: any){
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getShips()
  }

  public searchText!: string;
  search(){
    console.log(this.searchText);
    this.getShips()
  }

  delete!: Subscription;
  deleteShip(id: string){
    let dialogRef = this.dialog.open(DeleteDialogueComponent, {});
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.delete = this.shipService.deleteShip(id).subscribe(res => {
          this.snackBar.open("Ship deleted successfully...","" ,{duration:3000})
          this.getShips()
        });
      }
    });
  }

  assignEmployees(){

  }

  viewEmployeeList(id: string){
    let dialogRef = this.dialog.open(EmployeeListComponent, {
      data: {id: id},
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getShips();
    });
  }

}
