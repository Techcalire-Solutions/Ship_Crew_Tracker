import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { map, startWith, Subscription } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { Role } from '../../../common/interfaces/role';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DeboardingType } from '../../../common/interfaces/deboarding-type';
import { Employee } from '../../../common/interfaces/employee';
import {MatSelectModule} from '@angular/material/select';
import { MatSelectSearchModule } from 'mat-select-search';
import { Rank } from '../../../common/interfaces/rank';
import { Department } from '../../../common/interfaces/department';
import { AddRoleComponent } from '../../role/add-role/add-role.component';
import { AddRankComponent } from '../../rank/add-rank/add-rank.component';
import { AddDepartmentComponent } from '../../department/add-department/add-department.component';
import { AddDeboardingTypeComponent } from '../../deboarding-type/add-deboarding-type/add-deboarding-type.component';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-add-employee',
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
    MatSlideToggle,
    CommonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSelectSearchModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
  ],
})
export class AddEmployeeComponent {
  imageUrl: string = '';
  dialog = inject(MatDialog)
  constructor(public dialogRef: MatDialogRef<AddEmployeeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
  private snackBar: MatSnackBar, private employeeService: EmployeeService ) {}

  searchCtrl = new FormControl();
  ngOnDestroy(): void {
    this.submit?.unsubscribe();
  }

  form!: FormGroup;
  updateStatus: boolean = false;
  ngOnInit(): void {

    this.form = this.fb.group({
      name : ['', Validators.required],
      employeeCode : ['', Validators.required],
      deboardingTypeId : [],
      status : [true],
      roleId : [, Validators.required],
      phoneNumber : ['', [Validators.required, Validators.pattern("^[0-9 +]*$"), Validators.minLength(10), Validators.maxLength(14)]],
      email : ['', Validators.email],
      joiningDate : ['', Validators.required],
      rankId : [, Validators.required],
      departmentId : [],
      address : [''],
      imageUrl: [''],
      imageName: ['']
    });

    if(this.data?.stage === 'update' && this.data.value != null){
      this.updateStatus = true;
      this.patchEmployee(this.data.value);
    }else if(this.data?.stage === 'filter'){
      console.log(this.data.value);
      this.form.get('name')?.setValue(this.data.value);
    }

    this.getRole();
    this.getRank();
    this.getDeboardingType();
    this.getDepartment();
  }

  roleSub!: Subscription;
  roles: Role[] = [];
  getRole(){
    this.roleSub = this.employeeService.getRole(this.filterRole).subscribe(role => {
      this.roles = role;
    });
  }

  filterRole: string = '';
  search(event: Event){
    this.filterRole = (event.target as HTMLInputElement).value;
    this.getRole();
  }

  addRole(){
    let dialogRef = this.dialog.open(AddRoleComponent, {});
    dialogRef.afterClosed().subscribe((res: any) => {
      this.filterRole = ''
      this.getRole();
      this.form.get('roleId')?.setValue(res._id)
    });
  }

  rankSub!: Subscription;
  ranks: Rank[] = [];
  getRank(){
    this.rankSub = this.employeeService.getRank(this.filterRank).subscribe(rank => {
      this.ranks = rank;
    });
  }

  filterRank: string = '';
  searchRank(event: Event){
    this.filterRank = (event.target as HTMLInputElement).value;
    this.getRank();
  }

  addRank(){
    let dialogRef = this.dialog.open(AddRankComponent, {});
    dialogRef.afterClosed().subscribe((res: any) => {
      this.filterRank = '';
      this.getRank();
      this.form.get('rankId')?.setValue(res._id)
    });
  }

  departmentSub!: Subscription;
  departments: Department[] = [];
  getDepartment(){
    this.departmentSub = this.employeeService.getDepartment(this.filterDept).subscribe(rank => {
      this.departments = rank;
    });
  }

  filterDept: string = '';
  searchDept(event: Event){
    this.filterDept = (event.target as HTMLInputElement).value;
    this.getDepartment()
  }

  addDepat(){
    let dialogRef = this.dialog.open(AddDepartmentComponent, {});
    dialogRef.afterClosed().subscribe((res: any) => {
      this.filterDept = '';
      this.getDepartment();
      this.form.get('departmentId')?.setValue(res._id)
    });
  }

  deboardSub!: Subscription;
  deboarding: DeboardingType[] = [];
  getDeboardingType(){
    this.deboardSub = this.employeeService.getDeboardingType(this.filteDeboard).subscribe(deboardingType =>{
      this.deboarding = deboardingType.filter(item => {
        return item.typeName === 'StayIn' || item.typeName === 'StayOut';
      });
    });
  }

  filteDeboard: string = '';
  searchDeboard(event: Event){
    this.filteDeboard = (event.target as HTMLInputElement).value;
    this.getDeboardingType()
  }

  addDeboard(){
    let dialogRef = this.dialog.open(AddDeboardingTypeComponent, {});
    dialogRef.afterClosed().subscribe((res: any) => {
      this.filteDeboard = ''
      this.getDeboardingType();
      this.form.get('deboardingTypeId')?.setValue(res._id)
    });
  }

  patchEmployee(employee: Employee){
    console.log(employee);

    this.form.patchValue({
      name: employee.name,
      employeeCode: employee.employeeCode,
      roleId: employee.roleId._id,
      deboardingTypeId: employee.deboardingTypeId,
      phoneNumber: employee.phoneNumber,
      email: employee.email,
      status: employee.status,
      joiningDate: employee.joiningDate
    })
  }

  close(){
    this.dialogRef.close();
  }

  submit!: Subscription;
  onSubmit(){
    if(this.updateStatus){
      this.submit = this.employeeService.updateEmployee(this.form.getRawValue(), this.data.value._id).subscribe(employee => {
        this.snackBar.open("Employee updated successfully...","" ,{duration:3000})
        this.dialogRef.close();
      });
    }else{
      this.submit = this.employeeService.addEmployee(this.form.getRawValue()).subscribe(employee => {
        console.log(employee);

        this.snackBar.open("Employee added successfully...","" ,{duration:3000})
        this.dialogRef?.close(employee)
      });
    }
  }

  onRoleSelected(roleId: string, roleName: string) {
    console.log('Selected Role ID:', roleId);
    console.log('Selected Role Name:', roleName);

    // Here you can perform any action with roleId and roleName
    // For example, you could set these values to form controls
    this.form.get('roleId')?.setValue(roleId);
    // If you need to store the roleName separately, you might want to set it on another form control or a variable
  }

  uploadSub!: Subscription;
  url = environment.baseUrl;
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    let file = input.files?.[0];
    if (file) {
      let fileName = file.name;
      if (fileName.length > 12) {
        const splitName = fileName.split('.');
        fileName = splitName[0].substring(0, 12) + "... ." + splitName[1];
      }

      this.uploadSub = this.employeeService.uploadEmployeeImage(file).subscribe({
        next: (invoice) => {
          console.log(invoice);

          console.log(invoice.fileUrl);

          this.imageUrl = this.url + invoice.fileUrl;

          this.form.get('imageUrl')?.setValue(invoice.fileUrl);
          this.form.get('imageName')?.setValue(invoice.file.filename);
          console.log(this.form.getRawValue());
        }
      });
    }
  }

  clearFileInput() {
    let file =  this.form.get('imageName')?.value
    this.employeeService.deleteImage(file).subscribe(inv => {
      console.log(inv);
      this.imageUrl = '';
    });
  }
}
