export interface MainProcessAPI {
  on(channel: string, listener: (event: any, ...args: any[]) => void): this;
  once(channel: string, listener: (event: any, ...args: any[]) => void): this;
  send(channel: string, ...args: any[]): void;
  sendSync(channel: string, ...args: any[]): any;
  isFullScreen(): boolean;
  isElectron(): boolean;
  close(): void;
  relaunch(): void;
  getEnvironment(): string;
  setTitleBar(): boolean;
  logger: ILogger;
}

export interface ILogger {
  log(...params: any[]): void;
  debug(...params: any[]): void;
  info(...params: any[]): void;
  warn(...params: any[]): void;
  error(...params: any[]): void;
}