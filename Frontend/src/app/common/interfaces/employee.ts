import { DeboardingType } from "./deboarding-type"
import { Department } from "./department"
import { Rank } from "./rank"
import { Role } from "./role"

export interface Employee {
  _id: string
  name : string
  employeeCode : string
  deboardingTypeId : DeboardingType
  leaveStatus : boolean
  status : boolean
  roleId : Role
  phoneNumber : string
  email : string
  joiningDate : Date
  imageUrl: string
  rankId: Rank
  departmentId: Department
  currentStatus: string
}

