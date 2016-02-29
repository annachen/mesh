// LineSeg.js

function LineSeg(p0, p1) {
    var self = this;
    this.p0 = p0;
    this.p1 = p1;
    this.ori = new Point(p1.y - p0.y, p0.x - p1.x);
    this.drawStyle = '#22222ee'

    this.equals = function(seg) {
        if (self.p0.equals(seg.p0) && self.p1.equals(seg.p1)) return true;
        if (self.p0.equals(seg.p1) && self.p1.equals(seg.p0)) return true;
        return false;
    }

    this.draw = function(style) {
        var ctx = window.canvas.ctx;
        if (style == null) {
            style = self.drawStyle;
        }
        ctx.strokeStyle = style;
        ctx.beginPath();
        ctx.moveTo(self.p0.x, self.p0.y);
        ctx.lineTo(self.p1.x, self.p1.y);
        ctx.stroke();
        self.p0.draw('#dddddd');
        self.p1.draw('#000000');
    }
}
