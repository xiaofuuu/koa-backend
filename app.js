
const logger = require('koa-logger');
const koaBody = require('koa-body');
const router = require('./routes');
const Koa = require('koa');
const app = module.exports = new Koa();

// "database"
const posts = [];

// middleware
app.use(logger());

app.use(koaBody());

// route definitions

app.use(router.routes());

if (!module.parent) app.listen(3000);
