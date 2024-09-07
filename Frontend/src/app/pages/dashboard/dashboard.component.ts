import { BoardingComponent } from './boarding/boarding.component';
import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import $ from 'jquery';
import { DeboardingComponent } from './deboarding/deboarding.component';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    DeboardingComponent,
    BoardingComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  employeeService = inject(EmployeeService)
  ngOnInit(): void {
    this.getEmployees();
    this.getBoardedEmployees();
    this.getDeBoardedEmployees();
    this.onLeaveEmployees();
  }

  activeTab: string = 'deboarding';

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  employeeSub!: Subscription;
  employeeCount!: number;
  getEmployees(){
    this.employeeSub = this.employeeService.getEmployee().subscribe(employees =>{
      this.employeeCount = employees.length;
    });
  }

  boardedSub!: Subscription;
  boardedCount!: number;
  getBoardedEmployees(){
    this.boardedSub = this.employeeService.getBoardedEmployee().subscribe(employees =>{
      this.boardedCount = employees.length;
    })
  }

  deboardedSub!: Subscription;
  deboardedCount!: number;
  stayInCount!: number;
  stayOutCount!: number;
  getDeBoardedEmployees(){
    this.deboardedSub = this.employeeService.getDeBoardedEmployee().subscribe(employees =>{
      console.log(employees);

      this.deboardedCount = employees.length;
      this.stayInCount = employees.filter(res=> res.deboardingTypeId.typeName === 'StayIn').length
      this.stayOutCount = employees.filter(res=> res.deboardingTypeId.typeName === 'StayOut').length
    })
  }

  onLeaveSub!: Subscription;
  onLeaveCount!: number;
  onLeaveEmployees(){
    this.onLeaveSub = this.employeeService.getOnLeaveEmployee().subscribe(employees =>{
      this.onLeaveCount = employees.length;
    })
  }

  tyDutySub!: Subscription;
  tyDutyCount: number = 0;
  tyDutyEmployees(){
    this.tyDutySub = this.employeeService.getEmployeeTyDuty().subscribe(employees =>{
      this.tyDutyCount = employees.length;
    })
  }

  hospitalSub!: Subscription;
  hospitalCount: number = 0;
  hospitalEmployees(){
    this.hospitalSub = this.employeeService.getHospitalEmployee().subscribe(employees =>{
      this.hospitalCount = employees.length;
    })
  }

  handleApiCall() {
    this.getEmployees()
    this.getBoardedEmployees()
    this.getDeBoardedEmployees()
    this.onLeaveEmployees()
  }

  ngOnDestroy(): void {
    this.employeeSub?.unsubscribe();
    this.boardedSub?.unsubscribe();
    this.deboardedSub?.unsubscribe();
    this.onLeaveSub?.unsubscribe();
  }
}


