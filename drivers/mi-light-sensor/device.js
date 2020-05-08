'use strict';

const Homey = require('homey');
const Sensor = require('../Sensor')

class MiLightSensor extends Sensor {
	
	onInit() {
		this.log('MiLightSensor has been inited');
	}
	
}

module.exports = MiLightSensor;