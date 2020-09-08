let selected_ctype_index;
let s1, s2, s3;

const d_construct_type = [
    "조적공사",
    "미장공사",
    "방수공사",
    "석공사",
    "타일공사",
    "도장공사",
    "유리공사",
    "커튼월공사",
    "수장공사",
];

const d_construct_detail_type = [
    ["벽돌공사", "블록공사", "ALC공사"],
    ["시멘트 모르타르", "석고 플라스터", "회반죽 바름", "돌로마이트 플라스터", "인조석 바름", "테라조 바름", "온돌바닥 미장"],
    ["아스팔트 방수", "합성고분자 방수", "시멘트액체 방수", "침투성 방수", "피막 방수", "도막 방수", "모르타르 방수"],
    ["화성암", "수성암", "변성암"],
    ["자기질 타일", "석기질 타일", "도기질 타일"],
    ["수성 페인트", "유성 페인트", "에멀션 페인트", "바니시", "래커", "오일스테인", "알루미늄 페인트", "녹막이 페인트", "본타일", "무늬코트"],
    ["목재창호", "강재창호", "알루미늄 창호", "합성수지 창호", "시스템 창호", "발코니전용 창호"],
    ["Unit Wall", "Stick Wall", "Punched Wall"],
    ["금속", "기와", "스테인레스"],
    ["장판비닐시트", "마루판", "벽체시트"]
];

const d_defact_type = [
    "천장", "벽", "바닥"
];

const d_defact_detail_type = [
    ["매지불량", "파손", "수직불량", "수평불량", "오염", "기타(타이핑)"],
    ["균열", "박락", "백화", "동해", "곰팡이", "불경화", "기타(타이핑)"],
    ["결로 발생", "접착 불량", "백화 현상", "균열", "기타(타이핑)"],
    ["백화", "실런트 불량", "파손", "석재 오염", "기타(타이핑)"],
    ["두께 및 치수의 불균일", "표면 및 모서리 손상", "휨상태, 뒤틀림 상태", "모서리의 어긋남", "기타(타이핑)"],
    ["균열", "건조 불량", "흘러내림", "박리", "결로", "황색화", "변색, 퇴색", "기타(타이핑)"],
    ["단열", "결로", "방음", "파손", "배수격실", "기타(타이핑)"],
    ["누수", "결로", "파손", "누기", "조립불량", "기타(타이핑)"],
    ["누수", "단열불량", "내화불량", "구배불량", "기타(타이핑)"],
    ["들뜸", "주름", "오염", "변색", "이색", "기타(타이핑)"]
];

function addLoadDate() {
    document.getElementById('input_due_date').value = new Date().toISOString().substring(0, 10);
}

function ctypeSelected() {
    selected_ctype = document.getElementById('input_ctype').value;
    for (var i in d_construct_type) {
        if (d_construct_type[i] == selected_ctype){
            selected_ctype_index = i;
            break;
        }
    }
}

function loadDefactInfo() {
    var c_type = document.getElementById('input_ctype').getAttribute('value');
    document.getElementById('div_user_type_box').style.display = 'none';
    if (c_type) {
        document.getElementById('div_add_defact_box').style.display = 'none';
        document.getElementById('div_hide_info_box').style.display = 'block';
        loadTarget = document.getElementsByClassName('div-d-item');
        for (var i in loadTarget) {
            loadTarget[i].innerHTML = '';
        }
        document.getElementById('div_now_info').innerHTML = "세부 공종을 선택하세요.";
        d_select(selected_ctype_index, 1);
    } else {
        alert('공종을 먼저 선택하세요.');
    }
}

function addClickListener(dom, nextFunction, nextIndex) {
    if (nextIndex != 4) { //3번째 최종 하자 리스트 누를 때는 예외처리
        dom.addEventListener('click',
            function (e) {
                if (e.target.getAttribute('value')) {
                    document.getElementById('div_user_type_box').style.display = 'none';
                    if (nextIndex == 2) {
                        document.getElementById('div_now_info').innerHTML = "하자 위치를 선택하세요";
                        s1 = e.target.getAttribute('value');
                        document.getElementById('div_s3').innerHTML = '';
                    }
                    if (nextIndex == 3) {
                        document.getElementById('div_now_info').innerHTML = "하자 종류를 선택하세요";
                        s2 = e.target.getAttribute('value');
                    }
                    prevDom = document.getElementsByClassName('li-type-' + (nextIndex - 1));
                    for (var i = 0; i < prevDom.length; i++) {
                        prevDom[i].style.background = "#f2f2f2";
                        prevDom[i].style.color = "black";
                    }
                    e.target.style.background = "dodgerblue";
                    e.target.style.color = "white";
                    nextFunction(selected_ctype_index, nextIndex);
                }
            });
    } else {
        dom.addEventListener('click',
            function (e) {
                if (e.target.getAttribute('value')) {
                    document.getElementById('div_user_type_box').style.display = 'none';
                    value = e.target.getAttribute('value');
                    if (value == "기타(타이핑)") {
                        document.getElementById('div_user_type_box').style.display = 'block';
                        document.getElementById('input_typing').focus();
                    } else selectedFinalValue(value);
                }
            });
    }
}

function d_select(typeIndex, index) {
    loadTarget = document.getElementById('div_s' + index);
    loadTarget.innerHTML = "";
    var loadedItem = "";

    if (index == 1) {
        for (var i in d_construct_detail_type[typeIndex]) {
            eachItem = d_construct_detail_type[typeIndex][i];
            innerItem = '<li class="li-type-' + index + '" value="' + eachItem + '">' + eachItem;
            loadTarget.innerHTML += innerItem;
        }
    }
    if (index == 2) {
        for (var i in d_defact_type) {
            eachItem = d_defact_type[i];
            innerItem = '<li class="li-type-' + index + '" value="' + eachItem + '">' + eachItem;
            loadTarget.innerHTML += innerItem;
        }

    }
    if (index == 3) {
        for (var i in d_defact_detail_type[typeIndex]) {
            eachItem = d_defact_detail_type[typeIndex][i];
            innerItem = '<li class="li-type-' + index + '" value="' + eachItem + '">' + eachItem;
            loadTarget.innerHTML += innerItem;
        }
    }
    addClickListener(loadTarget, d_select, index + 1);
}

function selectedFinalValue(finalValue) {
    document.getElementById('div_now_info').innerHTML = "";
    s3 = finalValue;
    value = s1 + "-" + s2 + "-" + s3;
    document.getElementById('div_add_defact_box').style.display = 'block';
    document.getElementById('div_hide_info_box').style.display = 'none';
    document.getElementById('input_dtype').setAttribute('value', value);
}

function user_typed() {
    typedValue = document.getElementById('input_typing').value;
    if (typedValue.length > 0) {
        selectedFinalValue(typedValue);
    } else {
        alert("1자 이상 입력하세요.");
    }
}

function hide_ctype_box() {
    document.getElementById('div_add_defact_box').style.display = 'block';
    document.getElementById('div_hide_ctype_box').style.display = 'none';
}

function hide_info_box() {
    document.getElementById('div_add_defact_box').style.display = 'block';
    document.getElementById('div_hide_info_box').style.display = 'none';
}
