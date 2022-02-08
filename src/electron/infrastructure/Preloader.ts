const {
    contextBridge,
    ipcRenderer,
    remote
} = require('electron');
const { Titlebar, Color } = require('custom-electron-titlebar');

const logger = require('electron-log');

(() => {

    function on(channel, listener) {
        return ipcRenderer.on(channel, listener);
    }
    function once(channel, listener) {
        return ipcRenderer.once(channel, listener);
    }
    function send(channel, ...args) {
        return ipcRenderer.send(channel, ...args);
    }
    function sendSync(channel, ...args) {
        return ipcRenderer.sendSync(channel, ...args);
    }
    function isFullScreen() {
        return remote.getCurrentWindow().isFullScreen();
    }
    function isElectron() {
        return window && window.process && window.process.type;
    }
    function close() {
        remote.getCurrentWindow().close();
    }
    function relaunch() {
        remote.app.relaunch();
        remote.app.exit();
    }
    function getEnvironment() {
        return process.env.Environment;
    }
    function setTitleBar() {
        if (!isFullScreen()) {
            const MyTitleBar = new Titlebar({
                backgroundColor: Color.fromHex('#f6f7fb'),
                menu: null,
                maximizable: false,
                titleHorizontalAlignment: 'left',
                icon: 'assets/images/logo/logo.svg',
            });
            document.body.classList.add('with-titlebar');
        }
    }

    contextBridge.exposeInMainWorld(
        'MainProcessAPI',
        {
            on,
            once,
            send,
            sendSync,
            isFullScreen,
            isElectron,
            close,
            relaunch,
            getEnvironment,
            setTitleBar,
            logger: {
                log(...params: any[]) { logger.log(...params); },
                debug(...params: any[]) { logger.debug(...params); },
                info(...params: any[]) { logger.info(...params); },
                warn(...params: any[]) { logger.warn(...params); },
                error(...params: any[]) { logger.error(...params); },
            }
        }
    );
})();
