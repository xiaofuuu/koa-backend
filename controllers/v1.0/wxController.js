const wxC = {}
const rp = require('request-promise')
const logger = require('../../logger')
const sql = require('../../mysql-connect')

wxC.getWxUserInfo = async function(ctx){
    logger.debug('hello world')

    let options = {
        method: 'GET',
        url: 'http://web.juhe.cn:8080/fund/suspend/purch',
        qs: {
            key: '44a39b366980997da3ccd070a681c13b'
        },
        json: true
    }

    let data = await rp(options).catch(error => console.log(error));

    ctx.body = {
        msg: data,
        res_code: 200
    }
}

wxC.getStudents = async function(ctx){
    let s_id = ctx.request.query.s_id;

    if(!s_id){
        ctx.body = {
            msg: '参数错误',
            res_code: 200
        }
        return false;
    }

    let data = await sql('select s_name from classroom where s_id = ?', [s_id]).catch(error => { logger.error(error) })

    ctx.body = {
        msg: data.length == 1 ? data[0] : data,
        res_code: 200
    }
}

module.exports = wxC;