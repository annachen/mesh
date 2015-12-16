
function epsEquals(x, y, eps) {
    if (Math.abs(x - y) < eps) {
        return true;
    }
    return false;
}


function Point(x, y) {
    var self = this;
    this.x = x;
    this.y = y;

    this.drawStyle = '#ff7700'

    this.eps = 0.001;

    this.equals = function(p) {
        if (epsEquals(self.x, p.x, self.eps) && epsEquals(self.y, p.y, self.eps)) {
            return true;
        }
        return false;
    }

    this.draw = function(style) {
        if (style == null) {
            style = self.drawStyle;
        }
        ctx = window.canvas.ctx;
        ctx.beginPath();
        ctx.arc(self.x, self.y, 2, 0, 2*Math.PI, false);
        ctx.fillStyle = style;
        ctx.fill();
        ctx.strokeStyle = style;
        ctx.stroke();
    }

    this.copy = function() {
        return new Point(self.x, self.y);
    }
}
