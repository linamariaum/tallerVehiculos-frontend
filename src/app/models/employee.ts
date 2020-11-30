import { Role } from './role';

export class Employee {
  id: number;
  name: string;
  password: string;
  email: string;
  cellphone: string;
  registryDate: string;
  removalDate: string;
  role: Role;
}
