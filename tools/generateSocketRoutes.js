const { RouteGenerator } = require('./RouteGenerator/RouteGenerator');
new RouteGenerator(
    __dirname + '/../src/main.ts',
    __dirname + '/../src/socket-io/Router.ts',
    __dirname + '/RouteGenerator/socketTemplate.hbs',
    ['src/electron/controllers/*Controller.ts']
).Generate();