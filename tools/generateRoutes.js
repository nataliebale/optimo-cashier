const { RouteGenerator } = require('./RouteGenerator/RouteGenerator');
new RouteGenerator(
    __dirname + '/../src/main.ts',
    __dirname + '/../src/electron/routes/Router.ts',
    __dirname + '/RouteGenerator/template.hbs',
    ['src/electron/controllers/*Controller.ts']
).Generate();