//공종, 동, 호 선택 함수
var ejs = require('ejs'),
    fs = require('fs'),
    mysql = require('mysql');

const mySqlClient = mysql.createConnection(require('../config/db_config'));

const selectUnsolvedDefactSql_ctype = 'select construction_type as c, count(*) as cnt from defact where is_reject < 2 group by construction_type';
const selectUnsolvedDefactSql_dong = 'select dong, count(*) as cnt from defact where construction_type = ? and is_reject < 2 group by dong';
const selectUnsolvedDefactSql_ho = 'select ho, count(*) as cnt from defact where dong = ? and construction_type = ? and is_reject < 2 group by ho';

const MAX_DONG = 9; // 101~108 Dong
const MAX_HO = 4; // 1 ho ~ 4 ho
const MAX_FLOOR = 10; //101~104 - 1001~1004 Ho

let dong_list = [];
let ho_list = [];
const ctype_list = ["조적공사", "미장공사", "방수공사", "석공사", "타일공사", "도장공사", "유리공사", "커튼월공사", "수장공사"];


for (var k = 1; k <= MAX_DONG; k++) {
    dong_list.push(100 + k);
}

for (var i = MAX_FLOOR; i >= 1; i--) {
    for (var j = 1; j <= MAX_HO; j++) {
        ho_list.push(i * 100 + j);
    }
}

var select_const = function (req, res) {
    if (req.session.user) {
        fs.readFile('./public/select_const.html', 'utf8', function (error, data) {
            mySqlClient.query(selectUnsolvedDefactSql_ctype, function (err, rows) {
                var c_data = [];
                var c_data_cnt = [];

                for (var i = 0 in ctype_list) {
                    c_data_cnt.push(0);
                }

                rows.forEach(function (element) {
                    c_data.push([element.c, element.cnt]);
                });

                for (var i = 0 in ctype_list) {
                    for (var j = 0 in c_data) {
                        if (c_data[j][0] == ctype_list[i]) {
                            c_data_cnt[i] = c_data[j][1];
                        }
                    }
                }

                res.send(ejs.render(data, {
                    name: req.session.user.userName,
                    type: req.session.user.userType,
                    c_data: c_data_cnt,
                }));
            });
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

//query: ctype (make cookie)
var select_dong = function (req, res) {
    if (req.session.user) {
        if (req.params.ctype) {
            //Make Cookie - ctype
            res.cookie('ctype', req.params.ctype);

            fs.readFile('./public/select_dong.html', 'utf8', function (err, data) {
                mySqlClient.query(selectUnsolvedDefactSql_dong, [req.params.ctype], function (err, rows) {
                    if (err) {
                        console.log('Sql Error: ' + err);
                        res.redirect('/');
                    } else {
                        var d_data = [];
                        var dong_data_cnt = [];

                        for (var i = 0 in dong_list) {
                            dong_data_cnt.push(0);
                        }

                        rows.forEach(function (element) {
                            d_data.push([element.dong, element.cnt]);
                        });

                        for (var i = 0 in dong_list) {
                            for (var j = 0 in d_data) {
                                if (d_data[j][0] == dong_list[i]) {
                                    dong_data_cnt[i] = d_data[j][1];
                                }
                            }
                        }

                        res.send(ejs.render(data, {
                            name: req.session.user.userName,
                            type: req.session.user.userType,
                            dong_data: dong_data_cnt,
                            ctype: req.params.ctype
                        }));
                    }
                });
            });
        } else {
            console.log("params.ctype 없음");
            res.redirect('/select/const');
        }
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

//query: dong (make cookie)
var select_ho = function (req, res) {
    if (req.session.user) {
        if (req.params.dong) {
            
            //Make Cookie - dong
            res.cookie('dong', req.params.dong);
            
            fs.readFile('./public/select_ho.html', 'utf8', function (err, data) {
                mySqlClient.query(selectUnsolvedDefactSql_ho, [req.params.dong, req.cookies.ctype], function (err, rows) {
                    if (err) {
                        console.log('Sql Error: ' + err);
                        res.redirect('/');
                    } else {
                        var h_data = [];
                        var ho_data_cnt = [];

                        for (var i = 0 in ho_list) {
                            ho_data_cnt.push(0);
                        }

                        rows.forEach(function (element) {
                            h_data.push([element.ho, element.cnt]);
                        });

                        for (var i = 0 in ho_list) {
                            for (var j = 0 in h_data) {
                                if (h_data[j][0] == ho_list[i]) {
                                    ho_data_cnt[i] = h_data[j][1];
                                }
                            }
                        }
                        res.send(ejs.render(data, {
                            name: req.session.user.userName,
                            type: req.session.user.userType,
                            ctype: req.cookies.ctype,
                            dong: req.params.dong,
                            ho_data: ho_data_cnt
                        }));
                    }
                });
            });
        } else {
            console.log("params.dong 없음");
            res.redirect('/select/const/');
        }
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
}

module.exports.select_const = select_const;
module.exports.select_dong = select_dong;
module.exports.select_ho = select_ho;
