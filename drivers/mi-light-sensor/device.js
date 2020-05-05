'use strict';

const Homey = require('homey');

class MiLightSensor extends Homey.Device {
	
	onInit() {
		this.log('MiLightSensor has been inited');
	}
	
}

module.exports = MiLightSensor;