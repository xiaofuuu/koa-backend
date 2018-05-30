const fs = require('fs');
const os = require('os');

const router = require('koa-router')()
const wxC = require('../controllers/v1.0/wxController')
const uB = require('../controllers/v1.0/userBackend')

router.post('/api/v1.0/getWxUserInfo', wxC.getWxUserInfo)
router.get('/api/v1.0/findAllStudent', wxC.findAllStudent)
router.post('/api/v1.0/addStudent', wxC.addStudent)
router.post('/api/v1.0/saveArticleContent', wxC.saveArticleContent)
router.get('/api/v1.0/findArticleById', wxC.findArticleById)
router.put('/api/v1.0/updateArticle', wxC.updateArticle)

router.post('/api/v1.0/login', uB.Login)
router.get('/api/v1.0/getUserInfo', uB.getUserInfo)

router.get('/frontEndLogger', async (ctx) => {
    console.log(ctx.request.body)
})
router.get('/index', async function (ctx) {
    await ctx.render('index')
})
router.get('/page', async function (ctx) {
    await ctx.render('page')
})
// upload 
router.post('/api/v1.0/upload', async (ctx, next) => {

    if ('POST' != ctx.method) return await next();

    const file = ctx.request.body.files.file;
    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
    reader.pipe(stream);
    console.log('uploading %s -> %s', file.name, stream.path);

    ctx.redirect('/index');
})

module.exports = router;