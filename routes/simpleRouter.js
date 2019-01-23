const router = require('koa-router')();
const logger = require('../logger');
const sql = require('../mysql-connect');
const redis = require("redis"),
  client = redis.createClient({db: 'db1', url: 'redis://47.93.156.147:6379/1'});

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
      logger.error(err);
    });
  times.forEach(async (time, index) => {
    let data1 = await sql('update summit_activity_detail set startTime=? where activityId=? and id = ?',
      [
        dateFormat(new Date(new Date(startTime).getTime() +
          time * 1000)), id, 145 + index]).catch(
      err => {
        logger.error(err);
      });
  });
  sql('truncate table teacher_summit_activity_subscribe;').catch(
    err => logger.error(err));
  sql('truncate table user_summit_activity_comment;').catch(
    err => logger.error(err));
  sql('truncate table user_summit_activity_record;').catch(
    err => logger.error(err));
  sql('truncate table user_summit_activity_tips;').catch(
    err => logger.error(err));

  client.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
  });
  ctx.body = {
    msg: '设置成功',
    status: '200'
  };
});

router.get('v1.0/video', function (req, res, next) {
  let path = 'http://koalareading-online.oss-cn-beijing.aliyuncs.com/summit/five.mp4';
  let stat = fs.statSync(path);
  let fileSize = stat.size;
  let range = req.headers.range;

  // fileSize 3332038

  if (range) {
    //有range头才使用206状态码

    let parts = range.replace(/bytes=/, "").split("-");
    let start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : start + 999999;

    // end 在最后取值为 fileSize - 1
    end = end > fileSize - 1 ? fileSize - 1 : end;

    let chunksize = (end - start) + 1;
    let file = fs.createReadStream(path, {start, end});
    let head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    let head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }

});

router.get('v1.0/getInfo', function (req, res, ndex) {
  res.body = {
    msg: 'ok',
    res_code: 1
  };
});
module.exports = router;