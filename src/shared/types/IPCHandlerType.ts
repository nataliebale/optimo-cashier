import { OdinIPC } from '../enums/OdinIPC';

export type IPCHandlerType = { [t in OdinIPC]: Function };
