const router = require('koa-router')();
const wxC = require('../controllers/wxController');

router.post('/getWxUserInfo', wxC.getWxUserInfo)

module.exports = router;