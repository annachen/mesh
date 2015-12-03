
function Canvas(id) {
    
    var This = this;
    
    this.canvasId = id;
    this.ctx = $('#' + id)[0].getContext('2d');
    this.drawMode = false;
    
    this.path = new Array();

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
        This.ctx.beginPath();
        This.ctx.moveTo(x, y);
        This.path = new Array();
        This.path.push(Point(x, y));
    }

    this.mouseup = function(x, y) {
        if (This.drawMode) {
            This.drawMode = false;
            This.smoothPath();
        }
    }

    this.mousemove = function(x, y) {
        if (This.drawMode) {
            This.ctx.lineTo(x, y);
            This.path.push(Point(x, y));
            This.ctx.stroke();
        }
    }

    this.smoothPath = function() {
        // TODO: make curve smoother, especially when two points are far away
    }

}

$(function() {
    window.canvas = new Canvas('mainCanvas');
    window.canvas.initCanvasSize();
});
