const log4js = require('log4js');

log4js.configure({
  appenders: { cheese: { type: 'dateFile', filename: 'logs/main', pattern: "yyyy-MM-dd.log", alwaysIncludePattern: true }, out: { type: 'console' } },
  categories: { default: { appenders: ['cheese', 'out'], level: 'All' } }
});

const logger = log4js.getLogger();

module.exports = logger