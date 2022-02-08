export enum UserType {
  None = 0,
  All = ~None,
  Staff = 1 << 0,
  Device = 1 << 1,
  Admin = 1 << 2
}
