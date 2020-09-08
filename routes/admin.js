//관리자 페이지 라우터
var ejs = require('ejs'),
    fs = require('fs');

function admin(req, res) {
    fs.readFile('./public/admin_tool.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
            auth: 2
        }));
    });
}

function admin_auth(req, res) {
    var userPw = req.body.user_pw;
    fs.readFile('./public/admin_tool.html', 'utf8', function (error, data) {
        if(userPw == 'admin'){
            res.send(ejs.render(data, {
                auth: 1
            }));
        }
        else{
            res.send(ejs.render(data, {
                auth: 0
            }));
        }
    });
}

module.exports.admin = admin;
module.exports.admin_auth = admin_auth;