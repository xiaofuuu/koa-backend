const wxC = {}
const rp = require('request-promise')
const request = require('request')
const logger = require('../../logger')
const sql = require('../../mysql-connect')
const base = require('../../utils/base')

wxC.getWxUserInfo = async function (ctx) {
    let data = await request({
        method: 'get',
        uri: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx8b3bc1df5196160a&secret=e9c1a33f83ba4d34f7cf67c506becea0'
    }, function (error, response, body) {
        if (error) {
            console.error('upload failed:');
        }
        return body
    })

    if (data) {
        ctx.body = {
            msg: data,
            res_code: 200
        }
    }
}

// 查询学生
wxC.findAllStudent = async (ctx) => {
    let checkResult = await base.checkToken(ctx.cookie.token).catch(err => {
        ctx.body = {
            msg: 'token错误',
            res_code: -1
        }
    }), data

    if (checkResult) {
        data = await sql('select * from student').catch(error => {
            ctx.body = {
                msg: '参数错误',
                res_code: -200
            }
        })
    } else {
        ctx.body = {
            msg: 'token错误',
            res_code: -1
        }
    }

    if (data) {
        ctx.body = {
            msg: data.length == 1 ? data[0] : data,
            res_code: 200
        }
    }
}

// 添加学生
wxC.addStudent = async (ctx) => {

    let req_params = ['s_name', 's_birth', 's_score', 'c_id']

    if (req_params.length == Object.keys(ctx.request.body).length && !req_params.every(item => item == ctx.request.body[item])) {
        logger.error(ctx.request.body)
        ctx.body = {
            msg: '参数错误',
            res_code: -1
        }
        return;
    }

    if (isNaN(ctx.request.body.s_score) || isNaN(ctx.request.body.c_id)) {
        logger.error('Error s_score: ' + ctx.request.body.s_score + ' ---- ' + 'c_id: ' + ctx.request.body.c_id)
        ctx.body = {
            msg: '参数类型错误',
            res_code: -1
        }
        return;
    }

    let req_data = {
        s_name: ctx.request.body.s_name,
        s_birth: ctx.request.body.s_birth,
        s_score: ctx.request.body.s_score,
        c_id: ctx.request.body.c_id,
    }

    let data = await sql('insert into student(s_name,s_birth,s_score,c_id) values(?, ?, ?, ?)', [req_data.s_name, req_data.s_birth, req_data.s_score, req_data.c_id]).catch(error => {
        ctx.body = {
            msg: '参数错误',
            res_code: -200
        }
    })

    if (data) {
        ctx.body = {
            msg: '添加成功',
            res_code: 200
        }
    }
}

//
wxC.saveArticleContent = async (ctx) => {
    let content = ctx.request.body.content
    let title = ctx.request.body.title

    let data = await sql('insert into article(content,title) values(?, ?)', [content, title]).catch(error => {
        ctx.body = {
            msg: '参数错误',
            res_code: -200
        }
    })

    if (data) {
        ctx.body = {
            msg: '添加成功',
            res_code: 200
        }
    }
}

var get_client_ip = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    return ip;
};

//
wxC.findArticleById = async (ctx) => {
    let ip = get_client_ip(ctx.request)

    logger.debug('==>get client ip', ip)
    let aId = ctx.request.query.a_id

    let data = await sql('select * from article where a_id = ?', [aId]).catch(error => {
        ctx.body = {
            msg: '参数错误',
            res_code: -200
        }
    })

    ctx.body = {
        msg: data,
        res_code: 200
    }
}
//
wxC.updateArticle = async (ctx) => {
    let aId = ctx.request.query.a_id
    let content = ctx.request.body.content
    let title = ctx.request.body.title

    let data = await sql('update article set content = ?, title = ? where a_id = ?', [content, title, aId]).catch(error => {
        ctx.body = {
            msg: '参数错误',
            res_code: -200
        }
    })

    if (data) {
        ctx.body = {
            msg: '更新成功',
            res_code: 200
        }
    }
}
module.exports = wxC;