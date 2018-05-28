const logger = require('koa-logger');
const koaBody = require('koa-body');
const views = require('koa-views');
const serve = require('koa-static');
const cors = require('koa-cors');
const path = require('path');
const Koa = require('koa');
const emoji = require('node-emoji')
const app = module.exports = new Koa();

const router = require('./routes');

// middleware
app.use(logger())
// CORS
app.use(cors())
app.use(koaBody())

app.use(serve(__dirname + '/public'));
// views
app.use(views(path.resolve(__dirname, './views')))

// route definitions
app.use(router.routes())

app.listen(8999, function () {
    console.log('Server is running ' + emoji.get('coffee') + '...');
});
