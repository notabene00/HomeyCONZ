'use strict'

const Sensor = require('../Sensor')

class LeakageSensor extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName(), 'has been initiated')
	}
	
}

module.exports = LeakageSensor