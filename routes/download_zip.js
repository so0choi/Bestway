var zipper = require('zip-local'),
    fs = require('fs'),
    ejs = require('ejs');

const file = `${__dirname}/../temp/images.zip`;

function download_redirect(req, res) {
    createZip(__dirname + '/../public/resources/defact_images/', __dirname + '/../temp/images.zip', function (err) {
        if (err) {
            console.log("압축 중 에러 발생: " + err);
            res.redirect('/admin/auth');
        } else {
            console.log("이미지 폴더 압축 완료");
            res.download(file, '전체-하자이미지-압축파일.zip', function (err) {
                if (err) {
                    console.log("이미지 다운로드 중 에러 발생");
                    res.redirect('/admin/auth');
                    return;
                } else {
                    res.end();
                    return;
                }
            });

        }
    });
}

function createZip(source, out, finish) {
    zipper.sync.zip(source).compress().save(out);
    finish();
}

module.exports.toZip = download_redirect;
