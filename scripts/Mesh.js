
function initDisplay() {
    window.canvas = new Canvas('mainCanvas');
    window.canvas.initCanvasSize();
}

function initEvents() {
    $('#mainCanvas').live('mousedown', function(e) {
        var offset = $('#mainCanvas').offset();
        console.log(offset);
        window.canvas.mousedown(e.pageX - offset.left, e.pageY - offset.top);
    });

    $('#mainCanvas').live('mouseup', function(e) {
        var offset = $('#mainCanvas').offset();
        window.canvas.mouseup(e.pageX - offset.left, e.pageY - offset.top);

    });

    $('#mainCanvas').live('mousemove', function(e) {
        var offset = $('#mainCanvas').offset();
        window.canvas.mousemove(e.pageX - offset.left, e.pageY - offset.top);
    });
}



$(function() {
    initDisplay();
    initEvents();
});
