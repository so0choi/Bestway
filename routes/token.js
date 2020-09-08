const { Expo } = require('expo-server-sdk');
let expo = new Expo();
var mysql = require('mysql');
const mySqlClient = mysql.createConnection(require('../config/db_config'));

var token = function (req, res) {
    if(req.body.token){
        console.log(req.body.token);
        res.cookie('token', req.body.token);
        res.end();
    }
    else{
        console.log('There is no token');
        res.end();
    }
};

var getUserTokens= function(message, type){
    var selectTokenSql = 'select token from user where type=?';
    var savedTokens=[];
        mySqlClient.query(selectTokenSql,type,function(err,rows){
           if(err){
               console.log('select token err>>'+err);
           }
            else{
                rows.forEach(function(e){
                    savedTokens.push(e.token);
                });
                if(rows){
                    console.dir(savedTokens);
                    handlePushTokens(message, savedTokens);
                }
            }
        });
}

const handlePushTokens = (message, savedPushTokens) => {
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
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}

module.exports.sendPush = getUserTokens;
module.exports.addToken = token;