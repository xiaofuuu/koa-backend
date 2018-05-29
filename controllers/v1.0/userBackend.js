const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userBackend = {}

userBackend.Login = async (ctx) => {
  let user = {}
  user.username = ctx.request.body.username
  user.password = ctx.request.body.password

  ctx.response.body = {
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
  console.log(jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7fSwiZXhwIjoxNTI3NTk1MzE2LCJpYXQiOjE1Mjc1OTE3MTZ9.fffw4oJiY389ieRk56p678QQ6Lcn9trs4nI3tvQNV7Q'));
  // jwt.verify(token, 'shared-secret', function(err, decoded) {
  //   console.log(decoded) // bar
  // });

  ctx.body = {
    msg: 'ok',
    res_code: 200
  }
}

module.exports = userBackend