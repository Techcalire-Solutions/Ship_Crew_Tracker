import { Employee } from "./employee";
import { Ship } from "./ship";

export interface ShipEmployee {
  _id: string;
  employeeId: Employee;
  shipId: Ship;
  startingDate: Date;
  endingDate: Date;
  status: boolean;
}
