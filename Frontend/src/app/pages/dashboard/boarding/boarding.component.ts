import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from '../../../services/employee.service';
import { Subscription } from 'rxjs';
import { EmployeeMonitoring } from '../../../common/interfaces/employee-monitoring';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-boarding',
  standalone: true,
  imports: [ MatFormFieldModule, MatButtonToggleModule, MatIconModule, MatInputModule, DatePipe, CommonModule],
  templateUrl: './boarding.component.html',
  styleUrl: './boarding.component.scss'
})
export class BoardingComponent implements OnInit, OnDestroy{
  employeeService = inject(EmployeeService);
  ngOnInit(): void {
    this.getLog()
  }

  searchText: string = '';
  search(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value.trim()
    this.getLog()
  }

  logSub!: Subscription;
  logs: EmployeeMonitoring[] = [];
  getLog(){
    this.logSub = this.employeeService.getTodayMonitoringData(this.searchText).subscribe(data =>{
      this.logs = data;
    })
  }

  addRole(_t18: any) {
    throw new Error('Method not implemented.');
  }

  deleteRole(arg0: any) {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.logSub?.unsubscribe();
  }


}
