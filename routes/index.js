const router = require('koa-router')();
const wxC = require('../controllers/v1.0/wxController');

router.post('/api/v1.0/getWxUserInfo', wxC.getWxUserInfo)

module.exports = router;