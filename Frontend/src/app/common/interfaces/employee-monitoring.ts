import { DeboardingType } from './deboarding-type';
import { Employee } from './employee';
export interface EmployeeMonitoring {
  employeeId : Employee;
  checkInTime : Date
  checkOutTime : Date
  currentStatus : boolean
  curfewTime : boolean
  purpose : DeboardingType
  status : boolean
}
