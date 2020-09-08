const pattern_num = /[0-9]/; //숫자 입력 체크 (클릭 안되게)
const pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크

document.getElementById('div_ctype_list').addEventListener('click',function(e){
    if(pattern_kor.test(e.target.innerText) && !pattern_num.test(e.target.innerText)){
        location.href='/select/dong/'+e.target.innerText;
    }
});