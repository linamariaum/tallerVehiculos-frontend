import { Role } from './role';

export class Employee {
  id: number;
  name: string;
  password: string;
  email: string;
  cellphone: number;
  registryDate: Date;
  removalDate: Date;
  role: Role;
}
