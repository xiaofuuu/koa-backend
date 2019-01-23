const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const wxC = require('../controllers/v1.0/wxController');
const uB = require('../controllers/v1.0/userBackend');
const simpleRouter = require('./simpleRouter');

router.post('/api/v1.0/getWxUserInfo', wxC.getWxUserInfo);
router.get('/api/v1.0/findAllStudent', wxC.findAllStudent);
router.post('/api/v1.0/addStudent', wxC.addStudent);
router.post('/api/v1.0/saveArticleContent', wxC.saveArticleContent);
router.get('/api/v1.0/findArticleById', wxC.findArticleById);
router.put('/api/v1.0/updateArticle', wxC.updateArticle);
router.post('/api/v1.0/login', uB.Login);
router.get('/api/v1.0/getUserInfo', uB.getUserInfo);
router.get('/frontEndLogger', async (ctx) => {
  ctx.body = {
    msg: 'ok'
  };
});
router.get('/about', async (ctx) => {
  await ctx.render('about');
});
router.get('/index', async function (ctx) {
  if (ctx.request.query.type === '1') {
    await ctx.render('index', {type: 1});
  } else {
    await ctx.render('index', {type: 2});
  }
});
router.get('/page', async function (ctx) {
  await ctx.render('page');
});
router.post('/api/v1.0/upload', async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  if (!ctx.request.body.files) {
    return ctx.body = "上传失败！";
  }
  const file = ctx.request.body.files.file;
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../public/upload/') + `/${file.name}`;
  const stream = fs.createWriteStream(filePath);
  reader.pipe(stream);
  console.log('uploading %s -> %s', file.name, stream.path);
  ctx.body = "上传成功！";
});

router.use('/', simpleRouter.routes());

module.exports = router;