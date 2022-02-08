import { Injectable, NgZone } from '@angular/core';
import { IResult } from '../../../../../shared/types/IResult';
import { OdinIPCResult } from '../../../../../shared/enums/OdinIPC';
import { Observable } from 'rxjs';
import { CommonFunctions } from '../../../../../shared/CommonFunctions';
import { ICredentials } from '../../../../../shared/types/ICredentials';
import { ILoginDTO } from '../../../../../shared/types/ILoginDTO';
import { ILegalEntityListModel } from '../../../../../shared/types/ILegalEntityListModel';
import { ILocation } from '../../../../../shared/types/ILocation';
import { ISetupConfig } from '../../../../../shared/types/ISetupConfig';
import { IBOListRequest } from '../../../../../shared/types/IBOListRequest';
import { OdinEvent } from '../../../../../shared/enums/OdinEvent';
import { MainProcessAPI } from './MainProcessAPI';

@Injectable({
  providedIn: 'root',
})
export class MainProcessSetupService {
  private ipcRenderer: MainProcessAPI;
  private callerId: string;

  constructor(private zone: NgZone) {
    this.ipcRenderer = window.MainProcessAPI;
    this.callerId = CommonFunctions.generateGuid();
    this.ipcRenderer.send(OdinEvent.SUBSCRIBE, this.callerId);
  }

  login(data: ICredentials): Observable<IResult<ILoginDTO>> {
    return this.ipcSend<IResult<ILoginDTO>>('setupLogin', data);
  }

  getBOList(data: IBOListRequest): Observable<IResult<ILegalEntityListModel[]>> {
    return this.ipcSend<IResult<ILegalEntityListModel[]>>('setupGetBOList', data);
  }

  getLocations(id: string): Observable<IResult<ILocation[]>> {
    return this.ipcSend<IResult<ILocation[]>>('setupGetLocations', id);
  }

  setConfig(config: ISetupConfig): Observable<IResult<void>> {
    return this.ipcSend<IResult<void>>('setupSetConfig', config);
  }

  private ipcSend<T extends IResult<any>>(event: any, payload?): Observable<T> {
    return new Observable((subscriber) => {
      this.ipcRenderer.once(`${OdinIPCResult(event)}/${this.callerId}`, (_, result: T) => {
        this.zone.run(() => {
          if (result?.err) {
            subscriber.error(result.err);
          } else {
            subscriber.next(result);
          }
          subscriber.complete();
        });
      });
      this.ipcRenderer.send(event, this.callerId, payload);
    });
  }
}
