export interface IAdmin {
  email: string;
  phone: string;
  password: string;
  role: Role;
}

export enum Role {
  ADMIN,
  USER,
}
