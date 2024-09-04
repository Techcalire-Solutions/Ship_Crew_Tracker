import { DeboardingType } from "./deboarding-type"
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
  image: string
}

