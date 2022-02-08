export interface IWifiNetworksModel {
  msg: string;
  success: boolean;
  networks: IWifiNetwork[];
}

export interface IWifiNetwork {
  channel: string | number;
  mac: string;
  signal_level: number;
  ssid: string;
  signal: number;
  authentication: string;
}
