var ejs = require('ejs'),
    fs = require('fs');
var mysql = require('mysql');

const mySqlClient = mysql.createConnection(require('../config/db_config'));

//해당 동/호/방 안 하자 리스트 
var defactList = function (req, res) {
    if (req.session.user) {
        var selected_dong = req.query.dong,
            selected_ho = req.query.ho,
            selected_loc = req.query.loc,
            ctype = req.cookies.ctype;
        var selectDefactSql = "select * from defact where dong=? and ho = ? and room=? and construction_type=? order by is_reject;";

        mySqlClient.query(selectDefactSql, [selected_dong, selected_ho, selected_loc, ctype], function (err, rows, fields) {
            if (err) {
                console.log("ERROR>>" + err);
            } else {
                var unsolvedDefact = [];
                var solvedDefact = [];

                rows.forEach(function (element) {

                    if (element.is_solved == '0') {
                        unsolvedDefact.push(element);
                    } else {
                        solvedDefact.push(element);
                    }

                });
                fs.readFile('./public/list_defact.html', 'utf8', function (error, data) {
                    res.cookie('loc', selected_loc);
                    res.send(ejs.render(data, {
                        dong: selected_dong,
                        ho: selected_ho,
                        loc: selected_loc,
                        unsolvedDefact: unsolvedDefact,
                        solvedDefact: solvedDefact
                    }));

                });
            }
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

// 하자상세 페이지
var defactDetailList = function (req, res) {
    if (req.session.user) {
        var defactId = req.query.id;
        res.cookie('defactId', defactId);
        var ctype = req.cookies.ctype;
        var selectDetailSql = 'select d.id, d.img, d.construction_name, d.construction_type, d.info, d.create_date, d.due_date, d.is_solved, d.is_reject, d.room, d.dong, d.ho from defact d where d.id = ? and d.construction_type=?';

        var selectCommentSql = 'select u.name, u.type user_type,  c.comment, c.id from comment c, user u where c.defact_id = ? and u.id = c.user_id;';
        mySqlClient.query(selectDetailSql, [defactId, ctype], function (err, row) {
            if (err) {
                console.log("select detail sql ERROR>> " + err);
            } else {
                var detailInfo = row[0];
                detailInfo.create_date = detailInfo.create_date.substring(0,11);
                var commentInfo = [];
                mySqlClient.query(selectCommentSql, defactId, function (err, rows) {
                    if (err) {
                        console.log('select comment sql error>' + err);
                    } else {
                        rows.forEach(function (element) {
                            commentInfo.push(element);
                        });
                        fs.readFile('./public/detail_defact.html', 'utf8', function (err, data) {

                            res.send(ejs.render(data, {
                                detailInfo: detailInfo,
                                commentInfo: commentInfo,
                                dong: req.cookies.dong,
                                ho: req.cookies.ho,
                                loc: req.cookies.loc, 
                                username: req.session.user.userName
                            }));
                        });
                    }

                });
            }
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/"');
    }
};

var addComment = function (req, res) {
    if (req.session.user) {
        var user = {
            userId: req.session.user.id,
            userType: req.session.user.userType,
            userName: req.session.user.userName
        };
        var defactId = req.body.defact_id;
        var inputComment = req.body.inputComment;
        var insertCommentSql = 'insert into comment  (user_id, defact_id, comment )values (?,?,?)';

        var params = [user.userId, defactId, inputComment];
        mySqlClient.query(insertCommentSql, params, function (err) {
            if (err) {
                console.log("Comment Sql Error>>" + err);
            } else {
                res.writeHead(302, {
                    'Location': '/defact/detail?id=' + defactId
                });
                res.end();
            }
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

var editComment = function (req, res) {
    if (req.session.user) {
        var defactId = req.body.defactId;
        var commentId = req.body.commentId;
        var editComment = req.body.editComment;
        var insertCommentSql = 'update comment set comment = ? where id = ?';

        var params = [editComment, commentId];
        
        mySqlClient.query(insertCommentSql, params, function (err) {
            if (err) {
                console.log("Comment Sql Error>>" + err);
            } else {
                res.writeHead(302, {
                    'Location': '/defact/detail?id=' + defactId
                });
                res.end();
            }
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

var deleteComment = function (req, res) {
    if (req.session.user) {
        var defactId = req.query.did;
        var commentId = req.query.cid;
        var deleteCommentSql = 'delete from comment where id = ?';
        
        mySqlClient.query(deleteCommentSql, commentId, function (err) {
            if (err) {
                console.log("Comment Sql Error>>" + err);
            } else {
                res.writeHead(302, {
                    'Location': '/defact/detail?id=' + defactId
                });
                res.end();
            }
        });
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

var sendPush = require('./token.js').sendPush;


var defactMakeSolved = function (req, res) {
    if (req.session.user) {
        var ho = req.cookies.ho,
                    dong = req.cookies.dong,
                    loc = req.cookies.loc;
      
        if(req.session.user.userType==='반장'){
            var defactId = req.cookies.defactId;
            var updateIsSolvedSql = 'update defact set is_solved=1 where id=?;';
            mySqlClient.query(updateIsSolvedSql, defactId, function (err) {
                if (err) {
                    console.log('update is solved err>>' + err);
                } else {

                    const sendMsg = dong+'동 '+ho+'호 하자 보수 완료';
                    sendPush(sendMsg,'기사');
                        res.redirect('/defact/list/?dong=' + dong + '&ho=' + ho + '&loc=' + loc);
                }
            });
        } else {
            alertMsg = '하자 등록 권한이 없습니다';
             backUrl = '/defact/list?dong=' + dong + '&ho=' + ho + '&loc=' + loc;
        res.send('<script type="text/javascript">alert("' + alertMsg + '"); location.href = "'+backUrl+'";</script>');
        }
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

var rejectOrPass = function (req, res) {
    if (req.session.user) {
        if (req.session.user.userType == '기사') {
            var defactId = req.query.defactId;
            var reject = req.query.reject;
            //reject ==1 이면 red reject==2 면 green
            var rejectSql = 'update defact set is_reject = ? where id = ?;';
            mySqlClient.query(rejectSql, [reject, defactId], function (err) {
                if (err) {
                    console.log('Reject error>>' + err);
                } else {
                    dong = req.cookies.dong;
                    ho = req.cookies.ho;
                    loc = req.cookies.loc;
                    res.redirect('/defact/list?dong=' + dong + '&ho=' + ho + '&loc=' + loc);
                }
            });
        } else {
            res.send('<script type="text/javascript">alert("권한이 없습니다."); window.location="/defact/list?dong=' + req.cookies.dong + '&ho=' + req.cookies.ho + '&loc=' + req.cookies.loc + '";</script>');
        }
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

module.exports.defactMakeSolved = defactMakeSolved;
module.exports.defactList = defactList;
module.exports.defactDetailList = defactDetailList;
module.exports.defactAddComment = addComment;
module.exports.defactEditComment = editComment;
module.exports.defactDeleteComment = deleteComment;
module.exports.rejectOrPass = rejectOrPass;
