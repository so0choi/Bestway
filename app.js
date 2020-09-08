var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler'),
    expressErrorHandler = require('express-error-handler'),
    expressSession = require('express-session'),
    ejs = require('ejs'),
    fs = require('fs'),
    url = require('url'),
    cors = require('cors') //ajax 요청시 cors 지원

//이미지 업로드 모듈 (POST)
var imgUpload = require('./routes/img_upload').imgUpload;

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/public', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));
app.use(cors());

var router = express.Router();

//메인 페이지 라우터
var index = require('./routes/index.js');
router.route('/').get(index);

//관리자 페이지 라우터
var admin = require('./routes/admin.js');
router.route('/admin').get(admin.admin);
router.route('/admin/auth').post(admin.admin_auth);

//이미지 다운로드 라우터
var down_zip = require('./routes/download_zip.js');
router.route('/download/images').get(down_zip.toZip);

//하자 리스트 엑셀 다운로드 라우터
var down_csv = require('./routes/download_csv.js');
router.route('/download/csv').get(down_csv.toCsv);

//회원가입 라우터
var register = require('./routes/register.js');
router.route('/register').get(register.register);
router.route('/reg_submit').post(register.reg_submit);

//로그인 라우터
var login = require('./routes/login.js');
router.route('/process/login').post(login);

//로그아웃 라우터
var logout = require('./routes/logout.js');
router.route('/logout').get(logout);

 //공사종류, 동, 호  선택페이지
var select = require('./routes/select.js');
router.route('/select/const').get(select.select_const);
router.route('/select/dong/:ctype').get(select.select_dong);
router.route('/select/ho/:dong').get(select.select_ho);

//도면 이동 라우터 (호 선택 후)
var drawing = require('./routes/drawing.js');
router.route('/defact/drawing/:ho').get(drawing);

//하자 리스트 이동 라우터
var defact = require('./routes/defact.js');
router.route('/defact/list/').get(defact.defactList);
//하자 세부 페이지 라우터
router.route('/defact/detail/').get(defact.defactDetailList);
//하자 상세 페이지 댓글 라우터
router.route('/defact/add/comment/').post(defact.defactAddComment);
router.route('/defact/edit/comment/').post(defact.defactEditComment);
router.route('/defact/delete/comment/').get(defact.defactDeleteComment);
//하자 상세 수정 라우터
router.route('/defact/make_solved').get(defact.defactMakeSolved);
router.route('/defact/make_reject/').get(defact.rejectOrPass);

//하자 등록 라우터 (submit)
var addDefact = require('./routes/add_defact.js');
router.route('/defact/add_submit').post(imgUpload.single('img'), addDefact.addDefact);
//하자 등록 이동 라우터
router.route('/defact/add/').get(addDefact.loadAddDefact);

//FCM 처리 사용자 디바이스 토큰 관리 라우터
var token = require('./routes/token.js');
router.route('/token').post(token.addToken);

app.use('/', router);

// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});


app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


//웹서버 생성
http.listen(app.get('port'),
    function () {
        console.log('server started - port: ' + app.get('port'));
    }
);