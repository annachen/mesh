
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

    this.drawNaiveMesh = function() {
        self.tri.drawMesh();
    }
}


function Triangulation() {
    var self = this;

    this.scanDist = 20;

    this.edgeSize = 10;
    this.height = this.edgeSize / 2 * Math.sqrt(3);

    this.maxTriangles = 1000;

    this.mesh = null;

    this.toMeshNaive = function(shape) {
        // A shape should be a contour consists of a list of points.
        // For a contour, the first point must equat the last point
        // TODO: maybe this assumption is wrong, or not useful

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
        self.mesh = new Array();
        var seedTri = new Triangle(
            new Point(seed.x, seed.y - self.height/2.0),
            new Point((seed.x + self.edgeSize/2.0), seed.y + self.height/2.0),
            new Point((seed.x - self.edgeSize/2.0), seed.y + self.height/2.0)
        )
        seedTri.draw();
        self.mesh.push(seedTri);

        var edgeToGrow = new Array();
        var seenEdges = new Array();
        var surfaceEdges = new Array();

        // always have the edge in the clockwise order
        edgeToGrow.push(new LineSeg(seedTri.points[0], seedTri.points[1]));
        edgeToGrow.push(new LineSeg(seedTri.points[1], seedTri.points[2]));
        edgeToGrow.push(new LineSeg(seedTri.points[2], seedTri.points[0]));
        seenEdges.push(edgeToGrow[0]);
        seenEdges.push(edgeToGrow[1]);
        seenEdges.push(edgeToGrow[2]);
        var count = 0;
        while (edgeToGrow.length > 0 && count < self.maxTriangles) {
            var curEdge = edgeToGrow[0];
            edgeToGrow.shift();
            var newPt = self.getThridPoint(curEdge);
            if (!pointInShape(newPt, shape)) {
                surfaceEdges.push(curEdge);
                continue;
            }
            var newTri = new Triangle(curEdge.p0, newPt, curEdge.p1);
            var line0 = new LineSeg(curEdge.p0, newPt);
            var line1 = new LineSeg(newPt, curEdge.p1);
            for (var i=0;i<seenEdges.length;i++) {
                // (TODO) Make this fast
                if (seenEdges[i].equals(line0)) {
                    line0 = null
                    break;
                }
            }
            for (var i=0;i<seenEdges.length;i++) {
                // (TODO) Make this fast
                if (seenEdges[i].equals(line1)) {
                    line1 = null
                    break;
                }
            }
            if (line0 != null) {
                edgeToGrow.push(line0);
                seenEdges.push(line0);
            }
            if (line1 != null) {
                edgeToGrow.push(line1);
                seenEdges.push(line1);
            }
            if (line0 != null ||line1 != null) {
                self.mesh.push(newTri);
            }
            count ++;
        }
        console.log(self.mesh.length);

        // sort the surfaceEdges into a contour
        surfaceContour = _to_contour(surfaceEdges);
        
        // for each line segment in surfaceEdges, find the closest point
        // in the contour, and form a triangle with it.
        var contourPoints = new Array();
        var lastPt = null;
        var firstPt = null;
        for (var i=0; i<surfaceContour.length; i++) {
            var pt = closestPoint(surfaceContour[i], shape.points);
            contourPoints.push(pt);
            if (lastPt != null) {
                var t = new Triangle(pt, lastPt, surfaceContour[i].p0);
                self.mesh.push(t);
            }
            else {
                firstPt = pt;
            }
            lastPt = pt;
            // TODO: keep these triangles the same orientation (clockwise)
            // as the internal ones
            var tri = new Triangle(pt, surfaceContour[i].p0, surfaceContour[i].p1);
            self.mesh.push(tri);
        }
        var t = new Triangle(lastPt, firstPt, surfaceContour[0].p0);
        self.mesh.push(t);
        
        for (var i=0; i<surfaceEdges.length; i++) {
            surfaceEdges[i].draw('#0000ff');
        }
    }

    
    this._sqrt3 = Math.sqrt(3);

    this.getThridPoint = function(line) {
        var midx = (line.p0.x + line.p1.x) / 2.0;
        var midy = (line.p0.y + line.p1.y) / 2.0;
        var orix = (line.p1.y - line.p0.y) / 2.0 * self._sqrt3;
        var oriy = (line.p0.x - line.p1.x) / 2.0 * self._sqrt3;
        return new Point(midx + orix, midy + oriy);
    }

    this.drawMesh = function() {
        for (var i=0; i<self.mesh.length; i++) {
            self.mesh[i].draw();
        }
    }
}


function _to_contour(lines) {
    // start with the first line
    var contour = new Array();
    contour.push(lines[0]);
    var last_line = lines[0];
    while (contour.length < lines.length) {
        for (var i = 1; i < lines.length; i ++) {
            if (last_line.p1.equals(lines[i].p0)) {
                contour.push(lines[i]);
                last_line = lines[i];
                break;
            }
        }
    }
    return contour;
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
                    t1.adjacentTo(t2, true);
                    if (x > 0) {
                        t1.adjacentTo(self.triangles[self.triangles.length - 2], true);
                    }
                    if (y > 0) {
                        t1.adjacentTo(self.triangles[self.triangles.length - nHorizontal*2 - 1], true);
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
                    t1.adjacentTo(t2, true);
                    if (x > 0) {
                        t1.adjacentTo(self.triangles[self.triangles.length - 2], true);
                    }
                    t2.adjacentTo(self.triangles[self.triangles.length - nHorizontal*2], true)
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
