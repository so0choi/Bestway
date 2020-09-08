//로그아웃 라우터
function logout(req, res) {
    if (req.session.user) {
        req.session.destroy(function (err) {
            if (err) throw err;
            res.redirect('/');
        });
    } else {
        console.log('로그인 상태 아님');
        res.redirect('/');
    }
}

module.exports = logout;
