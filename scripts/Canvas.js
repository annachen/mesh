
function Canvas(id) {
    
    var This = this;
    
    this.canvasId = id;
    this.ctx = $('#' + id)[0].getContext('2d');
    this.drawMode = false;

    this.setSize = function(w, h) {
        This.width = w;
        This.height = h;
        this.updateCanvasDisplaySize();
    }

    this.initCanvasSize = function() {
        This.width = $('#middlePane').innerWidth();
        This.height = $('#middlePane').innerHeight();
        this.updateCanvasDisplaySize();
    }

    this.updateCanvasDisplaySize = function() {
        $('#' + This.canvasId).attr('width', This.width);
        $('#' + This.canvasId).attr('height', This.height);
    }

    this.mousedown = function(x, y) {
        This.drawMode = true;
    }

    this.mouseup = function(x, y) {
        This.drawMode = false;
    }

    this.mousemove = function(x, y) {
        
    }

}

$(function() {
    window.canvas = new Canvas('mainCanvas');
    window.canvas.initCanvasSize();
});
