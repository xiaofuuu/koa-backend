const wxC = {}
const rp = require('request-promise')

wxC.getWxUserInfo = async function(ctx){
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

module.exports = wxC;