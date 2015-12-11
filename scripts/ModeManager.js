
function ModeManager() {

    var self = this;

    this.modes = Object.freeze({
        'draw': 1,
        'animate': 2
    });

    this.currentMode = this.modes.draw;

    this.setMode = function(mode) {
        self.currentMode = mode;
        console.log('mode set');
    }

    this.keydown = function(key) {
        if (key == 77) {  // 'm' for mode
            if (self.currentMode == self.modes.draw) {
                self.setMode(self.modes.animate);
            } else {
                self.setMode(self.modes.draw);
            }
        }
    }
}
