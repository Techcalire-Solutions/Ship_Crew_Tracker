import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path: 'ship',
        loadComponent: () => import('./ship/ship.component').then(c => c.ShipComponent),
        data: { breadcrumb: 'Ships' }
      },
      {
        path: 'designation',
        loadComponent: () => import('./role/role.component').then(c => c.RoleComponent),
        data: { breadcrumb: 'Designations' }
      },
      {
        path: 'deboardingtype',
        loadComponent: () => import('./deboarding-type/deboarding-type.component').then(c => c.DeboardingTypeComponent),
        data: { breadcrumb: 'In & Out Types' }
      },
      {
        path: 'employees',
        loadComponent: () => import('./employees/employees.component').then(c => c.EmployeesComponent),
        data: { breadcrumb: 'Officers & Sailors' }
      },
      {
        path: 'deboarding',
        loadComponent: () => import('./dashboard/deboarding/deboarding.component').then(c => c.DeboardingComponent),
        data: { breadcrumb: 'Debording' }
      },
      {
        path: 'boarding',
        loadComponent: () => import('./dashboard/boarding/boarding.component').then(c => c.BoardingComponent),
        data: { breadcrumb: 'Boarding' }
      },
      {
        path: 'rank',
        loadComponent: () => import('./rank/rank.component').then(c => c.RankComponent),
        data: { breadcrumb: 'Ranks' }
      },
      {
        path: 'department',
        loadComponent: () => import('./department/department.component').then(c => c.DepartmentComponent),
        data: { breadcrumb: 'Departments' }
      },
    ]
  }
];
