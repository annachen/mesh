
function now() {
    return new Date().getTime() / 1000;
}

function Tools(id) {
    
    var self = this;
   
    // TODO(anna): make the tools a circle, not a rectangle

    // enum of tools
    this.tools = Object.freeze({
        "resetCanvas": 1
    });

    this.id = id;
    this.pressed = false;
    this.hold = false
    this.pressedPoint = null;
    this.pressedTime = null;

    // only have one now
    this.currentMode = this.tools.resetCanvas;

    this.mousedown = function(x, y) {
        self.pressed = true;
        self.pressedPoint = new Point(x, y);
        self.pressedPosition= $('#' + self.id).position();
        self.pressedTime = now();
        console.log('mousedown');
    }

    this.mouseup = function(x, y) {
        if (self.pressed) {
            var dx = x - self.pressedPoint.x;
            var dy = y - self.pressedPoint.y;
            if (dx < 10 && dy < 10) {
                // if not much movement, judge as a single click
                // TODO(anna): make this a function make based on current mode
                self.resetCanvas();
            }
            self.pressed = false;
            self.pressedPoint = null;
            self.pressedTime = null;
            self.hold = false;
            console.log('mouseup');
        }
    }

    this.mousemove = function(x, y) {
        if (self.pressed) {
            if (self.pressedPoint == null) {
                // Just in case
                return;
            }
            var dt = now() - self.pressedTime;
            var dx = x - self.pressedPoint.x;
            var dy = y - self.pressedPoint.y;
            if (dt > 0.5 && dx < 10 && dy < 10) {
                // if almost no movement for 0.5 secs, trigger hold
                self.hold = true;
                self.expand();
            }
            //if (!self.hold) {
                $('#' + self.id).css('left', self.pressedPosition.left + dx);
                $('#' + self.id).css('top', self.pressedPosition.top + dy);
            //}
        }
        console.log('mousemove');
    }

    this.expand = function(x, y) {
        console.log('expanded');
    }

    this.resetCanvas = function() {
        window.canvas.reset();
    }
}
