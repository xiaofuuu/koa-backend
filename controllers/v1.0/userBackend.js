const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const logger = require('../../logger')

const userBackend = {}

userBackend.Login = async (ctx) => {
  let user = {}
  user.username = ctx.request.body.username
  user.password = ctx.request.body.password
  if (!user.username || !user.password) {
    ctx.body = {
      msg: '请输入用户名或密码～',
      rs_code: -1
    }
  }

  ctx.body = {
    msg: {
      token: jwt.sign({
        data: user,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
      }, 'shared-secret')
    },
    rea_code: 200
  }

  // bcrypt.hash()
  // bcrypt.compare()
}

userBackend.getUserInfo = async (ctx) => {
  let token = ctx.request.header.authorization

  jwt.verify(token.substring(7), 'shared-secret', function (err, decoded) {
    if(err) {
      logger.error(err)
    }
    if (!decoded) {
      ctx.body = {
        msg: 'token验证失败',
        res_code: -3
      }
    } else {
      ctx.body = {
        msg: 'ok',
        res_code: 200
      }
    }
  });

}

module.exports = userBackend