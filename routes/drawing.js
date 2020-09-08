var ejs = require('ejs'),
    fs = require('fs');
var mysql = require('mysql');

const mySqlClient = mysql.createConnection(require('../config/db_config'));

const selectUnsolvedDefactSql = 'select room, count(*) as cnt from defact where dong = ? and ho = ? and construction_type = ? and is_reject < 2 group by room';

const rooms = ["현관", "거실", "발코니1", "발코니2", "발코니3", "침실1", "침실2", "침실3", "주방,식당", "욕실1", "욕실2"];

var drawing = function (req, res) {
    if (req.session.user) {
        //ctype(cookie), dong(cookie), ho(params) 모두 있을때만
        if (req.params.ho && req.cookies.ctype && req.cookies.dong) {
            var selected_ctype = req.cookies.ctype,
                selected_dong = req.cookies.dong,
                selected_ho = req.params.ho;

            res.cookie('ho', selected_ho);

            fs.readFile('./public/view_defact.html', 'utf8', function (error, data) {
                mySqlClient.query(selectUnsolvedDefactSql, [selected_dong, selected_ho, selected_ctype], function (err, rows) {
                    if (err) {
                        console.log('Sql Error: ' + err);
                        res.redirect('/');
                    } else {
                        var d_data = [];
                        var data_cnt = [];

                        for (var i = 0; i < 11; i++) {
                            data_cnt.push(0);
                        }

                        rows.forEach(function (element) {
                            d_data.push([element.room, element.cnt]);
                        });

                        for (var i = 0 in rooms) {
                            for (var j = 0 in d_data) {
                                if (d_data[j][0] == rooms[i]) {
                                    data_cnt[i] = d_data[j][1];
                                }
                            }
                        }

                        res.send(ejs.render(data, {
                            ctype: selected_ctype,
                            dong: selected_dong,
                            ho: selected_ho,
                            data_cnt: data_cnt
                        }));
                    }
                });
            });
        }
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

module.exports = drawing;
