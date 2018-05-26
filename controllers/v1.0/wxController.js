const wxC = {}
const rp = require('request-promise')
const request = require('request')
const logger = require('../../logger')
const sql = require('../../mysql-connect')

wxC.getWxUserInfo = async function (ctx) {
    let data = await request({
        method: 'get',
        uri: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx8b3bc1df5196160a&secret=38d196bb42e0114c9feb668718fa61f1'
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
wxC.findStudentById = async (ctx) => {
    let s_id = ctx.request.query.s_id;

    if (!s_id) {
        ctx.body = {
            msg: '参数错误',
            res_code: 200
        }
        return false;
    }

    let data = await sql('select * from student where s_id = ?', [s_id]).catch(error => {
        ctx.body = {
            msg: '参数错误',
            res_code: -200
        }
    })

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

module.exports = wxC;