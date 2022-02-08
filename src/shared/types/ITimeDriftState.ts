export interface ITimeDriftState {
  realTime: Date;
  localTime: Date;
  hasClockDriftExceededThreashold: boolean;
}

// {
//   realTime: Thu Dec 24 2020 16:10:36 GMT+0400 (Georgia Standard Time),
//   localTime: Thu Dec 24 2020 15:10:29 GMT+0400 (Georgia Standard Time),
//   hasClockDriftExceededThreashold: true}
// }
