// Triangle.js

function Triangle(p1, p2, p3) {
    var self = this;

    this.points = [p1, p2, p3];
    this.adjTris = null;

    this.drawStyle = '#ff7700';

    this.adjacentTo = function(triX, addReverse) {
        if (self.adjTris == null) {
            self.adjTris = new Array();
        }
        self.adjTris.push(triX);
        if (addReverse) {
            triX.adjacentTo(self);
        }
    }

    this.copy = function() {
        return Triangle(self.points[0], self.points[1], self.points[2]);
    }

    this.draw = function(style) {
        var ctx = window.canvas.ctx;
        if (style == null)
            style = self.drawStyle;
        ctx.strokeStyle = style;
        ctx.beginPath()
        ctx.moveTo(self.points[0].x, self.points[0].y);
        ctx.lineTo(self.points[1].x, self.points[1].y);
        ctx.stroke();
        ctx.lineTo(self.points[2].x, self.points[2].y);
        ctx.stroke();
        ctx.closePath();
        ctx.stroke();
    }
}
