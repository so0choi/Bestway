//하자 등록 라우터
var ejs = require('ejs'),
    fs = require('fs'),
    mysql = require('mysql'),
    getCurrentId = require('./img_upload').getCurrentId;
var request = require('request'),
    cors = require('cors');

const mySqlClient = mysql.createConnection(require('../config/db_config'));

//push notification
var token = require('./token.js');
var savedPushTokens = token.tokenArray;
var sendPush = token.sendPush;

//-------------------

var loadAddDefact = function (req, res) {
    
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho,
        selected_loc = req.query.loc;
    if(req.session.user.userType==='기사'){
    fs.readFile('./public/add_defact.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
            dong: selected_dong,
            ho: selected_ho,
            loc: selected_loc,
            ctype: req.cookies.ctype
        }));
    });
    }
    else{
        alertMsg = '하자 등록 권한이 없습니다';
        backUrl = '/defact/list?dong=' + selected_dong + '&ho=' + selected_ho + '&loc=' + selected_loc;
        res.send('<script type="text/javascript">alert("' + alertMsg + '"); location.href = "'+backUrl+'";</script>');
    }
};

var addDefact = function (req, res) {
    if (req.session.user) {

        var c_name = req.body.construction_name; //공사명
        var loc = req.body.loc; //dong,ho,room 쪼개야함
        var dong = loc.substring(0, loc.lastIndexOf("동"));
        var ho = loc.substring(loc.lastIndexOf("동") + 2, loc.lastIndexOf("호"));
        var room = loc.substring(loc.lastIndexOf("호") + 2);

        var c_type = req.body.construction_type; //공종
        var info = req.body.defact_info; //하자 정보
        var due_date = req.body.due_date; //기한
        var imgUrl = '/' + dong + '/' + ho + '/' + dong + '_' + ho + '_' + room + '_' + (getCurrentId() + 1) + '.png';

        var params = {
            construction_name: c_name,
            construction_type: c_type,
            dong: dong,
            ho: ho,
            room: room,
            info: info,
            due_date: due_date,
            img: imgUrl
        };

        var insertDefactSql = 'INSERT INTO defact SET ?;';
        mySqlClient.query(insertDefactSql, params, function (err) {
            if (err) {
                console.log("Insert Error>>" + err);
                alertMsg = "하자 등록 중 오류가 발생했습니다.";
                res.send('<script type="text/javascript">alert("' + alertMsg + '"); window.history.back();</script>');
            } else {

                alertMsg = "하자 등록이 완료되었습니다.";
                backUrl = '/defact/list?dong=' + dong + '&ho=' + ho + '&loc=' + room;

                var pushMsg = dong + '동 ' + ho + '호 하자 업로드';
                sendPush(pushMsg,'반장');
                res.send('<script type="text/javascript">alert("' + alertMsg + '"); location.href = "'+backUrl+'";</script>');
                
            }
        });
        
    } else {
        res.send('<script type="text/javascript">alert("로그인 후 이용하세요."); window.location="/";</script>');
    }
};

//-------------------------------푸시알림------

const handlePushTokens = (message) => {
    let notifications = [];
    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error('Push token ${pushToken} is not a valid Expo push token');
            continue;
        }
        notifications.push({
            to: pushToken,
            sound: 'default',
            title: 'Bluecheck',
            body: message,
            data: {
                message
            },
            channelId: "default",
        })
    }
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                //console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}
//------------------------------------------

module.exports.loadAddDefact = loadAddDefact;
module.exports.addDefact = addDefact;

//res.redirect('/defact/list?dong=' + dong + '&ho=' + ho + '&loc=' + room);
