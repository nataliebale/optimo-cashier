try {
  userData = require('electron').app.getPath('userData');
} catch (e) {
  userData = process.env.UserData;
}

module.exports = [
  {
    type: 'sqlite',
    database: userData + '/database.sqlite',
    synchronize: false,
    logging: false,
    migrationsTableName: '__migrations',
    entities: [
      __dirname + '/app/core/infrastructure/Entities/**/*.js',
      'app/core/infrastructure/Entities/**/*.js',
    ],
    migrations: [__dirname + '/app/core/infrastructure/Migrations/**/*.js'],
  },
  {
    name: 'transactiondb',
    type: 'sqlite',
    database: userData + '/transactionDatabase.sqlite',
    synchronize: false,
    logging: false,
    migrationsTableName: '__migrations',
    entities: [
      __dirname + '/app/core/infrastructure/Entities/**/*.js',
      'app/core/infrastructure/Entities/**/*.js',
    ],
    migrations: [__dirname + '/app/core/infrastructure/Migrations/**/*.js'],
  },
];
