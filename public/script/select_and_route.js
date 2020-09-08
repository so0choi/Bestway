let selected_dong = -1;
let selected_ho = -1;

let dong_list = [];
let ho_list = [];

const MAX_DONG = 9; // 101~108 Dong
const MAX_HO = 4; // 1 ho ~ 4 ho
const MAX_FLOOR = 10; //101~104 - 1001~1004 Ho

function addList() {
    for (var k = 1; k <= MAX_DONG; k++) {
        dong_list.push(100 + k);
    }

    for (var i = MAX_FLOOR; i >= 1; i--) {
        for (var j = 1; j <= MAX_HO; j++) {
            ho_list.push(i * 100 + j);
        }
    }
}

function appendDong() {
    dong_target = document.getElementById("div_dong_target");
    for (var i in dong_list) {
        var dong_HTML = '<label><input type="radio" name="div-dong-bt" value="' + dong_list[i] + '"> <div class="div-dong-bt">' + dong_list[i] + '동<div class="div-dong-float-icon" id="d' + i + '">0</div></div></label>';
        dong_target.innerHTML += dong_HTML;
    }
    addDongEvent();
}

function appendHo() {
    var ho_target = document.getElementById('div_ho_target');
    for (var j in ho_list) {
        var ho_HTML = '<label><input type="radio" name="div-ho-bt" value="' + ho_list[j] + '"> <div class="div-ho-bt" >' + ho_list[j] + '<div class="div-ho-float-icon" id="h' + j + '">0</div></div></label>';
        ho_target.innerHTML += ho_HTML;
    }
    addHoEvent();
}

function addDongEvent() {
    var dongTarget = document.getElementById('div_dong_target');

    dongTarget.addEventListener('click',
        function (e) {
            dongSelected(e);
        }
    );
}

function addHoEvent() {
    var hoTarget = document.getElementById('div_ho_target');

    hoTarget.addEventListener('click',
        function (e) {
            hoSelected(e);
        }
    );
}

function dongSelected(user_selected_dong) {
    if (user_selected_dong.target.getAttribute('value')) {
        location.href = "/select/ho/" + user_selected_dong.target.getAttribute('value');
    }
}

function hoSelected(user_selected_ho) {
    if (user_selected_ho.target.getAttribute('value')) {
        location.href = "/defact/drawing/" + user_selected_ho.target.getAttribute('value');
    }
}
