// Mesh.js: entry file of the project

function initDisplay() {

    window.modeManager = new ModeManager();
    window.canvas = new Canvas('mainCanvas');
    window.canvas.initCanvasSize();
    window.canvas.reset();
    window.tools = new Tools('toolsPane');
}

function initEvents() {
    
    $(window).keydown(function(event) {
        window.modeManager.keydown(event.which);
    });
    
    $('#mainCanvas').live('mousedown', function(e) {
        if (window.tools.pressed) {
            // stop tools holding action first
            window.tools.mouseup(e.pageX, e.pageY);
        }
        var offset = $('#mainCanvas').offset();
        window.canvas.mousedown(e.pageX - offset.left, e.pageY - offset.top);
    });

    $('#mainCanvas').live('mouseup', function(e) {
        if (window.tools.pressed) {
            // if tools movement is in action, override canvas action
            window.tools.mouseup(e.pageX, e.pageY);
        } else {
            var offset = $('#mainCanvas').offset();
            window.canvas.mouseup(e.pageX - offset.left, e.pageY - offset.top);
        }
    });

    $('#mainCanvas').live('mousemove', function(e) {
        if (window.tools.pressed) {
            // if tools movement is in action, override canvas action
            window.tools.mousemove(e.pageX, e.pageY);
        } else {
            var offset = $('#mainCanvas').offset();
            window.canvas.mousemove(e.pageX - offset.left, e.pageY - offset.top);
        }
    });

    $('#toolsPane').live('mousedown', function(e) {
        window.tools.mousedown(e.pageX, e.pageY);
        if (window.canvas.drawMode) {
            // if in draw mode, stop it
            window.canvas.mouseup(e.pageX, e.pageY);
        }
    });

    $('#toolsPane').live('mouseup', function(e) {
        window.tools.mouseup(e.pageX, e.pageY);
        if (window.canvas.drawMode) {
            // if in draw mode, also stop it
            window.canvas.mouseup(e.pageX, e.pageY);
        }
    });

    $('#toolsPane').live('mousemove', function(e) {
        window.tools.mousemove(e.pageX, e.pageY);
        if (window.canvas.drawMode) {
            // if in draw mode, also draw it
            window.canvas.mousemove(e.pageX, e.pageY);
        }
    });
}

$(function() {
    initDisplay();
    initEvents();
});
