const logger = require('koa-logger');
const koaBody = require('koa-body');
const views = require('koa-views');
const serve = require('koa-static');
const cors = require('koa-cors');
const jwt = require('koa-jwt');
const path = require('path');
const Koa = require('koa');
const emoji = require('node-emoji')
const app = module.exports = new Koa();

const router = require('./routes');

const options = {
    origin: "http://localhost:9090",
    credentials: true
};

const port = 8999

app.use(serve(__dirname + '/public'));
// views
app.use(views(path.resolve(__dirname, './views')))

app.use(function (ctx, next) {
    return next().catch((err) => {

        if (401 == err.status) {
            ctx.status = 401;
            ctx.body = {
                msg: 'token失效',
                resolve: -999
            };
        } else {
            throw err;
        }
    });
})

app.use(jwt({ secret: 'shared-secret' }).unless({
    path: [/\/register/, /\/login/],
}));

// middleware
app.use(logger())
// CORS
app.use(cors(options))
app.use(koaBody())

// route definitions
app.use(router.routes())

app.listen(port, function () {
    console.log('Server is running ' + emoji.get('coffee') + '...');
    console.log('PORT: ' + port);
});
