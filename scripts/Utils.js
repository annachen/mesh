// Utility functions

function epsEquals(x, y, eps) {
    if (Math.abs(x - y) < eps) {
        return true;
    }
    return false;
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


function distToLine(point, lineSeg) {
    // TODO: return real dist
    var midPt = new Point((lineSeg.p0.x + lineSeg.p1.x)/2.0, (lineSeg.p0.y + lineSeg.p1.y)/2.0);
    return point.distTo(midPt);
   // return (point.distTo(lineSeg.p0) + point.distTo(lineSeg.p1)) / 2.0;
}


function closestPoint(lineSeg, candidates) {
    var minDist = 100000.0;
    var pt = null;
    for (var i=0; i<candidates.length; i++) {
        var d = distToLine(candidates[i], lineSeg);
        if (d < minDist) {
            minDist = d;
            pt = candidates[i];
        }
    }
    return pt;
}
