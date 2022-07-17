const router = require('koa-router')();
const log = require('log4js').getLogger("errorLogger");
const sql = require('../database/mysql-connect');
const redis = require("redis"),
  client = redis.createClient({db: 'db1', url: 'redis://47.93.156.147:6379/1'});
const fs = require('fs');

function dateFormat(d) {
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() +
    ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

router.post('v1.0/set_date', async function getMoney(ctx) {
  const id = ctx.request.body.id;
  const startTime = ctx.request.body.startTime;
  const duringTime = (11 * 60 + 20) * 1000;
  const times = [58, 116, 182, 240, 288, 361, 441, 503, 560, 623];

  let d = new Date(new Date(startTime).getTime() + duringTime);
  let endTime = dateFormat(d);

  let data = await sql('update summit_activity set startTime=?, endTime=?, publishState=? where id=?', [startTime,
    endTime, 0, id]).catch(
    err => {
      log.error(ctx, err);
    });
  times.forEach(async (time, index) => {
    let data1 = await sql('update summit_activity_detail set startTime=? where activityId=? and id = ?',
      [
        dateFormat(new Date(new Date(startTime).getTime() +
          time * 1000)), id, 145 + index]).catch(
      err => {
        log.error(ctx, err);
      });
  });
  sql('truncate table teacher_summit_activity_subscribe;').catch(
    err => log.error(ctx, err));
  sql('truncate table user_summit_activity_comment;').catch(
    err => log.error(ctx, err));
  sql('truncate table user_summit_activity_record;').catch(
    err => log.error(ctx, err));
  sql('truncate table user_summit_activity_tips;').catch(
    err => log.error(ctx, err));

  client.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
  });
  ctx.body = {
    msg: '设置成功',
    status: '200'
  };
});

router.get('v1.0/video', async function (ctx, next) {
  let path = 'public/video/five.mp4';
  let stat = fs.statSync(path);
  let fileSize = stat.size;
  ctx.set({'Content-Type': 'video/mp4', 'Content-Length': fileSize});
  ctx.body = fs.createReadStream(path);
});

router.get('v1.0/getInfo', function (ctx) {
  ctx.body = {
    msg: 'ok',
    res_code: 1
  };
});

module.exports = router;