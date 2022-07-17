const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const common = require('../../utils/common');
const SHA256 = require("crypto-js/sha256");
const Base64 = require("crypto-js/enc-base64");
const sql = require("../../database/mysql-connect");
const log = require("log4js").getLogger("errorLogger");

const userBackend = {};

const validateAuth = (username, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(username, password, async function (err, res) {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

userBackend.Login = async (ctx) => {
  let user = {};
  user.username = ctx.request.body.username;
  user.password = ctx.request.body.password;

  if (!user.username || !user.password) {
    ctx.body = common.response(null, "请输入用户名或密码～", -1);
  }

  const data = await sql("select * from user where username = ?", [
    user.username,
  ]);

  const isValid = await validateAuth(
    Base64.stringify(SHA256(user.username + user.password)),
    data[0].password
  ).catch(() => {
    ctx.body = common.response(null, "异常错误", -1);
  });

  if (isValid) {
    ctx.body = common.response(null, "登录成功", 1);
  } else {
    ctx.body = common.response(null, "登录失败", 11);
  }
};

userBackend.Regist = (ctx) => {
  let user = {};
  user.username = ctx.request.body.username;
  user.password = ctx.request.body.password;

  if (!user.username || !user.password) {
    ctx.body = common.response(null, "请输入用户名或密码～", -1);
  }

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      ctx.body = common.response(null, "异常错误", -1);
      return;
    }
    bcrypt.hash(
      Base64.stringify(SHA256(user.username + user.password)),
      salt,
      async function (err, crypted) {
        if (err) {
          ctx.body = common.response(null, "异常错误", -1);
          return;
        }
        await sql(
          "insert into user(id, username, password) values(NULL, ?, ?)",
          [user.username, crypted]
        ).catch(() => {
          ctx.body = common.response(null, "参数错误", -1);
        });
      }
    );
  });
  ctx.cookies.set(
    "token",
    jwt.sign(
      {
        data: user,
        exp: Math.floor(Date.now() / 1000),
      },
      "shared-secret"
    )
  );

  ctx.body = common.response(null, "ok", 1);
};

userBackend.getUserInfo = async (ctx) => {
  let token = ctx.request.header.authorization;

  jwt.verify(token, "shared-secret", function (err, decoded) {
    if (err) {
      log.error(ctx, err);
    }
    if (!decoded) {
      ctx.body = common.response(null, "token验证失败", -3);
    } else {
      ctx.body = common.response(null, "ok", 1);
    }
  });
};

module.exports = userBackend;
