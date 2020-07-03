'use strict'

const Sensor = require('../Sensor')

class ZipatoLeakageSensor extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.log(this.getName(), 'has been initiated')
	}
	
}

module.exports = ZipatoLeakageSensor