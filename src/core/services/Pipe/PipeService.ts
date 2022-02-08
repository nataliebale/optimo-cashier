import { Constants } from './../../Constants';
import { CommonFunctions } from './../../../shared/CommonFunctions';
import { injectable } from 'inversify';
import { exec, execFile } from 'child_process';
import { EventEmitter } from 'events';
import * as net from 'net';
import { MessageBuffer } from './MessageBuffer';

@injectable()
export class PipeService {
  private _eventEmitter: EventEmitter;
  private _client: net.Socket;

  constructor() {
    this._eventEmitter = new EventEmitter();
  }

  public async init() {
    let deviceProcess;
    let PIPE_PATH;
    if (process.platform == 'linux') {
      deviceProcess = execFile(Constants.BinPath + '/OptimoDeviceService');
      PIPE_PATH = '/tmp/OptimoDeviceService';
    } else {
      deviceProcess = execFile(Constants.BinPath + '/OptimoDeviceService.exe');
      PIPE_PATH = '\\\\.\\pipe\\OptimoDeviceService';
    }
    process.on('exit', () => deviceProcess.kill());
    await CommonFunctions.sleep(100);

    let connected = false;

    while (!connected) {
      await new Promise((resolve, reject) => {
        this._client = net.connect(PIPE_PATH, () => {
          connected = true;
          resolve();
        });
        this._client.on('error', async () => {
          await CommonFunctions.sleep(100);
          resolve();
        });
      });
    }

    const received = new MessageBuffer('\n');
    this._client.on('data', (data) => {
      received.push(data);
      while (!received.isFinished()) {
        const message = received.handleData();
        console.log('pipe message', message);
        const object = JSON.parse(message);
        this._eventEmitter.emit(`${object.ResponseType}${object.RequestId}`, object);
      }
    });
  }

  public async send(method: string, requstId: string, payload: any) {
    return new Promise(async (resolve, reject) => {
      let resolved = false;
      this._client.write(
        JSON.stringify({ Method: method, RequestId: requstId, Payload: payload }) + '\n',
        async (err) => {
          console.log('pipe sent', method);
          if (err && !resolved) {
            resolved = true;
            reject(err);
          } else {
            if (!resolved) {
              resolved = true;
              resolve();
            }
          }
        }
      );
      await CommonFunctions.sleep(10000);
      if (!resolved) {
        resolved = true;
        reject(new Error('Pipe validation timed out'));
      }
    });
  }

  public on(event: string | symbol, listener: (...args: any[]) => void): EventEmitter {
    return this._eventEmitter.on(event, listener);
  }

  public once(event: string | symbol, listener: (...args: any[]) => void): EventEmitter {
    return this._eventEmitter.once(event, listener);
  }
}
