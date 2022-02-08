import { app, BrowserWindow, Display, screen } from 'electron';
import { inject, injectable } from 'inversify';
import * as url from 'url';
import { Constants } from '../../core/Constants';
import { SettingsService } from '../../core/services/Settings/SettingService';
import { Environment } from '../../shared/enums/Environment';

@injectable()
export class WindowManager {
  private _currentWindow: BrowserWindow;
  private splashScreen: BrowserWindow;
  private mainWindow: BrowserWindow;
  private primaryDisplay: Display;

  constructor(@inject(SettingsService) private readonly _settings: SettingsService) {
    this.primaryDisplay = screen.getPrimaryDisplay();
  }

  get HasWindow(): boolean {
    return this.mainWindow != null;
  }

  get CurrentWindow() {
    return this._currentWindow;
  }

  public async CreateSplashScreen() {
    if (this.splashScreen) {
      return;
    }

    const workAreaSize = this.primaryDisplay.workAreaSize;
    this.splashScreen = new BrowserWindow({
      x: 0,
      y: 0,
      width: workAreaSize.width,
      height: workAreaSize.height,
      webPreferences: {
        nodeIntegration: true,
      },
      alwaysOnTop: false, // !this.serve && process.env.UPDATE == "UPDATE"
    });

    this.splashScreen.setFullScreen(true);
    this.splashScreen.removeMenu();

    if (process.env.SERVE) {
      this.splashScreen.loadURL('http://localhost:4200/splashScreen.html');
    } else {
      this.splashScreen.loadURL(
        url.format({
          pathname: 'splashScreen.html',
          protocol: Constants.PROTOCOL + ':',
          slashes: true,
        })
      );
    }
    await new Promise((resolve) => {
      this.splashScreen.webContents.once('dom-ready', () => {
        resolve();
      });
    });
  }

  public async ShowSplashScreen() {
    await this.CreateSplashScreen();

    if (this.mainWindow) {
      this.mainWindow.hide();
    }

    this.splashScreen.show();
    this.splashScreen.focus();
    this.splashScreen.setFullScreen(true);
    this._currentWindow = this.splashScreen;
  }

  public async CreateMainWindow() {
    if (this.mainWindow) {
      return;
    }
    const workAreaSize = this.primaryDisplay.workAreaSize;

    this.mainWindow = new BrowserWindow({
      x: 0,
      y: 0,
      frame: false,
      width: workAreaSize.width,
      height: workAreaSize.height,
      webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: true, // turn off remote
        preload: __dirname + '/Preloader.js',
      },
      icon: Constants.WebPath + '/favicon.ico',
    });
    this.mainWindow.hide();
    this.splashScreen.focus();
    if (process.env.SERVE) {
      require('electron-reload')(__dirname, {
        electron: require(process.cwd() + '/node_modules/electron'),
      });
      this.mainWindow.loadURL('http://localhost:4200', {
        userAgent: Constants.UserAgent,
      });
    } else {
      this.mainWindow.loadURL(
        url.format({
          pathname: 'index.html',
          protocol: Constants.PROTOCOL + ':',
          slashes: true,
        }),
        {
          userAgent: Constants.UserAgent,
        }
      );
    }

    if (process.env.Environment != Environment.Production.toString()) {
      this.mainWindow.webContents.openDevTools();
    }

    if (process.env.Environment == Environment.Production.toString()) {
      this.mainWindow.removeMenu();

      if (this._settings.data.isFullScreen) {
        this.mainWindow.setFullScreen(true);
      } else {
        this.mainWindow.maximize();
        this.mainWindow.setResizable(false);
        let moving = false;
        this.mainWindow.on('move', () => {
          if (!moving) {
            moving = true;
            this.mainWindow.maximize();
            moving = false;
          }
        });
        this.mainWindow.on('unmaximize', () => this.mainWindow.maximize());
        this.mainWindow.on('resize', () => this.mainWindow.maximize());
      }
    }

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
      app.quit();
    });

    return new Promise((resolve) => {
      this.mainWindow.webContents.once('dom-ready', () => {
        resolve();
      });
    });
  }

  public async ShowMainWindow() {
    await this.CreateMainWindow();

    this.mainWindow.show();
    this.mainWindow.focus();

    if (this.splashScreen) {
      this.splashScreen.close();
      this.splashScreen = null;
    }

    if (this._settings.data.isFullScreen) {
      this.mainWindow.setAlwaysOnTop(true);
    }
    this._currentWindow = this.mainWindow;
  }
}
