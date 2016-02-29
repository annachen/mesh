
function Contour() {
    var self = this;

    this.points = null;
    this.minX = null;
    this.minY = null;
    this.maxX = null;
    this.maxY = null;

    this.startContour = function() {
        self.points = new Array();
        self.minX = window.canvas.width;
        self.minY = window.canvas.height;
        self.maxX = 0;
        self.maxY = 0;
    }

    this.addPoint = function(p) {
        self.points.push(p);
        if (p.x > self.maxX) self.maxX = p.x;
        if (p.y > self.maxY) self.maxY = p.y;
        if (p.x < self.minX) self.minX = p.x;
        if (p.y < self.minY) self.minY = p.y;
    }

    this.endContour = function() {
        if (!self.points[0].equals(self.points[self.points.length-1])) {
            self.points.push(self.points[0]);
        }
    }
}

function Canvas(id) {
    
    var self = this;
    
    this.canvasId = id;
    this.ctx = $('#' + id)[0].getContext('2d');
    this.drawMode = false;
    this.drawStyle = '#000000';
    this.mc = new MeshCreator();
    
    this.path = new Contour();

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

    this.reset = function() {
        self.ctx.clearRect(0, 0, self.width, self.height);
        self.mc.drawBasicMesh();
    }

    this.mousedown = function(x, y) {
        self.drawMode = true;
        self.ctx.strokeStyle = self.drawStyle;
        self.ctx.beginPath();
        self.ctx.moveTo(x, y);
        self.path.startContour();
        self.path.addPoint(new Point(x, y));
    }

    this.mouseup = function(x, y) {
        if (self.drawMode) {
            self.drawMode = false;
            self.smoothPath();
            self.path.endContour();
            // TODO: better flow to converto to mesh
            self.mc.shapeToMeshNaive(self.path);
            self.mc.drawNaiveMesh();
        }
    }

    this.mousemove = function(x, y) {
        if (self.drawMode) {
            self.ctx.lineTo(x, y);
            self.path.addPoint(new Point(x, y));
            self.ctx.stroke();
        }
    }

    this.smoothPath = function() {
        // TODO: make curve smoother, especially when two points are far away
    }

}

