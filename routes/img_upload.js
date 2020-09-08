//이미지 업로드
var fs = require('fs'),
    multer = require('multer'),
    path = require('path'),
    mysql = require('mysql');
//하자 ID select 위한 연결 클라이언트 생성
const mySqlClient = mysql.createConnection(require('../config/db_config'));

const baseImgDir = 'public/resources/defact_images/';

let currentId = 0;

function mkdir(dirPath) {
    const isExists = fs.existsSync(dirPath);
    if(!isExists) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            var dong = req.cookies.dong,
                ho = req.cookies.ho;
            var currentDirPath = baseImgDir + dong + '/' + ho + '/';
            //폴더 없으면 생성
            mkdir(currentDirPath);
            cb(null, baseImgDir + dong + '/' + ho + '/');
        },
        filename(req, file, cb) {
            var dong = req.cookies.dong,
                ho = req.cookies.ho,
                loc = req.cookies.loc;
            
            var currentFileName;
            var selectLastIdSql = 'select * from defact ORDER BY id DESC limit 1';
            //파일 이름: 최근(last) defact id + 1
            mySqlClient.query(selectLastIdSql, function(err, row){
                if(err){
                    //SQL 오류
                    console.log("selectLastIdSql ERROR>>"+err);
                }
                else if(row[0]){
                    lastId = parseInt(row[0].id);
                    currentId = lastId;
                    currentFileName = dong + '_' + ho + '_' + loc + '_' + (lastId + 1) + '.png';
                    cb(null, currentFileName);
                }
                else{
                    //하자 리스트에 아무것도 없는 경우
                    console.log('last id 조회 결과 없음, id 1');
                    currentId = 1;
                    currentFileName = dong + '_' + ho + '_' + loc + '_1.png';
                    cb(null, currentFileName);
                }
            })
        },
    }),
    limits: {
        fileSize: 15 * 1024 * 1024 //img Limit: 15MB
    },
});

const getCurrentId = function(){
    var id = currentId;
    return id;
}

module.exports.imgUpload = upload;
module.exports.getCurrentId = getCurrentId;