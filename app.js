const logger = require('koa-logger');
const koaBody = require('koa-body');
const views = require('koa-views');
const serve = require('koa-static');
const cors = require('koa-cors');
const convert = require('koa-convert');
const cookie = require('koa-cookie').default
const path = require('path');
const Koa = require('koa');
const ejs = require('koa-ejs');
const emoji = require('node-emoji')
const app = module.exports = new Koa();
const IO = require('koa-socket');
const router = require('./routes');
const options = {
    origin: 'http://localhost:9090',
    credentials: true
};
const port = 8999
ejs(app, {
    root: path.join(__dirname, './views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
});
app.use(serve(__dirname + '/public'));
// middleware
app.use(logger())
// CORS
app.use(convert(cors(options)))
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 2000*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));
app.use(cookie())
const io = new IO({
    ioOptions: {
        pingTimeout: 10000,
        pingInterval: 5000,
    },
});
// 注入应用
io.attach(app);
io.on('connection', async (ctx, data) => {
    console.log('server is success!')
    ctx.socket.emit('message', 'hello world');
})
io.on('join', async (ctx, data) => {
    console.log(data.message)
})
// route definitions
app.use(router.routes())
app.listen(port, function () {
    console.log('Server is running ' + emoji.get('coffee') + '...');
    console.log('PORT: ' + port);
});
