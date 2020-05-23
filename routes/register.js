//회원가입 이동 라우터
var ejs = require('ejs'),
    fs = require('fs');
var mysql = require('mysql');

const mySqlClient = mysql.createConnection(require('../config/db_config'));
const authConfig = require('../config/auth_config');
const superPassword = authConfig.super_password;

var loadRegister = function(req, res){
    fs.readFile('./public/register.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {}));
    });
};

//회원가입 라우터
var registerSubmit = function(req, res) {
    var id = req.body.id;
    var pw = req.body.pw;
    var name = req.body.name;
    var tel = req.body.tel;
    var auth = req.body.auth;
    var type = req.body.type;
    var result;
    var params = {
        user_id: id,
        password: pw,
        name: name,
        tel: tel,
        type: type
    };

    var alertMsg = "";
    if (auth == superPassword) {
        result = checkInput(params);
        if (result == 2) {
            alertMsg = '연락처 입력이 잘못되었습니다.';
            res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
        } else if (result == 3) {
            alertMsg = '아이디는 영어/숫자 4-12자리로 입력해주세요.';
            res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
        } else {
            var checkIdSql = 'SELECT * FROM user WHERE user_id = ?;';
            mySqlClient.query(checkIdSql, params.user_id, function (err, rows) {
                if (err) {
                    console.log("Search Error>>" + err);
                    alertMsg = "회원등록 중 오류가 발생했습니다.";
                    res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
                } else {
                    if (rows.length > 0) {
                        alertMsg = "이미 사용중인 아이디입니다.";
                        res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
                    } else {
                        var insertSql = 'INSERT INTO user SET ?;';
                        mySqlClient.query(insertSql, params, function (err) {
                            if (err) {
                                console.log("Insert Error>>" + err);
                                alertMsg = "회원등록 중 오류가 발생했습니다.";
                                res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/register";</script>');
                            } else {
                                alertMsg = "회원가입이 완료되었습니다.";
                                res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.location="/";</script>');

                            }
                        });
                    }

                }
            });
        }
    } else {
        res.send('<script type="text/javascript">alert("인증코드가 일치하지 않습니다."); window.location="/register";</script>');
        res.end();
    }
};

//회원가입 체크 라우터
function checkInput(params) {
    var result;
    var pattern_eng = /[a-zA-Z]/; //영어 입력 체크 패턴
    var pattern_num = /[0-9]/; //숫자 입력 체크 
    var pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
    var pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
    id = params.user_id;
    tel = params.tel;
    if ((pattern_num.test(id)) || (pattern_eng.test(id)) && !(pattern_spc.test(id)) && !(pattern_kor.test(id))) { //id검사
        if ((pattern_num.test(tel)) && !(pattern_eng.test(tel)) && !(pattern_spc.test(tel)) && !(pattern_kor.test(tel))) { //tel검사
            result = 1; //정상
        } else {
            result = 2; // tel 입력 오류
        }
    } else {
        result = 3; //id 입력 오류
    }
    return result;
}

module.exports.register = loadRegister;
module.exports.reg_submit = registerSubmit;