const logger = require('koa-logger');
const koaBody = require('koa-body');
const router = require('./routes');
const Koa = require('koa');
const emoji = require('node-emoji')
const app = module.exports = new Koa();

// middleware
app.use(logger());

app.use(koaBody());

// route definitions
app.use(router.routes());

app.listen(8999, function(){
    console.log('Server is running ' + emoji.get('coffee') + '...');
});
