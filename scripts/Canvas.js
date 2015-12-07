
function Canvas(id) {
    
    var self = this;
    
    this.canvasId = id;
    this.ctx = $('#' + id)[0].getContext('2d');
    this.drawMode = false;
    
    this.path = new Array();

    this.setSize = function(w, h) {
        self.width = w;
        self.height = h;
        this.updateCanvasDisplaySize();
    }

    this.initCanvasSize = function() {
        self.width = $('#middlePane').innerWidth();
        self.height = $('#middlePane').innerHeight();
        this.updateCanvasDisplaySize();
    }

    this.updateCanvasDisplaySize = function() {
        $('#' + self.canvasId).attr('width', self.width);
        $('#' + self.canvasId).attr('height', self.height);
    }

    this.clearAll = function() {
        self.ctx.clearRect(0, 0, self.width, self.height);
    }

    this.mousedown = function(x, y) {
        self.drawMode = true;
        self.ctx.beginPath();
        self.ctx.moveTo(x, y);
        self.path = new Array();
        self.path.push(Point(x, y));
    }

    this.mouseup = function(x, y) {
        if (self.drawMode) {
            self.drawMode = false;
            self.smoothPath();
        }
    }

    this.mousemove = function(x, y) {
        if (self.drawMode) {
            self.ctx.lineTo(x, y);
            self.path.push(Point(x, y));
            self.ctx.stroke();
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
