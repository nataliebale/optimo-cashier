if (!window.MainProcessAPI) {
  let server = window.location.origin;
  let socket = io(server);
  socket.on('connect_timeout', console.log);
  socket.on(
    'reconnect',
    () => (window.location.href = window.location.origin + window.location.pathname)
  );
  socket.on('connect_error', () => {
    socket.close();
    server = 'http://127.0.0.1:8899';
    socket = io(server);
    socket.on(
      'reconnect',
      () => (window.location.href = window.location.origin + window.location.pathname)
    );
    socket.on('connect_error', () => {
      console.log('connection_err');
      setTimeout(() => {
        fetch('http://127.0.0.1:8899/socket.io/socket.io.js')
          .then((e) => {
            if (e.ok) {
              setTimeout(
                () => (window.location.href = window.location.origin + window.location.pathname),
                500
              );
            }
          })
          .catch();
        fetch(`${window.location.origin}/socket.io/socket.io.js`)
          .then((e) => {
            if (e.ok) {
              setTimeout(
                () => (window.location.href = window.location.origin + window.location.pathname),
                500
              );
            }
          })
          .catch();
      }, 1000);
    });
  });
  window.MainProcessAPI = {
    on: function (e, func) {
      socket.on(e, (msg) => func(null, msg));
    },
    once: function (e, func) {
      socket.once(e, (msg) => func(null, msg));
    },
    send: function (event, callerId, data) {
      socket.emit(event, JSON.stringify({ callerId, data }));
    },
    isFullScreen: function () {
      return false;
    },
    isElectron: function () {
      return false;
    },
    close: function () {
      alert('cannot close window');
    },
    relaunch: function () {
      fetch(`${server}/app/restart`).catch((e) => alert('Unable to restart'));
    },
    getEnvironment: function () {
      return 2;
    },
    setTitleBar: function () {
      return false;
    },
    logger: {
      log(...params) {
        console.log(...params);
      },
      debug(...params) {
        console.debug(...params);
      },
      info(...params) {
        console.info(...params);
      },
      warn(...params) {
        console.warn(...params);
      },
      error(...params) {
        console.error(...params);
      },
    },
  };
}
