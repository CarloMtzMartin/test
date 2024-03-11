module.exports = {
  envPlugin: require('./env'),

  mysqlPlugin: require('./mysql'),
  controllersPlugin: require('./controllers'),
  repositoriesPlugin: require('./repositories'),

  swaggerPlugin: require('./swagger'),
  jwtPlugin: require('./jwt'),
  multipartPlugin: require('./multipart'),
  staticPlugin: require('./static'),
  rolecheckPlugin: require('./rolecheck'),

  // services
  smoobufp: require('./smoobufp'),

  // cache
  cachePlugin: require('./cache'),

  eventPlugin: require('./events')
}
