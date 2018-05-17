const wxC = {}

wxC.getWxUserInfo = function(req, res){
    res.body = {
        msg: 'ok',
        res_code: 200
    }
}

module.exports = wxC;