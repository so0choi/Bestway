//MainPage 라우터

var ejs = require('ejs'),
    fs = require('fs');

function index(req, res) {
    if (req.session.user) {
        res.redirect('/select/const');
    } else {
        fs.readFile('./public/index.html', 'utf8', function (error, data) {
            res.send(ejs.render(data, {}));
        });
    }
}
module.exports = index;
