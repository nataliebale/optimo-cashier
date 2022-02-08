export interface IClockDriftStatus {
  hasClockDriftExceededThreashold: boolean;
  realTime: Date;
  localTime: Date;
}
