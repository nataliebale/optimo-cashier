export enum TokenType {
  None = 0,
  All = ~None,
  Access = 1 << 0,
  SignIn = 1 << 1
}
