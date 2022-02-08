import { ipcMain } from 'electron';
import log from 'electron-log';
import { injectable } from 'inversify';
import { IIPCSender } from './IIPCSender';
import { OdinEvent } from '../../../shared/enums/OdinEvent';

@injectable()
export class SystemEventService {
  private _subscribers: IIPCSender[] = [];

  constructor() {}

  subscribe(event, callerId, arg) {
    // console.log('subscribing');
    const subscriber = this._subscribers.filter((e) => e.id == event.sender.id)[0];
    if (!subscriber) {
      const sender: IIPCSender = {
        id: event.sender.id,
        callerId: callerId,
        sender: event.sender,
      };
      this._subscribers.push(sender);
    } else {
      subscriber.callerId = callerId;
    }
  }

  sendEvent(name: string, data: any) {
    log.info('შეტყობინება', name, data);
    log.info('შეტყობინებების გამომწერების რაოდენობა', this._subscribers.length);

    this._subscribers = this._subscribers.filter((i) => {
      try {
        return !!i.sender.id;
      } catch (e) {
        return false;
      }
    });

    this._subscribers.forEach((subscriber) => {
      try {
        if (subscriber.callerId) {
          subscriber.sender.send(`${name}/${subscriber.callerId}`, data);
        } else {
          subscriber.sender.send(name, data);
        }
      } catch (err) {
        console.error('err', err);
        log.error('ივენთის გაგზავნის დროს დაფიქსირდა შეცდომა', err, err.stack);
      }
    });
  }
}
