const pixel_point = [
    ["현관", 46, 141],
    ["거실", 78, 202],
    ["발코니1", 101, 266],
    ["발코니2", 56, 42],
    ["발코니3", 205, 14],
    ["침실1", 188, 205],
    ["침실2", 57, 88],
    ["침실3", 203, 61],
    ["주방,식당", 130, 76],
    ["욕실1", 182, 130],
    ["욕실2", 225, 143]
];

let selected_loc = -1;

function loadDrawingPoint() {
    var drawTarget = document.getElementById('div_drawing');

    //<div class="px-point"><div class="px-point-title"></div></div>

    for (var i = 0; i < 11; i++) {
        var innerCode = '<div class="px-point" id="' + 'point' + i + '" value="' + pixel_point[i][0] + '">&nbsp;<div class="px-point-title">' + pixel_point[i][0] + '</div></div>'

        drawTarget.innerHTML += innerCode;

        var pixelTarget = document.getElementById("point" + i);
        pixelTarget.style.left = pixel_point[i][1] + 'px';
        pixelTarget.style.top = pixel_point[i][2] + 'px';
    }
}

function locSelected(user_selected_loc) {
    if (user_selected_loc.target.getAttribute('value')) {
        selected_loc = user_selected_loc.target.getAttribute('value');
        selected_dong = document.getElementById('span_defact_dong').innerHTML.trim();
        selected_ho = document.getElementById('span_defact_ho').innerHTML.trim();

        location.href = "/defact/list?dong=" + selected_dong + "&ho=" + selected_ho + "&loc=" + selected_loc;
    }
}

function addClickEvent() {
    var pointTarget = document.getElementById('div_drawing');

    pointTarget.addEventListener('click',
        function (e) {
            locSelected(e);
        });
}
