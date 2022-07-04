const logger = require("koa-logger");
const koaBody = require("koa-body");
const views = require("koa-views");
const serve = require("koa-static");
const cors = require("koa-cors");
const convert = require("koa-convert");
const cookie = require("koa-cookie").default;
const path = require("path");
const Koa = require("koa");
const ejs = require("koa-ejs");
const range = require("koa-range");
const emoji = require("node-emoji");
const app = (module.exports = new Koa());
const router = require("./routes");
const bodyParser = require("koa-bodyparser");
//log工具
const logUtil = require('./utils/logUtil');
// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();

    ms = new Date() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});
const options = {
  origin: "http://localhost:9090",
  credentials: true,
};
app.use(range);
const port = 8999;
ejs(app, {
  root: path.join(__dirname, "./views"),
  layout: false,
  viewExt: "html",
  cache: false,
  debug: true,
});
app.use(serve(__dirname + "/public"));
// CORS;
app.use(convert(cors(options)));
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 2000 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
);
app.use(bodyParser());
app.use(cookie());
// route definitions
app.use(router.routes());

app.listen(port, function () {
  console.log("Server is running " + emoji.get("coffee") + "...");
  console.log("PORT: " + port);
});
