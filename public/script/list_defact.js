function go_add_defact() {
    dong = document.getElementById('span_dong').innerHTML.trim();
    ho = document.getElementById('span_ho').innerHTML.trim();
    loc = document.getElementById('span_loc').innerHTML.trim();

    location.href = '/defact/add?dong=' + dong + '&ho=' + ho + '&loc=' + loc;
}

function addEvent() {
 document.querySelector("#div-defact-container").addEventListener('click', function(e){
     var defactId = e.target.getAttribute('defact-id');
    if (defactId) {
        location.href = '/defact/detail?id=' + defactId;
    }
 });
}

function rejectEvent(){
    document.querySelectorAll('.div-commit-bt').forEach(function(element){element.addEventListener('click',function(e){
       var reject, defactId; 
        var targetId = e.target.getAttribute('id');
        //reject==1 이면 red
        if(targetId=='div_red_bt'){
            console.log('red');
           defactId = e.target.parentElement.parentElement.getAttribute('defact-id');
            reject=1;
            location.href ='/defact/make_reject?reject='+reject+'&defactId='+defactId;
        }
        //reject==2이면 green
        if(targetId=='div_green_bt'){
            console.log('green');
            defactId = e.target.parentElement.parentElement.getAttribute('defact-id');
            reject=2;
            
            location.href ='/defact/make_reject?reject='+reject+'&defactId='+defactId;
        }
    });});
}
