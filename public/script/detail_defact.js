document.querySelector("#span-pdf-bt").addEventListener('click',function(e){
    document.querySelector(".div-defact-box").style.display = "none";
    document.querySelector("#div_pdf_box").style.display = "block";
});

document.querySelector("#span_pdf_close").addEventListener('click',function(e){
    document.querySelector("#div_pdf_box").style.display = "none";
    document.querySelector(".div-defact-box").style.display = "block";
});

let prev_form_cid = 0; // 이전 form의 cid (innerHTML null로 변경)

document.querySelector(".ul-comment-view-box").addEventListener('click',function(e){
    
    //수정 버튼
    if(e.target.getAttribute('cid') && e.target.getAttribute('val') == 'edit'){
        if(prev_form_cid != 0){
            document.getElementById("div_input_"+prev_form_cid).innerHTML = '';
        }
        
        cid = e.target.getAttribute('cid');
        prev_form_cid = cid;
        
        defactId = document.getElementById('hided_defactId').value;
        
        target = document.getElementById('div_input_'+cid);
        target.innerHTML += '<form method="post" id="comment_form" action="/defact/edit/comment/"><input class="input-edit" name="editComment" placeholder="수정 내용을 입력하세요."><input type="submit" class="edit-commit-bt" value="수정"><input type="hidden" name="defactId" value="'+defactId+'"><input type="hidden" name="commentId" value="'+cid+'"></form>';
        
        document.getElementsByClassName("input-edit")[0].focus();
        // 코멘트 아이디, 수정 내용 받아서 /defact 쪽 라우터 넘기면됨
    }
    
    //삭제 버튼
    else if(e.target.getAttribute('cid') && e.target.getAttribute('val') == 'delete'){
        defactId = document.getElementById('hided_defactId').value;

        if(confirm("댓글을 삭제할까요?")){
            location.href = "/defact/delete/comment?cid="+e.target.getAttribute('cid')+"&did="+defactId;
        }else{
            return false;
        }
    }
});