
function Triangle(p1, p2, p3) {
    var self = this;

    this.points = [p1, p2, p3];
    this.adjTris = null;

    this.adjacentTo = function(triX) {
        if (self.adjTris == null) {
            self.adjTris = new Array();
        }
        self.adjTris.push(triX);
    }

    this.copy = function() {
        return Triangle(self.points[0], self.points[1], self.points[2]);
    }

    this.draw = function(style) {
        var ctx = window.canvas.ctx;
        ctx.strokeStyle = style;
        ctx.beginPath()
        ctx.moveTo(self.points[0].x, self.points[0].y);
        ctx.lineTo(self.points[1].x, self.points[1].y);
        ctx.stroke()
        ctx.lineTo(self.points[2].x, self.points[2].y);
        ctx.stroke()
        ctx.closePath()
        ctx.stroke()
    }
}


function adjacent(triX, triY) {
    triX.adjacentTo(triY);
    triY.adjacentTo(triX);
}


function _orientation(p, q, r) {
    var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (epsEquals(val, 0, 0.0001)) {
        return null;
    }
    if (val > 0) return 1;
    return -1;
}


function intersects(p1, q1, p2, q2) {
    var p1q1p2 = _orientation(p1, q1, p2);
    var p1q1q2 = _orientation(p1, q1, q2);
    var p2q2p1 = _orientation(p2, q2, p1);
    var p2q2q1 = _orientation(p2, q2, q1);
    if (p1q1p2 == null || p1q1q2 == null || p2q2p1 == null || p2q2q1 == null) {
        // assuming parallel segments don't intersect
        return false;
    }
    if (p1q1p2 * p1q1q2 > 0) {
        return false;
    } else if(p2q2p1 * p2q2q1 > 0) {
        return false;
    }
    return true;
}


function pointInShape(pt, shape) {
    var randomPt = new Point(0, 0);
    var numIntersect = 0;
    for (var i=0; i<shape.points.length - 1; i++) {
        var intsct = intersects(shape.points[i], shape.points[i+1], pt, randomPt);
        if (intsct) {
            numIntersect ++;
        }
    }
    if (numIntersect % 2 == 0) {
        return false;
    } else {
        return true;
    }
}


function MeshCreator() { 
    // contains function for creating mesh

    var self = this;

    this.bm = new BasicMesh();
    this.tri = new Triangulation();

    this.drawBasicMesh = function() {
        self.bm.drawMesh();
    }

    this.shapeToMeshNaive = function(shape) {
        //var basicVertices= self.bm.getVertices();
        var mesh = self.tri.toMeshNaive(shape);
    }

}


function Triangulation() {
    var self = this;

    this.scanDist = 20;

    this.edgeSize = 20;
    this.height = this.edgeSize / 2 * Math.sqrt(3);

    this.toMeshNaive = function(shape) {
        // A shape should be a contour consists of a list of points.
        // If the first point is not equal to the last, one line will be drawn 
        // between them.

        // Find a seed point that's inside the shape.
        // First: start at top middle point
        var midTop = new Point((shape.minX + shape.maxX) / 2.0, shape.minY)
        midTop.draw();

        // Scan down by some distance and find first and last point in shape
        var p = midTop;
        while (!pointInShape(p, shape)) {
            p.y += self.scanDist;
            if (p.y >= window.canvas.height) {
                return null;
            }
        }
        var firstInShape = p;
        firstInShape.draw();

        var p = firstInShape.copy();
        p.y += self.scanDist;
        while (pointInShape(p, shape)) {
            p.y += self.scanDist;
        }
        var firstOutShape = p;
        firstOutShape.draw();

        // the seed is the one in the middle
        var seed = new Point(midTop.x, (firstInShape.y + firstOutShape.y - self.scanDist)/2.0);
        seed.draw();

        // Now grow triangles from seed
        var triangles = new Array();
        var seedTri = new Triangle(
            new Point(seed.x, seed.y - self.height/2.0),
            new Point((seed.x - self.edgeSize/2.0), seed.y + self.height/2.0),
            new Point((seed.x + self.edgeSize/2.0), seed.y + self.height/2.0)
        )
        seedTri.draw();
    }
}

function BasicMesh() {
    // Basics equilateral triangles
    var self = this;

    this.edgeSize = 20;
    this.height = this.edgeSize / 2 * Math.sqrt(3);

    this.triangles = null;
    this.vertices = null;

    this.drawStyle = '#dddddd';

    this.getTriangles = function() {
        if (self.triangles == null) {
            self.computeTriangles();
        }
        return self.triangles;
    }

    this.getVertices = function() {
        if (self.vertices == null) {
            self.computeVertices();
        }
        return self.vertices;
    }

    this.computeVertices = function() {
        self.vertices = new Array();
        // upper left corner at (0, 0)
        var nHorizontal = Math.round(window.canvas.width / self.edgeSize);
        var nVertical = Math.round(window.canvas.height / self.height);
        for (var y=0; y<nVertical; y++) {
            if (y % 2 == 0) {
                for (var x=0; x<nHorizontal; x++) {
                    self.vertices.push(new Point(x*self.edgeSize, y*self.height));
                }
            } else {
                for (var x=0; x<nHorizontal; x++) {
                    self.vertices.push(new Point((x+1.0/2)*self.edgeSize, y*self.height));
                }
            }
        }
    }

    this.computeTriangles = function() {
        self.triangles = new Array();
        // upper left corner at (0, 0)
        var nHorizontal = Math.round(window.canvas.width / self.edgeSize);
        var nVertical = Math.round(window.canvas.height / self.height);
    
        for (var y=0; y<nVertical; y++) {
            if (y % 2 == 0) {
                for (var x=0; x<nHorizontal; x++) {
                    var t1 = new Triangle(
                        new Point(x*self.edgeSize, y*self.height), 
                        new Point((x+1)*self.edgeSize, y*self.height),
                        new Point((x+1.0/2)*self.edgeSize, (y+1)*self.height)
                    )
                    self.triangles.push(t1);
                    var t2 = new Triangle(
                        new Point((x+1)*self.edgeSize, y*self.height),
                        new Point((x+1.0/2)*self.edgeSize, (y+1)*self.height),
                        new Point((x+3.0/2)*self.edgeSize, (y+1)*self.height)
                    )
                    self.triangles.push(t2);

                    // add neighbors
                    adjacent(t1, t2);
                    if (x > 0) {
                        adjacent(t1, self.triangles[self.triangles.length - 2]);
                    }
                    if (y > 0) {
                        adjacent(t1, self.triangles[self.triangles.length - nHorizontal*2 - 1])
                    }
                }
            } else {
                for (var x=0; x<nHorizontal; x++) {
                    var t1 = new Triangle(
                        new Point(x*self.edgeSize, (y+1)*self.height), 
                        new Point((x+1)*self.edgeSize, (y+1)*self.height),
                        new Point((x+1.0/2)*self.edgeSize, y*self.height)
                    )
                    self.triangles.push(t1);
                    var t2 = new Triangle(
                        new Point((x+1)*self.edgeSize, (y+1)*self.height),
                        new Point((x+1.0/2)*self.edgeSize, y*self.height),
                        new Point((x+3.0/2)*self.edgeSize, y*self.height)
                    )
                    self.triangles.push(t2);

                    // add neighbors
                    adjacent(t1, t2);
                    if (x > 0) {
                        adjacent(t1, self.triangles[self.triangles.length - 2]);
                    }
                    adjacent(t2, self.triangles[self.triangles.length - nHorizontal*2])
                }
            }
        }
    }

    this.drawMesh = function() {
        if (self.triangles == null) {
            self.computeTriangles();
        }
        var ctx = window.canvas.ctx;
        for (var i in self.triangles) {
            var t = self.triangles[i];
            t.draw(self.drawStyle);
        }
    }
}
